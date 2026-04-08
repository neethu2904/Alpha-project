<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CampusController;
use App\Support\Campus\CampusPermission;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/campus/bootstrap', [CampusController::class, 'bootstrap'])
            ->middleware('permission:'.CampusPermission::DASHBOARD_VIEW.',sanctum');
        Route::post('/campus/reset', [CampusController::class, 'reset'])
            ->middleware('permission:'.CampusPermission::DEMO_RESET.',sanctum');

        Route::get('/departments', [CampusController::class, 'departments'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_VIEW.',sanctum');
        Route::post('/departments', [CampusController::class, 'storeDepartment'])
            ->middleware('permission:'.CampusPermission::DEPARTMENTS_CREATE.',sanctum');

        Route::get('/students', [CampusController::class, 'students'])
            ->middleware('permission:'.CampusPermission::STUDENTS_VIEW.',sanctum');
        Route::post('/students', [CampusController::class, 'storeStudent'])
            ->middleware('permission:'.CampusPermission::STUDENTS_CREATE.',sanctum');

        Route::get('/companies', [CampusController::class, 'companies'])
            ->middleware('permission:'.CampusPermission::PLACEMENT_VIEW.',sanctum');
        Route::post('/companies', [CampusController::class, 'storeCompany'])
            ->middleware('permission:'.CampusPermission::PLACEMENT_CREATE.',sanctum');
        Route::post('/companies/{company}/apply', [CampusController::class, 'applyToCompany'])
            ->middleware('permission:'.CampusPermission::PLACEMENT_APPLY.',sanctum');

        Route::get('/announcements', [CampusController::class, 'announcements'])
            ->middleware('permission:'.CampusPermission::ANNOUNCEMENTS_VIEW.',sanctum');
        Route::post('/announcements', [CampusController::class, 'storeAnnouncement'])
            ->middleware('permission:'.CampusPermission::ANNOUNCEMENTS_CREATE.',sanctum');

        Route::get('/reports/summary', [CampusController::class, 'summary'])
            ->middleware('permission:'.CampusPermission::REPORTS_VIEW.',sanctum');
    });
});
