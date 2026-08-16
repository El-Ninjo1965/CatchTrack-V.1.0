<?php

declare(strict_types=1);

require_once __DIR__ . '/../../api/bootstrap.php';

$config = platform_load_config();
platform_start_session($config);
$user = platform_require_admin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Platform Administration Dashboard</title>
</head>
<body>
    <h1>Administration Dashboard</h1>
    <p>Welcome, <?php echo htmlspecialchars((string) ($user['display_name'] ?? $user['username'] ?? 'Administrator'), ENT_QUOTES, 'UTF-8'); ?>.</p>
    <ul>
        <li><a href="/health">Health Check</a></li>
        <li><a href="/admin/users.php">User Management</a></li>
        <li><a href="/admin/modules.php">Module Management</a></li>
        <li><a href="/admin/logout.php">Logout</a></li>
    </ul>
</body>
</html>
