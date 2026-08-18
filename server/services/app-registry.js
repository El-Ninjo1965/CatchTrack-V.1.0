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
  const normalized = prefixed.replace(/\/+$/, '') || '/';
  return normalized === '' ? '/' : normalized;
};

const resolveRelativePath = (rootDir, value, fallback) => path.resolve(rootDir, value || fallback);

const validateExistingFilePath = (rootDir, value, label, appId) => {
  const text = normalizeText(value);
  if (!text) {
    throw new Error(`App "${appId}" has an invalid ${label}: missing value.`);
  }

  const resolved = path.isAbsolute(text) ? path.resolve(text) : path.resolve(rootDir, text);
  if (!fs.existsSync(resolved)) {
    throw new Error(`App "${appId}" has an invalid ${label}: "${text}" does not exist.`);
  }

  return resolved;
};

const readJsonFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`App registry file does not exist: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  if (!raw.trim()) {
    throw new Error(`App registry file is empty: ${filePath}`);
  }

  return JSON.parse(raw);
};

const validateWebRootDir = (webRootDir, rootDir, appId) => {
  const value = normalizeText(webRootDir);
  if (!value) {
    throw new Error(`App "${appId}" has an invalid webRootDir: missing value.`);
  }

  const resolved = path.isAbsolute(value)
    ? path.resolve(value)
    : path.resolve(rootDir, value);

  if (!path.isAbsolute(value)) {
    const relative = path.relative(rootDir, resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      throw new Error(`App "${appId}" has an invalid webRootDir: "${value}".`);
    }
  }

  if (!fs.existsSync(resolved)) {
    throw new Error(`App "${appId}" has an invalid webRootDir: "${value}" does not exist.`);
  }

  return resolved;
};

const normalizeApp = (input, rootDir) => {
  if (!input || typeof input !== 'object') {
    throw new Error('App registry entry is invalid: expected an object.');
  }

  const appId = normalizeText(input.appId);
  if (!appId) {
    throw new Error('App registry entry is invalid: missing appId.');
  }

  const mountPathInput = Object.prototype.hasOwnProperty.call(input, 'mountPath') ? input.mountPath : '/';
  const mountPathValue = normalizeText(mountPathInput);
  if (mountPathInput === undefined || mountPathInput === null) {
    /* default to root mount for the primary app */
  } else if (mountPathValue === '') {
    throw new Error(`App "${appId}" is invalid: missing mountPath.`);
  }

  const mountPath = normalizeMountPath(mountPathValue || '/');
  if (!mountPath || mountPath === '') {
    throw new Error(`App "${appId}" is invalid: missing mountPath.`);
  }

  const defaultWebRootDir = mountPath === '/' ? 'webroot' : path.join('apps', appId, 'webroot');
  const defaultDesignPath = mountPath === '/' ? 'design/neutral.css' : path.join('apps', appId, 'design', 'neutral.css');
  const defaultDataRootDir = path.join('server', 'state', 'apps', appId);
  const designName = normalizeText(input.design || input.theme || 'neutral');
  const webRootDir = validateWebRootDir(input.webRootDir || defaultWebRootDir, rootDir, appId);
  const explicitDesignPath = normalizeText(input.designPath);
  const designPath = explicitDesignPath
    ? validateExistingFilePath(rootDir, explicitDesignPath, 'designPath', appId)
    : (fs.existsSync(path.resolve(rootDir, defaultDesignPath)) ? path.resolve(rootDir, defaultDesignPath) : null);

  return {
    appId,
    appName: normalizeText(input.appName || appId),
    mountPath,
    webRootDir,
    design: designName || 'neutral',
    designPath,
    dataRootDir: resolveRelativePath(rootDir, input.dataRootDir || defaultDataRootDir, defaultDataRootDir),
    apiBasePath: normalizeMountPath(input.apiBasePath || '/api'),
    active: input.active !== false,
    metadata: input.metadata && typeof input.metadata === 'object' && !Array.isArray(input.metadata)
      ? { ...input.metadata }
      : {},
    connectionScope: normalizeText(input.connectionScope || appId)
  };
};

const createAppRegistryService = (registryPath, { rootDir } = {}) => {
  if (!registryPath || typeof registryPath !== 'string') {
    throw new Error('App registry path is required.');
  }

  const readStore = () => {
    const payload = readJsonFile(registryPath);
    if (!payload || typeof payload !== 'object' || !Array.isArray(payload.apps)) {
      throw new Error(`App registry at "${registryPath}" is invalid: expected an object with an apps array.`);
    }

    if (payload.apps.length === 0) {
      throw new Error(`App registry at "${registryPath}" is invalid: apps array cannot be empty.`);
    }

    const apps = payload.apps.map((app) => normalizeApp(app, rootDir));
    const seenAppIds = new Set();
    const seenMountPaths = new Set();

    for (const app of apps) {
      if (seenAppIds.has(app.appId)) {
        throw new Error(`App registry is invalid: duplicate appId "${app.appId}".`);
      }
      seenAppIds.add(app.appId);

      if (seenMountPaths.has(app.mountPath)) {
        throw new Error(`App registry is invalid: duplicate mountPath "${app.mountPath}".`);
      }
      seenMountPaths.add(app.mountPath);
    }

    return apps;
  };

  const cachedApps = readStore();

  const getApps = () => cachedApps.slice().sort((left, right) => right.mountPath.length - left.mountPath.length);

  const resolveRequest = (pathname) => {
    const apps = getApps();
    const normalizedPath = pathname && pathname.startsWith('/') ? pathname : `/${pathname || ''}`;

    for (const app of apps) {
      if (app.mountPath !== '/' && (normalizedPath === app.mountPath || normalizedPath.startsWith(`${app.mountPath}/`))) {
        const relativePath = normalizedPath.slice(app.mountPath.length) || '/';
        return {
          app,
          relativePath: relativePath.startsWith('/') ? relativePath : `/${relativePath}`,
          isGlobalRoot: false
        };
      }
    }

    if (normalizedPath === '/') {
      const fallback = apps.find((app) => app.mountPath === '/');
      if (!fallback) {
        return null;
      }
      return {
        app: fallback,
        relativePath: normalizedPath,
        isGlobalRoot: true
      };
    }

    return null;
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
      const resolved = resolveRequest(pathname);
      return resolved ? resolved.app : null;
    }
  };
};

module.exports = {
  createAppRegistryService,
  normalizeApp
};
