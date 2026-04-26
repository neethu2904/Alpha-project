<?php

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

echo "=== PERMISSION SYSTEM VERIFICATION ===\n\n";

echo "=== Permissions Seeded ===\n";
$permissionCount = Permission::where('guard_name', 'sanctum')->count();
echo "Total permissions: $permissionCount\n";
$samples = Permission::where('guard_name', 'sanctum')->limit(5)->pluck('name')->toArray();
echo "Sample permissions: " . implode(', ', $samples) . "\n";

echo "\n=== Roles Created ===\n";
$roles = Role::where('guard_name', 'sanctum')->pluck('name')->toArray();
echo "Roles: " . implode(', ', $roles) . "\n";

echo "\n=== Admin Role Permissions ===\n";
$adminRole = Role::where('name', 'admin')->where('guard_name', 'sanctum')->first();
if ($adminRole) {
    echo "Admin role has " . $adminRole->permissions()->count() . " permissions\n";
} else {
    echo "Admin role not found\n";
}

echo "\n=== Users Created ===\n";
echo "Total users: " . User::count() . "\n";

$adminUser = User::where('email', 'admin@demo.com')->first();
if ($adminUser) {
    echo "Admin user (admin@demo.com) has " . $adminUser->getAllPermissions()->count() . " permissions\n";
    echo "  - Role: " . $adminUser->role . "\n";
    echo "  - Designation: " . ($adminUser->designation?->name ?? 'None') . "\n";
}

$staffUser = User::where('email', 'staff@demo.com')->first();
if ($staffUser) {
    echo "Staff user (staff@demo.com) has " . $staffUser->getAllPermissions()->count() . " permissions\n";
    echo "  - Role: " . $staffUser->role . "\n";
    echo "  - Designation: " . ($staffUser->designation?->name ?? 'None') . "\n";
}

$studentUser = User::where('email', 'student@demo.com')->first();
if ($studentUser) {
    echo "Student user (student@demo.com) has " . $studentUser->getAllPermissions()->count() . " permissions\n";
    echo "  - Role: " . $studentUser->role . "\n";
    echo "  - Designation: " . ($studentUser->designation?->name ?? 'None') . "\n";
}

echo "\n=== Permission Enforcement Checks ===\n";

if ($adminUser) {
    echo "Admin user checks:\n";
    echo "  - students.view: " . ($adminUser->hasPermissionTo('students.view', 'sanctum') ? "✓ YES" : "✗ NO") . "\n";
    echo "  - students.create: " . ($adminUser->hasPermissionTo('students.create', 'sanctum') ? "✓ YES" : "✗ NO") . "\n";
    echo "  - attendance.mark: " . ($adminUser->hasPermissionTo('attendance.mark', 'sanctum') ? "✓ YES" : "✗ NO") . "\n";
}

if ($studentUser) {
    echo "Student user checks:\n";
    echo "  - announcements.view: " . ($studentUser->hasPermissionTo('announcements.view', 'sanctum') ? "✓ YES" : "✗ NO") . "\n";
    echo "  - students.create: " . ($studentUser->hasPermissionTo('students.create', 'sanctum') ? "✗ NO (as expected)" : "✓ YES (SECURITY ISSUE!)") . "\n";
    echo "  - placement.apply: " . ($studentUser->hasPermissionTo('placement.apply', 'sanctum') ? "✓ YES" : "✗ NO") . "\n";
}

if ($staffUser) {
    echo "Staff user checks:\n";
    echo "  - attendance.mark: " . ($staffUser->hasPermissionTo('attendance.mark', 'sanctum') ? "✓ YES" : "✗ NO") . "\n";
    echo "  - attendance.view: " . ($staffUser->hasPermissionTo('attendance.view', 'sanctum') ? "✓ YES" : "✗ NO") . "\n";
}

echo "\n=== VERIFICATION COMPLETE ===\n";
