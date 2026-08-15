const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const loadFile = (filePath) => {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInNewContext(code, globalThis, { filename: filePath });
};

const root = path.join(__dirname, '..');

const loadCore = () => {
  globalThis.window = globalThis;
  globalThis.window.addEventListener = () => {};
  globalThis.window.removeEventListener = () => {};
  globalThis.document = {
    readyState: 'complete',
    addEventListener() {}
  };
  globalThis.navigator = {
    userAgent: 'node-test',
    language: 'en-US',
    platform: 'linux',
    onLine: true
  };
  globalThis.crypto = require('node:crypto').webcrypto;
  globalThis.console = console;

  const files = [
    'Core/core.js',
    'Core/core-event-bus.js',
    'Core/core-error-handler.js',
    'Core/error-log.js',
    'Core/core-config.js',
    'Core/core-context.js',
    'Core/core-lifecycle.js',
    'Core/core-state.js',
    'Core/module-interface.js',
    'Core/module-registry.js',
    'Core/module-manager.js',
    'Core/core-loader.js',
    'Core/core-auth.js',
    'Core/core-access.js',
    'Core/core-audit.js',
    'Core/core-event-ring.js',
    'Core/core-user.js',
    'Core/core-admin.js',
    'Core/service-manager.js',
    'Core/config-manager.js',
    'Core/database-manager.js',
    'Core/core-startup.js'
  ];

  for (const file of files) {
    loadFile(path.join(root, file));
  }
};

test('user/admin master core core contracts', async () => {
  loadCore();

  const userResponse = await window.UserModule.createUser({
    username: 'alice',
    displayName: 'Alice Example',
    roles: ['member'],
    permissions: ['user:read']
  });

  assert.equal(userResponse.ok, true);
  assert.match(userResponse.data.displayId, /^USR-\d{6}$/);
  assert.equal(userResponse.data.username, 'alice');
  assert.equal(userResponse.data.roles.includes('member'), true);

  const lookup = await window.UserModule.getUserById(userResponse.data.id);
  assert.equal(lookup.ok, true);
  assert.equal(lookup.data.username, 'alice');

  const login = await window.UserModule.login({ userId: userResponse.data.id });
  assert.equal(login.ok, true);
  assert.equal(window.UserModule.getCurrentUser().username, 'alice');
  assert.equal(window.CoreAuth.isAuthenticated(), true);

  const access = window.CoreAccess.can(window.UserModule.getCurrentUser(), 'user:read', 'user');
  assert.equal(access.ok, true);

  const denied = window.CoreAccess.can(window.UserModule.getCurrentUser(), 'system:view', 'user');
  assert.equal(denied.ok, false);

  const adminResponse = await window.AdminModule.createUser({
    username: 'bob',
    displayName: 'Bob Admin',
    roles: ['admin'],
    permissions: ['user:read', 'user:write', 'system:view']
  }, 'system');
  assert.equal(adminResponse.ok, true);

  const ring = window.CoreEventRing.push('user', { action: 'test' });
  assert.equal(Array.isArray(ring), true);
  assert.ok(ring.length <= 256);

  const health = window.AdminModule.healthCheck();
  assert.equal(health.healthy, true);

  const updateResult = await window.UserModule.updateUser(userResponse.data.id, {
    displayName: 'Alice Updated'
  }, 'system');
  assert.equal(updateResult.ok, true);
  assert.equal(updateResult.data.displayName, 'Alice Updated');

  const deleteResult = await window.UserModule.deleteUser(userResponse.data.id, 'system');
  assert.equal(deleteResult.ok, true);

  const userAfterDelete = await window.UserModule.getUserById(userResponse.data.id);
  assert.equal(userAfterDelete.ok, true);
  assert.equal(userAfterDelete.data.status, 'deleted');

  const authService = window.ServiceManager.get('auth');
  assert.equal(typeof authService.authenticate, 'function');
  assert.equal(typeof authService.logout, 'function');

  window.ModuleRegistry.register({
    id: 'core-user',
    name: 'Core User',
    version: '1.0.0',
    description: 'registered test module',
    dependencies: [],
    permissions: ['user:read'],
    capabilities: ['identity']
  });

  const moduleManagerUpdate = window.ModuleManager.update('core-user');
  assert.ok(moduleManagerUpdate !== null);
});
