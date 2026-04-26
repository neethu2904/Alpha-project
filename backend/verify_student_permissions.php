<?php

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Spatie\Permission\Models\Permission;
use App\Models\User;

echo "=== Student user (ID 3) Detailed Permissions ===\n\n";

$student = User::findOrFail(3);

echo "User: {$student->name} ({$student->email})\n";
echo "Role: {$student->role}\n";
echo "Designation: " . ($student->designation?->name ?? 'None') . "\n\n";

$permissions = $student->getAllPermissions();
echo "Total Permissions: " . $permissions->count() . "\n";
echo "Permissions:\n";
foreach ($permissions->sortBy('name') as $perm) {
    echo "  - {$perm->name}\n";
}

echo "\n=== Role Check ===\n";
$roles = $student->getRoleNames();
echo "Roles: " . $roles->implode(', ') . "\n";

echo "\n=== Direct hasPermissionTo Checks ===\n";
$testPermissions = [
    'students.create',
    'students.view',
    'placement.apply',
    'announcements.view',
    'attendance.mark',
];

foreach ($testPermissions as $perm) {
    $has = $student->hasPermissionTo($perm, 'sanctum');
    echo "  {$perm}: " . ($has ? "YES" : "NO") . "\n";
}

echo "\n=== Database Direct Query ===\n";
$userPermissions = \DB::table('model_has_permissions')
    ->join('permissions', 'model_has_permissions.permission_id', '=', 'permissions.id')
    ->where('model_has_permissions.model_id', 3)
    ->where('model_has_permissions.model_type', 'App\\Models\\User')
    ->where('permissions.guard_name', 'sanctum')
    ->pluck('permissions.name')
    ->toArray();

echo "Permissions in database:\n";
foreach ($userPermissions as $perm) {
    echo "  - $perm\n";
}
