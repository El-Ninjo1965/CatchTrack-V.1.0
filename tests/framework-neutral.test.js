const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const selfFile = path.join(root, 'tests', 'framework-neutral.test.js');
const staleTerms = /CatchTrack|catchtrack|Catch Track|catch track|MASTER\s+FROZEN|WORKFLOW[_ -]?USER(?:[_ -]?ADMIN)?|MASTER[-_ ]?MEGA/i;

const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const loadVmFile = (filePath, context) => {
  const source = fs.readFileSync(filePath, 'utf8');
  vm.runInNewContext(source, context, { filename: filePath });
};

const loadPlatformContext = () => {
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
    navigator: {
      userAgent: 'node-test',
      language: 'en-US',
      platform: 'linux',
      onLine: true
    },
    document: {
      readyState: 'complete',
      addEventListener() {},
      removeEventListener() {}
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
    'platform/connection-manager.js',
    'platform/database-manager.js',
    'platform/core-startup.js'
  ];

  for (const file of files) {
    loadVmFile(path.join(root, file), context);
  }

  return context;
};

const walkProjectFiles = (baseDirs) => {
  const files = [];

  for (const baseDir of baseDirs) {
    const dirPath = path.join(root, baseDir);
    if (!fs.existsSync(dirPath)) continue;

    const stack = [dirPath];
    while (stack.length > 0) {
      const current = stack.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const fullPath = path.join(current, entry.name);
        if (entry.isDirectory()) {
          if (['.git', 'node_modules'].includes(entry.name)) continue;
          stack.push(fullPath);
          continue;
        }
        if (fullPath === selfFile) continue;
        files.push(fullPath);
      }
    }
  }

  return files;
};

const requestJson = (port, pathname, headers = {}) => new Promise((resolve, reject) => {
  const req = http.get({ hostname: '127.0.0.1', port, path: pathname, headers }, (res) => {
    let raw = '';
    res.on('data', (chunk) => { raw += chunk; });
    res.on('end', () => {
      try {
        resolve({ statusCode: res.statusCode, body: raw ? JSON.parse(raw) : {} });
      } catch (error) {
        reject(error);
      }
    });
  });

  req.on('error', reject);
});

const requestText = (port, pathname, headers = {}) => new Promise((resolve, reject) => {
  const req = http.get({ hostname: '127.0.0.1', port, path: pathname, headers }, (res) => {
    let raw = '';
    res.on('data', (chunk) => { raw += chunk; });
    res.on('end', () => {
      resolve({ statusCode: res.statusCode, body: raw });
    });
  });

  req.on('error', reject);
});

const requestRaw = (port, pathname, headers = {}, method = 'GET', body = null) => new Promise((resolve, reject) => {
  const req = http.request({
    hostname: '127.0.0.1',
    port,
    path: pathname,
    method,
    headers
  }, (res) => {
    let raw = '';
    res.on('data', (chunk) => { raw += chunk; });
    res.on('end', () => {
      resolve({ statusCode: res.statusCode, headers: res.headers, body: raw });
    });
  });

  req.on('error', reject);
  if (body !== null && typeof body !== 'undefined') {
    req.write(body);
  }
  req.end();
});

test('platform initializes without old app logic', () => {
  const context = loadPlatformContext();

  assert.equal(typeof context.Core, 'object');
  assert.equal(context.Core.version, '1.0.0');
  assert.equal(typeof context.Core.init, 'function');
  assert.equal(typeof context.CoreStartup.start, 'function');
  assert.equal(typeof context.ConfigManager.get, 'function');
  assert.equal(typeof context.ModuleRegistry.getAll, 'function');
  assert.equal(context.Core.state.initialized, true);
});

test('server exposes neutral health endpoints', async () => {
  const server = require(path.join(root, 'server', 'server.js'));
  const serverInstance = server;

  await new Promise((resolve, reject) => {
    serverInstance.listen(0, '127.0.0.1', () => resolve());
    serverInstance.once('error', reject);
  });

  const port = serverInstance.address().port;
  const health = await requestJson(port, '/health');
  const apiHealth = await requestJson(port, '/api/health');

  assert.equal(health.statusCode, 200);
  assert.equal(health.body.ok, true);
  assert.equal(health.body.service, 'neutral-platform');
  assert.equal(apiHealth.statusCode, 200);
  assert.equal(apiHealth.body.ok, true);
  assert.equal(apiHealth.body.status, 'healthy');

  await new Promise((resolve, reject) => {
    serverInstance.close((error) => (error ? reject(error) : resolve()));
  });
});


