const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const loadFile = (filePath, context) => {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInNewContext(code, context, { filename: filePath });
};

const root = path.join(__dirname, '..');

const loadCore = () => {
  const context = {
    console,
    process,
    require,
    Buffer,
    URL,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    performance,
    document: {
      readyState: 'complete',
      addEventListener() {},
      removeEventListener() {}
    },
    navigator: {
      userAgent: 'node-test',
      language: 'en-US',
      platform: 'linux',
      onLine: true
    },
    crypto: require('node:crypto').webcrypto,
    addEventListener() {},
    removeEventListener() {}
  };

  context.window = context;
  context.globalThis = context;

  const files = [
    'platform/core.js',
    'platform/core-event-bus.js',
    'platform/core-error-handler.js',
    'platform/error-log.js',
    'platform/core-config.js',
    'platform/core-context.js',
    'platform/core-lifecycle.js',
    'platform/core-state.js',
    'platform/module-interface.js',
    'platform/module-registry.js',
    'platform/module-manager.js',
    'platform/core-loader.js',
    'platform/core-auth.js',
    'platform/core-access.js',
    'platform/core-audit.js',
    'platform/core-event-ring.js',
    'platform/core-user.js',
    'platform/core-admin.js',
    'platform/service-manager.js',
    'platform/config-manager.js',
    'platform/database-manager.js',
    'platform/core-startup.js'
  ];

  for (const file of files) {
    loadFile(path.join(root, file), context);
  }

  return context;
};

test('developer bootstrap seed creates a single protected developer without bypasses', { concurrency: false }, async () => {
  const context = loadCore();

  const configuredUsername = 'bootstrapdev';
  const configuredPassword = process.env.CORE_BOOTSTRAP_PASSWORD || 'bootstrap-password-test';
  if (context.ConfigManager && typeof context.ConfigManager.set === 'function') {
    context.ConfigManager.set('bootstrap', {
      developerUsername: configuredUsername,
      developerDisplayId: 'USR-000001',
      enabled: true,
      passwordRequired: true,
      developerPassword: configuredPassword
    });
  }

  const firstBootstrap = await context.UserModule.bootstrapDeveloperUser();
  assert.equal(firstBootstrap.ok, true);
  assert.equal(firstBootstrap.created, true);
  assert.equal(firstBootstrap.data.username, configuredUsername);
  assert.equal(firstBootstrap.data.displayId, 'USR-000001');
  assert.equal(firstBootstrap.data.protected, true);
  assert.equal(firstBootstrap.data.roles.includes('developer'), true);

  const secondBootstrap = await context.UserModule.bootstrapDeveloperUser();
  assert.equal(secondBootstrap.ok, true);
  assert.equal(secondBootstrap.created, false);
  assert.equal(secondBootstrap.data.username, configuredUsername);

  const developerLogin = await context.UserModule.login({ username: configuredUsername, password: configuredPassword });
  assert.equal(developerLogin.ok, true);
  assert.equal(context.UserModule.getCurrentUser().username, configuredUsername);
  assert.equal(context.UserModule.isDeveloper(), true);
  assert.equal(context.UserModule.isAdmin(), false);

  const developerWrite = context.CoreAccess.can(context.UserModule.getCurrentUser(), 'user:write', 'user');
  assert.equal(developerWrite.ok, true);

  const adminCheck = context.CoreAccess.can(context.UserModule.getCurrentUser(), 'system:view', 'user');
  assert.equal(adminCheck.ok, true);
});

test('user/admin master core core contracts', { concurrency: false }, async () => {
  const context = loadCore();
  await context.UserModule.bootstrapDeveloperUser();

  const userResponse = await context.UserModule.createUser({
    username: 'alice',
    displayName: 'Alice Example',
    roles: ['user'],
    permissions: ['user:read']
  });

  assert.equal(userResponse.ok, true);
  assert.match(userResponse.data.displayId, /^USR-\d{6}$/);
  assert.equal(userResponse.data.username, 'alice');
  assert.equal(userResponse.data.roles.includes('user'), true);

  const lookup = await context.UserModule.getUserById(userResponse.data.id);
  assert.equal(lookup.ok, true);
  assert.equal(lookup.data.username, 'alice');

  const login = await context.UserModule.login({ userId: userResponse.data.id });
  assert.equal(login.ok, true);
  assert.equal(context.UserModule.getCurrentUser().username, 'alice');
  assert.equal(context.CoreAuth.isAuthenticated(), true);

  const access = context.CoreAccess.can(context.UserModule.getCurrentUser(), 'user:read', 'user');
  assert.equal(access.ok, true);

  const denied = context.CoreAccess.can(context.UserModule.getCurrentUser(), 'system:view', 'user');
  assert.equal(denied.ok, false);

  const developerUser = await context.UserModule.getUserByUsername('developer');
  const developerCreate = await context.UserModule.createUser({
    username: 'charlie',
    displayName: 'Charlie Developer',
    roles: ['user'],
    permissions: ['user:read']
  }, developerUser.data.id);
  assert.equal(developerCreate.ok, true);
  assert.equal(developerCreate.data.username, 'charlie');

  const adminResponse = await context.AdminModule.createUser({
    username: 'bob',
    displayName: 'Bob Admin',
    roles: ['admin'],
    permissions: ['user:read', 'user:write', 'system:view']
  }, 'system');
  assert.equal(adminResponse.ok, true);

  const ring = context.CoreEventRing.push('user', { action: 'test' });
  assert.equal(Array.isArray(ring), true);
  assert.ok(ring.length <= 256);

  const health = context.AdminModule.healthCheck();
  assert.equal(health.healthy, true);

  const stats = await context.AdminModule.getSystemStats();
  assert.equal(typeof stats.userCount, 'number');

  const protectedUser = await context.UserModule.createUser({
    username: 'secureuser',
    displayName: 'Secure User',
    roles: ['user'],
    permissions: ['user:read'],
    protected: true
  }, 'system');

  const unauthorizedProtectedUpdate = await context.UserModule.updateUser(
    protectedUser.data.id,
    { displayName: 'Unauthorized change' },
    { id: 'actor-readonly', roles: ['user'], permissions: ['user:read'] }
  );
  assert.equal(unauthorizedProtectedUpdate.ok, false);

  const updateResult = await context.UserModule.updateUser(userResponse.data.id, {
    displayName: 'Alice Updated'
  }, 'system');
  assert.equal(updateResult.ok, true);
  assert.equal(updateResult.data.displayName, 'Alice Updated');

  const deleteResult = await context.UserModule.deleteUser(userResponse.data.id, 'system');
  assert.equal(deleteResult.ok, true);

  const userAfterDelete = await context.UserModule.getUserById(userResponse.data.id);
  assert.equal(userAfterDelete.ok, true);
  assert.equal(userAfterDelete.data.status, 'deleted');

  const authService = context.ServiceManager.get('auth');
  assert.equal(typeof authService.authenticate, 'function');
  assert.equal(typeof authService.logout, 'function');

  context.ModuleRegistry.register({
    id: 'core-user',
    name: 'Core User',
    version: '1.0.0',
    description: 'registered test module',
    dependencies: [],
    permissions: ['user:read'],
    capabilities: ['identity']
  });

  const moduleManagerUpdate = context.ModuleManager.update('core-user');
  assert.ok(moduleManagerUpdate !== null);
});
