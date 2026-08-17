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
      appId: 'future-app',
      appName: 'Future App',
      serverUrl: 'https://example.org',
      apiBasePath: '/future/api',
      connectionStatus: 'configured',
      parameters: { region: 'eu' }
    })
  );
  const updatedConnections = cookieHeader ? await requestJson(port, '/api/connections', { cookie: cookieHeader }) : { statusCode: 0, body: {} };
  const removedConnection = cookieHeader
    ? await requestRaw(port, '/api/connections/future-app', { cookie: cookieHeader }, 'DELETE')
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
  assert.ok(updatedConnections.body.connections.some((connection) => connection.appId === 'future-app'));
  assert.equal(removedConnection.statusCode, 200);
  assert.ok(!cleanedConnections.body.connections.some((connection) => connection.appId === 'future-app'));

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
  assert.equal(createdConnection.statusCode, 201);
  assert.equal(scopedConnections.statusCode, 200);
  assert.equal(scopedConnections.body.connections.length, 1);
  assert.equal(scopedConnections.body.connections[0].appId, 'future-app');
  assert.equal(crossAppLookup.statusCode, 404);
  assert.equal(globalConnections.statusCode, 200);
  assert.equal(globalConnections.body.connections.length, 1);

  await new Promise((resolve, reject) => {
    serverInstance.close((error) => (error ? reject(error) : resolve()));
  });

  fs.rmSync(tempRoot, { recursive: true, force: true });
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
