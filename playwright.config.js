const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  timeout: 30000,
  fullyParallel: false,
  webServer: {
    command: 'python3 -m http.server 8000',
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