test('framework remains available without external modules', async () => {
  const context = loadPlatformContext();
  const emptyModulesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'neutral-modules-'));
  const { createServer } = require(path.join(root, 'server', 'server.js'));
  const serverInstance = createServer({ modulesDir: emptyModulesDir });

  try {
    const discovered = await context.CoreLoader.discoverExternalModules(emptyModulesDir);
    assert.equal(discovered.length, 0);
    assert.equal(typeof context.ModuleRegistry.getAll, 'function');

    await new Promise((resolve, reject) => {
      serverInstance.listen(0, '127.0.0.1', resolve);
      serverInstance.once('error', reject);
    });

    const port = serverInstance.address().port;
    const modules = await requestJson(port, '/api/modules');
    const missingAsset = await requestText(port, '/app/modules/gps/index.js');
    assert.deepEqual(modules.body.modules, []);
    assert.equal(missingAsset.statusCode, 404);
  } finally {
    if (serverInstance.listening) {
      await new Promise((resolve, reject) => serverInstance.close((error) => error ? reject(error) : resolve()));
    }
    fs.rmSync(emptyModulesDir, { recursive: true, force: true });
  }
});

test('generic module lifecycle is isolated and complete', () => {
  const context = loadPlatformContext();
  const module = context.ModuleInterface.create({
    id: 'sample-module',
    globalName: 'SampleModule',
    permissions: [],
    capabilities: ['sample']
  });

  context.ModuleManager.register(module);
  context.ModuleManager.install(module.id);
  context.ModuleManager.initialize(module.id);
  context.ModuleManager.enable(module.id);
  assert.equal(context.ModuleManager.getStatus(module.id), 'enabled');
  assert.equal(context.ModuleManager.disable(module.id), true);
  assert.equal(context.ModuleManager.getStatus(module.id), 'disabled');
  assert.throws(() => context.ModuleManager.register(module), /already registered/);
  assert.equal(context.ModuleManager.uninstall(module.id), true);
  assert.equal(context.ModuleManager.get(module.id), null);
  assert.equal(context.ModuleManager.disable('missing-module'), false);
  assert.equal(context.ModuleInterface.validateManifest({}), null);
});

test('server exposes neutral module catalog and module assets', async () => {
  const server = require(path.join(root, 'server', 'server.js'));
  const serverInstance = server;

  await new Promise((resolve, reject) => {
    serverInstance.listen(0, '127.0.0.1', () => resolve());
    serverInstance.once('error', reject);
  });

  const port = serverInstance.address().port;
  const modules = await requestJson(port, '/api/modules');
  const gpsManifest = await requestJson(port, '/app/modules/gps/module.json');
  const gpsScript = await requestText(port, '/app/modules/gps/index.js');
  const traversalAttempt = await requestText(port, '/app/modules/..%2f..%2fplatform/core.js');
  const adminAttempt = await requestJson(port, '/admin');
  const developerAttempt = await requestJson(port, '/developer');

  assert.equal(modules.statusCode, 200);
  assert.equal(modules.body.ok, true);
  assert.ok(Array.isArray(modules.body.modules));
  assert.ok(modules.body.modules.some((module) => module.id === 'gps'));

  assert.equal(gpsManifest.statusCode, 200);
  assert.equal(gpsManifest.body.id, 'gps');
  assert.equal(gpsScript.statusCode, 200);
  assert.match(gpsScript.body, /window\.GpsModule/);
  assert.equal(traversalAttempt.statusCode, 404);
  assert.equal(adminAttempt.statusCode, 401);
  assert.equal(developerAttempt.statusCode, 401);

  await new Promise((resolve, reject) => {
    serverInstance.close((error) => (error ? reject(error) : resolve()));
  });
});

