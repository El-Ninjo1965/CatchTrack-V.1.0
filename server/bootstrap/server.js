const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { port, host, rootDir, webRootDir, apiBase } = require('../config');
const MasterFramework = require('../../platform/master-framework');

if (!MasterFramework.getApp('neutral-app')) {
  MasterFramework.registerApp({
    appId: 'neutral-app',
    name: 'Neutral App',
    version: '1.0.0',
    description: 'Default neutral application shell for the framework runtime.',
    status: 'active',
    active: true,
    config: { framework: 'neutral-master-framework' }
  });
}

const appModulesDir = path.join(rootDir, 'app', 'modules');

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

const readJsonBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  let body = '';

  req.on('data', (chunk) => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  });

  req.on('end', () => {
    body = Buffer.concat(chunks).toString('utf8').trim();
    if (!body) {
      resolve({});
      return;
    }

    try {
      resolve(JSON.parse(body));
    } catch (error) {
      reject(new Error('Invalid JSON payload.'));
    }
  });

  req.on('error', () => reject(new Error('Request body could not be read.')));
});

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

const readAppModuleManifests = (modulesDir = appModulesDir) => {
  if (!fs.existsSync(modulesDir)) {
    return [];
  }

  const manifests = [];

  try {
    const entries = fs.readdirSync(modulesDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const manifestPath = path.join(modulesDir, entry.name, 'module.json');
      const fallbackPath = path.join(modulesDir, entry.name, 'manifest.json');
      const resolvedManifestPath = fs.existsSync(manifestPath)
        ? manifestPath
        : fs.existsSync(fallbackPath)
          ? fallbackPath
          : null;

      if (!resolvedManifestPath) {
        continue;
      }

      try {
        const raw = fs.readFileSync(resolvedManifestPath, 'utf8');
        const manifest = JSON.parse(raw);

        if (manifest && manifest.id) {
          manifests.push({
            ...manifest,
            modulePath: `app/modules/${entry.name}`
          });
        }
      } catch {
        // Skip manifests that cannot be parsed.
      }
    }
  } catch {
    // Return empty list on filesystem error.
  }

  return manifests;
};

const routeApi = (url, res, modulesDir = appModulesDir, req = null) => {
  const pathname = url.pathname;
  if (pathname === '/health' || pathname === `${apiBase}/health`) {
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
      },
      framework: MasterFramework.getDiagnostics()
    });
    return true;
  }

  if (pathname === `${apiBase}/framework` || pathname === `${apiBase}/diagnostics`) {
    sendJson(res, 200, {
      ok: true,
      framework: MasterFramework.getDiagnostics()
    });
    return true;
  }

  if (pathname === `${apiBase}/connections` || pathname === `${apiBase}/admin/connections`) {
    if (req && req.method === 'POST') {
      readJsonBody(req)
        .then((payload) => {
          const connectionId = payload.connectionId || payload.id || payload.name || 'default-connection';
          const appId = payload.appId || payload.app || 'neutral-app';
          const existing = MasterFramework.getConnection(connectionId);

          const normalized = {
            connectionId,
            appId,
            serverUrl: payload.serverUrl || payload.url || 'http://localhost',
            apiBase: payload.apiBase || '/api',
            authType: payload.authType || 'none',
            credentialsRef: payload.credentialsRef || '',
            active: !!payload.active,
            status: payload.status || (payload.active ? 'active' : 'inactive'),
            endpoints: payload.endpoints || {},
            health: payload.health || { status: 'unknown' }
          };

          const result = existing
            ? MasterFramework.updateConnection(connectionId, normalized)
            : MasterFramework.registerConnection(normalized);

          sendJson(res, 200, { ok: true, connection: result, mode: existing ? 'updated' : 'created' });
        })
        .catch((error) => {
          sendJson(res, 400, { ok: false, code: 'INVALID_PAYLOAD', message: error.message || 'Connection payload invalid.' });
        });
      return true;
    }

    sendJson(res, 200, {
      ok: true,
      connections: Array.from(MasterFramework.connections.values())
    });
    return true;
  }

  if (pathname === `${apiBase}/setup` || pathname === `${apiBase}/admin/setup`) {
    if (req && req.method === 'POST') {
      readJsonBody(req)
        .then((payload) => {
          const currentState = MasterFramework.loadSetupState();
          const merged = {
            ...currentState,
            ...payload,
            configuration: { ...(currentState.configuration || {}), ...(payload.configuration || {}) },
            installation: { ...(currentState.installation || {}), ...(payload.installation || {}) },
            updatedAt: new Date().toISOString()
          };

          const saved = MasterFramework.saveSetupState(merged);
          sendJson(res, 200, { ok: true, setup: saved });
        })
        .catch((error) => {
          sendJson(res, 400, { ok: false, code: 'INVALID_SETUP', message: error.message || 'Setup payload invalid.' });
        });
      return true;
    }

    sendJson(res, 200, {
      ok: true,
      setup: MasterFramework.loadSetupState()
    });
    return true;
  }

  if (pathname === `${apiBase}/modules`) {
    const modules = readAppModuleManifests(modulesDir);
    sendJson(res, 200, {
      ok: true,
      modules
    });
    return true;
  }

  return false;
};

const createServer = ({ modulesDir = appModulesDir } = {}) => http.createServer((req, res) => {
  const url = new URL(req.url, `http://${host}:${port}`);

  if (routeApi(url, res, modulesDir, req)) {
    return;
  }

  let requestPath = decodeURIComponent(url.pathname);

  if (requestPath === '/admin.html' || requestPath === '/dev.html') {
    const adminToken = process.env.ADMIN_ACCESS_TOKEN;
    const suppliedToken = req.headers['x-admin-access-token'];
    if (!adminToken || suppliedToken !== adminToken) {
      sendJson(res, 403, { ok: false, code: 'FORBIDDEN', message: 'Administrative pages require server-side authorization.' });
      return;
    }
  }

  if (requestPath === '/') {
    requestPath = '/index.html';
  }

  if (requestPath.startsWith('/webroot/')) {
    requestPath = requestPath.replace(/^\/webroot\//, '/');
  }

  if (requestPath.startsWith('/platform/')) {
    serveStaticFile(res, safeResolve(rootDir, requestPath));
    return;
  }

  if (requestPath.startsWith('/app/modules/')) {
    const modulePath = requestPath.slice('/app/modules/'.length);
    serveStaticFile(res, safeResolve(modulesDir, modulePath));
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

const server = createServer();

if (require.main === module) {
  server.listen(port, host, () => {
    console.log(`Neutral platform server listening on http://${host}:${port}`);
  });
}

module.exports = server;
module.exports.config = { port, host, rootDir, webRootDir, apiBase };
module.exports.createServer = createServer;
