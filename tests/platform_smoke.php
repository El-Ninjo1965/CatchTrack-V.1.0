<?php
declare(strict_types=1);

require_once __DIR__ . '/../server/src/Security/SessionManager.php';
require_once __DIR__ . '/../server/src/Database/Connection.php';
require_once __DIR__ . '/../server/src/Auth/AuthService.php';
require_once __DIR__ . '/../server/src/Modules/ModuleManager.php';
require_once __DIR__ . '/../server/src/Admin/AdminService.php';

use Platform\Auth\AuthService;
use Platform\Database\Connection;
use Platform\Modules\ModuleManager;
use Platform\Admin\AdminService;
use Platform\Security\SessionManager;

session_id('platform-smoke-test');
SessionManager::start([
    'session_name' => 'platform_test_session',
    'session_lifetime' => 3600,
    'session_secure' => false,
]);

$connection = new Connection([
    'driver' => 'sqlite',
    'database' => ':memory:',
    'host' => '',
    'port' => 0,
    'username' => '',
    'password' => '',
    'charset' => 'utf8'
]);

$pdo = $connection->pdo();
$pdo->exec('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, display_name TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT, updated_at TEXT)');
$pdo->exec('CREATE TABLE roles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, description TEXT NOT NULL)');
$pdo->exec('CREATE TABLE user_roles (user_id INTEGER NOT NULL, role_id INTEGER NOT NULL, assigned_at TEXT, PRIMARY KEY (user_id, role_id))');
$pdo->exec('CREATE TABLE modules (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, description TEXT NOT NULL, created_at TEXT)');
$pdo->exec('CREATE TABLE module_status (module_id INTEGER PRIMARY KEY, status TEXT NOT NULL, updated_at TEXT)');

$pdo->exec("INSERT INTO roles (name, description) VALUES ('admin', 'Administrative role'), ('viewer', 'Read only role')");
$pdo->exec("INSERT INTO modules (name, slug, description, created_at) VALUES ('API Interface', 'api-interface', 'API layer', CURRENT_TIMESTAMP)");
$pdo->exec("INSERT INTO module_status (module_id, status, updated_at) VALUES (1, 'enabled', CURRENT_TIMESTAMP)");

$auth = new AuthService($connection);
$auth->ensureBootstrapAdmin([
    'username' => 'platform_admin',
    'password' => 'platform-password',
    'display_name' => 'Platform Administrator'
]);

if (!$auth->login('platform_admin', 'platform-password')) {
    fwrite(STDERR, "Login failed\n");
    exit(1);
}

if (!$auth->requireAdmin()) {
    fwrite(STDERR, "Admin role assertion failed\n");
    exit(1);
}

$moduleManager = new ModuleManager($connection);
$adminService = new AdminService($connection, $moduleManager);

if (count($adminService->users()) < 1 || count($adminService->roles()) < 1 || count($adminService->modules()) < 1) {
    fwrite(STDERR, "Admin service data assertion failed\n");
    exit(1);
}

echo "platform_smoke:ok\n";
