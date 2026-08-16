<?php
declare(strict_types=1);

namespace Platform\Auth;

use Platform\Database\Connection;
use Platform\Security\SessionManager;
use PDO;

final class AuthService
{
    public function __construct(private readonly Connection $connection)
    {
    }

    public function ensureBootstrapAdmin(array $bootstrapConfig): void
    {
        if (trim((string) $bootstrapConfig['password']) === '') {
            return;
        }

        $pdo = $this->connection->pdo();

        $query = $pdo->prepare('SELECT id FROM users WHERE username = :username LIMIT 1');
        $query->execute(['username' => $bootstrapConfig['username']]);

        if ($query->fetch()) {
            return;
        }

        $passwordHash = password_hash((string) $bootstrapConfig['password'], PASSWORD_DEFAULT);

        $pdo->beginTransaction();

        $insertUser = $pdo->prepare('INSERT INTO users (username, password_hash, display_name, status, created_at, updated_at) VALUES (:username, :password_hash, :display_name, :status, NOW(), NOW())');
        $insertUser->execute([
            'username' => $bootstrapConfig['username'],
            'password_hash' => $passwordHash,
            'display_name' => $bootstrapConfig['display_name'],
            'status' => 'active'
        ]);

        $userId = (int) $pdo->lastInsertId();

        $roleQuery = $pdo->prepare('SELECT id FROM roles WHERE name = :name LIMIT 1');
        $roleQuery->execute(['name' => 'admin']);
        $adminRole = $roleQuery->fetch(PDO::FETCH_ASSOC);

        if ($adminRole) {
            $link = $pdo->prepare('INSERT INTO user_roles (user_id, role_id, assigned_at) VALUES (:user_id, :role_id, NOW())');
            $link->execute(['user_id' => $userId, 'role_id' => (int) $adminRole['id']]);
        }

        $pdo->commit();
    }

    public function login(string $username, string $password): bool
    {
        $stmt = $this->connection->pdo()->prepare(
            'SELECT u.id, u.username, u.password_hash, u.display_name, r.name AS role_name
             FROM users u
             LEFT JOIN user_roles ur ON ur.user_id = u.id
             LEFT JOIN roles r ON r.id = ur.role_id
             WHERE u.username = :username AND u.status = :status'
        );

        $stmt->execute([
            'username' => $username,
            'status' => 'active'
        ]);

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($rows === []) {
            return false;
        }

        $first = $rows[0];
        if (!password_verify($password, (string) $first['password_hash'])) {
            return false;
        }

        SessionManager::regenerate();
        $_SESSION['user'] = [
            'id' => (int) $first['id'],
            'username' => (string) $first['username'],
            'display_name' => (string) $first['display_name'],
            'roles' => array_values(array_filter(array_map(static fn(array $row): ?string => $row['role_name'] ? (string) $row['role_name'] : null, $rows))),
        ];

        return true;
    }

    public function logout(): void
    {
        SessionManager::destroy();
    }

    public function user(): ?array
    {
        return $_SESSION['user'] ?? null;
    }

    public function requireAdmin(): bool
    {
        $user = $this->user();
        return $user !== null && in_array('admin', $user['roles'], true);
    }
}
