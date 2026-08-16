<?php
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/bootstrap.php';

\Platform\Security\SessionManager::start($config['app']);

$connection = new \Platform\Database\Connection($config['database']);
$authService = new \Platform\Auth\AuthService($connection);
$authService->logout();

\Platform\Http\Response::redirect('/admin/index.php');
