<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;

class AttendanceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $student = auth()->user();

        // Get attendance records for the current student
        $attendanceBySubject = Attendance::where('student_id', $student->id)
            ->with(['subject'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($record) {
                return $record->subject->name ?? 'Unknown Subject';
            })
            ->map(function ($records) {
                $total = $records->count();
                $present = $records->where('status', 'present')->count();
                $absent = $records->where('status', 'absent')->count();
                $late = $records->where('status', 'late')->count();

                return [
                    'subject' => $records->first()->subject->name,
                    'subject_code' => $records->first()->subject->code ?? 'N/A',
                    'total_classes' => $total,
                    'present' => $present,
                    'absent' => $absent,
                    'late' => $late,
                    'percentage' => $total > 0 ? round(($present / $total) * 100, 2) : 0,
                    'status' => $total > 0 ? (($present / $total) * 100 >= 75 ? 'good' : (($present / $total) * 100 >= 50 ? 'warning' : 'critical')) : 'unknown',
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $attendanceBySubject,
            'message' => 'Attendance records retrieved successfully',
        ]);
    }

    public function getDetailedRecords(Request $request)
    {
        $student = auth()->user();
        $subjectFilter = $request->query('subject_id');

        $query = Attendance::where('student_id', $student->id)
            ->with(['subject', 'faculty'])
            ->orderBy('created_at', 'desc');

        if ($subjectFilter) {
            $query->where('subject_id', $subjectFilter);
        }

        $records = $query->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'date' => $record->created_at->format('Y-m-d'),
                    'subject' => $record->subject->name ?? 'Unknown Subject',
                    'class' => 'N/A',
                    'status' => $record->status,
                    'marked_by' => $record->faculty->name ?? 'Admin',
                    'remarks' => $record->remarks ?? 'N/A',
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $records,
            'message' => 'Detailed attendance records retrieved',
        ]);
    }

    public function getStatistics(Request $request)
    {
        $student = auth()->user();

        $totalClasses = Attendance::where('student_id', $student->id)->count();
        $presentCount = Attendance::where('student_id', $student->id)
            ->where('status', 'present')
            ->count();
        $absentCount = Attendance::where('student_id', $student->id)
            ->where('status', 'absent')
            ->count();
        $lateCount = Attendance::where('student_id', $student->id)
            ->where('status', 'late')
            ->count();

        $overallPercentage = $totalClasses > 0 ? round(($presentCount / $totalClasses) * 100, 2) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'total_classes' => $totalClasses,
                'present' => $presentCount,
                'absent' => $absentCount,
                'late' => $lateCount,
                'overall_percentage' => $overallPercentage,
                'status' => $overallPercentage >= 75 ? 'good' : ($overallPercentage >= 50 ? 'warning' : 'critical'),
            ],
            'message' => 'Attendance statistics retrieved',
        ]);
    }
}
