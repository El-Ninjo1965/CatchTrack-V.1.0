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
    modules: ['dashboard', 'gps', 'catch-log', 'fishing-spots'],
    config: { framework: 'neutral-master-framework' }
  });
}

if (!MasterFramework.getApp('catchtrack')) {
  MasterFramework.registerApp({
    appId: 'catchtrack',
    name: 'CatchTrack',
    version: '1.0.0',
    description: 'First real application shell for the CatchTrack framework.',
    status: 'active',
    active: true,
    modules: ['dashboard', 'gps', 'catch-log', 'fishing-spots'],
    config: {
      framework: 'neutral-master-framework',
      defaultView: 'dashboard'
    }
  });
}

if (typeof MasterFramework.markFrameworkInitialized === 'function') {
  MasterFramework.markFrameworkInitialized({
    currentStep: 'server-runtime',
    message: 'Server framework loaded.'
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

const getSetupSnapshot = () => MasterFramework.getSetupSnapshot();

const isSetupRequired = () => {
  const snapshot = getSetupSnapshot();
  return !(snapshot.installation && snapshot.installation.active) && snapshot.status !== 'ACTIVE';
};

const getDatabaseStatus = () => {
  return MasterFramework.getDatabaseStatus();
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

const getRequestRoles = (req) => {
  if (!req || !req.headers) {
    return [];
  }

  const raw = req.headers['x-framework-role'] || req.headers['x-user-role'] || req.headers['x-admin-role'] || '';
  return String(raw)
    .split(',')
    .map((role) => role.trim().toLowerCase())
    .filter(Boolean);
};

const isAdminWriteAuthorized = (req) => {
  const adminToken = process.env.ADMIN_ACCESS_TOKEN;
  const suppliedToken = req && req.headers ? req.headers['x-admin-access-token'] : null;
  if (adminToken && suppliedToken === adminToken) {
    return true;
  }

  const roles = getRequestRoles(req);
  return roles.some((role) => role === 'admin' || role === 'developer');
};

const requireAdminWriteAccess = (req, res) => {
  if (isAdminWriteAuthorized(req)) {
    return true;
  }

  sendJson(res, 403, {
    ok: false,
    code: 'FORBIDDEN',
    message: 'Administrative write access requires an authorized admin or developer role.'
  });
  return false;
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
      if (!requireAdminWriteAccess(req, res)) {
        return true;
      }
      readJsonBody(req)
        .then(async (payload) => {
          const connectionId = payload.connectionId || payload.id || payload.name || 'default-connection';
          const appId = payload.appId || payload.app || 'neutral-app';
          const existing = MasterFramework.getConnection(connectionId);

          const normalized = {
            connectionId,
            appId,
            serverUrl: payload.serverUrl || payload.url || 'http://localhost',
            apiBase: payload.apiBase || '/api',
            storageType: payload.storageType || payload.type || payload.databaseType || 'file',
            connectionType: payload.connectionType || payload.storageType || payload.type || 'file',
            databaseType: payload.databaseType || payload.sqlType || 'file',
            databaseName: payload.databaseName || payload.database || payload.name || '',
            storagePath: payload.storagePath || payload.filePath || payload.path || '',
            host: payload.host || '',
            port: payload.port || '',
            username: payload.username || '',
            password: payload.password || '',
            authType: payload.authType || 'none',
            credentialsRef: payload.credentialsRef || '',
            active: !!payload.active,
            default: !!payload.default,
            status: payload.status || (payload.active ? 'active' : 'inactive'),
            endpoints: payload.endpoints || {},
            health: payload.health || { status: 'unknown' }
          };

          const result = existing
            ? MasterFramework.updateConnection(connectionId, normalized)
            : MasterFramework.registerConnection(normalized);

          const storageAdapter = MasterFramework.createStorageAdapter(result);
          const connectionCheck = storageAdapter && typeof storageAdapter.test === 'function'
            ? await storageAdapter.test()
            : { ok: true, status: result.status || 'active', checkedAt: new Date().toISOString() };

          const persisted = MasterFramework.updateConnection(connectionId, {
            ...result,
            status: connectionCheck.status || result.status || 'active',
            active: !!result.active || !!connectionCheck.ok,
            health: { ...result.health, ...connectionCheck }
          });

          sendJson(res, 200, {
            ok: true,
            connection: persisted,
            adapter: storageAdapter,
            check: connectionCheck,
            mode: existing ? 'updated' : 'created'
          });
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
          const configuration = { ...(currentState.configuration || {}), ...(payload.configuration || {}) };
          const serverConfig = {
            ...(currentState.serverState || {}),
            ...(payload.serverState || {})
          };
          const databaseConfig = {
            ...(currentState.databaseState || {}),
            ...(payload.databaseState || {})
          };
          const bootstrapConfig = {
            ...(currentState.bootstrapState || {}),
            ...(payload.bootstrapState || {})
          };
          const frameworkState = {
            ...(currentState.frameworkState || {}),
            ...(payload.frameworkState || {})
          };
          const installation = {
            ...(currentState.installation || {}),
            ...(payload.installation || {})
          };

          if (configuration.serverUrl || configuration.apiBase || payload.serverUrl || payload.apiBase) {
            serverConfig.configured = true;
            serverConfig.url = payload.serverUrl || configuration.serverUrl || serverConfig.url || '';
            serverConfig.apiBase = payload.apiBase || configuration.apiBase || serverConfig.apiBase || '/api';
            serverConfig.status = serverConfig.status === 'ERROR' ? 'ERROR' : 'CONFIGURATION_REQUIRED';
            serverConfig.message = 'Server configuration saved.';
          }

          if (payload.serverTestedAt) {
            serverConfig.testedAt = payload.serverTestedAt;
          }

          const database = payload.database || configuration.database || {};
          if (database && (database.type || database.name || database.host || database.url || payload.databaseState)) {
            databaseConfig.configured = true;
            databaseConfig.type = database.type || databaseConfig.type || 'indexeddb';
            databaseConfig.name = database.name || databaseConfig.name || 'CoreDB';
            databaseConfig.host = database.host || databaseConfig.host || '';
            databaseConfig.url = database.url || databaseConfig.url || '';
            databaseConfig.status = databaseConfig.status === 'ERROR' ? 'ERROR' : 'CONFIGURATION_REQUIRED';
            databaseConfig.message = 'Database configuration saved.';
          }

          if (payload.bootstrap || payload.bootstrapState) {
            bootstrapConfig.configured = true;
            bootstrapConfig.username = (payload.bootstrap && payload.bootstrap.username) || bootstrapConfig.username || 'developer';
            bootstrapConfig.displayId = (payload.bootstrap && payload.bootstrap.displayId) || bootstrapConfig.displayId || 'USR-000001';
            bootstrapConfig.role = (payload.bootstrap && payload.bootstrap.role) || bootstrapConfig.role || 'developer';
            bootstrapConfig.enabled = payload.bootstrap && Object.prototype.hasOwnProperty.call(payload.bootstrap, 'enabled')
              ? !!payload.bootstrap.enabled
              : bootstrapConfig.enabled !== false;
            bootstrapConfig.status = bootstrapConfig.status === 'ERROR' ? 'ERROR' : 'CONFIGURATION_REQUIRED';
            bootstrapConfig.message = 'Bootstrap configuration saved.';
          }

          if (payload.currentStep) {
            currentState.currentStep = payload.currentStep;
          }

          const merged = {
            ...currentState,
            ...payload,
            configuration,
            serverState: serverConfig,
            databaseState: databaseConfig,
            bootstrapState: bootstrapConfig,
            frameworkState,
            installation,
            updatedAt: new Date().toISOString()
          };

          const saved = MasterFramework.saveSetupState(merged);
          sendJson(res, 200, {
            ok: true,
            status: MasterFramework.getInstallationStatus ? MasterFramework.getInstallationStatus(saved) : saved.status,
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
      status: snapshot.status,
      setup: snapshot
    });
    return true;
  }

  if (pathname === `${apiBase}/setup/activate` || pathname === `${apiBase}/admin/setup/activate`) {
    if (req && req.method === 'POST') {
      readJsonBody(req)
        .then((payload) => {
          const result = MasterFramework.activateInstallation({
            currentStep: payload.currentStep || 'runtime',
            message: payload.message || 'Installation activated.'
          });

          if (result && result.ok === false) {
            sendJson(res, 409, result);
            return;
          }

          sendJson(res, 200, {
            ok: true,
            status: MasterFramework.getInstallationStatus(result),
            setup: result
          });
        })
        .catch((error) => {
          sendJson(res, 400, { ok: false, code: 'INVALID_SETUP', message: error.message || 'Activation payload invalid.' });
        });
      return true;
    }

    const snapshot = getSetupSnapshot();
    sendJson(res, 200, {
      ok: true,
      status: snapshot.status,
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
            currentStep: 'server-test',
            configuration: {
              ...(setupState.configuration || {}),
              serverUrl: payload.serverUrl || setupState.configuration?.serverUrl || `http://${host}:${port}`,
              apiBase: payload.apiBase || setupState.configuration?.apiBase || '/api'
            },
            serverState: {
              ...(setupState.serverState || {}),
              configured: true,
              testedAt: new Date().toISOString(),
              reachable: !!result.ok,
              responseTimeMs: result.responseTimeMs,
              status: result.ok ? 'READY_TO_TEST' : 'ERROR',
              message: result.message,
              url: payload.serverUrl || setupState.configuration?.serverUrl || `http://${host}:${port}`,
              apiBase: payload.apiBase || setupState.configuration?.apiBase || '/api'
            },
            installation: { ...(setupState.installation || {}), state: result.ok ? 'CONFIGURATION_REQUIRED' : 'ERROR' },
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
            ...(nextState.databaseState || {}),
            type: payload.type || nextState.databaseState?.type || 'indexeddb',
            name: payload.name || nextState.databaseState?.name || payload.database || 'framework-db',
            host: payload.host || nextState.databaseState?.host || '',
            url: payload.url || nextState.databaseState?.url || '',
            configured: !!(payload.name || payload.host || payload.url || payload.type || nextState.databaseState?.configured),
            testedAt: new Date().toISOString(),
            reachable: true,
            responseTimeMs: 0,
            status: 'READY',
            message: 'Database configuration test passed.'
          };

          const setup = {
            ...nextState,
            database: {
              ...(nextState.database || {}),
              type: databaseConfig.type,
              name: databaseConfig.name,
              host: databaseConfig.host,
              url: databaseConfig.url
            },
            databaseState: databaseConfig,
            configuration: { ...(nextState.configuration || {}), database: {
              type: databaseConfig.type,
              name: databaseConfig.name,
              host: databaseConfig.host,
              url: databaseConfig.url
            } },
            frameworkState: {
              ...(nextState.frameworkState || {}),
              initialized: true,
              initializedAt: nextState.frameworkState?.initializedAt || new Date().toISOString(),
              status: 'READY',
              message: 'Framework initialized.'
            },
            currentStep: 'framework-initialization',
            updatedAt: new Date().toISOString()
          };
          MasterFramework.saveSetupState(setup);
          const status = getDatabaseStatus();
          sendJson(res, 200, { ok: status.ok, status: status.status, database: status, setup: MasterFramework.loadSetupState() });
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

  if (pathname === `${apiBase}/devices` || pathname === `${apiBase}/admin/devices`) {
    if (req && req.method === 'POST') {
      if (!requireAdminWriteAccess(req, res)) {
        return true;
      }
      readJsonBody(req)
        .then((payload) => {
          const device = MasterFramework.upsertDevice({
            id: payload.id || payload.deviceId,
            deviceId: payload.deviceId || payload.id,
            name: payload.name || payload.deviceName,
            type: payload.type,
            status: payload.status,
            userId: payload.userId || payload.assignedUserId,
            userDisplayId: payload.userDisplayId || payload.assignedDisplayId,
            appId: payload.appId,
            moduleId: payload.moduleId,
            lastContactAt: payload.lastContactAt || payload.lastSeenAt,
            metadata: payload.metadata || {}
          });

          sendJson(res, 200, { ok: true, device });
        })
        .catch((error) => {
          sendJson(res, 400, { ok: false, code: 'INVALID_DEVICE', message: error.message || 'Device payload invalid.' });
        });
      return true;
    }

    sendJson(res, 200, {
      ok: true,
      devices: MasterFramework.listDevices(),
      status: MasterFramework.listDevices().length ? 'AVAILABLE' : 'EMPTY'
    });
    return true;
  }

  if (pathname === `${apiBase}/licenses` || pathname === `${apiBase}/admin/licenses`) {
    if (req && req.method === 'POST') {
      if (!requireAdminWriteAccess(req, res)) {
        return true;
      }
      readJsonBody(req)
        .then((payload) => {
          const license = MasterFramework.upsertLicense({
            id: payload.id || payload.licenseId,
            licenseId: payload.licenseId || payload.id,
            type: payload.type,
            status: payload.status,
            validFrom: payload.validFrom,
            validUntil: payload.validUntil,
            userId: payload.userId,
            deviceId: payload.deviceId,
            appId: payload.appId,
            moduleId: payload.moduleId,
            metadata: payload.metadata || {}
          });

          sendJson(res, 200, { ok: true, license });
        })
        .catch((error) => {
          sendJson(res, 400, { ok: false, code: 'INVALID_LICENSE', message: error.message || 'License payload invalid.' });
        });
      return true;
    }

    sendJson(res, 200, {
      ok: true,
      licenses: MasterFramework.listLicenses(),
      status: MasterFramework.listLicenses().length ? 'AVAILABLE' : 'EMPTY'
    });
    return true;
  }

  if (pathname === `${apiBase}/updates` || pathname === `${apiBase}/admin/updates`) {
    const updates = MasterFramework.getUpdateState();
    sendJson(res, 200, {
      ok: true,
      updates,
      status: updates.status || 'NOT_CONFIGURED'
    });
    return true;
  }

  if (pathname === `${apiBase}/updates/check` || pathname === `${apiBase}/admin/updates/check`) {
    if (req && req.method === 'POST') {
      if (!requireAdminWriteAccess(req, res)) {
        return true;
      }
      readJsonBody(req)
        .then((payload) => {
          const updates = MasterFramework.checkForUpdates(payload);
          sendJson(res, 200, { ok: true, updates, status: updates.status });
        })
        .catch((error) => {
          sendJson(res, 400, { ok: false, code: 'INVALID_UPDATES', message: error.message || 'Update check payload invalid.' });
        });
      return true;
    }

    const updates = MasterFramework.getUpdateState();
    sendJson(res, 200, { ok: true, updates, status: updates.status });
    return true;
  }

  if (pathname === `${apiBase}/marketplace` || pathname === `${apiBase}/admin/marketplace`) {
    const state = MasterFramework.getMarketplaceState();
    const modules = readAppModuleManifests(modulesDir);
    const installedModules = Array.isArray(modules)
      ? modules.map((module) => ({
        ...module,
        status: module.status || 'available',
        installed: true,
        active: !!module.active
      }))
      : [];

    sendJson(res, 200, {
      ok: true,
      marketplace: {
        ...state,
        catalog: Array.isArray(state.catalog) ? state.catalog : []
      },
      modules: installedModules,
      status: installedModules.length ? 'AVAILABLE' : 'EMPTY'
    });
    return true;
  }

  if (pathname === `${apiBase}/marketplace/modules` || pathname === `${apiBase}/admin/marketplace/modules`) {
    sendJson(res, 200, {
      ok: true,
      modules: readAppModuleManifests(modulesDir),
      status: 'AVAILABLE'
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
