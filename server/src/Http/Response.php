<?php
declare(strict_types=1);

namespace Platform\Http;

final class Response
{
    public static function json(array $payload, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        $encoded = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if ($encoded === false) {
            http_response_code(500);
            echo '{"ok":false,"error":"encoding_error","message":"Response encoding failed."}';
            return;
        }

        echo $encoded;
    }

    public static function redirect(string $path): void
    {
        header('Location: ' . $path, true, 302);
    }
}
