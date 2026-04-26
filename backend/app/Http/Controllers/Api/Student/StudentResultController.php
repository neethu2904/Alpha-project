<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\SemesterResult;
use App\Models\MarkEntry;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentResultController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Get all published semesters for logged-in student
     */
    public function getPublishedSemesters(Request $request)
    {
        $user = auth()->user();
        $student = $this->resolveStudentProfile($user);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'No student profile linked to current user',
            ], 403);
        }

        $semesters = SemesterResult::where('student_id', $student->id)
            ->where('is_published', true)
            ->with('semester')
            ->get()
            ->map(function ($result) {
                return [
                    'id' => $result->semester->id,
                    'name' => $result->semester->name,
                    'result_id' => $result->id,
                    'is_published' => $result->is_published,
                    'published_at' => $result->published_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $semesters,
            'message' => 'Published semesters retrieved',
        ]);
    }

    /**
     * Get detailed result for a semester
     */
    public function getSemesterResult(Request $request, $semesterId)
    {
        $user = auth()->user();
        $student = $this->resolveStudentProfile($user);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'No student profile linked to current user',
            ], 403);
        }

        $result = SemesterResult::where('student_id', $student->id)
            ->where('semester_id', $semesterId)
            ->where('is_published', true)
            ->first();

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'Result not found or not published yet',
            ], 404);
        }

        // Get all mark entries for this student + semester
        $markEntries = MarkEntry::where('student_id', $student->id)
            ->whereHas('subject', function ($q) use ($semesterId) {
                $q->whereHas('semesters', function ($q) use ($semesterId) {
                    $q->where('semesters.id', $semesterId);
                });
            })
            ->where('status', '!=', 'draft')
            ->with(['subject', 'exam', 'markScheme'])
            ->get();

        // Format marks table
        $marksTable = $markEntries->map(function ($entry) {
            return [
                'subject_id' => $entry->subject_id,
                'subject_name' => $entry->subject->name,
                'subject_code' => $entry->subject->code,
                'internal_marks' => $entry->internal_marks,
                'external_marks' => $entry->external_marks,
                'extra_marks' => $entry->extra_marks,
                'total_marks' => $entry->total_marks,
                'grade' => $entry->grade,
                'result' => $entry->result,
                'is_absent' => $entry->is_absent,
            ];
        });

        // Calculate summaries
        $summary = [
            'total_subjects' => $marksTable->count(),
            'total_internal' => $marksTable->sum('internal_marks'),
            'total_external' => $marksTable->sum('external_marks'),
            'total_extra' => $marksTable->sum('extra_marks'),
            'grand_total' => $marksTable->sum('total_marks'),
            'percentage' => $result->percentage,
            'overall_grade' => $result->overall_grade,
            'gpa' => $result->gpa,
            'result' => $result->result,
            'subjects_passed' => $result->subjects_passed,
            'subjects_failed' => $result->subjects_failed,
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'semester' => $result->semester,
                'marks' => $marksTable,
                'summary' => $summary,
                'published_at' => $result->published_at,
            ],
            'message' => 'Semester result retrieved successfully',
        ]);
    }

    /**
     * Get all results (all published semesters with marks)
     */
    public function getAllResults(Request $request)
    {
        $user = auth()->user();
        $student = $this->resolveStudentProfile($user);

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'No student profile linked to current user',
            ], 403);
        }

        $results = SemesterResult::where('student_id', $student->id)
            ->where('is_published', true)
            ->with('semester')
            ->orderBy('semester_id')
            ->get()
            ->map(function ($result) {
                return [
                    'semester_id' => $result->semester->id,
                    'semester_name' => $result->semester->name,
                    'total_subjects' => $result->total_subjects,
                    'subjects_passed' => $result->subjects_passed,
                    'subjects_failed' => $result->subjects_failed,
                    'percentage' => $result->percentage,
                    'overall_grade' => $result->overall_grade,
                    'gpa' => $result->gpa,
                    'result' => $result->result,
                    'published_at' => $result->published_at,
                ];
            });

        // Calculate cumulative GPA
        $cumulativeGpa = $results->avg('gpa');
        $totalPass = $results->sum('subjects_passed');
        $totalFail = $results->sum('subjects_failed');

        return response()->json([
            'success' => true,
            'data' => [
                'semesters' => $results,
                'cumulative' => [
                    'total_semesters' => $results->count(),
                    'total_subjects_passed' => $totalPass,
                    'total_subjects_failed' => $totalFail,
                    'cumulative_gpa' => round($cumulativeGpa, 2),
                    'overall_result' => $totalFail > 0 ? 'FAIL' : 'PASS',
                ],
            ],
            'message' => 'All results retrieved successfully',
        ]);
    }

    /**
     * Resolve student profile from user
     */
    private function resolveStudentProfile($user): ?Student
    {
        if (!$user) {
            return null;
        }

        if ($user->relationLoaded('student') ? $user->student : $user->student()->exists()) {
            return $user->student;
        }

        return Student::query()
            ->where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();
    }
}
