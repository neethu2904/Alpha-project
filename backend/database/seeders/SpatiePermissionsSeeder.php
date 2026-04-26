<?php

namespace Database\Seeders;

use App\Support\Campus\CampusPermission;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SpatiePermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Seeds ONLY Spatie permissions from CampusPermission constants.
     * No custom system_permissions table involvement.
     */
    public function run(): void
    {
        // First, create all permissions from CampusPermission
        $allPermissions = [];
        foreach (CampusPermission::all() as $permissionName) {
            $perm = Permission::firstOrCreate(
                ['name' => $permissionName, 'guard_name' => 'sanctum']
            );
            $allPermissions[] = $perm->id;
        }

        // Create and assign role-based permission sets
        
        // Super Admin - all permissions
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'sanctum']);
        $superAdminRole->syncPermissions($allPermissions);

        // Admin - all permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'sanctum']);
        $adminRole->syncPermissions($allPermissions);

        // Staff - staff-specific permissions (from CampusPermission::byRole())
        $staffPermissions = CampusPermission::byRole()['staff'] ?? [];
        $staffPermissionIds = Permission::query()
            ->whereIn('name', $staffPermissions)
            ->where('guard_name', 'sanctum')
            ->pluck('id')
            ->toArray();
        $staffRole = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'sanctum']);
        $staffRole->syncPermissions($staffPermissionIds);

        // Student - student-specific permissions (from CampusPermission::byRole())
        $studentPermissions = CampusPermission::byRole()['student'] ?? [];
        $studentPermissionIds = Permission::query()
            ->whereIn('name', $studentPermissions)
            ->where('guard_name', 'sanctum')
            ->pluck('id')
            ->toArray();
        $studentRole = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'sanctum']);
        $studentRole->syncPermissions($studentPermissionIds);

        // Faculty, HOD, Placement Officer, Exam Coordinator, Supervisor - all get staff-like permissions
        foreach (['faculty', 'hod', 'placement_officer', 'exam_coordinator', 'supervisor'] as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'sanctum']);
            $role->syncPermissions($staffPermissionIds);
        }
    }
}
