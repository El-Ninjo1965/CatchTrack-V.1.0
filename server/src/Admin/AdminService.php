<?php
declare(strict_types=1);

namespace Platform\Admin;

use Platform\Database\Connection;
use Platform\Modules\ModuleManager;

final class AdminService
{
    public function __construct(
        private readonly Connection $connection,
        private readonly ModuleManager $moduleManager
    ) {
    }

    public function users(): array
    {
        $stmt = $this->connection->pdo()->query(
            'SELECT id, username, display_name, status, created_at, updated_at FROM users ORDER BY id ASC'
        );

        return $stmt->fetchAll() ?: [];
    }

    public function roles(): array
    {
        $stmt = $this->connection->pdo()->query('SELECT id, name, description FROM roles ORDER BY name ASC');
        return $stmt->fetchAll() ?: [];
    }

    public function modules(): array
    {
        return $this->moduleManager->listAll();
    }
}