test('server grants protected technical routes with the configured token', async () => {
  const { createServer } = require(path.join(root, 'server', 'server.js'));
  const tempStoreDir = fs.mkdtempSync(path.join(os.tmpdir(), 'neutral-connections-'));
  const connectionStorePath = path.join(tempStoreDir, 'connections.json');
  const serverInstance = createServer({ adminAccessToken: 'unit-admin-token', connectionStorePath });

  await new Promise((resolve, reject) => {
    serverInstance.listen(0, '127.0.0.1', () => resolve());
    serverInstance.once('error', reject);
  });

  const port = serverInstance.address().port;
  const denied = await requestJson(port, '/admin');
  const allowedAdmin = await requestRaw(port, '/admin', { 'x-admin-access-token': 'unit-admin-token' });
  const allowedDeveloper = await requestRaw(port, '/developer', { 'x-admin-access-token': 'unit-admin-token' });
  const cookie = Array.isArray(allowedAdmin.headers['set-cookie']) ? allowedAdmin.headers['set-cookie'][0] : '';
  const cookieHeader = cookie ? cookie.split(';')[0] : '';
  const protectedConnections = await requestJson(port, '/api/connections', cookieHeader ? { cookie: cookieHeader } : {});
  const createdConnection = await requestRaw(
    port,
    '/api/connections',
    cookieHeader
      ? { cookie: cookieHeader, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' },
    'POST',
    JSON.stringify({
      appId: 'primary-web-app',
      appName: 'Primary Web App',
      serverUrl: 'https://example.org',
      apiBasePath: '/future/api',
      connectionStatus: 'configured',
      parameters: { region: 'eu' }
    })
  );
  const updatedConnections = cookieHeader ? await requestJson(port, '/api/connections', { cookie: cookieHeader }) : { statusCode: 0, body: {} };
  const removedConnection = cookieHeader
    ? await requestRaw(port, '/api/connections/primary-web-app', { cookie: cookieHeader }, 'DELETE')
    : { statusCode: 0 };
  const cleanedConnections = cookieHeader ? await requestJson(port, '/api/connections', { cookie: cookieHeader }) : { statusCode: 0, body: {} };

  assert.equal(denied.statusCode, 403);
  assert.equal(allowedAdmin.statusCode, 200);
  assert.match(allowedAdmin.body, /Platform Administration/i);
  assert.ok(cookieHeader, 'Expected protected admin route to set an auth cookie.');
  assert.equal(allowedDeveloper.statusCode, 200);
  assert.match(allowedDeveloper.body, /Platform Diagnostics/i);
  assert.equal(protectedConnections.statusCode, 200);
  assert.ok(Array.isArray(protectedConnections.body.connections));
  assert.equal(createdConnection.statusCode, 201);
  assert.equal(updatedConnections.statusCode, 200);
  assert.ok(updatedConnections.body.connections.some((connection) => connection.appId === 'primary-web-app'));
  assert.equal(removedConnection.statusCode, 200);
  assert.ok(!cleanedConnections.body.connections.some((connection) => connection.appId === 'primary-web-app'));

  await new Promise((resolve, reject) => {
    serverInstance.close((error) => (error ? reject(error) : resolve()));
  });

  fs.rmSync(tempStoreDir, { recursive: true, force: true });
});

test('server resolves app context and keeps app-scoped connections isolated', async () => {
  const { createServer } = require(path.join(root, 'server', 'server.js'));
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'neutral-apps-'));
  const futureWebRoot = path.join(tempRoot, 'future-webroot');
  const futureDataRoot = path.join(tempRoot, 'future-data');
  fs.mkdirSync(futureWebRoot, { recursive: true });
  fs.mkdirSync(futureDataRoot, { recursive: true });
  fs.writeFileSync(path.join(futureWebRoot, 'index.html'), '<!doctype html><html><head><title>Future App</title></head><body><h1>Future App</h1></body></html>');

  const appRegistryPath = path.join(tempRoot, 'apps.json');
  fs.writeFileSync(appRegistryPath, JSON.stringify({
    schemaVersion: 1,
    apps: [
      {
        appId: 'primary-web-app',
        appName: 'Primary Web App',
        mountPath: '/',
        webRootDir: 'webroot',
        dataRootDir: 'server/state/apps/primary-web-app',
        apiBasePath: '/api',
        connectionScope: 'primary-web-app',
        active: true,
        metadata: {}
      },
      {
        appId: 'future-app',
        appName: 'Future App',
        mountPath: '/future',
        webRootDir: futureWebRoot,
        dataRootDir: futureDataRoot,
        apiBasePath: '/api',
        connectionScope: 'future-app',
        active: true,
        metadata: {}
      }
    ]
  }, null, 2));

  const connectionStorePath = path.join(tempRoot, 'connections.json');
  const serverInstance = createServer({
    adminAccessToken: 'unit-admin-token',
    connectionStorePath,
    appRegistryPath
  });

  await new Promise((resolve, reject) => {
    serverInstance.listen(0, '127.0.0.1', () => resolve());
    serverInstance.once('error', reject);
  });

  const port = serverInstance.address().port;
  const appContext = await requestJson(port, '/future/api/app-context');
  const futureIndex = await requestText(port, '/future/');
  const denied = await requestJson(port, '/future/api/connections');
  const rootCreate = await requestRaw(
    port,
    '/api/connections',
    { 'x-admin-access-token': 'unit-admin-token', 'Content-Type': 'application/json' },
    'POST',
    JSON.stringify({
      appId: 'primary-web-app',
      appName: 'Primary Web App',
      serverUrl: 'https://root.example',
      apiBasePath: '/api',
      connectionStatus: 'configured',
      parameters: { tier: 'root' }
    })
  );
  const createdConnection = await requestRaw(
    port,
    '/future/api/connections',
    { 'x-admin-access-token': 'unit-admin-token', 'Content-Type': 'application/json' },
    'POST',
    JSON.stringify({
      appId: 'ignored-app',
      appName: 'Future App',
      serverUrl: 'https://future.example',
      apiBasePath: '/api',
      connectionStatus: 'configured',
      parameters: { tier: 'future' }
    })
  );
  const scopedConnections = await requestJson(port, '/future/api/connections', { 'x-admin-access-token': 'unit-admin-token' });
  const crossAppLookup = await requestJson(port, '/future/api/connections/primary-web-app', { 'x-admin-access-token': 'unit-admin-token' });
  const globalConnections = await requestJson(port, '/api/connections', { 'x-admin-access-token': 'unit-admin-token' });

  assert.equal(appContext.statusCode, 200);
  assert.equal(appContext.body.app.appId, 'future-app');
  assert.equal(futureIndex.statusCode, 200);
  assert.match(futureIndex.body, /Future App/);
  assert.equal(denied.statusCode, 403);
  assert.equal(rootCreate.statusCode, 201);
  assert.equal(createdConnection.statusCode, 201);
  assert.equal(scopedConnections.statusCode, 200);
  assert.equal(scopedConnections.body.connections.length, 1);
  assert.equal(scopedConnections.body.connections[0].appId, 'future-app');
  assert.equal(crossAppLookup.statusCode, 404);
  assert.equal(globalConnections.statusCode, 200);
  assert.equal(globalConnections.body.connections.length, 1);
  assert.equal(globalConnections.body.connections[0].appId, 'primary-web-app');

  await new Promise((resolve, reject) => {
    serverInstance.close((error) => (error ? reject(error) : resolve()));
  });

  fs.rmSync(tempRoot, { recursive: true, force: true });
});

