<?php
declare(strict_types=1);

return [
    'app_name' => getenv('PLATFORM_APP_NAME') ?: 'Technical Web App Platform',
    'environment' => getenv('APP_ENV') ?: 'production',
    'session_name' => getenv('PLATFORM_SESSION_NAME') ?: 'platform_session',
    'session_secure' => filter_var(getenv('SESSION_SECURE') ?: '1', FILTER_VALIDATE_BOOL),
    'session_lifetime' => (int) (getenv('SESSION_LIFETIME') ?: 3600),
    'bootstrap_admin' => [
        'username' => getenv('BOOTSTRAP_ADMIN_USERNAME') ?: 'platform_admin',
        'password' => getenv('BOOTSTRAP_ADMIN_PASSWORD') ?: '',
        'display_name' => getenv('BOOTSTRAP_ADMIN_DISPLAY_NAME') ?: 'Platform Administrator',
    ],
];
