<?php

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Department;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

echo "=== DEPARTMENT FIELDS VERIFICATION ===\n\n";

// 1. Check database schema
echo "1. DATABASE SCHEMA\n";
$columns = DB::select("DESCRIBE departments");
echo "   Columns: " . count($columns) . "\n";
foreach ($columns as $col) {
    $nullable = $col->Null === 'YES' ? 'nullable' : 'required';
    echo "   ✓ {$col->Field} ({$col->Type}, {$nullable})\n";
}

// 2. Check model fillable
echo "\n2. MODEL CONFIGURATION\n";
$dept = new Department();
echo "   Fillable fields: " . count($dept->getFillable()) . "\n";
foreach ($dept->getFillable() as $field) {
    echo "   ✓ {$field}\n";
}

// 3. Test creation with all fields
echo "\n3. CREATE DEPARTMENT TEST\n";
try {
    // Create HOD
    $hod = User::where('role', 'staff')->first();
    if (!$hod) {
        $hod = User::create([
            'name' => 'Dr. Test HOD',
            'email' => 'test-hod-' . time() . '@test.edu',
            'password' => Hash::make('test123'),
            'role' => 'staff',
            'title' => 'Department Head',
        ]);
        echo "   Created test HOD: {$hod->name}\n";
    }

    $testDept = Department::create([
        'name' => 'Information Technology',
        'code' => 'IT-' . time(),
        'description' => 'Department of Information Technology focused on latest technologies',
        'hod_id' => $hod->id,
        'contact_email' => 'it@campus.edu',
        'phone' => '+1-555-0200',
        'intake_capacity' => 100,
        'status' => 'active',
    ]);
    echo "   ✓ Department created successfully\n";
    echo "   ID: {$testDept->id}\n";
    echo "   Name: {$testDept->name}\n";
    echo "   Code: {$testDept->code}\n";
} catch (Exception $e) {
    echo "   ✗ Error: {$e->getMessage()}\n";
}

// 4. Query and verify
echo "\n4. RETRIEVE & VERIFY\n";
if (isset($testDept)) {
    echo "   Name: {$testDept->name}\n";
    echo "   Code: {$testDept->code}\n";
    echo "   Description: " . substr($testDept->description ?? 'null', 0, 50) . "...\n";
    echo "   HOD ID: {$testDept->hod_id}\n";
    echo "   HOD Name: " . ($testDept->hod?->name ?? 'null') . "\n";
    echo "   Contact Email: {$testDept->contact_email}\n";
    echo "   Phone: {$testDept->phone}\n";
    echo "   Intake Capacity: {$testDept->intake_capacity}\n";
    echo "   Status: {$testDept->status}\n";
    echo "   Created At: {$testDept->created_at}\n";
    echo "   Updated At: {$testDept->updated_at}\n";
}

// 5. Field completeness check
echo "\n5. FIELD COMPLETENESS CHECK\n";
$requiredFields = [
    'Basic Info' => ['name', 'code', 'description'],
    'Management' => ['hod_id', 'contact_email', 'phone'],
    'Capacity' => ['intake_capacity'],
    'Status & Control' => ['status', 'created_at', 'updated_at'],
];

foreach ($requiredFields as $category => $fields) {
    echo "   {$category}:\n";
    foreach ($fields as $field) {
        $hasField = isset($testDept->{$field});
        $status = $hasField ? '✓' : '✗';
        echo "   {$status} {$field}\n";
    }
}

// 6. Scopes test
echo "\n6. SCOPES TESTING\n";
$activeCount = Department::active()->count();
$inactiveCount = Department::inactive()->count();
echo "   Active departments: {$activeCount}\n";
echo "   Inactive departments: {$inactiveCount}\n";

// 7. Relationships test
echo "\n7. RELATIONSHIPS TESTING\n";
$dept = Department::first();
if ($dept) {
    echo "   Department: {$dept->name} ({$dept->code})\n";
    echo "   Has HOD relationship: " . (method_exists($dept, 'hod') ? '✓' : '✗') . "\n";
    echo "   Has students relationship: " . (method_exists($dept, 'students') ? '✓' : '✗') . "\n";
    echo "   Has staff relationship: " . (method_exists($dept, 'staff') ? '✓' : '✗') . "\n";
    echo "   Has courses relationship: " . (method_exists($dept, 'courses') ? '✓' : '✗') . "\n";
}

echo "\n=== VERIFICATION COMPLETE ===\n";
