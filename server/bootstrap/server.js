const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { port, host, rootDir, webRootDir, apiBase, connectionStorePath, appRegistryPath } = require('../config');
const { createAppRegistryService } = require('../services/app-registry');
const { createConnectionService } = require('../services/connection-service');

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

const readRequestJson = (req) => new Promise((resolve, reject) => {
  let raw = '';
  req.on('data', (chunk) => {
    raw += chunk;
  });
  req.on('end', () => {
    if (!raw.trim()) {
      resolve(null);
      return;
    }

    try {
      resolve(JSON.parse(raw));
    } catch (error) {
      reject(new Error('Invalid JSON payload.'));
    }
  });
  req.on('error', reject);
});

const ADMIN_SESSION_COOKIE = 'admin_access_session';

const hashAdminToken = (token) => crypto.createHash('sha256').update(String(token)).digest('hex');

const parseCookies = (cookieHeader = '') => cookieHeader.split(';').reduce((cookies, entry) => {
  const separatorIndex = entry.indexOf('=');
  if (separatorIndex === -1) {
    return cookies;
  }

  const key = entry.slice(0, separatorIndex).trim();
  const value = entry.slice(separatorIndex + 1).trim();
  if (key) {
    cookies[key] = decodeURIComponent(value);
  }
  return cookies;
}, {});

const hasAdminAccess = (req, adminAccessToken) => {
  if (!adminAccessToken) {
    return false;
  }

  if (req.headers['x-admin-access-token'] === adminAccessToken) {
    return true;
  }

  const cookies = parseCookies(req.headers.cookie || '');
  return cookies[ADMIN_SESSION_COOKIE] === hashAdminToken(adminAccessToken);
};

