<?php

declare(strict_types=1);

require_once __DIR__ . '/../../api/bootstrap.php';

$config = platform_load_config();
platform_start_session($config);

if (isset($_SESSION['user']) && ($_SESSION['user']['role_key'] ?? '') === 'admin') {
    header('Location: /admin/dashboard.php');
    exit;
}

$error = '';
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $username = trim((string) ($_POST['username'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');

    if ($username !== '' && $password !== '') {
        $pdo = platform_get_pdo($config);
        $stmt = $pdo->prepare('SELECT u.id, u.username, u.display_name, u.password_hash, u.status, r.role_key FROM users u INNER JOIN roles r ON r.id = u.role_id WHERE u.username = :username LIMIT 1');
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();

        if ($user && ($user['status'] ?? '') === 'active' && ($user['role_key'] ?? '') === 'admin' && password_verify($password, (string) ($user['password_hash'] ?? ''))) {
            session_regenerate_id(true);
            $_SESSION['user'] = [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'display_name' => $user['display_name'],
                'role_key' => $user['role_key']
            ];
            header('Location: /admin/dashboard.php');
            exit;
        }
    }

    $error = 'Invalid credentials.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Platform Administration Login</title>
</head>
<body>
    <h1>Platform Administration</h1>
    <?php if ($error !== ''): ?>
        <p><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></p>
    <?php endif; ?>
    <form method="post" action="">
        <label>
            Username
            <input type="text" name="username" required>
        </label>
        <label>
            Password
            <input type="password" name="password" required>
        </label>
        <button type="submit">Login</button>
    </form>
</body>
</html>
