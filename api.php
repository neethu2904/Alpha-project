<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CampusController;
use App\Support\Campus\CampusPermission;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);


        Route::get('/campus/bootstrap', [CampusController::class, 'bootstrap'])
            ->middleware('permission:'.CampusPermission::DASHBOARD_VIEW.',sanctum');
        Route::post('/campus/reset', [CampusController::class, 'reset'])
            ->middleware('permission:'.CampusPermission::DEMO_RESET.',sanctum');

        Route::get('/departments', [CampusController::class, 'departments'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_VIEW.',sanctum');

        Route::post('/departments', [CampusController::class, 'storeDepartment'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');

        Route::get('/masters', [CampusController::class, 'masters'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');
        Route::post('/masters', [CampusController::class, 'storeMaster'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');
        Route::put('/masters/{master}', [CampusController::class, 'updateMaster'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');
        Route::delete('/masters/{master}', [CampusController::class, 'destroyMaster'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');
        Route::get('/designations', [CampusController::class, 'designations'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');
        Route::post('/designations', [CampusController::class, 'storeDesignation'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');
        Route::put('/designations/{designation}', [CampusController::class, 'updateDesignation'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');
        Route::delete('/designations/{designation}', [CampusController::class, 'destroyDesignation'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');
        Route::post('/departments', [CampusController::class, 'storeDepartment'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');
        Route::put('/departments/{department}', [CampusController::class, 'updateDepartment'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');
        Route::delete('/departments/{department}', [CampusController::class, 'destroyDepartment'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');


        Route::get('/students', [CampusController::class, 'students'])
            ->middleware('permission:'.CampusPermission::STUDENTS_VIEW.',sanctum');
        Route::post('/students', [CampusController::class, 'storeStudent'])
            ->middleware('permission:'.CampusPermission::STUDENTS_CREATE.',sanctum');
        Route::put('/students/{student}', [CampusController::class, 'updateStudent'])
            ->middleware('permission:'.CampusPermission::STUDENTS_CREATE.',sanctum');
        Route::delete('/students/{student}', [CampusController::class, 'destroyStudent'])
            ->middleware('permission:'.CampusPermission::STUDENTS_CREATE.',sanctum');

        Route::get('/staff', [CampusController::class, 'staff'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_VIEW.',sanctum');
        Route::post('/staff', [CampusController::class, 'storeStaff'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');
        Route::put('/staff/{staff}', [CampusController::class, 'updateStaff'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');
        Route::delete('/staff/{staff}', [CampusController::class, 'destroyStaff'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');

        Route::get('/companies', [CampusController::class, 'companies'])
            ->middleware('permission:'.CampusPermission::PLACEMENT_VIEW.',sanctum');
        Route::post('/companies', [CampusController::class, 'storeCompany'])
            ->middleware('permission:'.CampusPermission::PLACEMENT_CREATE.',sanctum');
        Route::put('/companies/{company}', [CampusController::class, 'updateCompany'])
            ->middleware('permission:'.CampusPermission::PLACEMENT_CREATE.',sanctum');
        Route::delete('/companies/{company}', [CampusController::class, 'destroyCompany'])
            ->middleware('permission:'.CampusPermission::PLACEMENT_CREATE.',sanctum');
        Route::post('/companies/{company}/apply', [CampusController::class, 'applyToCompany'])
            ->middleware('permission:'.CampusPermission::PLACEMENT_APPLY.',sanctum');

        Route::get('/announcements', [CampusController::class, 'announcements'])
            ->middleware('permission:'.CampusPermission::ANNOUNCEMENTS_VIEW.',sanctum');
        Route::post('/announcements', [CampusController::class, 'storeAnnouncement'])
            ->middleware('permission:'.CampusPermission::ANNOUNCEMENTS_CREATE.',sanctum');

            Route::put('/announcements/{announcement}', [CampusController::class, 'updateAnnouncement'])
            ->middleware('permission:'.CampusPermission::ANNOUNCEMENTS_CREATE.',sanctum');
        Route::delete('/announcements/{announcement}', [CampusController::class, 'destroyAnnouncement'])
            ->middleware('permission:'.CampusPermission::ANNOUNCEMENTS_CREATE.',sanctum');

        Route::get('/reports/summary', [CampusController::class, 'summary'])
            ->middleware('permission:'.CampusPermission::REPORTS_VIEW.',sanctum');
    });
});
