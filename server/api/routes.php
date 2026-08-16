<?php
declare(strict_types=1);

use Platform\Auth\AuthService;
use Platform\Http\Response;
use Platform\Http\Router;
use Platform\Admin\AdminService;

/** @var Router $router */
/** @var AuthService $authService */
/** @var AdminService $adminService */

$router->add('GET', '/api/health', static function (): void {
    Response::json([
        'ok' => true,
        'service' => 'technical-platform',
        'status' => 'healthy',
        'timestamp' => gmdate('c')
    ]);
});

$router->add('POST', '/api/auth/login', static function () use ($authService): void {
    $body = \Platform\Http\Request::jsonBody();
    $username = trim((string) ($body['username'] ?? ''));
    $password = (string) ($body['password'] ?? '');

    if ($username === '' || $password === '') {
        Response::json(['ok' => false, 'error' => 'validation_error', 'message' => 'Username and password are required.'], 422);
        return;
    }

    if (!$authService->login($username, $password)) {
        Response::json(['ok' => false, 'error' => 'invalid_credentials', 'message' => 'Invalid credentials.'], 401);
        return;
    }

    Response::json(['ok' => true, 'user' => $authService->user()]);
});

$router->add('POST', '/api/auth/logout', static function () use ($authService): void {
    $authService->logout();
    Response::json(['ok' => true]);
});

$router->add('GET', '/api/admin/users', static function () use ($authService, $adminService): void {
    if (!$authService->requireAdmin()) {
        Response::json(['ok' => false, 'error' => 'forbidden'], 403);
        return;
    }

    Response::json(['ok' => true, 'data' => $adminService->users()]);
});

$router->add('GET', '/api/admin/roles', static function () use ($authService, $adminService): void {
    if (!$authService->requireAdmin()) {
        Response::json(['ok' => false, 'error' => 'forbidden'], 403);
        return;
    }

    Response::json(['ok' => true, 'data' => $adminService->roles()]);
});

$router->add('GET', '/api/admin/modules', static function () use ($authService, $adminService): void {
    if (!$authService->requireAdmin()) {
        Response::json(['ok' => false, 'error' => 'forbidden'], 403);
        return;
    }

    Response::json(['ok' => true, 'data' => $adminService->modules()]);
});
