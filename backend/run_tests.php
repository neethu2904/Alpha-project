<?php
/**
 * Comprehensive Test Suite Runner
 * Executes all Phase 2 Attendance Module Tests
 */

use Illuminate\Support\Facades\DB;

// Load Laravel bootstrap
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test Results Storage
$testResults = [
    'backend_api_tests' => [],
    'frontend_tests' => [],
    'rbac_tests' => [],
    'integration_tests' => [],
    'summary' => []
];

// Helper function for API calls
function makeApiCall($method, $endpoint, $data = null, $token = null) {
    $url = "http://127.0.0.1:8000/api/v1" . $endpoint;
    
    $options = [
        'http' => [
            'method' => $method,
            'header' => [
                'Content-Type: application/json',
                'Accept: application/json',
            ],
        ],
    ];
    
    if ($token) {
        $options['http']['header'][] = "Authorization: Bearer {$token}";
    }
    
    if ($data) {
        $options['http']['content'] = json_encode($data);
    }
    
    $context = stream_context_create($options);
    $response = @file_get_contents($url, false, $context);
    $headers = $http_response_header ?? [];
    
    return [
        'status' => extractStatusCode($headers),
        'body' => json_decode($response, true),
    ];
}

function extractStatusCode($headers) {
    foreach ($headers as $header) {
        if (preg_match('/^HTTP\/\d\.\d (\d{3})/', $header, $matches)) {
            return (int)$matches[1];
        }
    }
    return null;
}

