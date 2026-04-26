<?php

namespace App\Http\Controllers\Api\Staff;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PlacementController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Get all job drives/companies
     */
    public function getDrives(Request $request)
    {
        $status = $request->query('status'); // upcoming, ongoing, completed

        $drives = [
            [
                'id' => 1,
                'company' => 'TCS',
                'position' => 'Systems Engineer',
                'salary' => '3.5 - 4.5 LPA',
                'eligibility' => '60% throughout',
                'status' => 'upcoming',
                'date' => '2026-04-15',
                'registrations' => 45,
                'batch_eligible' => '2025, 2026',
            ],
            [
                'id' => 2,
                'company' => 'Infosys',
                'position' => 'Software Engineer',
                'salary' => '3.0 - 4.0 LPA',
                'eligibility' => '65% GPA',
                'status' => 'ongoing',
                'date' => '2026-04-05',
                'registrations' => 38,
                'batch_eligible' => '2025, 2026',
            ],
            [
                'id' => 3,
                'company' => 'Wipro',
                'position' => 'Software Developer',
                'salary' => '3.2 - 3.8 LPA',
                'eligibility' => '60% throughout',
                'status' => 'completed',
                'date' => '2026-03-20',
                'registrations' => 52,
                'selections' => 28,
                'batch_eligible' => '2025, 2026',
            ],
        ];

        if ($status) {
            $drives = array_filter($drives, fn ($d) => $d['status'] === $status);
        }

        return response()->json([
            'success' => true,
            'data' => array_values($drives),
            'total_drives' => count($drives),
        ]);
    }

    /**
     * Get students applied for a drive
     */
    public function getApplications(Request $request)
    {
        $driveId = $request->query('drive_id');
        $status = $request->query('status'); // registered, selected, rejected

        $applications = [
            [
                'id' => 1,
                'student_id' => '21CS001',
                'name' => 'Amit Kumar',
                'email' => 'amit@alphagrew.dev',
                'cgpa' => 8.5,
                'status' => 'selected',
                'offer_letter' => true,
                'salary_offered' => '3.8 LPA',
            ],
            [
                'id' => 2,
                'student_id' => '21CS002',
                'name' => 'Priya Sharma',
                'email' => 'priya@alphagrew.dev',
                'cgpa' => 8.8,
                'status' => 'selected',
                'offer_letter' => true,
                'salary_offered' => '4.0 LPA',
            ],
            [
                'id' => 3,
                'student_id' => '21CS003',
                'name' => 'Rajesh Singh',
                'email' => 'rajesh@alphagrew.dev',
                'cgpa' => 7.5,
                'status' => 'pending',
                'offer_letter' => false,
            ],
        ];

        if ($status) {
            $applications = array_filter($applications, fn ($a) => $a['status'] === $status);
        }

        return response()->json([
            'success' => true,
            'data' => array_values($applications),
            'drive_id' => $driveId,
            'total_applications' => count($applications),
        ]);
    }

    /**
     * Create new placement drive
     */
    public function createDrive(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string',
            'position' => 'required|string',
            'salary' => 'required|string',
            'eligibility' => 'required|string',
            'date' => 'required|date',
            'batch_eligible' => 'required|array',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Placement drive created successfully',
            'data' => [
                'drive_id' => 4,
                'company' => $validated['company_name'],
                'status' => 'upcoming',
            ],
        ]);
    }

    /**
     * Update placement drive
     */
    public function updateDrive(Request $request, $driveId)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:upcoming,ongoing,completed',
            'salary' => 'sometimes|string',
            'registrations_closed' => 'sometimes|boolean',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Placement drive updated successfully',
            'data' => ['drive_id' => $driveId],
        ]);
    }

    /**
     * Get placement statistics
     */
    public function getStatistics()
    {
        $stats = [
            'total_students' => 120,
            'placed_students' => 98,
            'placement_percentage' => 81.67,
            'highest_package' => '8.5 LPA',
            'average_package' => '4.3 LPA',
            'companies_visited' => 15,
            'offers_pending' => 12,
            'pending_percentage' => 10,
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Get placement results by batch
     */
    public function getResultsByBatch(Request $request)
    {
        $batch = $request->query('batch');

        $results = [
            [
                'batch' => '2025',
                'total' => 60,
                'placed' => 55,
                'percentage' => 91.67,
                'avg_package' => '4.5 LPA',
                'highest' => '8.5 LPA',
            ],
            [
                'batch' => '2024',
                'total' => 60,
                'placed' => 58,
                'percentage' => 96.67,
                'avg_package' => '4.2 LPA',
                'highest' => '7.2 LPA',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $results,
        ]);
    }

    /**
     * Export placement report
     */
    public function exportReport(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Report generated successfully',
            'data' => [
                'file_name' => 'placement_report_'.date('Y-m-d').'.xlsx',
                'download_url' => '/api/v1/staff/placement/report/download',
            ],
        ]);
    }
}
