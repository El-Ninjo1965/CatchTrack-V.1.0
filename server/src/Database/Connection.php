<?php
declare(strict_types=1);

namespace Platform\Database;

use PDO;

final class Connection
{
    private PDO $pdo;

    public function __construct(array $databaseConfig)
    {
        if (($databaseConfig['driver'] ?? 'mysql') === 'sqlite') {
            $dsn = 'sqlite:' . ($databaseConfig['database'] ?: ':memory:');
            $username = null;
            $password = null;
        } else {
            $dsn = sprintf(
                '%s:host=%s;port=%d;dbname=%s;charset=%s',
                $databaseConfig['driver'],
                $databaseConfig['host'],
                $databaseConfig['port'],
                $databaseConfig['database'],
                $databaseConfig['charset']
            );
            $username = $databaseConfig['username'];
            $password = $databaseConfig['password'];
        }

        $this->pdo = new PDO($dsn, $username, $password, [
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
