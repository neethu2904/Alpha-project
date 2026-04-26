<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MarkEntry;
use App\Models\Exam;
use Illuminate\Http\Request;

class MarkReviewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('permission:marks.approve', ['only' => ['verify', 'reject', 'approve']]);
        $this->middleware('permission:marks.view', ['only' => ['index', 'getSubmittedMarks']]);
    }

    /**
     * Get all submitted marks for review
     */
    public function getSubmittedMarks(Request $request)
    {
        $query = MarkEntry::where('status', '!=', 'draft')
            ->with(['exam', 'student', 'subject', 'enteredBy']);

        if ($request->has('exam_id')) {
            $query->where('exam_id', $request->exam_id);
        }

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $entries = $query->orderBy('created_at', 'desc')->paginate(50);

        // Add summary stats
        $stats = [
            'total_entries' => $entries->total(),
            'submitted' => MarkEntry::where('status', 'submitted')->count(),
            'verified' => MarkEntry::where('status', 'verified')->count(),
            'approved' => MarkEntry::where('status', 'approved')->count(),
            'published' => MarkEntry::where('status', 'published')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $entries,
            'stats' => $stats,
            'message' => 'Submitted marks retrieved for review',
        ]);
    }

    /**
     * Verify marks (HOD checks for errors)
     */
    public function verify(Request $request, MarkEntry $entry)
    {
        if ($entry->status === 'draft') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot verify draft marks. Submit first.',
            ], 422);
        }

        $validated = $request->validate([
            'remarks' => 'nullable|string',
            'adjustments' => 'nullable|array',
            'adjustments.internal_marks' => 'nullable|numeric|min:0',
            'adjustments.external_marks' => 'nullable|numeric|min:0',
            'adjustments.extra_marks' => 'nullable|numeric|min:0',
        ]);

        $user = auth()->user();

        // Apply adjustments if provided
        if (!empty($validated['adjustments'])) {
            if (isset($validated['adjustments']['internal_marks'])) {
                $entry->internal_marks = $validated['adjustments']['internal_marks'];
            }
            if (isset($validated['adjustments']['external_marks'])) {
                $entry->external_marks = $validated['adjustments']['external_marks'];
            }
            if (isset($validated['adjustments']['extra_marks'])) {
                $entry->extra_marks = $validated['adjustments']['extra_marks'];
            }

            // Recalculate total and grade
            $entry->calculateTotalAndGrade();
        }

        $entry->update([
            'status' => 'verified',
            'verified_by' => $user->id,
            'verified_at' => now(),
            'remarks' => $validated['remarks'] ?? $entry->remarks,
        ]);

        return response()->json([
            'success' => true,
            'data' => $entry->load(['exam', 'student', 'subject']),
            'message' => 'Marks verified successfully',
        ]);
    }

    /**
     * Reject marks (send back to teacher for correction)
     */
    public function reject(Request $request, MarkEntry $entry)
    {
        $validated = $request->validate([
            'reason' => 'required|string',
        ]);

        $entry->update([
            'status' => 'draft',
            'remarks' => $validated['reason'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $entry,
            'message' => 'Marks rejected. Sent back to teacher for correction.',
        ]);
    }

    /**
     * Approve verified marks (final approval before publishing)
     */
    public function approve(Request $request, MarkEntry $entry)
    {
        if ($entry->status !== 'verified') {
            return response()->json([
                'success' => false,
                'message' => 'Only verified marks can be approved',
            ], 422);
        }

        $entry->update(['status' => 'approved']);

        return response()->json([
            'success' => true,
            'data' => $entry,
            'message' => 'Marks approved successfully',
        ]);
    }

    /**
     * Get marks summary for an exam
     */
    public function getExamSummary(Request $request)
    {
        $validated = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $exam = Exam::findOrFail($validated['exam_id']);
        $entries = MarkEntry::where('exam_id', $validated['exam_id'])
            ->where('subject_id', $validated['subject_id'])
            ->with(['student', 'subject'])
            ->get();

        $summary = [
            'exam_name' => $exam->name,
            'subject_name' => $exam->subject->name,
            'total_students' => $entries->count(),
            'absent_count' => $entries->where('is_absent', true)->count(),
            'pass_count' => $entries->where('result', 'PASS')->count(),
            'fail_count' => $entries->where('result', 'FAIL')->count(),
            'average_marks' => $entries->whereNotNull('total_marks')->avg('total_marks'),
            'highest_marks' => $entries->max('total_marks'),
            'lowest_marks' => $entries->min('total_marks'),
            'status_distribution' => [
                'draft' => $entries->where('status', 'draft')->count(),
                'submitted' => $entries->where('status', 'submitted')->count(),
                'verified' => $entries->where('status', 'verified')->count(),
                'approved' => $entries->where('status', 'approved')->count(),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => $summary,
                'entries' => $entries,
            ],
            'message' => 'Exam summary retrieved successfully',
        ]);
    }
}
