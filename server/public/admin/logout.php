<?php

declare(strict_types=1);

require_once __DIR__ . '/../../api/bootstrap.php';

$config = platform_load_config();
platform_start_session($config);
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 3600, $params['path'], $params['domain'] ?? '', $params['secure'] ?? false, $params['httponly'] ?? true);
}
session_destroy();
header('Location: /admin/login.php');
exit;
