<?php
// Autoloader đơn giản cho PSR-4 App\ -> src/
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../src/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

use App\Shared\Http\Request;
use App\Shared\Middleware\CorsMiddleware;

// Xử lý CORS Preflight
CorsMiddleware::handle();

// Nạp Router và Dispatch
$router = require __DIR__ . '/../routes/api.php';
$router->dispatch(Request::getMethod(), Request::getUri());
