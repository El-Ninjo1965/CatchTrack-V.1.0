<?php
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/bootstrap.php';

\Platform\Security\SessionManager::start($config['app']);

$connection = new \Platform\Database\Connection($config['database']);
$authService = new \Platform\Auth\AuthService($connection);
$moduleManager = new \Platform\Modules\ModuleManager($connection);
$adminService = new \Platform\Admin\AdminService($connection, $moduleManager);

$authService->ensureBootstrapAdmin($config['app']['bootstrap_admin']);

$errorMessage = '';
if (($_GET['error'] ?? '') === 'forbidden') {
    $errorMessage = 'Access denied: administrator role required.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim((string) ($_POST['username'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');

    if ($username === '' || $password === '') {
        $errorMessage = 'Username and password are required.';
    } elseif (!$authService->login($username, $password)) {
        $errorMessage = 'Invalid administrator credentials.';
    } elseif (!$authService->requireAdmin()) {
        $authService->logout();
        \Platform\Http\Response::redirect('/admin/index.php?error=forbidden');
    } else {
        \Platform\Http\Response::redirect('/admin/index.php');
    }
}

$user = $authService->user();
if ($user !== null && $authService->requireAdmin()) {
    $users = $adminService->users();
    $roles = $adminService->roles();
    $modules = $adminService->modules();
    require dirname(__DIR__, 2) . '/admin/views/dashboard.php';
    exit;
}

require dirname(__DIR__, 2) . '/admin/views/login.php';
