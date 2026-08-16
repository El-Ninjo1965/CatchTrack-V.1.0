<?php
declare(strict_types=1);

namespace Platform\Http;

final class Router
{
    /** @var array<string, callable> */
    private array $routes = [];

    public function add(string $method, string $path, callable $handler): void
    {
        $key = strtoupper($method) . ' ' . rtrim($path, '/');
        $this->routes[$key] = $handler;
    }

    public function dispatch(string $method, string $path): bool
    {
        $normalizedPath = rtrim($path, '/') ?: '/';
        $key = strtoupper($method) . ' ' . $normalizedPath;

        if (!array_key_exists($key, $this->routes)) {
            return false;
        }

        ($this->routes[$key])();
        return true;
    }
}