test('app registry rejects duplicate ids, duplicate mounts, and invalid entries', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'neutral-registry-'));
  const rootWebRoot = path.join(tempRoot, 'webroot');
  const demoWebRoot = path.join(tempRoot, 'apps', 'demo2', 'webroot');
  const catchtrackWebRoot = path.join(tempRoot, 'apps', 'catchtrack', 'webroot');
  const zukunftWebRoot = path.join(tempRoot, 'apps', 'zukunft', 'webroot');
  fs.mkdirSync(rootWebRoot, { recursive: true });
  fs.mkdirSync(demoWebRoot, { recursive: true });
  fs.mkdirSync(catchtrackWebRoot, { recursive: true });
  fs.mkdirSync(zukunftWebRoot, { recursive: true });

  const writeRegistry = (apps) => {
    const registryPath = path.join(tempRoot, 'apps.json');
    fs.writeFileSync(registryPath, JSON.stringify({ schemaVersion: 1, apps }, null, 2));
    return registryPath;
  };

  const validRegistry = writeRegistry([
    {
      appId: 'primary-web-app',
      appName: 'Primary Web App',
      mountPath: '/',
      webRootDir: 'webroot',
      dataRootDir: 'server/state/apps/primary-web-app',
      apiBasePath: '/api',
      connectionScope: 'primary-web-app',
      active: true,
      metadata: {}
    },
    {
      appId: 'demo2',
      appName: 'Demo 2',
      mountPath: '/demo2',
      webRootDir: 'apps/demo2/webroot',
      dataRootDir: 'server/state/apps/demo2',
      apiBasePath: '/api',
      connectionScope: 'demo2',
      active: true,
      metadata: {}
    },
    {
      appId: 'catchtrack',
      appName: 'CatchTrack',
      mountPath: '/catchtrack',
      webRootDir: 'apps/catchtrack/webroot',
      dataRootDir: 'server/state/apps/catchtrack',
      apiBasePath: '/api',
      connectionScope: 'catchtrack',
      active: true,
      metadata: {}
    },
    {
      appId: 'zukunft',
      appName: 'Zukunft',
      mountPath: '/zukunft',
      webRootDir: 'apps/zukunft/webroot',
      dataRootDir: 'server/state/apps/zukunft',
      apiBasePath: '/api',
      connectionScope: 'zukunft',
      active: true,
      metadata: {}
    }
  ]);

  const registry = require(path.join(root, 'server', 'services', 'app-registry.js'));
  const loadedRegistry = registry.createAppRegistryService(validRegistry, { rootDir: tempRoot });
  assert.equal(loadedRegistry.getApp('demo2').mountPath, '/demo2');
  assert.equal(loadedRegistry.resolveRequest('/catchtrack/settings').app.appId, 'catchtrack');
  assert.equal(loadedRegistry.resolveRequest('/zukunft/').app.appId, 'zukunft');

  assert.throws(() => {
    writeRegistry([
      { appId: 'demo2', mountPath: '/demo2', webRootDir: 'webroot' },
      { appId: 'demo2', mountPath: '/demo3', webRootDir: 'webroot' }
    ]);
    registry.createAppRegistryService(path.join(tempRoot, 'apps.json'), { rootDir: tempRoot });
  }, /duplicate appId/i);

  assert.throws(() => {
    writeRegistry([
      { appId: 'demo-a', mountPath: '/demo2', webRootDir: 'webroot' },
      { appId: 'demo-b', mountPath: '/demo2', webRootDir: 'apps/demo2/webroot' }
    ]);
    registry.createAppRegistryService(path.join(tempRoot, 'apps.json'), { rootDir: tempRoot });
  }, /duplicate mountPath/i);

  assert.throws(() => {
    writeRegistry([
      { appId: '', mountPath: '/demo-invalid', webRootDir: 'webroot' }
    ]);
    registry.createAppRegistryService(path.join(tempRoot, 'apps.json'), { rootDir: tempRoot });
  }, /missing appId|invalid/i);

  assert.throws(() => {
    writeRegistry([
      { appId: 'invalid-root', mountPath: '', webRootDir: 'webroot' }
    ]);
    registry.createAppRegistryService(path.join(tempRoot, 'apps.json'), { rootDir: tempRoot });
  }, /missing mountPath|invalid/i);

  assert.throws(() => {
    writeRegistry([
      { appId: 'invalid-webroot', mountPath: '/invalid', webRootDir: 'missing/path' }
    ]);
    registry.createAppRegistryService(path.join(tempRoot, 'apps.json'), { rootDir: tempRoot });
  }, /webRootDir/i);

  fs.rmSync(tempRoot, { recursive: true, force: true });
});

