<?php
/** Lightweight checks for the current backend configuration. */

$database = require __DIR__ . '/../config/database.php';
$app = require __DIR__ . '/../config/app.php';

$checks = [
    'Database config' => isset($database['host'], $database['port'], $database['database'], $database['username'], $database['charset']),
    'App config' => isset($app['env'], $app['url'], $app['jwt_secret']),
    'UTF-8 database' => ($database['charset'] ?? null) === 'utf8mb4',
];

$failed = [];
foreach ($checks as $name => $passed) {
    echo ($passed ? "✓ " : "✗ ") . $name . PHP_EOL;
    if (!$passed) $failed[] = $name;
}

if ($failed) {
    fwrite(STDERR, 'Failed checks: ' . implode(', ', $failed) . PHP_EOL);
    exit(1);
}
