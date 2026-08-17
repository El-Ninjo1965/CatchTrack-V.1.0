const path = require('node:path');

const rootDir = path.resolve(__dirname, '../..');

module.exports = {
  port: Number(process.env.PORT || 3000),
  host: process.env.HOST || '0.0.0.0',
  rootDir,
  platformPath: path.join(rootDir, 'platform'),
  appPath: path.join(rootDir, 'app'),
  webRootDir: path.join(rootDir, 'webroot'),
  testsPath: path.join(rootDir, 'tests'),
  apiBase: '/api',
  connectionStorePath: process.env.CONNECTION_STORE_PATH || path.join(rootDir, 'server', 'state', 'connections.json'),
  appRegistryPath: process.env.APP_REGISTRY_PATH || path.join(rootDir, 'server', 'state', 'apps.json')
};
