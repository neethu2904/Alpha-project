<?php
// Load Laravel
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::first();
$token = $user->createToken('api-test')->plainTextToken;

$baseUrl = 'http://localhost:8000/api/v1';
$headers = [
    'Authorization: Bearer ' . $token,
    'Accept: application/json',
    'Content-Type: application/json'
];

function testEndpoint($method, $url, $headers, $data = null) {
    echo "\n$method $url\n";
    echo str_repeat("-", 60) . "\n";
    
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method
    ]);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "Status: HTTP $httpCode\n";
    
    $decoded = json_decode($response, true);
    if (is_array($decoded)) {
        if (isset($decoded['data']) && is_array($decoded['data'])) {
            if (isset($decoded['data'][0])) {
                echo "Found " . count($decoded['data']) . " items\n";
                echo "Sample: " . json_encode($decoded['data'][0], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
            } else {
                echo "Data keys: " . implode(', ', array_keys($decoded['data'])) . "\n";
            }
        } elseif (isset($decoded['message'])) {
            echo "Message: " . $decoded['message'] . "\n";
        } else {
            echo "Response: " . json_encode(array_slice($decoded, 0, 3), JSON_PRETTY_PRINT) . "\n";
        }
    } else {
        echo "Response: " . substr($response, 0, 300) . "\n";
    }
}

echo "=== API ENDPOINTS TEST ===\n";

// Test 1: Get departments
testEndpoint('GET', $baseUrl . '/departments', $headers);

// Test 2: Get all designations
testEndpoint('GET', $baseUrl . '/designations', $headers);

// Test 3: Seed default permissions
testEndpoint('POST', $baseUrl . '/permissions-v1/seed/defaults', $headers);

// Test 4: Get permissions grouped
testEndpoint('GET', $baseUrl . '/permissions-v1/list/grouped', $headers);

// Test 5: Get permission modules
testEndpoint('GET', $baseUrl . '/permissions-v1/list/modules', $headers);

// Test 6: Get permissions for students module
testEndpoint('GET', $baseUrl . '/permissions-v1/list/by-module/students', $headers);

echo "\n" . str_repeat("=", 60) . "\n";
echo "API Testing Complete!\n";
