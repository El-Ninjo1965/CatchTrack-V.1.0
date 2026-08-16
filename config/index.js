'use strict';

module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  host: process.env.HOST || '127.0.0.1',
  platformPath: 'platform',
  appPath: 'app',
  webrootPath: 'webroot',
  testsPath: 'tests'
};
