<?php
declare(strict_types=1);

namespace Platform\Database;

use PDO;

final class Connection
{
    private PDO $pdo;

    public function __construct(array $databaseConfig)
    {
        $dsn = sprintf(
            '%s:host=%s;port=%d;dbname=%s;charset=%s',
            $databaseConfig['driver'],
            $databaseConfig['host'],
            $databaseConfig['port'],
            $databaseConfig['database'],
            $databaseConfig['charset']
        );

        $this->pdo = new PDO($dsn, $databaseConfig['username'], $databaseConfig['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }

    public function pdo(): PDO
    {
        return $this->pdo;
    }
}
