<?php
declare(strict_types=1);

namespace Platform\Security;

final class SessionManager
{
    public static function start(array $appConfig): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        session_name($appConfig['session_name']);
        session_set_cookie_params([
            'lifetime' => (int) $appConfig['session_lifetime'],
            'path' => '/',
            'domain' => '',
            'secure' => (bool) $appConfig['session_secure'],
            'httponly' => true,
            'samesite' => 'Strict',
        ]);

        ini_set('session.use_strict_mode', '1');
        ini_set('session.use_only_cookies', '1');
        ini_set('session.cookie_httponly', '1');

        session_start();
    }

    public static function regenerate(): void
    {
        session_regenerate_id(true);
    }

    public static function destroy(): void
    {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 3600, $params['path'], $params['domain'], (bool) $params['secure'], (bool) $params['httponly']);
        }

        session_destroy();
    }
}
