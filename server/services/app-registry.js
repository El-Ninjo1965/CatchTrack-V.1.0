'use strict';

const fs = require('node:fs');
const path = require('node:path');

const normalizeText = (value) => String(value ?? '').trim();

const normalizeMountPath = (value) => {
  const text = normalizeText(value);
  if (!text || text === '/') {
    return '/';
  }

  const prefixed = text.startsWith('/') ? text : `/${text}`;
  return prefixed.replace(/\/+$/, '') || '/';
};

const resolveRelativePath = (rootDir, value, fallback) => path.resolve(rootDir, value || fallback);

const readJsonFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  if (!raw.trim()) {
    return null;
  }

  return JSON.parse(raw);
};

const normalizeApp = (input, rootDir) => {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const appId = normalizeText(input.appId);
  if (!appId) {
    return null;
  }

  const mountPath = normalizeMountPath(input.mountPath || '/');
  const defaultWebRootDir = mountPath === '/' ? 'webroot' : path.join('apps', appId, 'webroot');
  const defaultDataRootDir = path.join('server', 'state', 'apps', appId);

  return {
    appId,
    appName: normalizeText(input.appName || appId),
    mountPath,
    webRootDir: resolveRelativePath(rootDir, input.webRootDir, defaultWebRootDir),
    dataRootDir: resolveRelativePath(rootDir, input.dataRootDir, defaultDataRootDir),
    apiBasePath: normalizeMountPath(input.apiBasePath || '/api'),
    active: input.active !== false,
    metadata: input.metadata && typeof input.metadata === 'object' && !Array.isArray(input.metadata)
      ? { ...input.metadata }
      : {},
    connectionScope: normalizeText(input.connectionScope || appId)
  };
};

const defaultAppDefinitions = (rootDir) => [
  normalizeApp({
    appId: 'primary-web-app',
    appName: 'Primary Web App',
    mountPath: '/',
    webRootDir: 'webroot',
    dataRootDir: path.join('server', 'state', 'apps', 'primary-web-app'),
    apiBasePath: '/api',
    connectionScope: 'primary-web-app',
    active: true
  }, rootDir)
];

const createAppRegistryService = (registryPath, { rootDir } = {}) => {
  if (!registryPath || typeof registryPath !== 'string') {
    throw new Error('App registry path is required.');
  }

  const readStore = () => {
    try {
      const payload = readJsonFile(registryPath);
      const apps = payload && Array.isArray(payload.apps) ? payload.apps : [];
      const normalized = apps.map((app) => normalizeApp(app, rootDir)).filter(Boolean);
      return normalized.length > 0 ? normalized : defaultAppDefinitions(rootDir);
    } catch {
      return defaultAppDefinitions(rootDir);
    }
  };

  const getApps = () => readStore().sort((left, right) => right.mountPath.length - left.mountPath.length);

  const resolveRequest = (pathname) => {
    const apps = getApps();
    const normalizedPath = pathname && pathname.startsWith('/') ? pathname : `/${pathname || ''}`;

    for (const app of apps) {
      if (app.mountPath === '/') {
        return {
          app,
          relativePath: normalizedPath,
          isGlobalRoot: true
        };
      }

      if (normalizedPath === app.mountPath || normalizedPath.startsWith(`${app.mountPath}/`)) {
        const relativePath = normalizedPath.slice(app.mountPath.length) || '/';
        return {
          app,
          relativePath: relativePath.startsWith('/') ? relativePath : `/${relativePath}`,
          isGlobalRoot: false
        };
      }
    }

    const fallback = apps.find((app) => app.mountPath === '/') || defaultAppDefinitions(rootDir)[0];
    return {
      app: fallback,
      relativePath: normalizedPath,
      isGlobalRoot: true
    };
  };

  return {
    listApps() {
      return getApps();
    },

    getApp(appId) {
      const id = normalizeText(appId);
      if (!id) {
        return null;
      }

      return getApps().find((app) => app.appId === id) || null;
    },

    resolveRequest,

    getCurrentAppContext(pathname) {
      return resolveRequest(pathname).app;
    }
  };
};

module.exports = {
  createAppRegistryService,
  normalizeApp
};