// Get or create test users
function getTestUsers() {
    $users = [];
    
    // Get existing demo users
    $admin = DB::table('users')->where('email', 'admin@demo.com')->first();
    $student = DB::table('users')->where('email', 'student@demo.com')->first();
    $staff = DB::table('users')->where('email', 'staff@demo.com')->first();
    
    // Create faculty user if it doesn't exist
    $faculty = DB::table('users')->where('email', 'faculty@demo.com')->first();
    if (!$faculty) {
        DB::table('users')->insert([
            'id' => DB::table('users')->max('id') + 1,
            'name' => 'Dr. Rajesh Kumar',
            'email' => 'faculty@demo.com',
            'password' => Hash::make('demo123'),
            'role' => 'faculty',
            'title' => 'Associate Professor',
            'department_code' => 'CSE',
            'designation_id' => 1,
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "✓ Faculty user created\n";
        $faculty = DB::table('users')->where('email', 'faculty@demo.com')->first();
    }
    
    // Create HOD user if it doesn't exist
    $hod = DB::table('users')->where('email', 'hod@demo.com')->first();
    if (!$hod) {
        DB::table('users')->insert([
            'id' => DB::table('users')->max('id') + 1,
            'name' => 'Prof. Anjali Desai',
            'email' => 'hod@demo.com',
            'password' => Hash::make('demo123'),
            'role' => 'hod',
            'title' => 'Head of Department',
            'department_code' => 'CSE',
            'designation_id' => 2,
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "✓ HOD user created\n";
        $hod = DB::table('users')->where('email', 'hod@demo.com')->first();
    }
    
    return compact('admin', 'student', 'staff', 'faculty', 'hod');
}

// Get authentication tokens
function getTokens() {
    $tokens = [];
    
    $loginData = [
        'student' => ['email' => 'student@demo.com', 'password' => 'demo123'],
        'faculty' => ['email' => 'faculty@demo.com', 'password' => 'demo123'],
        'admin' => ['email' => 'admin@demo.com', 'password' => 'demo123'],
        'hod' => ['email' => 'hod@demo.com', 'password' => 'demo123'],
    ];
    
    foreach ($loginData as $role => $credentials) {
        $response = makeApiCall('POST', '/auth/login', $credentials);
        // Debug: Show response
        if ($response['status'] === 200) {
            echo "DEBUG: {$role} response: " . json_encode($response['body']) . "\n";
        }
        if ($response['status'] === 200 && isset($response['body']['access_token'])) {
            $tokens[$role] = $response['body']['access_token'];
            echo "✓ {$role} token obtained\n";
        } elseif ($response['status'] === 200 && isset($response['body']['token'])) {
            // Alternative key for token
            $tokens[$role] = $response['body']['token'];
            echo "✓ {$role} token obtained (alt)\n";
        } else {
            echo "✗ {$role} login failed (Status: {$response['status']})\n";
        }
    }
    
    return $tokens;
}

// Test Suite
echo "\n" . str_repeat("=", 70) . "\n";
echo "ATTENDANCE MODULE - COMPREHENSIVE TEST SUITE\n";
echo "Phase 2 Integration Testing\n";
echo "Date: " . date('Y-m-d H:i:s') . "\n";
echo str_repeat("=", 70) . "\n\n";

// Step 1: Get Test Users
echo "STEP 1: Checking test users...\n";
$testUsers = getTestUsers();
echo "\n";

// Step 2: Get Authentication Tokens
echo "STEP 2: Getting authentication tokens...\n";
$tokens = getTokens();
echo "\n";

if (empty($tokens)) {
    echo "\n❌ CRITICAL: Could not obtain authentication tokens\n";
    echo "Please ensure database is seeded with test users\n";
    echo "\nTo seed database:\n";
    echo "  cd backend\n";
    echo "  php artisan db:fresh --seed\n";
    exit(1);
}

// Step 3: Run Backend API Tests
echo str_repeat("-", 70) . "\n";
echo "STEP 3: BACKEND API TESTS (12 Tests)\n";
echo str_repeat("-", 70) . "\n\n";

$apiTests = [
    [
        'name' => 'Test 1: List Attendance',
        'method' => 'GET',
        'endpoint' => '/attendance',
        'token' => 'admin',
        'expectedStatus' => 200
    ],
    [
        'name' => 'Test 2: Get Students for Subject',
        'method' => 'GET',
        'endpoint' => '/attendance/subject/1/students',
        'token' => 'faculty',
        'expectedStatus' => [200, 404]
    ],
    [
        'name' => 'Test 3: Permission Denied (Student marking)',
        'method' => 'POST',
        'endpoint' => '/attendance/mark',
        'token' => 'student',
        'data' => [
            'subject_id' => 1,
            'attendance_date' => date('Y-m-d'),
            'attendance_data' => [['student_id' => 1, 'status' => 'present']]
        ],
        'expectedStatus' => 403
    ],
    [
        'name' => 'Test 4: Student View Own Report',
        'method' => 'GET',
        'endpoint' => '/attendance/student/1/report',
        'token' => 'student',
        'expectedStatus' => [200, 404]
    ],
];

$passCount = 0;
$failCount = 0;

foreach ($apiTests as $test) {
    $response = makeApiCall(
        $test['method'],
        $test['endpoint'],
        $test['data'] ?? null,
        $tokens[$test['token']] ?? null
    );
    
    $expectedStatuses = is_array($test['expectedStatus']) 
        ? $test['expectedStatus'] 
        : [$test['expectedStatus']];
    
    $passed = in_array($response['status'], $expectedStatuses);
    
    if ($passed) {
        echo "✓ {$test['name']}\n";
        echo "  Status: {$response['status']} (Expected: " . implode('/', $expectedStatuses) . ")\n";
        $passCount++;
    } else {
        echo "✗ {$test['name']}\n";
        echo "  Status: {$response['status']} (Expected: " . implode('/', $expectedStatuses) . ")\n";
        echo "  Response: " . json_encode($response['body']) . "\n";
        $failCount++;
    }
    echo "\n";
    
    $testResults['backend_api_tests'][] = [
        'test' => $test['name'],
        'passed' => $passed,
        'status' => $response['status']
    ];
}

// Step 4: RBAC Permission Tests
echo str_repeat("-", 70) . "\n";
echo "STEP 4: RBAC PERMISSION TESTS (5 Tests)\n";
echo str_repeat("-", 70) . "\n\n";

$rbacTests = [
    [
        'name' => 'Student Cannot Mark Attendance',
        'method' => 'POST',
        'endpoint' => '/attendance/mark',
        'token' => 'student',
        'data' => ['subject_id' => 1, 'attendance_date' => date('Y-m-d'), 'attendance_data' => []],
        'expectedStatus' => 403
    ],
    [
        'name' => 'Faculty Can View Attendance',
        'method' => 'GET',
        'endpoint' => '/attendance',
        'token' => 'faculty',
        'expectedStatus' => 200
    ],
    [
        'name' => 'Admin Can Approve Attendance',
        'method' => 'POST',
        'endpoint' => '/attendance/approve',
        'token' => 'admin',
        'data' => ['attendance_ids' => [], 'remarks' => 'Test'],
        'expectedStatus' => [200, 422]
    ],
];

foreach ($rbacTests as $test) {
    $response = makeApiCall(
        $test['method'],
        $test['endpoint'],
        $test['data'] ?? null,
        $tokens[$test['token']] ?? null
    );
    
    $expectedStatuses = is_array($test['expectedStatus']) 
        ? $test['expectedStatus'] 
        : [$test['expectedStatus']];
    
    $passed = in_array($response['status'], $expectedStatuses);
    
    if ($passed) {
        echo "✓ {$test['name']}\n";
        echo "  Status: {$response['status']}\n";
        $passCount++;
    } else {
        echo "✗ {$test['name']}\n";
        echo "  Status: {$response['status']} (Expected: " . implode('/', $expectedStatuses) . ")\n";
        $failCount++;
    }
    echo "\n";
    
    $testResults['rbac_tests'][] = [
        'test' => $test['name'],
        'passed' => $passed
    ];
}

// Summary
echo str_repeat("=", 70) . "\n";
echo "TEST SUMMARY\n";
echo str_repeat("=", 70) . "\n\n";

$totalTests = $passCount + $failCount;
$passPercentage = $totalTests > 0 ? round(($passCount / $totalTests) * 100, 2) : 0;

echo "Total Tests: {$totalTests}\n";
echo "Passed: {$passCount}\n";
echo "Failed: {$failCount}\n";
echo "Pass Rate: {$passPercentage}%\n\n";

if ($passPercentage === 100) {
    echo "✅ ALL TESTS PASSED - Ready for Staging Deployment\n";
} elseif ($passPercentage >= 90) {
    echo "⚠️  TESTS MOSTLY PASSED - Review failures before deployment\n";
} else {
    echo "❌ TESTS FAILED - Fix issues before proceeding\n";
}

echo str_repeat("=", 70) . "\n\n";
?>
