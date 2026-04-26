<?php

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Support\Campus\CampusPermission;

echo "=== COMPREHENSIVE PERMISSION VERIFICATION ===\n\n";

// 1. Verify constant definitions
echo "1. CampusPermission Constants\n";
echo "   Total constants: " . count(CampusPermission::all()) . "\n";
echo "   STUDENTS_CREATE constant: " . (defined('App\Support\Campus\CampusPermission::STUDENTS_CREATE') ? 'Defined' : 'Not defined') . "\n";

// 2. Verify role definitions
echo "\n2. Role Definitions (CampusPermission::byRole())\n";
$byRole = CampusPermission::byRole();
echo "   Admin permissions: " . count($byRole['admin']) . "\n";
echo "   Staff permissions: " . count($byRole['staff']) . "\n";
echo "   Student permissions: " . count($byRole['student']) . "\n";
echo "   Checking if STUDENTS_CREATE in student role: " . (in_array('students.create', $byRole['student']) ? 'YES (BUG!)' : 'NO (correct)') . "\n";

// 3. Verify role->permission assignments in database
echo "\n3. Database Role Assignments\n";
$roles = \DB::table('roles')->get();
foreach ($roles as $role) {
    $count = \DB::table('role_has_permissions')
        ->where('role_id', $role->id)
        ->count();
    echo "   {$role->name} role: {$count} permissions\n";
}

// 4. Verify each user's permissions
echo "\n4. User Permission Verification\n";
$users = User::all();
foreach ($users as $user) {
    $perms = $user->getAllPermissions();
    $hasStudentCreate = $user->hasPermissionTo('students.create', 'sanctum');
    echo "   {$user->name} ({$user->role}): {$perms->count()} permissions, students.create={$hasStudentCreate}\n";
}

// 5. Route middleware enforcement test
echo "\n5. Simulated Route Protection Test\n";
$admin = User::where('email', 'admin@demo.com')->first();
$student = User::where('email', 'student@demo.com')->first();

echo "   Admin can create students: " . ($admin->hasPermissionTo('students.create', 'sanctum') ? "YES ✓" : "NO") . "\n";
echo "   Student can create students: " . ($student->hasPermissionTo('students.create', 'sanctum') ? "YES ✗ SECURITY ISSUE" : "NO ✓") . "\n";

echo "\n=== VERIFICATION COMPLETE ===\n";