const setAdminAccessCookie = (res, adminAccessToken) => {
  if (!adminAccessToken) {
    return;
  }

  res.setHeader('Set-Cookie', `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(hashAdminToken(adminAccessToken))}; HttpOnly; Path=/; SameSite=Lax`);
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

const toPublicAppContext = (appContext) => {
  if (!appContext) {
    return null;
  }

  return {
    appId: appContext.appId,
    appName: appContext.appName,
    mountPath: appContext.mountPath,
    design: appContext.design || 'neutral',
    designPath: appContext.designPath || null,
    apiBasePath: appContext.apiBasePath,
    connectionScope: appContext.connectionScope,
    active: appContext.active,
    metadata: appContext.metadata || {},
    isAppScoped: !!appContext.isAppScoped
  };
};

const isGlobalRoute = (pathname) => {
  const globalRoutes = ['/health', '/admin', '/admin.html', '/dev', '/developer', '/dev.html', '/', '/index.html'];
  return globalRoutes.includes(pathname)
    || pathname.startsWith('/api/')
    || pathname.startsWith('/platform/')
    || pathname.startsWith('/app/modules/')
    || pathname.startsWith('/webroot/')
    || pathname.startsWith('/design/');
};

const routeApi = async (req, url, res, { modulesDir = appModulesDir, adminAccessToken = process.env.ADMIN_ACCESS_TOKEN, connectionService, appRegistryService, appContext } = {}) => {
  const pathname = url.pathname;
  const routePath = appContext && appContext.relativePath ? appContext.relativePath : pathname;
  const apiPrefix = appContext && appContext.apiBasePath ? appContext.apiBasePath : apiBase;

  if (pathname === '/health' || routePath === `${apiPrefix}/health`) {
    sendJson(res, 200, {
      ok: true,
      service: 'neutral-platform',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
    return true;
  }

  if (routePath === `${apiPrefix}/status`) {
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

  if (routePath === `${apiPrefix}/modules`) {
    const modules = readAppModuleManifests(modulesDir);
    sendJson(res, 200, {
      ok: true,
      modules
    });
    return true;
  }

  if (routePath === `${apiPrefix}/app-context`) {
    sendJson(res, 200, {
      ok: true,
      app: toPublicAppContext(appContext),
      appCount: appRegistryService.listApps().length
    });
    return true;
  }

  if (routePath === `${apiPrefix}/apps`) {
    if (!hasAdminAccess(req, adminAccessToken)) {
      sendJson(res, adminAccessToken ? 403 : 401, {
        ok: false,
        code: adminAccessToken ? 'FORBIDDEN' : 'UNAUTHORIZED',
        message: adminAccessToken
          ? 'Administrative pages require server-side authorization.'
          : 'Administrative access token is not configured.'
      });
      return true;
    }

    sendJson(res, 200, {
      ok: true,
      apps: appRegistryService.listApps()
    });
    return true;
  }

  if (routePath === `${apiPrefix}/connections`) {
    if (!hasAdminAccess(req, adminAccessToken)) {
      sendJson(res, adminAccessToken ? 403 : 401, {
        ok: false,
        code: adminAccessToken ? 'FORBIDDEN' : 'UNAUTHORIZED',
        message: adminAccessToken
          ? 'Administrative pages require server-side authorization.'
          : 'Administrative access token is not configured.'
      });
      return true;
    }

    if (req.method === 'GET') {
      sendJson(res, 200, {
        ok: true,
        connections: connectionService.listConnections(appContext ? appContext.appId : null)
      });
      return true;
    }

    if (req.method === 'POST') {
      if (!hasAdminAccess(req, adminAccessToken)) {
        sendJson(res, adminAccessToken ? 403 : 401, {
          ok: false,
          code: adminAccessToken ? 'FORBIDDEN' : 'UNAUTHORIZED',
          message: adminAccessToken
            ? 'Administrative pages require server-side authorization.'
            : 'Administrative access token is not configured.'
        });
        return true;
      }

      const payload = await readRequestJson(req);
      const result = connectionService.upsertConnection(
        { ...(payload || {}), appId: appContext.appId },
        appContext.appId
      );
      sendJson(res, result.ok ? 201 : 400, result);
      return true;
    }

    sendJson(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' });
    return true;
  }

  if (routePath.startsWith(`${apiPrefix}/connections/`)) {
    const connectionId = decodeURIComponent(routePath.slice(`${apiPrefix}/connections/`.length));

    if (!hasAdminAccess(req, adminAccessToken)) {
      sendJson(res, adminAccessToken ? 403 : 401, {
        ok: false,
        code: adminAccessToken ? 'FORBIDDEN' : 'UNAUTHORIZED',
        message: adminAccessToken
          ? 'Administrative pages require server-side authorization.'
          : 'Administrative access token is not configured.'
      });
      return true;
    }

    if (req.method === 'GET') {
      const connection = connectionService.getConnection(connectionId, appContext ? appContext.appId : null);
      if (!connection) {
        sendJson(res, 404, { ok: false, code: 'NOT_FOUND', message: 'Connection not found.' });
        return true;
      }

      sendJson(res, 200, { ok: true, connection });
      return true;
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const payload = await readRequestJson(req);
      const result = connectionService.upsertConnection(
        { ...(payload || {}), id: connectionId, appId: appContext.appId },
        appContext.appId
      );
      sendJson(res, result.ok ? 200 : 400, result);
      return true;
    }

    if (req.method === 'DELETE') {
      const result = connectionService.removeConnection(connectionId, appContext.appId);
      sendJson(res, result.ok ? 200 : 404, result);
      return true;
    }

    sendJson(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' });
    return true;
  }

  return false;
};

const createServer = ({ modulesDir = appModulesDir, adminAccessToken = process.env.ADMIN_ACCESS_TOKEN, connectionStorePath: storePath = connectionStorePath, appRegistryPath: registryPath = appRegistryPath } = {}) => {
  const appRegistry = createAppRegistryService(registryPath, { rootDir });
  const connectionApi = createConnectionService(storePath, { appRegistry });
  const rootApp = appRegistry.getApp('primary-web-app') || appRegistry.listApps().find((app) => app.mountPath === '/') || null;

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${host}:${port}`);
    const resolvedApp = appRegistry.resolveRequest(url.pathname);
    const requestApp = resolvedApp || (isGlobalRoute(url.pathname) && rootApp ? {
      app: rootApp,
      relativePath: url.pathname,
      isGlobalRoot: true
    } : null);
    if (!requestApp) {
      sendJson(res, 404, { ok: false, code: 'NOT_FOUND', message: 'App route not registered.' });
      return;
    }

    const appContext = {
      ...requestApp.app,
      relativePath: requestApp.relativePath,
      isAppScoped: true
    };

    if (await routeApi(req, url, res, { modulesDir, adminAccessToken, connectionService: connectionApi, appRegistryService: appRegistry, appContext })) {
      return;
    }

    let requestPath = decodeURIComponent(requestApp.relativePath);

    const protectedRoutes = {
      '/admin': '/admin.html',
      '/admin.html': '/admin.html',
      '/dev': '/dev.html',
      '/developer': '/dev.html',
      '/dev.html': '/dev.html'
    };

    if (protectedRoutes[requestPath]) {
      if (!hasAdminAccess(req, adminAccessToken)) {
        sendJson(res, adminAccessToken ? 403 : 401, {
          ok: false,
          code: adminAccessToken ? 'FORBIDDEN' : 'UNAUTHORIZED',
          message: adminAccessToken
            ? 'Administrative pages require server-side authorization.'
            : 'Administrative access token is not configured.'
        });
        return;
      }

      if (req.headers['x-admin-access-token'] === adminAccessToken) {
        setAdminAccessCookie(res, adminAccessToken);
      }

      requestPath = protectedRoutes[requestPath];
    }

    if (requestPath === '/' || requestPath === '') {
      requestPath = '/index.html';
    }

    if (requestPath.startsWith('/webroot/')) {
      requestPath = requestPath.replace(/^\/webroot\//, '/');
    }

    if (requestPath.startsWith('/design/')) {
      serveStaticFile(res, safeResolve(rootDir, requestPath.replace(/^\/+/u, '')));
      return;
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

    const filePath = safeResolve(appContext.webRootDir || webRootDir, requestPath);
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
};

const server = createServer();

if (require.main === module) {
  server.listen(port, host, () => {
    console.log(`Neutral platform server listening on http://${host}:${port}`);
  });
}

module.exports = server;
module.exports.config = { port, host, rootDir, webRootDir, apiBase, connectionStorePath };
module.exports.createServer = createServer;
