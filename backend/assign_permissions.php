<?php
/**
 * Seed Attendance Permissions to Roles
 * Run from command line: php artisan tinker < assign_permissions.php
 */

use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

// Clear permission cache
app(PermissionRegistrar::class)->forgetCachedPermissions();

// Define attendance permissions
$attendancePermissions = [
    'attendance.view',
    'attendance.mark',
    'attendance.edit',
    'attendance.delete',
    'attendance.approve',
];

// Create permissions if they don't exist
foreach ($attendancePermissions as $permissionName) {
    Permission::firstOrCreate(['name' => $permissionName], ['guard_name' => 'sanctum']);
    echo "✓ Permission '{$permissionName}' created/verified\n";
}

// Refresh cache
app(PermissionRegistrar::class)->forgetCachedPermissions();

// Assign permissions to roles
$rolePermissions = [
    'admin' => ['attendance.view', 'attendance.mark', 'attendance.edit', 'attendance.delete', 'attendance.approve'],
    'faculty' => ['attendance.view', 'attendance.mark', 'attendance.edit'],
    'hod' => ['attendance.view', 'attendance.approve', 'attendance.edit'],
    'student' => ['attendance.view'],
    'staff' => ['attendance.view'],
];

foreach ($rolePermissions as $roleName => $permissions) {
    $role = Role::where('name', $roleName)->first();
    
    if (!$role) {
        $role = Role::create(['name' => $roleName, 'guard_name' => 'sanctum']);
        echo "✓ Role '{$roleName}' created\n";
    }
    
    foreach ($permissions as $permissionName) {
        $permission = Permission::where('name', $permissionName)->first();
        if ($permission && !$role->hasPermissionTo($permissionName)) {
            $role->givePermissionTo($permission);
            echo "  ✓ Assigned '{$permissionName}' to '{$roleName}'\n";
        }
    }
}

// Refresh cache again
app(PermissionRegistrar::class)->forgetCachedPermissions();

echo "\n✅ All attendance permissions assigned successfully\n";
?>
