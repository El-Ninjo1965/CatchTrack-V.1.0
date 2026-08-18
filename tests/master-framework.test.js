const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const Framework = require('../platform/master-framework');
const ServerBootstrap = require('../server/bootstrap/server');

const cleanupRuntimeState = () => {
  Framework.setupState = null;
  Framework.adminState = null;

  const runtimeDir = path.resolve(__dirname, '../server/runtime');
  for (const filename of ['setup-state.json', 'admin-state.json']) {
    const filePath = path.join(runtimeDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

test('registers and activates apps', () => {
  cleanupRuntimeState();
  const runtime = Framework;
  runtime.apps.clear();

  const app = runtime.registerApp({
    appId: 'weather',
    name: 'Weather App',
    version: '1.0.0',
    active: false,
    modules: ['gps'],
    config: { mode: 'local' }
  });

  assert.equal(app.appId, 'weather');
  assert.equal(runtime.getApp('weather').name, 'Weather App');
  runtime.activateApp('weather');
  assert.equal(runtime.getApp('weather').status, 'active');
});

test('registers and tests connections', async () => {
  cleanupRuntimeState();
  const runtime = Framework;
  runtime.connections.clear();

  runtime.registerConnection({
    connectionId: 'weather-api',
    appId: 'weather',
    serverUrl: 'https://example.com',
    apiBase: '/api',
    status: 'inactive',
    active: false,
    authType: 'none'
  });

  const connection = runtime.getConnection('weather-api');
  assert.equal(connection.appId, 'weather');

  await runtime.testConnection('weather-api', async () => ({ ok: true, status: 'healthy', checkedAt: '2026-01-01T00:00:00.000Z' }));
  assert.equal(runtime.getConnection('weather-api').status, 'healthy');
});

test('supports feature flags, permissions, and migrations', async () => {
  cleanupRuntimeState();
  const runtime = Framework;

  runtime.setFeatureFlag('new-sync-engine', true);
  assert.equal(runtime.getFeatureFlag('new-sync-engine'), true);

  const permissionResult = runtime.checkPermission({ id: 'u1', roles: ['admin'] }, 'system:view');
  assert.equal(permissionResult.ok, true);

  runtime.migrations = [];
  runtime.registerMigration({
    id: 'v1-to-v2',
    version: '2.0.0',
    from: '1.0.0',
    to: '2.0.0',
    run: async ({ from, to }) => ({ ok: true, from, to })
  });

  const result = await runtime.applyMigrations('1.0.0', runtime.migrations);
  assert.equal(result.ok, true);
  assert.equal(result.applied, 1);
});

test('supports persisted setup state and connection updates', () => {
  cleanupRuntimeState();
  const runtime = Framework;

  const initial = runtime.loadSetupState();
  assert.equal(initial.status, 'NOT_CONFIGURED');

  const saved = runtime.saveSetupState({
    currentStep: 'connection-config',
    appId: 'weather',
    configuration: { defaultRegion: 'de' }
  });

  assert.equal(saved.currentStep, 'connection-config');
  assert.equal(saved.configuration.defaultRegion, 'de');
  assert.equal(saved.status, 'CONFIGURATION_REQUIRED');

  const connection = runtime.registerConnection({
    connectionId: 'weather-api',
    appId: 'weather',
    serverUrl: 'https://weather.example.com',
    apiBase: '/weather-api',
    authType: 'token',
    status: 'inactive',
    active: false
  });

  assert.equal(connection.serverUrl, 'https://weather.example.com');
  const updated = runtime.updateConnection('weather-api', { status: 'active', active: true });
  assert.equal(updated.status, 'active');
});

test('provides diagnostic summary', () => {
  cleanupRuntimeState();
  const runtime = Framework;
  const diagnostics = runtime.getDiagnostics();
  assert.ok(diagnostics.framework);
  assert.ok(Array.isArray(diagnostics.connections));
  assert.ok(Array.isArray(diagnostics.applications));
});

test('supports admin devices, licenses, updates, and marketplace state', () => {
  cleanupRuntimeState();
  const runtime = Framework;

  const device = runtime.upsertDevice({
    deviceId: 'device-1',
    name: 'Scanner',
    type: 'scanner',
    status: 'active',
    userId: 'user-1',
    lastContactAt: '2026-08-18T00:00:00.000Z'
  });
  assert.equal(device.deviceId, 'device-1');
  assert.equal(runtime.getDevice('device-1').status, 'active');

  const license = runtime.upsertLicense({
    licenseId: 'license-1',
    type: 'trial',
    status: 'active',
    validUntil: '2027-01-01',
    userId: 'user-1'
  });
  assert.equal(license.licenseId, 'license-1');
  assert.equal(runtime.getLicense('license-1').type, 'trial');

  const updateState = runtime.checkForUpdates({
    currentVersion: '1.0.0',
    availableVersion: '1.1.0',
    source: 'local'
  });
  assert.equal(updateState.status, 'AVAILABLE');
  assert.equal(runtime.getUpdateState().availableVersion, '1.1.0');

  runtime.setMarketplaceCatalog([
    {
      id: 'gps',
      name: 'GPS Tracker',
      type: 'module',
      version: '1.0.0',
      status: 'available',
      source: 'local'
    }
  ]);
  assert.equal(runtime.getMarketplaceEntries().length, 1);
});

test('supports setup, database, and activation flow', async () => {
  cleanupRuntimeState();
  const runtime = Framework;
  runtime.setupState = null;

  const app = ServerBootstrap.createServer();

  const requestJson = (port, method, pathname, payload = null) => new Promise((resolve, reject) => {
    const body = payload ? JSON.stringify(payload) : '';
    const req = http.request({
      host: '127.0.0.1',
      port,
      path: pathname,
      method,
      headers: body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {}
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: data ? JSON.parse(data) : {} });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });

  const requestText = (port, method, pathname) => new Promise((resolve, reject) => {
    const req = http.request({
      host: '127.0.0.1',
      port,
      path: pathname,
      method
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });

    req.on('error', reject);
    req.end();
  });

  await new Promise((resolve) => app.listen(0, '127.0.0.1', resolve));
  const port = app.address().port;

  try {
    const initial = await requestJson(port, 'GET', '/api/setup/status');
    assert.equal(initial.body.status, 'NOT_CONFIGURED');

    const configured = await requestJson(port, 'POST', '/api/setup', {
      configuration: {
        serverUrl: `http://127.0.0.1:${port}`,
        apiBase: '/api',
        database: {
          type: 'indexeddb',
          name: 'CoreDB'
        }
      },
      bootstrapState: {
        configured: true,
        username: 'developer',
        displayId: 'USR-000001',
        role: 'developer'
      }
    });
    assert.equal(configured.body.status, 'CONFIGURATION_REQUIRED');

    const serverTest = await requestJson(port, 'POST', '/api/server/test', {
      serverUrl: `http://127.0.0.1:${port}`,
      apiBase: '/api'
    });
    assert.equal(serverTest.body.ok, true);

    const databaseTest = await requestJson(port, 'POST', '/api/database/test', {
      type: 'indexeddb',
      name: 'CoreDB'
    });
    assert.equal(databaseTest.body.ok, true);
    assert.equal(databaseTest.body.status, 'READY');

    const activated = await requestJson(port, 'POST', '/api/setup/activate', {
      currentStep: 'runtime'
    });
    assert.equal(activated.body.ok, true);
    assert.equal(activated.body.status, 'ACTIVE');

    const runtimeAfterActivation = await requestText(port, 'GET', '/');
    assert.equal(runtimeAfterActivation.statusCode, 200);
    assert.match(runtimeAfterActivation.body, /<!DOCTYPE html>/);
  } finally {
    await new Promise((resolve) => app.close(resolve));
  }
});
