<?php

namespace App\Support\Campus;

use App\Models\Announcement;
use App\Models\Company;
use App\Models\CompanyApplication;
use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CampusDataService
{
    public function build(): array
    {
        return $this->buildDataset(
            User::query()->with('student:id,user_id')->orderBy('id')->get(),
            Department::query()->orderBy('id')->get(),
            Student::query()->with('applications')->orderBy('id')->get(),
            Company::query()->orderBy('id')->get(),
            Announcement::query()->orderByDesc('date')->orderByDesc('id')->get(),
        );
    }

    public function buildForUser(User $user): array
    {
        $user->loadMissing('student:id,user_id,department_code');

        $users = User::query()
            ->with('student:id,user_id')
            ->when($user->role !== 'admin', fn ($query) => $query->whereKey($user->id))
            ->orderBy('id')
            ->get();

        $students = Student::query()
            ->with('applications')
            ->when(
                $user->role === 'staff' && $user->department_code,
                fn ($query) => $query->where('department_code', $user->department_code)
            )
            ->when(
                $user->role === 'student',
                fn ($query) => $query->whereKey($user->student?->id ?? 0)
            )
            ->orderBy('id')
            ->get();

        $companies = Company::query()
            ->orderBy('id')
            ->get()
            ->when(
                $user->role === 'student',
                fn (Collection $collection) => $collection->filter(function (Company $company) use ($user) {
                    $departmentCode = $user->student?->department_code ?? $user->department_code;

                    return $departmentCode !== null
                        && in_array($departmentCode, $company->eligible_departments ?? [], true);
                })->values()
            );

        $announcements = Announcement::query()
            ->when(
                $user->role !== 'admin',
                fn ($query) => $query->whereIn('audience', $this->visibleAudiencesFor($user))
            )
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get();

        return $this->buildDataset(
            $users,
            Department::query()->orderBy('id')->get(),
            $students,
            $companies,
            $announcements,
        );
    }

    public function authenticatedUser(User $user): array
    {
        $user->loadMissing('student:id,user_id');

        return [
            ...$this->sessionUser($user),
            'permissions' => $this->permissionsFor($user),
        ];
    }

    public function authPayload(User $user, string $token): array
    {
        return [
            'token' => $token,
            'user' => $this->authenticatedUser($user),
            'data' => $this->buildForUser($user),
        ];
    }

    public function permissionsFor(User $user): array
    {
        return $user->getAllPermissions()
            ->pluck('name')
            ->sort()
            ->values()
            ->all();
    }

    public function summaryForUser(User $user): array
    {
        $data = $this->buildForUser($user);
        $students = collect($data['students']);
        $companies = collect($data['companies']);
        $announcements = collect($data['announcements']);

        $studentCount = $students->count();
        $placed = $students->where('status', 'Placed')->count();

        return [
            'students' => $studentCount,
            'placed' => $placed,
            'placementReady' => $students->where('status', 'Placement Ready')->count(),
            'openDrives' => $companies->whereIn('status', ['Open', 'Closing Soon'])->count(),
            'departments' => count($data['departments']),
            'announcements' => $announcements->count(),
            'placementRate' => $studentCount > 0 ? round(($placed / $studentCount) * 100) : 0,
        ];
    }

    public function sessionUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'title' => $user->title,
            'departmentCode' => $user->department_code,
            'studentId' => $user->student?->id,
        ];
    }

    public function sync(array $payload): void
    {
        DB::transaction(function () use ($payload): void {
            CompanyApplication::query()->delete();
            Announcement::query()->delete();
            Student::query()->delete();
            Company::query()->delete();
            Department::query()->delete();

            foreach ($payload['departments'] ?? [] as $department) {
                DB::table('departments')->insert([
                    'id' => $department['id'],
                    'name' => $department['name'],
                    'code' => $department['code'],
                    'hod' => $department['hod'],
                    'staff_count' => $department['staffCount'],
                    'intake' => $department['intake'],
                    'accent' => $department['accent'] ?? '#24a8e8',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach ($payload['companies'] ?? [] as $company) {
                DB::table('companies')->insert([
                    'id' => $company['id'],
                    'name' => $company['name'],
                    'role' => $company['role'],
                    'package_offered' => $company['packageOffered'],
                    'drive_date' => $company['driveDate'],
                    'status' => $company['status'],
                    'location' => $company['location'],
                    'type' => $company['type'],
                    'applicants' => $company['applicants'] ?? 0,
                    'shortlisted' => $company['shortlisted'] ?? 0,
                    'eligible_departments' => json_encode($company['eligibleDepartments'] ?? []),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach ($payload['students'] ?? [] as $student) {
                DB::table('students')->insert([
                    'id' => $student['id'],
                    'user_id' => User::query()->where('email', $student['email'])->value('id'),
                    'name' => $student['name'],
                    'email' => $student['email'],
                    'registration_number' => $student['registrationNumber'],
                    'department_code' => $student['departmentCode'],
                    'year' => $student['year'],
                    'status' => $student['status'],
                    'cgpa' => $student['cgpa'],
                    'attendance' => $student['attendance'],
                    'phone' => $student['phone'] ?? '',
                    'mentor' => $student['mentor'] ?? '',
                    'fee_status' => $student['feeStatus'],
                    'placed_company' => $student['placedCompany'] ?? null,
                    'skills' => json_encode($student['skills'] ?? []),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach ($payload['announcements'] ?? [] as $announcement) {
                DB::table('announcements')->insert([
                    'id' => $announcement['id'],
                    'title' => $announcement['title'],
                    'summary' => $announcement['summary'],
                    'audience' => $announcement['audience'],
                    'priority' => $announcement['priority'],
                    'posted_by' => $announcement['postedBy'],
                    'date' => $announcement['date'],
                    'category' => $announcement['category'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            foreach ($payload['students'] ?? [] as $student) {
                foreach ($student['appliedCompanyIds'] ?? [] as $companyId) {
                    DB::table('company_applications')->insertOrIgnore([
                        'student_id' => $student['id'],
                        'company_id' => $companyId,
                    ]);
                }
            }

            foreach ($payload['users'] ?? [] as $user) {
                if (! isset($user['email'])) {
                    continue;
                }

                User::query()->where('email', $user['email'])->update([
                    'name' => $user['name'] ?? User::query()->where('email', $user['email'])->value('name'),
                    'role' => $user['role'] ?? User::query()->where('email', $user['email'])->value('role'),
                    'title' => $user['title'] ?? User::query()->where('email', $user['email'])->value('title'),
                    'department_code' => $user['departmentCode'] ?? User::query()->where('email', $user['email'])->value('department_code'),
                ]);
            }
        });
    }

    private function buildDataset(
        iterable $users,
        iterable $departments,
        iterable $students,
        iterable $companies,
        iterable $announcements,
    ): array {
        return [
            'users' => collect($users)
                ->map(fn (User $user) => $this->sessionUser($user))
                ->values()
                ->all(),
            'departments' => collect($departments)
                ->map(fn (Department $department) => [
                    'id' => $department->id,
                    'name' => $department->name,
                    'code' => $department->code,
                    'hod' => $department->hod,
                    'staffCount' => $department->staff_count,
                    'intake' => $department->intake,
                    'accent' => $department->accent,
                ])
                ->values()
                ->all(),
            'students' => collect($students)
                ->map(fn (Student $student) => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'registrationNumber' => $student->registration_number,
                    'departmentCode' => $student->department_code,
                    'year' => $student->year,
                    'status' => $student->status,
                    'cgpa' => (float) $student->cgpa,
                    'attendance' => (int) $student->attendance,
                    'phone' => $student->phone ?? '',
                    'mentor' => $student->mentor ?? '',
                    'feeStatus' => $student->fee_status,
                    'placedCompany' => $student->placed_company,
                    'appliedCompanyIds' => $student->applications->pluck('company_id')->values()->all(),
                    'skills' => $student->skills ?? [],
                ])
                ->values()
                ->all(),
            'companies' => collect($companies)
                ->map(fn (Company $company) => [
                    'id' => $company->id,
                    'name' => $company->name,
                    'role' => $company->role,
                    'packageOffered' => $company->package_offered,
                    'driveDate' => optional($company->drive_date)->toDateString(),
                    'status' => $company->status,
                    'location' => $company->location,
                    'type' => $company->type,
                    'applicants' => (int) $company->applicants,
                    'shortlisted' => (int) $company->shortlisted,
                    'eligibleDepartments' => $company->eligible_departments ?? [],
                ])
                ->values()
                ->all(),
            'announcements' => collect($announcements)
                ->map(fn (Announcement $announcement) => [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'summary' => $announcement->summary,
                    'audience' => $announcement->audience,
                    'priority' => $announcement->priority,
                    'postedBy' => $announcement->posted_by,
                    'date' => optional($announcement->date)->toDateString(),
                    'category' => $announcement->category,
                ])
                ->values()
                ->all(),
        ];
    }

    private function visibleAudiencesFor(User $user): array
    {
        return match ($user->role) {
            'staff' => ['All', 'Staff'],
            'student' => ['All', 'Students'],
            default => ['All', 'Students', 'Staff', 'Admin'],
        };
    }
}
