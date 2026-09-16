<?php
/**
 * MiniShop Backend Unit Tests Runner
 * This script runs all PHP unit tests for the backend
 */

// Bootstrap the application
require_once __DIR__ . '/../bootstrap.php';

// Simple test runner - will be expanded with actual tests
$tests = [];

// Test 1: Check if bootstrap is loaded
try {
    if (class_exists('App\\Config\\Config')) {
        $tests['Bootstrap'] = ['status' => 'PASS', 'message' => 'Bootstrap loaded successfully'];
    } else {
        $tests['Bootstrap'] = ['status' => 'FAIL', 'message' => 'Bootstrap failed to load'];
    }
} catch (Exception $e) {
    $tests['Bootstrap'] = ['status' => 'ERROR', 'message' => $e->getMessage()];
}

// Test 2: Check database configuration
try {
    $config = App\\Config\\Config::get('database');
    if (isset($config['host'], $config['database'], $config['username'])) {
        $tests['Database Config'] = ['status' => 'PASS', 'message' => 'Database configuration is valid'];
    } else {
        $tests['Database Config'] = ['status' => 'FAIL', 'message' => 'Database configuration is incomplete'];
    }
} catch (Exception $e) {
    $tests['Database Config'] = ['status' => 'ERROR', 'message' => $e->getMessage()];
}

// Test 3: Check JWT configuration
try {
    $jwtConfig = App\\Config\\Config::get('jwt');
    if (isset($jwtConfig['secret'], $jwtConfig['issuer'], $jwtConfig['audience'])) {
        $tests['JWT Config'] = ['status' => 'PASS', 'message' => 'JWT configuration is valid'];
    } else {
        $tests['JWT Config'] = ['status' => 'FAIL', 'message' => 'JWT configuration is incomplete'];
    }
} catch (Exception $e) {
    $tests['JWT Config'] = ['status' => 'ERROR', 'message' => $e->getMessage()];
}

// Output test results
$passed = 0;
$failed = 0;
$errors = 0;

echo "\n========================================\n";
echo "MiniShop Backend Unit Tests\n";
echo "========================================\n\n";

foreach ($tests as $name => $result) {
    $status = $result['status'];
    $message = $result['message'];
    
    switch ($status) {
        case 'PASS':
            echo "✓ ";
            $passed++;
            break;
        case 'FAIL':
            echo "✗ ";
            $failed++;
            break;
        case 'ERROR':
            echo "✗ ";
            $errors++;
            break;
    }
    
    echo "$name: $message\n";
}

echo "\n========================================\n";
echo "Results: $passed passed, $failed failed, $errors errors\n";
echo "========================================\n";

// Exit with appropriate code
if ($failed > 0 || $errors > 0) {
    exit(1);
}
exit(0);
