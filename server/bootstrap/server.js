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

const normalizeStatusValue = (value, fallback = 'NOT_CONFIGURED') => {
  const normalized = String(value || fallback).trim().toUpperCase();
  return ['NOT_CONFIGURED', 'CONFIGURATION_REQUIRED', 'READY_TO_TEST', 'TESTING', 'READY', 'ACTIVE', 'ERROR'].includes(normalized)
    ? normalized
    : fallback;
};

const getSetupSnapshot = () => {
  const setup = MasterFramework.loadSetupState();
  const installation = setup.installation || {};
  const configuration = setup.configuration || {};
  const database = setup.database || configuration.database || null;
  const setupState = MasterFramework.getInstallationStatus ? MasterFramework.getInstallationStatus() : normalizeStatusValue(setup.status, 'NOT_CONFIGURED');
  const status = MasterFramework.normalizeSetupStatus
    ? MasterFramework.normalizeSetupStatus(setup.status || setupState, 'NOT_CONFIGURED')
    : normalizeStatusValue(setup.status || setupState, 'NOT_CONFIGURED');

  return {
    ...setup,
    status,
    installation: {
      ...installation,
      active: !!installation.active,
      state: installation.state || 'draft'
    },
    configuration,
    database,
    setupState
  };
};

const isSetupRequired = () => {
  const snapshot = getSetupSnapshot();
  const status = MasterFramework.normalizeSetupStatus
    ? MasterFramework.normalizeSetupStatus(snapshot.setupState || snapshot.status || 'NOT_CONFIGURED', 'NOT_CONFIGURED')
    : normalizeStatusValue(snapshot.setupState || snapshot.status || 'NOT_CONFIGURED', 'NOT_CONFIGURED');
  const installationActive = !!(snapshot.installation && snapshot.installation.active);
  return !(installationActive || ['ACTIVE', 'READY'].includes(status));
};

const getDatabaseStatus = () => {
  const setup = getSetupSnapshot();
  const database = setup.database || setup.configuration?.database || null;
  const configured = !!(database && (database.type || database.name || database.host || database.url));

  if (!configured) {
    return {
      ok: false,
      status: 'NOT_CONFIGURED',
      configured: false,
      message: 'Database not configured'
    };
  }

  return {
    ok: true,
    status: 'READY',
    configured: true,
    type: database.type || 'unknown',
    name: database.name || database.database || 'framework-db',
    message: 'Database configuration present.'
  };
};

const getServerTestResult = async (payload = {}) => {
  const targetBase = normalizeStringValue(payload.serverUrl || process.env.SERVER_URL || `http://${host}:${port}`, `http://${host}:${port}`);
  const apiBase = payload.apiBase || '/api';
  const targetUrl = new URL(`${targetBase.replace(/\/$/, '')}${apiBase}/status`);
  const start = Date.now();

  return new Promise((resolve) => {
    const client = targetUrl.protocol === 'https:' ? require('node:https') : require('node:http');
    const request = client.get(targetUrl, (response) => {
      let body = '';
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        const parsed = (() => {
          try { return JSON.parse(body || '{}'); } catch { return {}; }
        })();

        resolve({
          ok: response.statusCode >= 200 && response.statusCode < 400,
          reachable: true,
          statusCode: response.statusCode,
          status: response.statusCode >= 200 && response.statusCode < 400 ? 'READY' : 'ERROR',
          responseTimeMs: Date.now() - start,
          version: parsed.framework?.framework?.version || parsed.version || 'unknown',
          message: response.statusCode >= 200 && response.statusCode < 400 ? 'Server reachable.' : `HTTP ${response.statusCode}`,
          endpoint: targetUrl.toString()
        });
      });
    });

    request.on('error', () => {
      resolve({
        ok: false,
        reachable: false,
        status: 'ERROR',
        responseTimeMs: Date.now() - start,
        message: 'Server is not reachable.',
        endpoint: targetUrl.toString()
      });
    });

    request.setTimeout(5000, () => {
      request.destroy();
      resolve({
        ok: false,
        reachable: false,
        status: 'ERROR',
        responseTimeMs: Date.now() - start,
        message: 'Server test timed out.',
        endpoint: targetUrl.toString()
      });
    });
  });
};

