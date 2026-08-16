<?php
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/bootstrap.php';

\Platform\Security\SessionManager::start($config['app']);

$connection = new \Platform\Database\Connection($config['database']);
$authService = new \Platform\Auth\AuthService($connection);
$moduleManager = new \Platform\Modules\ModuleManager($connection);
$adminService = new \Platform\Admin\AdminService($connection, $moduleManager);
$router = new \Platform\Http\Router();

$authService->ensureBootstrapAdmin($config['app']['bootstrap_admin']);

require dirname(__DIR__, 2) . '/api/routes.php';

$method = \Platform\Http\Request::method();
$path = \Platform\Http\Request::path();

if (!$router->dispatch($method, $path)) {
    \Platform\Http\Response::json(['ok' => false, 'error' => 'not_found'], 404);
}
