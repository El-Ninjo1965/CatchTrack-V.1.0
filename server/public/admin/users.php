<?php

declare(strict_types=1);

require_once __DIR__ . '/../../api/bootstrap.php';

$config = platform_load_config();
platform_start_session($config);
platform_require_admin();
$pdo = platform_get_pdo($config);
$users = $pdo->query('SELECT u.id, u.username, u.display_name, u.status, r.role_key, u.created_at FROM users u INNER JOIN roles r ON r.id = u.role_id ORDER BY u.id ASC')->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>User Management</title></head>
<body>
<h1>User Management</h1>
<table border="1" cellpadding="6" cellspacing="0">
    <thead><tr><th>ID</th><th>Username</th><th>Display Name</th><th>Role</th><th>Status</th><th>Created</th></tr></thead>
    <tbody>
    <?php foreach ($users as $entry): ?>
        <tr>
            <td><?php echo (int) $entry['id']; ?></td>
            <td><?php echo htmlspecialchars((string) $entry['username'], ENT_QUOTES, 'UTF-8'); ?></td>
            <td><?php echo htmlspecialchars((string) $entry['display_name'], ENT_QUOTES, 'UTF-8'); ?></td>
            <td><?php echo htmlspecialchars((string) $entry['role_key'], ENT_QUOTES, 'UTF-8'); ?></td>
            <td><?php echo htmlspecialchars((string) $entry['status'], ENT_QUOTES, 'UTF-8'); ?></td>
            <td><?php echo htmlspecialchars((string) $entry['created_at'], ENT_QUOTES, 'UTF-8'); ?></td>
        </tr>
    <?php endforeach; ?>
    </tbody>
</table>
<p><a href="/admin/dashboard.php">Back to Dashboard</a></p>
</body>
</html>
