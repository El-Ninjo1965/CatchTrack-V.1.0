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

  const createStatusSnapshot = (name, value) => ({
    name,
    value,
    status: value ? 'enabled' : 'disabled'
  });

  const FrameworkRuntime = {
    version: '1.0.0',
    apps: new Map(),
    connections: new Map(),
    featureFlags: new Map(),
    permissions: new Map(),
    migrations: [],
    createdAt: new Date().toISOString(),

    initialize() {
      this.setFeatureFlag('new-sync-engine', false);
      this.setFeatureFlag('beta-admin', false);
      this.setFeatureFlag('offline-first', true);
      this.registerPermission('system:view', 'Read system and diagnostics information.');
      this.registerPermission('module:read', 'Read module metadata and status.');
      this.registerPermission('app:read', 'Read app metadata.');
      this.registerPermission('connection:read', 'Read connection metadata.');
      this.registerPermission('connection:write', 'Modify connection metadata.');
      return this;
    },

    normalizeApp(appDefinition) {
      if (!isPlainObject(appDefinition)) {
        throw new TypeError('Application definition must be an object.');
      }

      const appId = normalizeString(appDefinition.appId || appDefinition.id, 'default-app');
      const appName = normalizeString(appDefinition.name, appId);
      const normalized = {
        appId,
        id: appId,
        name: appName,
        version: normalizeString(appDefinition.version, '1.0.0'),
        description: normalizeString(appDefinition.description, ''),
        active: !!appDefinition.active,
        status: normalizeString(appDefinition.status, appDefinition.active ? 'active' : 'inactive'),
        modules: Array.isArray(appDefinition.modules) ? [...appDefinition.modules] : [],
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

      return {
        connectionId,
        id: connectionId,
        appId,
        serverUrl,
        apiBase,
        endpoints: isPlainObject(connectionDefinition.endpoints) ? { ...connectionDefinition.endpoints } : {},
        status: normalizeString(connectionDefinition.status, 'inactive'),
        active: !!connectionDefinition.active,
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
        status: 'not-started',
        currentStep: 'system-check',
        completedSteps: [],
        appId: 'neutral-app',
        appName: 'Neutral App',
        selectedApp: null,
        configuration: {},
        connections: [],
        database: null,
        adminAccount: null,
        license: null,
        installation: {
          active: false,
          installedAt: null,
          activatedAt: null,
          state: 'draft'
        },
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
    },

    getInstallationStatus() {
      const state = this.loadSetupState();
      const installation = state.installation || {};
      const config = state.configuration || {};
      const database = state.database || config.database || null;
      const connections = Array.isArray(state.connections) ? state.connections.length : 0;

      if (installation.active === true || state.status === 'active') {
        return 'ACTIVE';
      }
      if (state.status === 'ready' || state.status === 'READY') {
        return 'READY';
      }
      if (state.status === 'testing' || state.currentStep === 'connection-test' || state.currentStep === 'database-test') {
        return 'TESTING';
      }
      if (state.status === 'in-progress' || state.status === 'CONFIGURATION_REQUIRED' || state.currentStep === 'configuration') {
        return 'CONFIGURATION_REQUIRED';
      }
      if (database || connections > 0 || config.serverUrl || config.appId) {
        return 'READY_TO_TEST';
      }
      return 'NOT_CONFIGURED';
    },

    loadSetupState() {
      const baseState = this.getDefaultSetupState();
      if (this.setupState && isPlainObject(this.setupState)) {
        return { ...baseState, ...this.setupState, installation: { ...baseState.installation, ...(this.setupState.installation || {}) } };
      }
      this.setupState = { ...baseState };
      return this.setupState;
    },

    saveSetupState(nextState = null) {
      const state = isPlainObject(nextState) ? nextState : this.loadSetupState();
      const normalized = {
        ...this.getDefaultSetupState(),
        ...state,
        installation: {
          ...this.getDefaultSetupState().installation,
          ...(state.installation || {})
        },
        updatedAt: new Date().toISOString()
      };
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

      return {
        framework: {
          name: 'neutral-master-framework',
          version: this.version,
          apps: this.apps.size,
          connections: this.connections.size,
          featureFlags: this.featureFlags.size,
          migrations: this.migrations.length
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
