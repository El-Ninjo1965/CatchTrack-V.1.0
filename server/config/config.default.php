<?php

declare(strict_types=1);

return [
    'app' => [
        'name' => 'Web App Framework v1',
        'environment' => getenv('APP_ENV') ?: 'production',
        'debug' => filter_var(getenv('APP_DEBUG') ?: 'false', FILTER_VALIDATE_BOOL),
        'base_url' => getenv('APP_BASE_URL') ?: ''
    ],
    'database' => [
        'host' => getenv('DB_HOST') ?: '127.0.0.1',
        'port' => (int) (getenv('DB_PORT') ?: '3306'),
        'name' => getenv('DB_NAME') ?: 'web_app_platform',
        'username' => getenv('DB_USERNAME') ?: '',
        'password' => getenv('DB_PASSWORD') ?: '',
        'charset' => 'utf8mb4'
    ],
    'session' => [
        'name' => getenv('SESSION_NAME') ?: 'platform_session',
        'lifetime' => (int) (getenv('SESSION_LIFETIME') ?: '3600'),
        'secure' => filter_var(getenv('SESSION_SECURE') ?: 'false', FILTER_VALIDATE_BOOL),
        'httponly' => true,
        'samesite' => getenv('SESSION_SAMESITE') ?: 'Lax'
    ]
];
