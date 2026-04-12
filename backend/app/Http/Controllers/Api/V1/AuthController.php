<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
<<<<<<< HEAD
use App\Models\User;
use App\Support\Campus\CampusDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
=======
use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use App\Support\Campus\CampusDataService;
use App\Support\Campus\CampusMasterCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
>>>>>>> d7dc03e (demo)
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request, CampusDataService $campusData): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()
            ->with('student:id,user_id')
            ->where('email', $credentials['email'])
            ->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 422);
        }

        $abilities = $campusData->permissionsFor($user);
        $tokenName = Str::limit($request->userAgent() ?: 'campus-web', 40, '');
        $token = $user->createToken($tokenName ?: 'campus-web', $abilities)->plainTextToken;

        return response()->json(
            $campusData->authPayload($user, $token)
        );
    }

<<<<<<< HEAD
=======
    public function register(Request $request, CampusDataService $campusData): JsonResponse
    {
        $payload = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = DB::transaction(function () use ($payload): User {
            $department = Department::query()->orderBy('id')->first();
            $departmentCode = $department?->code ?? 'CSE';
            $nextStudentId = ((int) Student::query()->max('id')) + 1;

            $user = User::query()->create([
                'name' => $payload['name'],
                'email' => $payload['email'],
                'password' => $payload['password'],
                'role' => 'student',
                'title' => 'Student Applicant',
                'department_code' => $departmentCode,
                'email_verified_at' => now(),
            ]);

            $user->syncRoles(['student']);

            Student::query()->create([
                'user_id' => $user->id,
                'name' => $payload['name'],
                'email' => $payload['email'],
                'registration_number' => sprintf('BIT26%s%03d', $departmentCode, $nextStudentId),
                'department_code' => $departmentCode,
                'year' => CampusMasterCatalog::normalizeValue(CampusMasterCatalog::STUDENT_YEAR, '1st Year') ?? 'year_1',
                'gender' => CampusMasterCatalog::normalizeValue(CampusMasterCatalog::STUDENT_GENDER, 'Prefer not to say') ?? 'prefer_not_to_say',
                'status' => CampusMasterCatalog::normalizeValue(CampusMasterCatalog::STUDENT_STATUS, 'Active') ?? 'active',
                'cgpa' => 0,
                'attendance' => 0,
                'phone' => '',
                'mentor' => $department?->hod ?? '',
                'fee_status' => CampusMasterCatalog::normalizeValue(CampusMasterCatalog::PAYMENT_STATUS, 'Pending') ?? 'pending',
                'skills' => [],
            ]);

            return $user->fresh(['student:id,user_id']);
        });

        $abilities = $campusData->permissionsFor($user);
        $tokenName = Str::limit($request->userAgent() ?: 'campus-web', 40, '');
        $token = $user->createToken($tokenName ?: 'campus-web', $abilities)->plainTextToken;

        return response()->json(
            $campusData->authPayload($user, $token),
            201
        );
    }

>>>>>>> d7dc03e (demo)
    public function me(Request $request, CampusDataService $campusData): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'user' => $campusData->authenticatedUser($user),
        ]);
    }

<<<<<<< HEAD
=======
    public function updateProfile(Request $request, CampusDataService $campusData): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'title' => ['required', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        DB::transaction(function () use ($user, $payload): void {
            $user->update([
                'name' => $payload['name'],
                'email' => $payload['email'],
                'title' => $payload['title'],
                ...(! empty($payload['password']) ? ['password' => $payload['password']] : []),
            ]);

            if ($user->role === 'student' && $user->student) {
                $user->student->update([
                    'name' => $payload['name'],
                    'email' => $payload['email'],
                ]);
            }
        });

        $user = $user->fresh(['student:id,user_id']);

        return response()->json([
            'user' => $campusData->authenticatedUser($user),
            'data' => $campusData->buildForUser($user),
        ]);
    }

>>>>>>> d7dc03e (demo)
    public function logout(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $user->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
