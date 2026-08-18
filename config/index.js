'use strict';

module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  host: process.env.HOST || '127.0.0.1',
  platformPath: 'platform',
  appPath: 'app',
  webrootPath: 'webroot',
  testsPath: 'tests',
  defaultAppId: process.env.DEFAULT_APP_ID || 'neutral-app',
  featureFlags: {
    'offline-first': true,
    'new-sync-engine': false,
    'beta-admin': false
  },
  runtime: {
    source: 'config',
    environment: process.env.NODE_ENV || 'development',
    mode: 'neutral-framework'
  },
  secrets: {
    adminAccessToken: process.env.ADMIN_ACCESS_TOKEN || '',
    bootstrapPassword: process.env.CORE_BOOTSTRAP_PASSWORD || ''
  },
  storage: {
    namespace: 'core:'
  }
};
