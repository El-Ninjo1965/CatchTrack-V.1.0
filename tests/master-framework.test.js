const test = require('node:test');
const assert = require('node:assert/strict');

const Framework = require('../platform/master-framework');

test('registers and activates apps', () => {
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
  const runtime = Framework;

  const initial = runtime.loadSetupState();
  assert.equal(initial.status, 'not-started');

  const saved = runtime.saveSetupState({
    status: 'in-progress',
    currentStep: 'connection-config',
    appId: 'weather',
    configuration: { defaultRegion: 'de' }
  });

  assert.equal(saved.currentStep, 'connection-config');
  assert.equal(saved.configuration.defaultRegion, 'de');

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
  const runtime = Framework;
  const diagnostics = runtime.getDiagnostics();
  assert.ok(diagnostics.framework);
  assert.ok(Array.isArray(diagnostics.connections));
  assert.ok(Array.isArray(diagnostics.applications));
});
