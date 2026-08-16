const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { port, host, rootDir, webRootDir, apiBase } = require('./config');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload, null, 2));
};

const safeResolve = (baseDir, requestPath) => {
  const normalized = path.normalize(requestPath).replace(/^\/+/, '');
  const resolved = path.resolve(baseDir, normalized);

  if (resolved !== baseDir && !resolved.startsWith(baseDir + path.sep)) {
    return null;
  }

  return resolved;
};

const serveStaticFile = (res, filePath) => {
  if (!filePath || !fs.existsSync(filePath)) {
    sendJson(res, 404, { ok: false, code: 'NOT_FOUND', message: 'Resource not found.' });
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const content = fs.readFileSync(filePath);
  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  res.end(content);
};

const routeApi = (url, res) => {
  const pathname = url.pathname;
  if (pathname === `${apiBase}/health`) {
    sendJson(res, 200, {
      ok: true,
      service: 'neutral-platform',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
    return true;
  }

  if (pathname === `${apiBase}/status`) {
    sendJson(res, 200, {
      ok: true,
      environment: process.env.NODE_ENV || 'development',
      server: 'neutral-platform',
      runtime: {
        platform: process.platform,
        arch: process.arch,
        uptime: Math.round(process.uptime())
      }
    });
    return true;
  }

  if (pathname === `${apiBase}/modules`) {
    sendJson(res, 200, {
      ok: true,
      modules: [],
      message: 'Module registry is available to runtime components.'
    });
    return true;
  }

  return false;
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${host}:${port}`);

  if (routeApi(url, res)) {
    return;
  }

  let requestPath = decodeURIComponent(url.pathname);

  if (requestPath === '/') {
    requestPath = '/index.html';
  }

  if (requestPath.startsWith('/webroot/')) {
    requestPath = requestPath.replace(/^\/webroot\//, '/');
  }

  if (requestPath.startsWith('/Core/')) {
    serveStaticFile(res, safeResolve(rootDir, requestPath));
    return;
  }

  const filePath = safeResolve(webRootDir, requestPath);
  if (!filePath) {
    sendJson(res, 403, { ok: false, code: 'FORBIDDEN', message: 'Directory traversal is blocked.' });
    return;
  }

  if (filePath.endsWith(path.sep) || !path.extname(filePath)) {
    const candidate = path.join(filePath, 'index.html');
    if (fs.existsSync(candidate)) {
      serveStaticFile(res, candidate);
      return;
    }
  }

  serveStaticFile(res, filePath);
});

if (require.main === module) {
  server.listen(port, host, () => {
    console.log(`Neutral platform server listening on http://${host}:${port}`);
  });
}

module.exports = server;
