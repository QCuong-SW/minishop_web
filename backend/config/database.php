<?php
return [
    'host' => getenv('DB_HOST') ?: '127.0.0.1',
    'port' => getenv('DB_PORT') ?: '3306',
    'database' => getenv('DB_DATABASE') ?: 'shopee_mini',
    'username' => getenv('DB_USERNAME') ?: 'app',
    'password' => getenv('DB_PASSWORD') ?: 'app',
    'charset' => 'utf8mb4'
];
