'use strict';

const packageJson = require('../../package.json');

const getHealthStatus = () => ({
  ok: true,
  service: 'neutral-platform',
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: packageJson.version || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  uptime: Math.round(process.uptime())
});

const getRuntimeStatus = () => ({
  ok: true,
  environment: process.env.NODE_ENV || 'development',
  server: 'neutral-platform',
  runtime: {
    platform: process.platform,
    arch: process.arch,
    uptime: Math.round(process.uptime())
  }
});

module.exports = {
  getHealthStatus,
  getRuntimeStatus
};
