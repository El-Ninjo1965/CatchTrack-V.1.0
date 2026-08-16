<?php

declare(strict_types=1);

const PLATFORM_ROOT = __DIR__ . '/..';

function platform_load_config(): array
{
    $default = require PLATFORM_ROOT . '/config/config.default.php';
    $localFile = PLATFORM_ROOT . '/config/config.local.php';
    $local = is_file($localFile) ? require $localFile : [];
    return array_replace_recursive($default, is_array($local) ? $local : []);
}

function platform_start_session(array $config): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $session = $config['session'] ?? [];
    session_name((string) ($session['name'] ?? 'platform_session'));
    session_set_cookie_params([
        'lifetime' => (int) ($session['lifetime'] ?? 3600),
        'path' => '/',
        'secure' => (bool) ($session['secure'] ?? false),
        'httponly' => (bool) ($session['httponly'] ?? true),
        'samesite' => (string) ($session['samesite'] ?? 'Lax')
    ]);
    session_start();
}

function platform_response(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function platform_json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }

    $parsed = json_decode($raw, true);
    return is_array($parsed) ? $parsed : [];
}

function platform_get_pdo(array $config): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $db = $config['database'] ?? [];
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $db['host'] ?? '127.0.0.1',
        (int) ($db['port'] ?? 3306),
        $db['name'] ?? '',
        $db['charset'] ?? 'utf8mb4'
    );

    $pdo = new PDO(
        $dsn,
        (string) ($db['username'] ?? ''),
        (string) ($db['password'] ?? ''),
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );

    return $pdo;
}

function platform_require_auth(): array
{
    if (!isset($_SESSION['user']) || !is_array($_SESSION['user'])) {
        platform_response([
            'ok' => false,
            'error' => 'AUTH_REQUIRED'
        ], 401);
    }

    return $_SESSION['user'];
}

function platform_require_admin(): array
{
    $user = platform_require_auth();
    if (($user['role_key'] ?? '') !== 'admin') {
        platform_response([
            'ok' => false,
            'error' => 'ADMIN_REQUIRED'
        ], 403);
    }

    return $user;
}