const normalizeStringValue = (value, fallback = '') => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const normalized = value.trim();
  return normalized || fallback;
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

  if (pathname === `${apiBase}/setup` || pathname === `${apiBase}/admin/setup` || pathname === `${apiBase}/setup/status` || pathname === `${apiBase}/admin/setup/status` || pathname === `${apiBase}/install/status`) {
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
          sendJson(res, 200, {
            ok: true,
            status: MasterFramework.getInstallationStatus ? MasterFramework.getInstallationStatus() : saved.status,
            setup: saved
          });
        })
        .catch((error) => {
          sendJson(res, 400, { ok: false, code: 'INVALID_SETUP', message: error.message || 'Setup payload invalid.' });
        });
      return true;
    }

    const snapshot = getSetupSnapshot();
    sendJson(res, 200, {
      ok: true,
      status: snapshot.setupState,
      setup: snapshot
    });
    return true;
  }

  if (pathname === `${apiBase}/server/test` || pathname === `${apiBase}/admin/server/test`) {
    if (req && req.method === 'POST') {
      readJsonBody(req)
        .then(async (payload) => {
          const result = await getServerTestResult(payload);
          const setupState = MasterFramework.loadSetupState();
          const nextState = {
            ...setupState,
            status: result.ok ? 'READY_TO_TEST' : 'ERROR',
            currentStep: 'server-test',
            configuration: { ...(setupState.configuration || {}), serverUrl: payload.serverUrl || setupState.configuration?.serverUrl || `http://${host}:${port}` },
            installation: { ...(setupState.installation || {}), state: result.ok ? 'ready_to_test' : 'error' },
            updatedAt: new Date().toISOString()
          };
          MasterFramework.saveSetupState(nextState);
          sendJson(res, 200, { ok: result.ok, result });
        })
        .catch((error) => {
          sendJson(res, 400, { ok: false, code: 'SERVER_TEST_FAILED', message: error.message || 'Server test failed.' });
        });
      return true;
    }

    getServerTestResult({ serverUrl: process.env.SERVER_URL || `http://${host}:${port}`, apiBase }).then((result) => {
      sendJson(res, 200, { ok: result.ok, result });
    }).catch((error) => {
      sendJson(res, 500, { ok: false, code: 'SERVER_TEST_FAILED', message: error.message || 'Server test failed.' });
    });
    return true;
  }

  if (pathname === `${apiBase}/database/status` || pathname === `${apiBase}/admin/database/status` || pathname === `${apiBase}/database/test` || pathname === `${apiBase}/admin/database/test`) {
    if (req && req.method === 'POST') {
      readJsonBody(req)
        .then((payload) => {
          const nextState = MasterFramework.loadSetupState();
          const databaseConfig = {
            type: payload.type || nextState.database?.type || 'indexeddb',
            name: payload.name || nextState.database?.name || payload.database || 'framework-db',
            host: payload.host || nextState.database?.host || '',
            url: payload.url || nextState.database?.url || '',
            configured: !!(payload.name || payload.host || payload.url || nextState.database)
          };

          const setup = {
            ...nextState,
            database: databaseConfig,
            configuration: { ...(nextState.configuration || {}), database: databaseConfig },
            status: databaseConfig.configured ? 'READY_TO_TEST' : 'NOT_CONFIGURED',
            currentStep: 'database-config',
            updatedAt: new Date().toISOString()
          };
          MasterFramework.saveSetupState(setup);
          const status = getDatabaseStatus();
          sendJson(res, status.ok ? 200 : 200, { ok: status.ok, status: status.status, database: status, setup: MasterFramework.loadSetupState() });
        })
        .catch((error) => {
          sendJson(res, 400, { ok: false, code: 'INVALID_DATABASE', message: error.message || 'Database configuration invalid.' });
        });
      return true;
    }

    const status = getDatabaseStatus();
    sendJson(res, 200, { ok: status.ok, status: status.status, database: status, setup: MasterFramework.loadSetupState() });
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

  if ((requestPath === '/' || requestPath === '/index.html') && isSetupRequired()) {
    serveStaticFile(res, path.join(webRootDir, 'setup.html'));
    return;
  }

  if (requestPath === '/') {
    requestPath = '/index.html';
  }

  if (requestPath === '/setup' || requestPath === '/setup.html') {
    serveStaticFile(res, path.join(webRootDir, 'setup.html'));
    return;
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
