<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

\Platform\Http\Response::json([
    'ok' => true,
    'service' => 'technical-platform',
    'message' => 'Use /api/health for health checks and /admin for administration.'
]);