test('connection service rejects unknown apps and cross-app access', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'neutral-connections-'));
  const rootWebRoot = path.join(tempRoot, 'webroot');
  const demoWebRoot = path.join(tempRoot, 'apps', 'demo2', 'webroot');
  fs.mkdirSync(rootWebRoot, { recursive: true });
  fs.mkdirSync(demoWebRoot, { recursive: true });

  const appRegistryPath = path.join(tempRoot, 'apps.json');
  fs.writeFileSync(appRegistryPath, JSON.stringify({
    schemaVersion: 1,
    apps: [
      {
        appId: 'primary-web-app',
        appName: 'Primary Web App',
        mountPath: '/',
        webRootDir: 'webroot',
        dataRootDir: 'server/state/apps/primary-web-app',
        apiBasePath: '/api',
        connectionScope: 'primary-web-app',
        active: true,
        metadata: {}
      },
      {
        appId: 'demo2',
        appName: 'Demo 2',
        mountPath: '/demo2',
        webRootDir: 'apps/demo2/webroot',
        dataRootDir: 'server/state/apps/demo2',
        apiBasePath: '/api',
        connectionScope: 'demo2',
        active: true,
        metadata: {}
      }
    ]
  }, null, 2));

  const appRegistry = require(path.join(root, 'server', 'services', 'app-registry.js'));
  const connectionServiceModule = require(path.join(root, 'server', 'services', 'connection-service.js'));
  const registry = appRegistry.createAppRegistryService(appRegistryPath, { rootDir: tempRoot });
  const connectionService = connectionServiceModule.createConnectionService(path.join(tempRoot, 'connections.json'), { appRegistry: registry });

  const validRoot = connectionService.upsertConnection({
    appId: 'primary-web-app',
    appName: 'Primary Web App',
    serverUrl: 'https://root.example',
    apiBasePath: '/api',
    connectionStatus: 'configured',
    parameters: { area: 'root' }
  }, 'primary-web-app');
  assert.equal(validRoot.ok, true);

  const wrongScope = connectionService.upsertConnection({
    appId: 'demo2',
    appName: 'Demo 2',
    serverUrl: 'https://demo2.example',
    apiBasePath: '/api',
    connectionStatus: 'configured',
    parameters: { area: 'demo2' }
  }, 'primary-web-app');
  assert.equal(wrongScope.ok, false);
  assert.equal(wrongScope.code, 'ACCESS_DENIED');

  const unknownApp = connectionService.upsertConnection({
    appId: 'ghost-app',
    appName: 'Ghost App',
    serverUrl: 'https://ghost.example',
    apiBasePath: '/api',
    connectionStatus: 'configured',
    parameters: { area: 'ghost' }
  }, 'ghost-app');
  assert.equal(unknownApp.ok, false);
  assert.equal(unknownApp.code, 'APP_NOT_REGISTERED');

  const rootConnections = connectionService.listConnections('primary-web-app');
  assert.equal(rootConnections.length, 1);
  assert.equal(rootConnections[0].appId, 'primary-web-app');

  const crossAppLookup = connectionService.getConnection(validRoot.data.id, 'demo2');
  assert.equal(crossAppLookup, null);

  fs.rmSync(tempRoot, { recursive: true, force: true });
});

