<?php
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');

$root = __DIR__;

require_once $root . '/src/Http/Response.php';
require_once $root . '/src/Http/Request.php';
require_once $root . '/src/Http/Router.php';
require_once $root . '/src/Security/SessionManager.php';
require_once $root . '/src/Database/Connection.php';
require_once $root . '/src/Auth/AuthService.php';
require_once $root . '/src/Modules/ModuleManager.php';
require_once $root . '/src/Admin/AdminService.php';

set_exception_handler(static function (Throwable $exception): void {
    http_response_code(500);
    \Platform\Http\Response::json([
        'ok' => false,
        'error' => 'internal_error',
        'message' => 'An internal error occurred.'
    ], 500);
});

set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

$config = [
    'app' => require $root . '/config/app.php',
    'database' => require $root . '/config/database.php',
];
