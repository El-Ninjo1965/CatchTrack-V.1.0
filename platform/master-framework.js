(function (globalObject) {
  'use strict';

  const root = globalObject || globalThis;

  const normalizeString = (value, fallback = '') => {
    if (typeof value !== 'string') {
      return fallback;
    }

    const trimmed = value.trim();
    return trimmed || fallback;
  };

  const isPlainObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

  const normalizeSetupStatus = (value, fallback = 'NOT_CONFIGURED') => {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }

    const normalized = String(value).trim().toUpperCase().replace(/[\s_-]+/g, '_');
    const aliases = {
      NOT_STARTED: 'NOT_CONFIGURED',
      DRAFT: 'NOT_CONFIGURED',
      IN_PROGRESS: 'CONFIGURATION_REQUIRED',
      CONFIGURATION_REQUIRED: 'CONFIGURATION_REQUIRED',
      READY_TO_TEST: 'READY_TO_TEST',
      TESTING: 'TESTING',
      READY: 'READY',
      ACTIVE: 'ACTIVE',
      ERROR: 'ERROR',
      NOT_CONFIGURED: 'NOT_CONFIGURED'
    };

    return aliases[normalized] || fallback;
  };

  const createStatusSnapshot = (name, value) => ({
    name,
    value,
    status: value ? 'enabled' : 'disabled'
  });

  const cloneObject = (value, fallback = {}) => (isPlainObject(value) ? { ...value } : { ...fallback });

  const normalizeSectionState = (value, defaults) => ({
    ...defaults,
    ...(isPlainObject(value) ? value : {})
  });

  const ADMIN_STATE_STORAGE_KEY = 'master-framework.admin-state';
  const ADMIN_STATE_FILE_NAME = 'admin-state.json';

  const FrameworkRuntime = {
    version: '1.0.0',
    apps: new Map(),
    connections: new Map(),
    featureFlags: new Map(),
    normalizeSetupStatus,
    permissions: new Map(),
    roles: new Map(),
    migrations: [],
    createdAt: new Date().toISOString(),

    initialize() {
      this.setFeatureFlag('new-sync-engine', false);
      this.setFeatureFlag('beta-admin', false);
      this.setFeatureFlag('offline-first', true);
      this.registerRole('user', {
        description: 'Standard end user.',
        permissions: ['user:read']
      });
      this.registerRole('member', {
        description: 'Member with basic collaboration access.',
        permissions: ['user:read']
      });
      this.registerRole('manager', {
        description: 'Management role with restricted write access.',
        permissions: ['user:read', 'user:write']
      });
      this.registerRole('admin', {
        description: 'Administrators can manage users and system settings.',
        permissions: ['user:read', 'user:write', 'system:view']
      });
      this.registerRole('developer', {
        description: 'Developer role with module and framework access.',
        permissions: ['user:read', 'user:write', 'system:view', 'module:read', 'module:update']
      });
      this.registerPermission('system:view', 'Read system and diagnostics information.');
      this.registerPermission('module:read', 'Read module metadata and status.');
      this.registerPermission('module:update', 'Update module metadata and runtime state.');
      this.registerPermission('app:read', 'Read app metadata.');
      this.registerPermission('app:module:read', 'Read app-specific module access metadata.');
      this.registerPermission('app:module:update', 'Update app-specific module access metadata.');
      this.registerPermission('connection:read', 'Read connection metadata.');
      this.registerPermission('connection:write', 'Modify connection metadata.');
      this.registerPermission('user:read', 'Read user data.');
      this.registerPermission('user:write', 'Create and update users.');
      this.setFeatureFlag('app-scoped-governance', true);
      return this;
    },

    normalizeApp(appDefinition) {
      if (!isPlainObject(appDefinition)) {
        throw new TypeError('Application definition must be an object.');
      }

      const appId = normalizeString(appDefinition.appId || appDefinition.id, 'default-app');
      const appName = normalizeString(appDefinition.name, appId);
      const moduleAccess = isPlainObject(appDefinition.moduleAccess)
        ? { ...appDefinition.moduleAccess }
        : (isPlainObject(appDefinition.config) && isPlainObject(appDefinition.config.moduleAccess)
          ? { ...appDefinition.config.moduleAccess }
          : {});

      const featureTemplates = Array.isArray(appDefinition.featureTemplates)
        ? appDefinition.featureTemplates.map((featureDefinition) => this.normalizeFeatureTemplate(featureDefinition)).filter(Boolean)
        : Array.isArray(appDefinition.features)
          ? appDefinition.features.map((featureDefinition) => this.normalizeFeatureTemplate(featureDefinition)).filter(Boolean)
          : [
              this.normalizeFeatureTemplate({ id: 'overview', label: 'Overview', description: 'Core overview area.', permissions: ['system:view'] }),
              this.normalizeFeatureTemplate({ id: 'profile', label: 'Profile', description: 'User profile and settings.', permissions: ['user:read'] }),
              this.normalizeFeatureTemplate({ id: 'modules', label: 'Modules', description: 'Feature and module workspace.', permissions: ['module:read'] })
            ].filter(Boolean);
      const featureAccess = isPlainObject(appDefinition.featureAccess)
        ? { ...appDefinition.featureAccess }
        : {};

      const normalized = {
        appId,
        id: appId,
        name: appName,
        version: normalizeString(appDefinition.version, '1.0.0'),
        description: normalizeString(appDefinition.description, ''),
        active: !!appDefinition.active,
        status: normalizeString(appDefinition.status, appDefinition.active ? 'active' : 'inactive'),
        modules: Array.isArray(appDefinition.modules) ? [...appDefinition.modules] : [],
        moduleAccess,
        featureTemplates,
        featureAccess,
        config: isPlainObject(appDefinition.config) ? { ...appDefinition.config } : {},
        secrets: isPlainObject(appDefinition.secrets) ? { ...appDefinition.secrets } : {},
        runtimeState: isPlainObject(appDefinition.runtimeState) ? { ...appDefinition.runtimeState } : {},
        permissions: Array.isArray(appDefinition.permissions) ? [...appDefinition.permissions] : [],
        capabilities: Array.isArray(appDefinition.capabilities) ? [...appDefinition.capabilities] : [],
        ui: isPlainObject(appDefinition.ui) ? { ...appDefinition.ui } : {},
        server: isPlainObject(appDefinition.server) ? { ...appDefinition.server } : {},
        createdAt: appDefinition.createdAt || new Date().toISOString(),
        updatedAt: appDefinition.updatedAt || new Date().toISOString()
      };

      if (normalized.config && typeof normalized.config === 'object' && !normalized.config.moduleAccess) {
        normalized.config.moduleAccess = normalized.moduleAccess;
      }
      if (normalized.config && typeof normalized.config === 'object' && !normalized.config.featureAccess) {
        normalized.config.featureAccess = normalized.featureAccess;
      }

      return normalized;
    },

    registerApp(appDefinition) {
      const app = this.normalizeApp(appDefinition);
      this.apps.set(app.appId, app);
      return app;
    },

    getApp(appId) {
      const normalized = normalizeString(appId, '');
      if (!normalized) {
        return null;
      }
      return this.apps.get(normalized) || null;
    },

    setAppModuleAccess(appId, moduleId, access = {}) {
      const app = this.getApp(appId);
      if (!app) {
        throw new Error(`Application not found: ${appId}`);
      }

      const moduleKey = normalizeString(moduleId, '');
      if (!moduleKey) {
        throw new Error('Module id is required.');
      }

      const source = isPlainObject(app.moduleAccess) ? { ...app.moduleAccess } : {};
      const roleMatrix = isPlainObject(access.roles) ? Object.fromEntries(
        Object.entries(access.roles).map(([role, enabled]) => [normalizeString(role, ''), !!enabled])
          .filter(([role]) => role)
      ) : {};

      const nextEntry = {
        enabled: typeof access.enabled === 'boolean' ? access.enabled : true,
        permissions: Array.isArray(access.permissions)
          ? [...new Set(access.permissions.filter(Boolean).map((entry) => normalizeString(String(entry), '')))].filter(Boolean)
          : Array.isArray(source[moduleKey] && source[moduleKey].permissions) ? [...source[moduleKey].permissions] : [],
        roles: roleMatrix,
        updatedAt: new Date().toISOString()
      };

      source[moduleKey] = nextEntry;
      app.moduleAccess = source;
      if (isPlainObject(app.config)) {
        app.config.moduleAccess = source;
      }
      app.updatedAt = new Date().toISOString();
      return { ...nextEntry, moduleId: moduleKey, appId: app.appId };
    },

    getAppModuleAccess(appId, moduleId) {
      const app = this.getApp(appId);
      if (!app) {
        return null;
      }

      const moduleKey = normalizeString(moduleId, '');
      if (!moduleKey) {
        return null;
      }

      const access = isPlainObject(app.moduleAccess) ? app.moduleAccess[moduleKey] : null;
      return access ? { ...access, moduleId: moduleKey, appId: app.appId } : null;
    },

    listAppModuleAccess(appId) {
      const app = this.getApp(appId);
      if (!app) {
        return [];
      }

      const accessMap = isPlainObject(app.moduleAccess) ? app.moduleAccess : {};
      return Object.entries(accessMap).map(([moduleId, value]) => ({
        appId: app.appId,
        moduleId,
        ...(isPlainObject(value) ? value : {})
      }));
    },

    normalizeFeatureTemplate(featureDefinition) {
      if (!featureDefinition) {
        return null;
      }

      const definition = isPlainObject(featureDefinition) ? featureDefinition : { id: String(featureDefinition) };
      const featureId = normalizeString(definition.id || definition.featureId || definition.name, '');
      if (!featureId) {
        return null;
      }

      const normalized = {
        id: featureId,
        key: featureId,
        label: normalizeString(definition.label || definition.name || definition.title, featureId),
        description: normalizeString(definition.description, ''),
        permissions: Array.isArray(definition.permissions)
          ? [...new Set(definition.permissions.filter(Boolean).map((entry) => normalizeString(String(entry), '')).filter(Boolean))]
          : [],
        roles: Array.isArray(definition.roles)
          ? [...new Set(definition.roles.filter(Boolean).map((role) => normalizeString(String(role), '')).filter(Boolean))]
          : [],
        group: normalizeString(definition.group, 'core'),
        enabled: typeof definition.enabled === 'boolean' ? definition.enabled : true
      };

      return normalized;
    },

    registerFeatureTemplate(appId, templateDefinition) {
      const app = this.getApp(appId);
      if (!app) {
        throw new Error(`Application not found: ${appId}`);
      }

      const normalized = this.normalizeFeatureTemplate(templateDefinition);
      if (!normalized) {
        throw new TypeError('Feature template definition must be an object with an id.');
      }

      const templates = Array.isArray(app.featureTemplates) ? [...app.featureTemplates] : [];
      const existingIndex = templates.findIndex((template) => template.id === normalized.id || template.key === normalized.id);
      if (existingIndex >= 0) {
        templates[existingIndex] = { ...templates[existingIndex], ...normalized };
      } else {
        templates.push(normalized);
      }
      app.featureTemplates = templates;
      if (isPlainObject(app.config)) {
        app.config.featureTemplates = templates;
      }
      app.updatedAt = new Date().toISOString();
      return { ...normalized };
    },

    setAppFeatureAccess(appId, featureId, access = {}) {
      const app = this.getApp(appId);
      if (!app) {
        throw new Error(`Application not found: ${appId}`);
      }

      const featureKey = normalizeString(featureId, '');
      if (!featureKey) {
        throw new Error('Feature id is required.');
      }

      const source = isPlainObject(app.featureAccess) ? { ...app.featureAccess } : {};
      const roleMatrix = isPlainObject(access.roles) ? Object.fromEntries(
        Object.entries(access.roles).map(([role, enabled]) => [normalizeString(role, ''), !!enabled])
          .filter(([role]) => role)
      ) : {};

      const nextEntry = {
        enabled: typeof access.enabled === 'boolean' ? access.enabled : true,
        permissions: Array.isArray(access.permissions)
          ? [...new Set(access.permissions.filter(Boolean).map((entry) => normalizeString(String(entry), '')))].filter(Boolean)
          : Array.isArray(source[featureKey] && source[featureKey].permissions) ? [...source[featureKey].permissions] : [],
        roles: roleMatrix,
        updatedAt: new Date().toISOString()
      };

      source[featureKey] = nextEntry;
      app.featureAccess = source;
      if (isPlainObject(app.config)) {
        app.config.featureAccess = source;
      }
      app.updatedAt = new Date().toISOString();
      return { ...nextEntry, featureId: featureKey, appId: app.appId };
    },

    getAppFeatureAccess(appId, featureId) {
      const app = this.getApp(appId);
      if (!app) {
        return null;
      }

      const featureKey = normalizeString(featureId, '');
      if (!featureKey) {
        return null;
      }

      const access = isPlainObject(app.featureAccess) ? app.featureAccess[featureKey] : null;
      return access ? { ...access, featureId: featureKey, appId: app.appId } : null;
    },

    listAppFeatureAccess(appId) {
      const app = this.getApp(appId);
      if (!app) {
        return [];
      }

      const accessMap = isPlainObject(app.featureAccess) ? app.featureAccess : {};
      return Object.entries(accessMap).map(([featureId, value]) => ({
        appId: app.appId,
        featureId,
        ...(isPlainObject(value) ? value : {})
      }));
    },

    listApps() {
      return Array.from(this.apps.values()).map((app) => ({ ...app, config: { ...app.config }, secrets: { ...app.secrets }, runtimeState: { ...app.runtimeState } }));
    },

    activateApp(appId) {
      const app = this.getApp(appId);
      if (!app) {
        throw new Error(`Application not found: ${appId}`);
      }
      app.active = true;
      app.status = 'active';
      app.updatedAt = new Date().toISOString();
      return app;
    },

    deactivateApp(appId) {
      const app = this.getApp(appId);
      if (!app) {
        throw new Error(`Application not found: ${appId}`);
      }
      app.active = false;
      app.status = 'inactive';
      app.updatedAt = new Date().toISOString();
      return app;
    },

    unregisterApp(appId) {
      const normalized = normalizeString(appId, '');
      return this.apps.delete(normalized);
    },

    normalizeConnection(connectionDefinition) {
      if (!isPlainObject(connectionDefinition)) {
        throw new TypeError('Connection definition must be an object.');
      }

      const connectionId = normalizeString(connectionDefinition.connectionId || connectionDefinition.id, 'default-connection');
      const appId = normalizeString(connectionDefinition.appId || connectionDefinition.app, 'default-app');
      const serverUrl = normalizeString(connectionDefinition.serverUrl || connectionDefinition.url || connectionDefinition.serverAddress, 'http://localhost');
      const apiBase = normalizeString(connectionDefinition.apiBase || connectionDefinition.basePath || '/api', '/api');
      const storageType = normalizeString(connectionDefinition.storageType || connectionDefinition.type || connectionDefinition.databaseType || connectionDefinition.connectionType || 'file', 'file');
      const databaseType = normalizeString(connectionDefinition.databaseType || connectionDefinition.sqlType || ((storageType === 'sql' || storageType === 'sqlite' || storageType === 'mysql' || storageType === 'postgresql') ? storageType : ''), '');
      const databaseName = normalizeString(connectionDefinition.databaseName || connectionDefinition.name || connectionDefinition.database || '', '');
      const storagePath = normalizeString(connectionDefinition.storagePath || connectionDefinition.filePath || connectionDefinition.path || '', '');
      const host = normalizeString(connectionDefinition.host || '', '');
      const port = normalizeString(connectionDefinition.port || connectionDefinition.portNumber || '', '');
      const username = normalizeString(connectionDefinition.username || '', '');
      const password = normalizeString(connectionDefinition.password || '', '');

      return {
        connectionId,
        id: connectionId,
        appId,
        serverUrl,
        apiBase,
        type: storageType,
        storageType,
        connectionType: normalizeString(connectionDefinition.connectionType || storageType, storageType),
        databaseType,
        databaseName,
        storagePath,
        host,
        port,
        username,
        password,
        endpoints: isPlainObject(connectionDefinition.endpoints) ? { ...connectionDefinition.endpoints } : {},
        status: normalizeString(connectionDefinition.status, 'inactive'),
        active: !!connectionDefinition.active,
        default: !!connectionDefinition.default,
        authType: normalizeString(connectionDefinition.authType, 'none'),
        credentialsRef: normalizeString(connectionDefinition.credentialsRef, ''),
        health: isPlainObject(connectionDefinition.health) ? { ...connectionDefinition.health } : { status: 'unknown' },
        lastTestAt: connectionDefinition.lastTestAt || null,
        createdAt: connectionDefinition.createdAt || new Date().toISOString(),
        updatedAt: connectionDefinition.updatedAt || new Date().toISOString()
      };
    },

    registerConnection(connectionDefinition) {
      const connection = this.normalizeConnection(connectionDefinition);
      this.connections.set(connection.connectionId, connection);
      return connection;
    },

    getConnection(connectionId) {
      const normalized = normalizeString(connectionId, '');
      if (!normalized) {
        return null;
      }
      return this.connections.get(normalized) || null;
    },

    listConnections(appId = null) {
      const values = Array.from(this.connections.values());
      if (!appId) {
        return values;
      }
      return values.filter((connection) => connection.appId === normalizeString(appId, ''));
    },

    updateConnection(connectionId, updates) {
      const connection = this.getConnection(connectionId);
      if (!connection) {
        throw new Error(`Connection not found: ${connectionId}`);
      }
      const next = { ...connection, ...updates, updatedAt: new Date().toISOString() };
      this.connections.set(connectionId, next);
      return next;
    },

    setConnectionStatus(connectionId, status) {
      const normalizedStatus = normalizeString(status, 'inactive');
      const connection = this.getConnection(connectionId);
      if (!connection) {
        throw new Error(`Connection not found: ${connectionId}`);
      }
      connection.status = normalizedStatus;
      connection.active = normalizedStatus === 'active' || normalizedStatus === 'healthy';
      connection.updatedAt = new Date().toISOString();
      return connection;
    },

    async testConnection(connectionId, testHandler = null) {
      const connection = this.getConnection(connectionId);
      if (!connection) {
        throw new Error(`Connection not found: ${connectionId}`);
      }

      const result = typeof testHandler === 'function'
        ? await testHandler(connection)
        : { ok: true, status: 'healthy', checkedAt: new Date().toISOString() };

      connection.health = isPlainObject(result) ? { ...result } : { status: 'healthy' };
      connection.lastTestAt = new Date().toISOString();
      connection.status = result && result.status ? String(result.status) : connection.status;
      connection.updatedAt = new Date().toISOString();
      return connection;
    },

    getStorageManager() {
      if (typeof globalThis !== 'undefined' && globalThis.StorageManager && typeof globalThis.StorageManager.resolveStorageAdapter === 'function') {
        return globalThis.StorageManager;
      }

      if (typeof require === 'function') {
        try {
          return require('./storage-manager');
        } catch (error) {
          return null;
        }
      }

      return null;
    },

    normalizeStorageType(value, fallback = 'file') {
      const manager = this.getStorageManager();
      if (manager && typeof manager.normalizeStorageType === 'function') {
        return manager.normalizeStorageType(value, fallback);
      }
      const normalized = normalizeString(String(value || fallback), fallback).toLowerCase();
      return normalized === 'text' ? 'file' : normalized;
    },

    createStorageAdapter(connectionDefinition = {}) {
      const manager = this.getStorageManager();
      if (manager && typeof manager.resolveStorageAdapter === 'function') {
        return manager.resolveStorageAdapter(connectionDefinition || {});
      }

      const normalized = this.normalizeConnection(connectionDefinition || {});
      return {
        id: normalized.connectionId,
        connectionId: normalized.connectionId,
        type: normalized.storageType,
        storageType: normalized.storageType,
        name: `${normalized.storageType.toUpperCase()} storage adapter`,
        async test() {
          return { ok: true, status: 'healthy', mode: normalized.storageType, checkedAt: new Date().toISOString() };
        },
        async read() { return null; },
        async write(collection, key, value) { return value; },
        async list() { return []; },
        async remove() { return true; }
      };
    },

    getActiveStorageConnection() {
      const defaultConnection = this.listConnections().find((connection) => !!connection.default) || this.listConnections().find((connection) => !!connection.active) || null;
      const fallback = this.normalizeConnection({
        connectionId: 'file-storage',
        appId: 'default-app',
        storageType: 'file',
        databaseType: 'file',
        active: true,
        default: true,
        status: 'active'
      });

      const source = defaultConnection || fallback;
      return this.createStorageAdapter(source);
    },

    setFeatureFlag(key, value) {
      const normalizedKey = normalizeString(key, '');
      if (!normalizedKey) {
        throw new Error('Feature flag key is required.');
      }
      this.featureFlags.set(normalizedKey, !!value);
      return this.featureFlags.get(normalizedKey);
    },

    getFeatureFlag(key, defaultValue = false) {
      const normalizedKey = normalizeString(key, '');
      if (!normalizedKey) {
        return defaultValue;
      }
      return this.featureFlags.has(normalizedKey) ? this.featureFlags.get(normalizedKey) : defaultValue;
    },

    listFeatureFlags() {
      return Array.from(this.featureFlags.entries()).map(([name, value]) => ({ name, value, status: createStatusSnapshot(name, value) }));
    },

    registerRole(roleId, roleDefinition = {}) {
      const normalized = normalizeString(roleId, '');
      if (!normalized) {
        throw new Error('Role key is required.');
      }

      const definition = isPlainObject(roleDefinition) ? roleDefinition : {};
      const permissions = Array.isArray(definition.permissions)
        ? [...new Set(definition.permissions.filter(Boolean).map((value) => normalizeString(String(value), '')))].filter(Boolean)
        : [];

      const role = {
        role: normalized,
        name: normalizeString(definition.name, normalized),
        description: normalizeString(definition.description, ''),
        permissions,
        isSystem: !!definition.isSystem
      };

      this.roles.set(normalized, role);
      permissions.forEach((permission) => {
        this.registerPermission(permission, definition.permissionDescriptions && definition.permissionDescriptions[permission] ? definition.permissionDescriptions[permission] : '');
      });

      return { ...role };
    },

    getRole(roleId) {
      const normalized = normalizeString(roleId, '');
      if (!normalized) {
        return null;
      }
      return this.roles.has(normalized) ? { ...this.roles.get(normalized) } : null;
    },

    getRoleCatalog() {
      return Array.from(this.roles.values()).map((role) => ({ ...role, permissions: [...role.permissions] }));
    },

    getPermissionCatalog() {
      return Array.from(this.permissions.entries()).map(([permission, description]) => ({
        permission,
        description: normalizeString(description, '')
      }));
    },

    registerPermission(permission, description = '') {
      const normalized = normalizeString(permission, '');
      if (!normalized) {
        throw new Error('Permission key is required.');
      }
      this.permissions.set(normalized, normalizeString(description, ''));
      return { permission: normalized, description: this.permissions.get(normalized) };
    },

    checkPermission(subject, permission) {
      const permissionKey = normalizeString(permission, '');
      if (!permissionKey) {
        return { ok: false, code: 'NO_PERMISSION', message: 'Permission is required.' };
      }

      const value = subject && typeof subject === 'object' ? subject : null;
      const permissions = Array.isArray(value && value.permissions) ? value.permissions.filter(Boolean).map(String) : [];
      const roles = Array.isArray(value && value.roles) ? value.roles.filter(Boolean).map(String) : [];
      const hasPermission = permissions.includes(permissionKey) || roles.includes('admin') || roles.includes('developer');

      return {
        ok: hasPermission,
        code: hasPermission ? 'ALLOWED' : 'DENIED',
        permission: permissionKey,
        subject: value && (value.id || value.username || value.email) ? value.id || value.username || value.email : 'anonymous'
      };
    },

    getDefaultSetupState() {
      return {
        status: 'NOT_CONFIGURED',
        currentStep: 'system-check',
        completedSteps: [],
        appId: 'neutral-app',
        appName: 'Neutral App',
        selectedApp: null,
        configuration: {},
        serverState: {
          configured: false,
          testedAt: null,
          status: 'NOT_CONFIGURED',
          reachable: false,
          responseTimeMs: null,
          message: 'Server not configured.',
          url: '',
          apiBase: '/api'
        },
        databaseState: {
          configured: false,
          testedAt: null,
          status: 'NOT_CONFIGURED',
          reachable: false,
          responseTimeMs: null,
          message: 'Database not configured.',
          type: 'indexeddb',
          name: 'CoreDB',
          host: '',
          url: ''
        },
        frameworkState: {
          initialized: false,
          initializedAt: null,
          status: 'NOT_INITIALIZED',
          message: 'Framework not initialized.'
        },
        bootstrapState: {
          configured: false,
          enabled: true,
          username: 'developer',
          displayId: 'USR-000001',
          role: 'developer',
          status: 'NOT_CONFIGURED',
          message: 'Bootstrap not configured.'
        },
        connections: [],
        database: null,
        adminAccount: null,
        license: null,
        installation: {
          active: false,
          installedAt: null,
          activatedAt: null,
          state: 'NOT_CONFIGURED'
        },
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
    },

    readPersistedSetupState() {
      const candidates = [];

      if (typeof localStorage !== 'undefined') {
        try {
          const raw = localStorage.getItem('master-framework.setup-state');
          if (raw) {
            candidates.push(JSON.parse(raw));
          }
        } catch (error) {
          // Ignore invalid persisted state in localStorage.
        }
      }

      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        try {
          const fs = require('node:fs');
          const path = require('node:path');
          const stateFile = path.resolve(process.cwd(), 'server', 'runtime', 'setup-state.json');
          if (fs.existsSync(stateFile)) {
            const raw = fs.readFileSync(stateFile, 'utf8');
            if (raw && raw.trim()) {
              candidates.push(JSON.parse(raw));
            }
          }
        } catch (error) {
          // Ignore invalid persisted state on disk.
        }
      }

      for (const candidate of candidates) {
        if (isPlainObject(candidate)) {
          return candidate;
        }
      }
      return null;
    },

    getInstallationStatus(state = null) {
      const source = state && isPlainObject(state) ? state : this.loadSetupState();
      const installation = source.installation || {};
      const serverState = source.serverState || {};
      const databaseState = source.databaseState || {};
      const frameworkState = source.frameworkState || {};
      const bootstrapState = source.bootstrapState || {};
      const config = source.configuration || {};
      const databaseConfig = source.database || config.database || null;
      const connections = Array.isArray(source.connections) ? source.connections.length : 0;
      const rawStatus = normalizeSetupStatus(source.status || installation.state || 'NOT_CONFIGURED', 'NOT_CONFIGURED');
      const hasConfiguration = !!(
        serverState.configured ||
        databaseState.configured ||
        databaseConfig ||
        config.serverUrl ||
        config.appId ||
        bootstrapState.configured ||
        (isPlainObject(config) && Object.keys(config).length > 0)
      );
      const hasTesting = !!(serverState.testedAt || databaseState.testedAt);

      if (installation.active === true || rawStatus === 'ACTIVE') {
        return 'ACTIVE';
      }
      if (rawStatus === 'ERROR' || serverState.status === 'ERROR' || databaseState.status === 'ERROR' || frameworkState.status === 'ERROR' || bootstrapState.status === 'ERROR') {
        return 'ERROR';
      }
      if (rawStatus === 'READY') {
        return 'READY';
      }
      if (frameworkState.initialized && serverState.testedAt && databaseState.testedAt) {
        return 'READY';
      }
      if (hasConfiguration && hasTesting) {
        return 'READY_TO_TEST';
      }
      if (rawStatus === 'READY_TO_TEST' || rawStatus === 'TESTING') {
        return rawStatus;
      }
      if (hasConfiguration || connections > 0 || source.currentStep === 'configuration') {
        return 'CONFIGURATION_REQUIRED';
      }
      return 'NOT_CONFIGURED';
    },

    normalizeSetupState(state = {}) {
      const baseState = this.getDefaultSetupState();
      const merged = {
        ...baseState,
        ...(isPlainObject(state) ? state : {}),
        configuration: cloneObject(state.configuration, baseState.configuration),
        serverState: normalizeSectionState(state.serverState, baseState.serverState),
        databaseState: normalizeSectionState(state.databaseState, baseState.databaseState),
        frameworkState: normalizeSectionState(state.frameworkState, baseState.frameworkState),
        bootstrapState: normalizeSectionState(state.bootstrapState, baseState.bootstrapState),
        installation: normalizeSectionState(state.installation, baseState.installation),
        connections: Array.isArray(state.connections) ? [...state.connections] : [...baseState.connections]
      };

      const status = this.getInstallationStatus(merged);
      merged.status = status;
      merged.installation.state = status;
      if (status === 'ACTIVE') {
        merged.installation.active = true;
        merged.installation.activatedAt = merged.installation.activatedAt || new Date().toISOString();
      }
      if (merged.frameworkState.initialized && !merged.frameworkState.initializedAt) {
        merged.frameworkState.initializedAt = new Date().toISOString();
      }
      return merged;
    },

    getSetupSnapshot() {
      return this.normalizeSetupState(this.loadSetupState());
    },

    getServerState() {
      return cloneObject(this.getSetupSnapshot().serverState, this.getDefaultSetupState().serverState);
    },

    getDatabaseState() {
      return cloneObject(this.getSetupSnapshot().databaseState, this.getDefaultSetupState().databaseState);
    },

    getFrameworkState() {
      return cloneObject(this.getSetupSnapshot().frameworkState, this.getDefaultSetupState().frameworkState);
    },

    getBootstrapState() {
      return cloneObject(this.getSetupSnapshot().bootstrapState, this.getDefaultSetupState().bootstrapState);
    },

    getServerStatus() {
      const state = this.getServerState();
      return {
        ...state,
        ok: state.status !== 'ERROR',
        configured: !!state.configured
      };
    },

    getDatabaseStatus() {
      const state = this.getDatabaseState();
      return {
        ...state,
        ok: state.status !== 'ERROR' && state.status !== 'NOT_CONFIGURED' ? true : !!state.configured,
        configured: !!state.configured
      };
    },

    loadSetupState() {
      const baseState = this.getDefaultSetupState();
      const persisted = this.readPersistedSetupState();
      const source = persisted && isPlainObject(persisted)
        ? persisted
        : (this.setupState && isPlainObject(this.setupState) ? this.setupState : null);

      if (!source) {
        this.setupState = this.normalizeSetupState(baseState);
        return this.setupState;
      }

      const merged = this.normalizeSetupState({
        ...baseState,
        ...source
      });

      this.setupState = merged;
      return merged;
    },

    saveSetupState(nextState = null) {
      const state = isPlainObject(nextState) ? nextState : this.loadSetupState();
      const normalized = this.normalizeSetupState({
        ...this.getDefaultSetupState(),
        ...state,
        updatedAt: new Date().toISOString()
      });
      this.setupState = normalized;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('master-framework.setup-state', JSON.stringify(normalized));
      }
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        try {
          const fs = require('node:fs');
          const path = require('node:path');
          const stateDir = path.resolve(process.cwd(), 'server', 'runtime');
          fs.mkdirSync(stateDir, { recursive: true });
          fs.writeFileSync(path.join(stateDir, 'setup-state.json'), JSON.stringify(normalized, null, 2));
        } catch (error) {
          // best effort filesystem persistence; runtime state remains available in memory.
        }
      }
      return this.setupState;
    },

    updateSetupProgress(progress = {}) {
      const state = this.loadSetupState();
      const next = {
        ...state,
        ...progress,
        updatedAt: new Date().toISOString()
      };
      return this.saveSetupState(next);
    },

    markFrameworkInitialized(metadata = {}) {
      const state = this.loadSetupState();
      state.frameworkState = {
        ...this.getDefaultSetupState().frameworkState,
        ...state.frameworkState,
        initialized: true,
        initializedAt: new Date().toISOString(),
        status: 'READY',
        message: metadata.message || 'Framework initialized.'
      };
      if (metadata.currentStep) {
        state.currentStep = metadata.currentStep;
      }
      return this.saveSetupState(state);
    },

    updateServerState(serverState = {}) {
      const state = this.loadSetupState();
      state.serverState = normalizeSectionState(serverState, this.getDefaultSetupState().serverState);
      if (Object.keys(serverState || {}).length > 0) {
        state.serverState.configured = true;
      }
      if (serverState && Object.prototype.hasOwnProperty.call(serverState, 'configured')) {
        state.serverState.configured = !!serverState.configured;
      }
      return this.saveSetupState(state);
    },

    updateDatabaseState(databaseState = {}) {
      const state = this.loadSetupState();
      state.databaseState = normalizeSectionState(databaseState, this.getDefaultSetupState().databaseState);
      if (Object.keys(databaseState || {}).length > 0) {
        state.databaseState.configured = true;
      }
      if (databaseState && Object.prototype.hasOwnProperty.call(databaseState, 'configured')) {
        state.databaseState.configured = !!databaseState.configured;
      }
      return this.saveSetupState(state);
    },

    updateBootstrapState(bootstrapState = {}) {
      const state = this.loadSetupState();
      state.bootstrapState = normalizeSectionState(bootstrapState, this.getDefaultSetupState().bootstrapState);
      if (Object.keys(bootstrapState || {}).length > 0) {
        state.bootstrapState.configured = true;
      }
      if (bootstrapState && Object.prototype.hasOwnProperty.call(bootstrapState, 'enabled')) {
        state.bootstrapState.enabled = !!bootstrapState.enabled;
      }
      return this.saveSetupState(state);
    },

    activateInstallation(metadata = {}) {
      const state = this.loadSetupState();
      const currentStatus = this.getInstallationStatus(state);

      if (currentStatus !== 'READY') {
        return {
          ok: false,
          code: 'SETUP_NOT_READY',
          status: currentStatus,
          message: 'Installation cannot be activated before server, database and framework are ready.'
        };
      }

      const nextState = {
        ...state,
        status: 'ACTIVE',
        installation: {
          ...state.installation,
          active: true,
          installedAt: state.installation.installedAt || new Date().toISOString(),
          activatedAt: new Date().toISOString(),
          state: 'ACTIVE'
        },
        currentStep: metadata.currentStep || 'runtime',
        updatedAt: new Date().toISOString()
      };

      if (metadata.message) {
        nextState.installation.message = metadata.message;
      }

      return this.saveSetupState(nextState);
    },

    getDefaultAdminState() {
      const now = new Date().toISOString();
      return {
        devices: [],
        licenses: [],
        updates: {
          currentVersion: this.version,
          availableVersion: null,
          status: 'NOT_CONFIGURED',
          lastCheckedAt: null,
          source: 'local',
          message: 'Update source not configured.'
        },
        marketplace: {
          catalog: [],
          lastRefreshedAt: null,
          source: 'local'
        },
        createdAt: now,
        updatedAt: now
      };
    },

    readPersistedAdminState() {
      const candidates = [];

      if (typeof localStorage !== 'undefined') {
        try {
          const raw = localStorage.getItem(ADMIN_STATE_STORAGE_KEY);
          if (raw) {
            candidates.push(JSON.parse(raw));
          }
        } catch (error) {
          // Ignore malformed admin state in browser storage.
        }
      }

      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        try {
          const fs = require('node:fs');
          const path = require('node:path');
          const stateFile = path.resolve(process.cwd(), 'server', 'runtime', ADMIN_STATE_FILE_NAME);
          if (fs.existsSync(stateFile)) {
            const raw = fs.readFileSync(stateFile, 'utf8');
            if (raw && raw.trim()) {
              candidates.push(JSON.parse(raw));
            }
          }
        } catch (error) {
          // Ignore malformed admin state on disk.
        }
      }

      for (const candidate of candidates) {
        if (isPlainObject(candidate)) {
          return candidate;
        }
      }

      return null;
    },

    loadAdminState() {
      const baseState = this.getDefaultAdminState();
      const persisted = this.readPersistedAdminState();
      const source = persisted && isPlainObject(persisted)
        ? persisted
        : (this.adminState && isPlainObject(this.adminState) ? this.adminState : null);

      if (!source) {
        this.adminState = { ...baseState };
        return this.adminState;
      }

      const state = {
        ...baseState,
        ...source,
        devices: Array.isArray(source.devices) ? source.devices.map((device) => this.normalizeDevice(device)).filter(Boolean) : [],
        licenses: Array.isArray(source.licenses) ? source.licenses.map((license) => this.normalizeLicense(license)).filter(Boolean) : [],
        updates: this.normalizeUpdateState(source.updates || baseState.updates),
        marketplace: {
          ...baseState.marketplace,
          ...(source.marketplace || {}),
          catalog: Array.isArray(source.marketplace && source.marketplace.catalog)
            ? source.marketplace.catalog.map((entry) => this.normalizeMarketplaceEntry(entry)).filter(Boolean)
            : []
        }
      };

      this.adminState = state;
      return state;
    },

    saveAdminState(nextState = null) {
      const state = isPlainObject(nextState) ? nextState : this.loadAdminState();
      const normalized = {
        ...this.getDefaultAdminState(),
        ...state,
        devices: Array.isArray(state.devices) ? state.devices.map((device) => this.normalizeDevice(device)).filter(Boolean) : [],
        licenses: Array.isArray(state.licenses) ? state.licenses.map((license) => this.normalizeLicense(license)).filter(Boolean) : [],
        updates: this.normalizeUpdateState(state.updates || {}),
        marketplace: {
          ...this.getDefaultAdminState().marketplace,
          ...(state.marketplace || {}),
          catalog: Array.isArray(state.marketplace && state.marketplace.catalog)
            ? state.marketplace.catalog.map((entry) => this.normalizeMarketplaceEntry(entry)).filter(Boolean)
            : []
        },
        updatedAt: new Date().toISOString()
      };

      this.adminState = normalized;

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(ADMIN_STATE_STORAGE_KEY, JSON.stringify(normalized));
      }

      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        try {
          const fs = require('node:fs');
          const path = require('node:path');
          const stateDir = path.resolve(process.cwd(), 'server', 'runtime');
          fs.mkdirSync(stateDir, { recursive: true });
          fs.writeFileSync(path.join(stateDir, ADMIN_STATE_FILE_NAME), JSON.stringify(normalized, null, 2));
        } catch (error) {
          // best effort filesystem persistence; runtime state remains available in memory.
        }
      }

      return this.adminState;
    },

    normalizeDevice(device = {}) {
      if (!isPlainObject(device)) {
        return null;
      }

      const now = new Date().toISOString();
      const id = normalizeString(device.id || device.deviceId || device.identifier, '');
      const deviceId = id || `device-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
      return {
        id: deviceId,
        deviceId,
        name: normalizeString(device.name || device.label || device.deviceName, deviceId),
        type: normalizeString(device.type || device.category, 'generic'),
        status: normalizeString(device.status, 'inactive'),
        userId: normalizeString(device.userId || device.assignedUserId, ''),
        userDisplayId: normalizeString(device.userDisplayId || device.assignedDisplayId, ''),
        appId: normalizeString(device.appId || '', ''),
        moduleId: normalizeString(device.moduleId || '', ''),
        lastContactAt: normalizeString(device.lastContactAt || device.lastSeenAt, ''),
        registeredAt: normalizeString(device.registeredAt, now),
        updatedAt: now,
        metadata: isPlainObject(device.metadata) ? { ...device.metadata } : {}
      };
    },

    normalizeLicense(license = {}) {
      if (!isPlainObject(license)) {
        return null;
      }

      const now = new Date().toISOString();
      const licenseId = normalizeString(license.licenseId || license.id, '');
      const normalizedId = licenseId || `license-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
      return {
        id: normalizedId,
        licenseId: normalizedId,
        type: normalizeString(license.type || license.kind, 'standard'),
        status: normalizeString(license.status, 'inactive'),
        validFrom: normalizeString(license.validFrom || license.issuedAt, ''),
        validUntil: normalizeString(license.validUntil || license.expiresAt, ''),
        userId: normalizeString(license.userId || license.assignedUserId, ''),
        deviceId: normalizeString(license.deviceId || license.assignedDeviceId, ''),
        appId: normalizeString(license.appId || '', ''),
        moduleId: normalizeString(license.moduleId || '', ''),
        createdAt: normalizeString(license.createdAt, now),
        updatedAt: now,
        metadata: isPlainObject(license.metadata) ? { ...license.metadata } : {}
      };
    },

    normalizeUpdateState(update = {}) {
      if (!isPlainObject(update)) {
        return this.getDefaultAdminState().updates;
      }

      const currentVersion = normalizeString(update.currentVersion, this.version);
      const availableVersion = normalizeString(update.availableVersion, '');
      const status = normalizeString(update.status, availableVersion && availableVersion !== currentVersion ? 'AVAILABLE' : 'NOT_CONFIGURED').toUpperCase();
      const allowedStatuses = ['NOT_CONFIGURED', 'CHECKING', 'AVAILABLE', 'UP_TO_DATE', 'ERROR', 'UNKNOWN'];

      return {
        currentVersion,
        availableVersion: availableVersion || null,
        status: allowedStatuses.includes(status) ? status : 'UNKNOWN',
        lastCheckedAt: normalizeString(update.lastCheckedAt, null),
        source: normalizeString(update.source, 'local'),
        message: normalizeString(update.message, availableVersion && availableVersion !== currentVersion ? `Update ${availableVersion} available.` : 'Update source not configured.')
      };
    },

    normalizeMarketplaceEntry(entry = {}) {
      if (!isPlainObject(entry)) {
        return null;
      }

      const now = new Date().toISOString();
      const id = normalizeString(entry.id || entry.moduleId || entry.name, '');
      const normalizedId = id || `catalog-${Math.random().toString(16).slice(2, 10)}`;
      return {
        id: normalizedId,
        name: normalizeString(entry.name, normalizedId),
        type: normalizeString(entry.type || (entry.capabilities && entry.capabilities.includes('gps') ? 'module' : ''), 'module'),
        version: normalizeString(entry.version, '1.0.0'),
        status: normalizeString(entry.status, 'available'),
        description: normalizeString(entry.description, ''),
        source: normalizeString(entry.source || entry.modulePath, 'local'),
        appId: normalizeString(entry.appId || '', ''),
        moduleId: normalizeString(entry.moduleId || entry.id || '', ''),
        capabilities: Array.isArray(entry.capabilities) ? [...entry.capabilities] : [],
        permissions: Array.isArray(entry.permissions) ? [...entry.permissions] : [],
        installed: !!entry.installed,
        active: !!entry.active,
        lastSeenAt: normalizeString(entry.lastSeenAt, now),
        actions: Array.isArray(entry.actions) ? [...entry.actions] : ['view'],
        metadata: isPlainObject(entry.metadata) ? { ...entry.metadata } : {}
      };
    },

    listDevices() {
      return Array.from(this.loadAdminState().devices || []).map((device) => ({ ...device, metadata: { ...(device.metadata || {}) } }));
    },

    getDevice(deviceId) {
      const normalized = normalizeString(deviceId, '');
      if (!normalized) {
        return null;
      }

      return this.listDevices().find((device) => device.deviceId === normalized || device.id === normalized) || null;
    },

    upsertDevice(device = {}) {
      const state = this.loadAdminState();
      const normalized = this.normalizeDevice(device);
      if (!normalized) {
        throw new TypeError('Device definition must be an object.');
      }

      const index = state.devices.findIndex((entry) => entry.deviceId === normalized.deviceId);
      if (index >= 0) {
        state.devices[index] = { ...state.devices[index], ...normalized, updatedAt: new Date().toISOString() };
      } else {
        state.devices.push(normalized);
      }

      return this.saveAdminState(state).devices.find((entry) => entry.deviceId === normalized.deviceId);
    },

    removeDevice(deviceId) {
      const state = this.loadAdminState();
      const normalized = normalizeString(deviceId, '');
      const nextDevices = state.devices.filter((entry) => entry.deviceId !== normalized && entry.id !== normalized);
      state.devices = nextDevices;
      this.saveAdminState(state);
      return true;
    },

    listLicenses() {
      return Array.from(this.loadAdminState().licenses || []).map((license) => ({ ...license, metadata: { ...(license.metadata || {}) } }));
    },

    getLicense(licenseId) {
      const normalized = normalizeString(licenseId, '');
      if (!normalized) {
        return null;
      }

      return this.listLicenses().find((license) => license.licenseId === normalized || license.id === normalized) || null;
    },

    upsertLicense(license = {}) {
      const state = this.loadAdminState();
      const normalized = this.normalizeLicense(license);
      if (!normalized) {
        throw new TypeError('License definition must be an object.');
      }

      const index = state.licenses.findIndex((entry) => entry.licenseId === normalized.licenseId);
      if (index >= 0) {
        state.licenses[index] = { ...state.licenses[index], ...normalized, updatedAt: new Date().toISOString() };
      } else {
        state.licenses.push(normalized);
      }

      return this.saveAdminState(state).licenses.find((entry) => entry.licenseId === normalized.licenseId);
    },

    removeLicense(licenseId) {
      const state = this.loadAdminState();
      const normalized = normalizeString(licenseId, '');
      state.licenses = state.licenses.filter((entry) => entry.licenseId !== normalized && entry.id !== normalized);
      this.saveAdminState(state);
      return true;
    },

    getUpdateState() {
      return { ...this.loadAdminState().updates };
    },

    setUpdateState(updateState = {}) {
      const state = this.loadAdminState();
      state.updates = this.normalizeUpdateState({ ...state.updates, ...updateState });
      return this.saveAdminState(state).updates;
    },

    checkForUpdates(payload = {}) {
      const state = this.loadAdminState();
      const currentVersion = normalizeString(payload.currentVersion, state.updates.currentVersion || this.version);
      const availableVersion = normalizeString(
        payload.availableVersion || (typeof process !== 'undefined' && process.env ? process.env.UPDATE_AVAILABLE_VERSION : '') || state.updates.availableVersion || '',
        ''
      );
      const source = normalizeString(payload.source || state.updates.source, 'local');
      const hasUpdate = !!availableVersion && availableVersion !== currentVersion;
      const next = this.normalizeUpdateState({
        ...state.updates,
        currentVersion,
        availableVersion: availableVersion || null,
        status: hasUpdate ? 'AVAILABLE' : 'UP_TO_DATE',
        lastCheckedAt: new Date().toISOString(),
        source,
        message: hasUpdate ? `Update ${availableVersion} available.` : 'No updates available.'
      });
      state.updates = next;
      this.saveAdminState(state);
      return next;
    },

    getMarketplaceState() {
      const state = this.loadAdminState();
      return {
        ...state.marketplace,
        catalog: Array.isArray(state.marketplace.catalog)
          ? state.marketplace.catalog.map((entry) => ({ ...entry, metadata: { ...(entry.metadata || {}) } }))
          : []
      };
    },

    setMarketplaceCatalog(catalog = []) {
      const state = this.loadAdminState();
      state.marketplace = {
        ...state.marketplace,
        catalog: Array.isArray(catalog) ? catalog.map((entry) => this.normalizeMarketplaceEntry(entry)).filter(Boolean) : [],
        lastRefreshedAt: new Date().toISOString(),
        source: 'local'
      };
      return this.saveAdminState(state).marketplace;
    },

    appendMarketplaceEntries(entries = []) {
      const state = this.loadAdminState();
      const current = Array.isArray(state.marketplace.catalog) ? state.marketplace.catalog : [];
      const additional = Array.isArray(entries) ? entries.map((entry) => this.normalizeMarketplaceEntry(entry)).filter(Boolean) : [];
      state.marketplace = {
        ...state.marketplace,
        catalog: [...current, ...additional],
        lastRefreshedAt: new Date().toISOString()
      };
      return this.saveAdminState(state).marketplace;
    },

    getMarketplaceEntries() {
      return this.getMarketplaceState().catalog;
    },

    updateSetupStep(stepName, value) {
      const state = this.loadSetupState();
      const nextState = { ...state, currentStep: stepName, updatedAt: new Date().toISOString() };
      if (Array.isArray(nextState.completedSteps) && !nextState.completedSteps.includes(stepName)) {
        nextState.completedSteps.push(stepName);
      }
      if (value && typeof value === 'object') {
        nextState.configuration = { ...(nextState.configuration || {}), ...value };
      }
      return this.saveSetupState(nextState);
    },

    registerMigration(migration) {
      if (!isPlainObject(migration)) {
        throw new TypeError('Migration must be an object.');
      }
      const entry = {
        id: normalizeString(migration.id, `migration-${this.migrations.length + 1}`),
        version: normalizeString(migration.version, '1.0.0'),
        from: normalizeString(migration.from, '0.0.0'),
        to: normalizeString(migration.to, migration.version || '1.0.0'),
        description: normalizeString(migration.description, ''),
        run: typeof migration.run === 'function' ? migration.run : async () => ({ ok: true })
      };
      this.migrations.push(entry);
      return entry;
    },

    async applyMigrations(currentVersion, steps = []) {
      const version = normalizeString(currentVersion, '0.0.0');
      const pending = Array.isArray(steps) && steps.length > 0 ? steps : this.migrations;

      const results = [];
      for (const entry of pending) {
        const from = normalizeString(entry.from, '0.0.0');
        const target = normalizeString(entry.to, entry.version || from);
        if (from === version || version === '0.0.0' || (version < from && entry.version)) {
          const result = await entry.run({ from, to: target, currentVersion: version });
          results.push({ ...result, id: entry.id, from, to: target });
        }
      }
      return { ok: true, applied: results.length, results };
    },

    getDiagnostics() {
      const connectionStates = Array.from(this.connections.values()).map((connection) => ({
        id: connection.connectionId,
        appId: connection.appId,
        status: connection.status,
        health: connection.health,
        active: !!connection.active
      }));
      const adminState = this.loadAdminState();

      return {
        framework: {
          name: 'neutral-master-framework',
          version: this.version,
          apiVersion: 'v1',
          apps: this.apps.size,
          connections: this.connections.size,
          featureFlags: this.featureFlags.size,
          migrations: this.migrations.length,
          devices: Array.isArray(adminState.devices) ? adminState.devices.length : 0,
          licenses: Array.isArray(adminState.licenses) ? adminState.licenses.length : 0,
          updateStatus: adminState.updates ? adminState.updates.status : 'NOT_CONFIGURED'
        },
        applications: this.listApps().map((app) => ({
          id: app.appId,
          name: app.name,
          version: app.version,
          status: app.status,
          active: app.active
        })),
        connections: connectionStates,
        featureFlags: this.listFeatureFlags(),
        permissions: Array.from(this.permissions.entries()).map(([permission, description]) => ({ permission, description })),
        admin: {
          devices: this.listDevices(),
          licenses: this.listLicenses(),
          updates: this.getUpdateState(),
          marketplace: this.getMarketplaceState()
        },
        setup: this.getSetupSnapshot(),
        timestamp: new Date().toISOString()
      };
    }
  };

  const appRegistry = {
    register: FrameworkRuntime.registerApp.bind(FrameworkRuntime),
    get: FrameworkRuntime.getApp.bind(FrameworkRuntime),
    list: FrameworkRuntime.listApps.bind(FrameworkRuntime),
    activate: FrameworkRuntime.activateApp.bind(FrameworkRuntime),
    deactivate: FrameworkRuntime.deactivateApp.bind(FrameworkRuntime),
    unregister: FrameworkRuntime.unregisterApp.bind(FrameworkRuntime)
  };

  const connectionManager = {
    register: FrameworkRuntime.registerConnection.bind(FrameworkRuntime),
    get: FrameworkRuntime.getConnection.bind(FrameworkRuntime),
    list: FrameworkRuntime.listConnections.bind(FrameworkRuntime),
    update: FrameworkRuntime.updateConnection.bind(FrameworkRuntime),
    setStatus: FrameworkRuntime.setConnectionStatus.bind(FrameworkRuntime),
    test: FrameworkRuntime.testConnection.bind(FrameworkRuntime)
  };

  const featureFlags = {
    set: FrameworkRuntime.setFeatureFlag.bind(FrameworkRuntime),
    get: FrameworkRuntime.getFeatureFlag.bind(FrameworkRuntime),
    list: FrameworkRuntime.listFeatureFlags.bind(FrameworkRuntime)
  };

  FrameworkRuntime.initialize();

  root.MasterFramework = FrameworkRuntime;
  root.AppRegistry = appRegistry;
  root.ConnectionManager = connectionManager;
  root.FeatureFlags = featureFlags;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrameworkRuntime;
  }
})(typeof window !== 'undefined' ? window : globalThis);
