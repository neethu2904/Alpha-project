<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SemesterResult;
use App\Models\MarkEntry;
use App\Models\ResultPublishingLog;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResultPublishingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('permission:marks.publish', ['only' => ['publishResults', 'unlockResults', 'lockMarks']]);
        $this->middleware('permission:marks.view', ['only' => ['getPublishingStatus', 'getPublishingLogs']]);
    }

    /**
     * Get publishing status for a semester
     */
    public function getPublishingStatus(Request $request)
    {
        $validated = $request->validate([
            'semester_id' => 'required|exists:semesters,id',
        ]);

        $semester = Semester::findOrFail($validated['semester_id']);

        // Check mark entry statuses
        $markStats = [
            'total_entries' => MarkEntry::whereHas('subject', function ($q) use ($semester) {
                $q->whereHas('semesters', function ($q) use ($semester) {
                    $q->where('semesters.id', $semester->id);
                });
            })->count(),
            'draft' => MarkEntry::where('status', 'draft')->whereHas('subject', function ($q) use ($semester) {
                $q->whereHas('semesters', function ($q) use ($semester) {
                    $q->where('semesters.id', $semester->id);
                });
            })->count(),
            'submitted' => MarkEntry::where('status', 'submitted')->whereHas('subject', function ($q) use ($semester) {
                $q->whereHas('semesters', function ($q) use ($semester) {
                    $q->where('semesters.id', $semester->id);
                });
            })->count(),
            'verified' => MarkEntry::where('status', 'verified')->whereHas('subject', function ($q) use ($semester) {
                $q->whereHas('semesters', function ($q) use ($semester) {
                    $q->where('semesters.id', $semester->id);
                });
            })->count(),
            'approved' => MarkEntry::where('status', 'approved')->whereHas('subject', function ($q) use ($semester) {
                $q->whereHas('semesters', function ($q) use ($semester) {
                    $q->where('semesters.id', $semester->id);
                });
            })->count(),
        ];

        $publishedResults = SemesterResult::where('semester_id', $semester->id)
            ->where('is_published', true)
            ->count();

        $canPublish = $markStats['draft'] === 0 && $markStats['submitted'] === 0;

        return response()->json([
            'success' => true,
            'data' => [
                'semester' => $semester,
                'mark_stats' => $markStats,
                'published_results_count' => $publishedResults,
                'can_publish' => $canPublish,
                'ready_percentage' => $markStats['total_entries'] > 0
                    ? round(($markStats['approved'] / $markStats['total_entries']) * 100, 2)
                    : 0,
            ],
            'message' => 'Publishing status retrieved',
        ]);
    }

    /**
     * Publish results for a semester
     */
    public function publishResults(Request $request)
    {
        $validated = $request->validate([
            'semester_id' => 'required|exists:semesters,id',
        ]);

        $semester = Semester::findOrFail($validated['semester_id']);
        $user = auth()->user();

        return DB::transaction(function () use ($semester, $user) {
            // Get all mark entries for this semester
            $markEntries = MarkEntry::whereHas('subject', function ($q) use ($semester) {
                $q->whereHas('semesters', function ($q) use ($semester) {
                    $q->where('semesters.id', $semester->id);
                });
            })->get();

            if ($markEntries->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No mark entries found for this semester',
                ], 422);
            }

            // Check that all marks are approved
            $pendingEntries = $markEntries->whereNotIn('status', ['approved', 'published', 'locked'])->count();
            if ($pendingEntries > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot publish. $pendingEntries marks pending approval",
                ], 422);
            }

            // Group by student
            $studentIds = $markEntries->pluck('student_id')->unique();
            $publishedCount = 0;

            foreach ($studentIds as $studentId) {
                $result = SemesterResult::firstOrCreate(
                    ['student_id' => $studentId, 'semester_id' => $semester->id],
                    ['is_published' => false]
                );

                // Recalculate result
                $result->recalculateResult();

                // Publish
                if (!$result->is_published) {
                    $result->publishAndLock($user->id);
                    $publishedCount++;
                }
            }

            // Lock all mark entries
            $markEntries->each(function ($entry) {
                $entry->update([
                    'status' => 'locked',
                    'published_at' => now(),
                ]);
            });

            // Log the publishing action
            ResultPublishingLog::create([
                'semester_id' => $semester->id,
                'published_by' => $user->id,
                'total_students' => count($studentIds),
                'students_published' => $publishedCount,
                'action' => 'publish',
                'details' => "Published results for $publishedCount students",
                'published_at' => now(),
            ]);

            return [
                'success' => true,
                'published_count' => $publishedCount,
                'total_entries' => $markEntries->count(),
                'message' => "Results published successfully for $publishedCount students",
            ];
        });
    }

    /**
     * Unlock results (revert publishing) - Admin override only
     */
    public function unlockResults(Request $request)
    {
        $validated = $request->validate([
            'semester_id' => 'required|exists:semesters,id',
            'reason' => 'required|string',
        ]);

        $semester = Semester::findOrFail($validated['semester_id']);
        $user = auth()->user();

        return DB::transaction(function () use ($semester, $user, $validated) {
            $results = SemesterResult::where('semester_id', $semester->id)
                ->where('is_published', true)
                ->get();

            foreach ($results as $result) {
                $result->update([
                    'is_published' => false,
                    'published_at' => null,
                    'locked_at' => null,
                ]);
            }

            // Unlock mark entries
            MarkEntry::whereHas('subject', function ($q) use ($semester) {
                $q->whereHas('semesters', function ($q) use ($semester) {
                    $q->where('semesters.id', $semester->id);
                });
            })->update(['status' => 'approved']);

            // Log the unlock action
            ResultPublishingLog::create([
                'semester_id' => $semester->id,
                'published_by' => $user->id,
                'total_students' => $results->count(),
                'students_published' => 0,
                'action' => 'unlock',
                'details' => $validated['reason'],
                'published_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'unlocked_count' => $results->count(),
                ],
                'message' => 'Results unlocked successfully',
            ]);
        });
    }

    /**
     * Get publishing logs for audit trail
     */
    public function getPublishingLogs(Request $request)
    {
        $validated = $request->validate([
            'semester_id' => 'nullable|exists:semesters,id',
        ]);

        $query = ResultPublishingLog::with(['semester', 'publishedBy']);

        if ($request->has('semester_id')) {
            $query->where('semester_id', $request->semester_id);
        }

        $logs = $query->orderByDesc('published_at')->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $logs,
            'message' => 'Publishing logs retrieved successfully',
        ]);
    }
}
