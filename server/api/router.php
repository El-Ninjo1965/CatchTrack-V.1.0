<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$config = platform_load_config();
platform_start_session($config);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

$scriptPath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
if ($scriptPath !== '/' && $scriptPath !== '.') {
    $uri = '/' . ltrim((string) preg_replace('#^' . preg_quote($scriptPath, '#') . '#', '', $uri), '/');
}

$routes = [
    'GET' => [
        '/health' => static function () use ($config): void {
            platform_response([
                'ok' => true,
                'status' => 'healthy',
                'app' => $config['app']['name'] ?? 'Web App Framework v1',
                'time' => gmdate('c')
            ]);
        },
        '/auth/session' => static function (): void {
            $user = $_SESSION['user'] ?? null;
            platform_response([
                'ok' => true,
                'authenticated' => is_array($user),
                'user' => $user
            ]);
        },
        '/admin/users' => static function () use ($config): void {
            platform_require_admin();
            $pdo = platform_get_pdo($config);
            $stmt = $pdo->query('SELECT u.id, u.username, u.display_name, u.status, r.role_key, u.created_at, u.updated_at FROM users u INNER JOIN roles r ON r.id = u.role_id ORDER BY u.id ASC');
            platform_response(['ok' => true, 'data' => $stmt->fetchAll()]);
        },
        '/admin/modules' => static function () use ($config): void {
            platform_require_admin();
            $pdo = platform_get_pdo($config);
            $stmt = $pdo->query('SELECT module_key, module_name, status, created_at, updated_at FROM modules ORDER BY module_name ASC');
            platform_response(['ok' => true, 'data' => $stmt->fetchAll()]);
        }
    ],
    'POST' => [
        '/auth/login' => static function () use ($config): void {
            $input = platform_json_input();
            $username = trim((string) ($input['username'] ?? ''));
            $password = (string) ($input['password'] ?? '');

            if ($username === '' || $password === '') {
                platform_response(['ok' => false, 'error' => 'INVALID_CREDENTIALS'], 422);
            }

            $pdo = platform_get_pdo($config);
            $stmt = $pdo->prepare('SELECT u.id, u.username, u.display_name, u.password_hash, u.status, r.role_key FROM users u INNER JOIN roles r ON r.id = u.role_id WHERE u.username = :username LIMIT 1');
            $stmt->execute(['username' => $username]);
            $user = $stmt->fetch();

            if (!$user || ($user['status'] ?? '') !== 'active' || !password_verify($password, (string) ($user['password_hash'] ?? ''))) {
                platform_response(['ok' => false, 'error' => 'INVALID_CREDENTIALS'], 401);
            }

            session_regenerate_id(true);
            $_SESSION['user'] = [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'display_name' => $user['display_name'],
                'role_key' => $user['role_key']
            ];

            platform_response(['ok' => true, 'user' => $_SESSION['user']]);
        },
        '/auth/logout' => static function (): void {
            $_SESSION = [];
            if (ini_get('session.use_cookies')) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', $params['secure'] ?? false, $params['httponly'] ?? true);
            }
            session_destroy();
            platform_response(['ok' => true]);
        }
    ]
];

$handler = $routes[$method][$uri] ?? null;
if (!is_callable($handler)) {
    platform_response(['ok' => false, 'error' => 'NOT_FOUND'], 404);
}

try {
    $handler();
} catch (Throwable $exception) {
    platform_response([
        'ok' => false,
        'error' => 'INTERNAL_ERROR',
        'message' => ($config['app']['debug'] ?? false) ? $exception->getMessage() : 'Unexpected server error.'
    ], 500);
}
