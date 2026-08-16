<?php
declare(strict_types=1);

namespace Platform\Modules;

use Platform\Database\Connection;

final class ModuleManager
{
    public function __construct(private readonly Connection $connection)
    {
    }

    public function listAll(): array
    {
        $sql = 'SELECT m.id, m.name, m.slug, m.description, ms.status, ms.updated_at
                FROM modules m
                LEFT JOIN module_status ms ON ms.module_id = m.id
                ORDER BY m.name ASC';

        $stmt = $this->connection->pdo()->query($sql);
        return $stmt->fetchAll() ?: [];
    }
}
