const { test, expect } = require('@playwright/test');

test('neutral platform web shell loads and registers the gps module', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Neutral Platform|Platform/i);
  await expect(page.locator('h2').first()).toContainText(/Neutral Platform|Platform/i);
  await expect(page.locator('link[rel="stylesheet"]').first()).toHaveAttribute('href', /style\.css/i);
  await page.waitForFunction(() => window.GpsModule && window.ModuleRegistry && typeof window.ModuleRegistry.has === 'function' && window.ModuleRegistry.has('gps'));

  const gpsState = await page.evaluate(() => ({
    hasGpsModule: !!window.GpsModule,
    registryHasGps: window.ModuleRegistry.has('gps'),
    gpsStatus: window.ModuleRegistry.get('gps') && typeof window.ModuleRegistry.get('gps').getStatus === 'function'
      ? window.ModuleRegistry.get('gps').getStatus()
      : null,
    appVersion: window.App && window.App.version
  }));

  expect(gpsState.hasGpsModule).toBe(true);
  expect(gpsState.registryHasGps).toBe(true);
  expect(gpsState.appVersion).toBe('1.0.0');
});