test('server separates root and demo2 connections', async () => {
  const { createServer } = require(path.join(root, 'server', 'server.js'));
  const tempStoreDir = fs.mkdtempSync(path.join(os.tmpdir(), 'neutral-app-connections-'));
  const connectionStorePath = path.join(tempStoreDir, 'connections.json');
  const serverInstance = createServer({
    adminAccessToken: 'unit-admin-token',
    connectionStorePath
  });

  await new Promise((resolve, reject) => {
    serverInstance.listen(0, '127.0.0.1', () => resolve());
    serverInstance.once('error', reject);
  });

  const port = serverInstance.address().port;
  const rootCreate = await requestRaw(
    port,
    '/api/connections',
    { 'x-admin-access-token': 'unit-admin-token', 'Content-Type': 'application/json' },
    'POST',
    JSON.stringify({
      appId: 'primary-web-app',
      appName: 'Primary Web App',
      serverUrl: 'https://root.example',
      apiBasePath: '/api',
      connectionStatus: 'configured',
      parameters: { area: 'root' }
    })
  );
  const demoCreate = await requestRaw(
    port,
    '/demo2/api/connections',
    { 'x-admin-access-token': 'unit-admin-token', 'Content-Type': 'application/json' },
    'POST',
    JSON.stringify({
      appId: 'demo2',
      appName: 'Demo 2',
      serverUrl: 'https://demo2.example',
      apiBasePath: '/api',
      connectionStatus: 'configured',
      parameters: { area: 'demo2' }
    })
  );
  const rootConnections = await requestJson(port, '/api/connections', { 'x-admin-access-token': 'unit-admin-token' });
  const demoConnections = await requestJson(port, '/demo2/api/connections', { 'x-admin-access-token': 'unit-admin-token' });
  const rootLookupInDemo = await requestJson(port, '/demo2/api/connections/root-app', { 'x-admin-access-token': 'unit-admin-token' });
  const demoLookupInRoot = await requestJson(port, '/api/connections/demo2', { 'x-admin-access-token': 'unit-admin-token' });
  const rootAppContext = await requestJson(port, '/api/app-context', { 'x-admin-access-token': 'unit-admin-token' });
  const demoAppContext = await requestJson(port, '/demo2/api/app-context', { 'x-admin-access-token': 'unit-admin-token' });
  const unknownRoute = await requestJson(port, '/no-such-app/');

  assert.equal(rootCreate.statusCode, 201);
  assert.equal(demoCreate.statusCode, 201);
  assert.equal(rootConnections.statusCode, 200);
  assert.equal(rootConnections.body.connections.length, 1);
  assert.equal(rootConnections.body.connections[0].appId, 'primary-web-app');
  assert.equal(demoConnections.statusCode, 200);
  assert.equal(demoConnections.body.connections.length, 1);
  assert.equal(demoConnections.body.connections[0].appId, 'demo2');
  assert.equal(rootLookupInDemo.statusCode, 404);
  assert.equal(demoLookupInRoot.statusCode, 404);
  assert.equal(rootAppContext.statusCode, 200);
  assert.equal(rootAppContext.body.app.appId, 'primary-web-app');
  assert.equal(demoAppContext.statusCode, 200);
  assert.equal(demoAppContext.body.app.appId, 'demo2');
  assert.equal(unknownRoute.statusCode, 404);

  await new Promise((resolve, reject) => {
    serverInstance.close((error) => (error ? reject(error) : resolve()));
  });

  fs.rmSync(tempStoreDir, { recursive: true, force: true });
});

