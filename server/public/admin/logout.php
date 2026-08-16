<?php

declare(strict_types=1);

require_once __DIR__ . '/../../api/bootstrap.php';

$config = platform_load_config();
platform_start_session($config);
$_SESSION = [];
session_destroy();
header('Location: /admin/login.php');
exit;
