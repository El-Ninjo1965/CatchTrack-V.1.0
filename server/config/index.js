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
  connectionStorePath: path.join(rootDir, 'server', 'state', 'connections.json')
};
