<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Company;
use App\Models\CompanyApplication;
use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use App\Support\Campus\CampusPermission;
use App\Support\Campus\CampusDataService;
use Database\Seeders\CampusDemoSeeder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CampusController extends Controller
{
    public function bootstrap(Request $request, CampusDataService $campusData): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'user' => $campusData->authenticatedUser($user),
            'data' => $campusData->buildForUser($user),
        ]);
    }

    public function reset(Request $request, CampusDataService $campusData): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();

        Artisan::call('db:seed', [
            '--class' => CampusDemoSeeder::class,
            '--force' => true,
        ]);

        $user = User::query()
            ->with('student:id,user_id')
            ->findOrFail($actor->id);

        return response()->json([
            'user' => $campusData->authenticatedUser($user),
            'data' => $campusData->buildForUser($user),
        ]);
    }

    public function departments(Request $request, CampusDataService $campusData): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json($campusData->buildForUser($user)['departments']);
    }

    public function storeDepartment(Request $request, CampusDataService $campusData): JsonResponse
    {
        $payload = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:20', 'alpha_dash', Rule::unique('departments', 'code')],
            'hod' => ['required', 'string', 'max:255'],
            'staffCount' => ['required', 'integer', 'min:1'],
            'intake' => ['required', 'integer', 'min:1'],
        ]);

        Department::query()->create([
            'name' => $payload['name'],
            'code' => strtoupper($payload['code']),
            'hod' => $payload['hod'],
            'staff_count' => $payload['staffCount'],
            'intake' => $payload['intake'],
            'accent' => '#2563eb',
        ]);

        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'data' => $campusData->buildForUser($user),
        ], 201);
    }

    public function students(Request $request, CampusDataService $campusData): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json($campusData->buildForUser($user)['students']);
    }

    public function storeStudent(Request $request, CampusDataService $campusData): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('students', 'email'), Rule::unique('users', 'email')],
            'departmentCode' => ['nullable', 'string', 'max:20', Rule::exists('departments', 'code')],
            'year' => ['required', 'string', 'max:50'],
            'cgpa' => ['required', 'numeric', 'min:0', 'max:10'],
            'attendance' => ['required', 'integer', 'min:0', 'max:100'],
            'phone' => ['nullable', 'string', 'max:50'],
            'feeStatus' => ['required', Rule::in(['Paid', 'Pending'])],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:100'],
        ]);

        $departmentCode = $user->role === 'staff'
            ? $user->department_code
            : ($payload['departmentCode'] ?? null);

        abort_unless($departmentCode, 422, 'A department is required for new students.');

        $department = Department::query()->where('code', $departmentCode)->firstOrFail();
        $nextId = (int) Student::query()->max('id') + 1;

        Student::query()->create([
            'id' => $nextId,
            'name' => $payload['name'],
            'email' => $payload['email'],
            'registration_number' => sprintf('BIT%s%s%03d', now()->format('y'), $departmentCode, $nextId),
            'department_code' => $departmentCode,
            'year' => $payload['year'],
            'status' => 'Active',
            'cgpa' => $payload['cgpa'],
            'attendance' => $payload['attendance'],
            'phone' => $payload['phone'] ?? null,
            'mentor' => $user->role === 'staff' ? $user->name : $department->hod,
            'fee_status' => $payload['feeStatus'],
            'skills' => $payload['skills'] ?? [],
        ]);

        return response()->json([
            'data' => $campusData->buildForUser($user),
        ], 201);
    }

    public function companies(Request $request, CampusDataService $campusData): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json($campusData->buildForUser($user)['companies']);
    }

    public function storeCompany(Request $request, CampusDataService $campusData): JsonResponse
    {
        $payload = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'packageOffered' => ['required', 'string', 'max:100'],
            'driveDate' => ['required', 'date'],
            'status' => ['required', Rule::in(['Upcoming', 'Open', 'Closing Soon', 'Closed'])],
            'location' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['Placement', 'Internship'])],
            'eligibleDepartments' => ['required', 'array', 'min:1'],
            'eligibleDepartments.*' => ['string', Rule::exists('departments', 'code')],
        ]);

        Company::query()->create([
            'name' => $payload['name'],
            'role' => $payload['role'],
            'package_offered' => $payload['packageOffered'],
            'drive_date' => $payload['driveDate'],
            'status' => $payload['status'],
            'location' => $payload['location'],
            'type' => $payload['type'],
            'applicants' => 0,
            'shortlisted' => 0,
            'eligible_departments' => array_values(array_unique(array_map('strtoupper', $payload['eligibleDepartments']))),
        ]);

        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'data' => $campusData->buildForUser($user),
        ], 201);
    }

    public function applyToCompany(Request $request, Company $company, CampusDataService $campusData): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        abort_unless($user->can(CampusPermission::PLACEMENT_APPLY), 403, 'You do not have permission to apply to company drives.');

        $student = $user->student;

        abort_unless($student, 403, 'A linked student profile is required before applying.');
        abort_unless(
            in_array($student->department_code, $company->eligible_departments ?? [], true),
            403,
            'You are not eligible for this drive.'
        );
        abort_if($company->status === 'Closed', 422, 'This drive is already closed.');

        DB::transaction(function () use ($student, $company): void {
            $application = CompanyApplication::query()->firstOrCreate([
                'student_id' => $student->id,
                'company_id' => $company->id,
            ]);

            if ($application->wasRecentlyCreated) {
                $company->increment('applicants');
            }
        });

        return response()->json([
            'data' => $campusData->buildForUser($user),
        ]);
    }

    public function announcements(Request $request, CampusDataService $campusData): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json($campusData->buildForUser($user)['announcements']);
    }

    public function storeAnnouncement(Request $request, CampusDataService $campusData): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $allowedAudiences = $user->role === 'admin'
            ? ['All', 'Students', 'Staff', 'Admin']
            : ['All', 'Students', 'Staff'];

        $payload = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string', 'max:1000'],
            'audience' => ['required', Rule::in($allowedAudiences)],
            'priority' => ['required', Rule::in(['High', 'Medium', 'Low'])],
            'category' => ['required', 'string', 'max:100'],
        ]);

        Announcement::query()->create([
            'title' => $payload['title'],
            'summary' => $payload['summary'],
            'audience' => $payload['audience'],
            'priority' => $payload['priority'],
            'posted_by' => $user->name,
            'date' => now()->toDateString(),
            'category' => $payload['category'],
        ]);

        return response()->json([
            'data' => $campusData->buildForUser($user),
        ], 201);
    }

    public function summary(Request $request, CampusDataService $campusData): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json($campusData->summaryForUser($user));
    }
}
