const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  timeout: 30000,
  fullyParallel: false,
  webServer: {
    command: 'ADMIN_ACCESS_TOKEN=playwright-admin CONNECTION_STORE_PATH=/tmp/neutral-connections.json PORT=8000 node server/server.js',
    url: 'http://127.0.0.1:8000',
    reuseExistingServer: true,
    timeout: 15000
  },
  use: {
    baseURL: 'http://127.0.0.1:8000',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'off'
  }
});
