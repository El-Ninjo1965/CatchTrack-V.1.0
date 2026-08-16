const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

module.exports = {
  port: Number(process.env.PORT || 3000),
  host: process.env.HOST || '127.0.0.1',
  rootDir,
  webRootDir: path.join(rootDir, 'webroot'),
  apiBase: '/api'
};