test('webroot assets are present and reference real files', () => {
  const pages = ['index.html', 'admin.html', 'dev.html'];
  const expected = ['webroot/style.css', 'webroot/master-ui.js'];

  for (const page of pages) {
    const filePath = path.join(root, 'webroot', page);
    assert.ok(fs.existsSync(filePath), `Missing webroot page: ${page}`);

    const html = readText(path.join('webroot', page));
    const refs = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map((match) => match[1]);

    for (const ref of refs) {
      if (ref.startsWith('http') || ref.startsWith('#') || ref.startsWith('mailto:')) continue;
      const target = path.join(root, 'webroot', ref.replace(/^\.\//, ''));
      assert.ok(fs.existsSync(target), `Broken asset reference in ${page}: ${ref}`);
    }
  }

  for (const file of expected) {
    assert.ok(fs.existsSync(path.join(root, file)), `Missing expected asset: ${file}`);
  }
});

test('design layer is separated and app-aware', async () => {
  const { createServer } = require(path.join(root, 'server', 'server.js'));
  const serverInstance = createServer({ adminAccessToken: 'unit-admin-token' });

  await new Promise((resolve, reject) => {
    serverInstance.listen(0, '127.0.0.1', () => resolve());
    serverInstance.once('error', reject);
  });

  const port = serverInstance.address().port;
  const rootDesign = await requestText(port, '/design/neutral.css');
  const rootContext = await requestJson(port, '/api/app-context', { 'x-admin-access-token': 'unit-admin-token' });
  const demoContext = await requestJson(port, '/demo2/api/app-context', { 'x-admin-access-token': 'unit-admin-token' });

  assert.equal(rootDesign.statusCode, 200);
  assert.match(rootDesign.body, /--bg|background/i);
  assert.equal(rootContext.statusCode, 200);
  assert.equal(rootContext.body.app.design, 'neutral');
  assert.equal(demoContext.statusCode, 200);
  assert.equal(demoContext.body.app.design, 'demo2-neutral');
  assert.match(demoContext.body.app.designPath, /apps\/demo2\/design\/neutral\.css/i);

  await new Promise((resolve, reject) => {
    serverInstance.close((error) => (error ? reject(error) : resolve()));
  });
});

test('workflow documents the neutral structure without stale directions', () => {
  const workflow = readText('WORKFLOW.md');

  assert.match(workflow, /platform\//i);
  assert.match(workflow, /server\//i);
  assert.match(workflow, /webroot\//i);
  assert.match(workflow, /tests\//i);
  assert.match(workflow, /config\//i);
  assert.doesNotMatch(workflow, staleTerms);
});

test('neutral project scan rejects stale app-specific terms but ignores the validator itself', () => {
  const candidates = walkProjectFiles(['platform', 'server', 'app', 'config']);

  for (const filePath of candidates) {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.doesNotMatch(content, staleTerms, `Stale project term found in ${path.relative(root, filePath)}`);
  }

  const selfContent = fs.readFileSync(selfFile, 'utf8');
  assert.match(selfContent, /CatchTrack|catchtrack|MASTER\s+FROZEN|WORKFLOW[_ -]?USER(?:[_ -]?ADMIN)?|MASTER[-_ ]?MEGA/i);
});
