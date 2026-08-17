const { test, expect } = require('@playwright/test');

test('user app opens directly and renders the active gps module', async ({ page }) => {
  await page.context().grantPermissions(['geolocation'], { origin: 'http://127.0.0.1:8000' });
  await page.context().setGeolocation({ latitude: 52.52, longitude: 13.405 });
  await page.goto('/');

  await expect(page).toHaveTitle('CatchTrack');
  await expect(page.locator('.user-app-brand')).toHaveText('CatchTrack');
  await expect(page.getByRole('button', { name: 'Modules' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
  await expect(page.locator('text=Framework Status')).toHaveCount(0);
  await expect(page.locator('text=Developer')).toHaveCount(0);
  await expect(page.locator('[data-view="admin:dashboard"]')).toHaveCount(0);
  await expect(page.locator('[data-view="developer:core"]')).toHaveCount(0);
  const gpsState = await page.evaluate(async () => {
    const module = window.GpsModule || null;
    const registry = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
      ? window.ModuleRegistry.getAll().map((entry) => entry.id)
      : [];
    const position = module && typeof module.getCurrentPosition === 'function'
      ? await module.getCurrentPosition()
      : null;
    return {
      hasModule: !!module,
      registry,
      position
    };
  });
  expect(gpsState.hasModule).toBe(true);
  expect(gpsState.registry).toContain('gps');
  expect(gpsState.position).toBeTruthy();
  expect(gpsState.position).toMatchObject({
    lat: 52.52,
    lng: 13.405
  });
});

test('demo2 app opens as a separate neutral instance', async ({ page, request }) => {
  await page.goto('/demo2/');

  await expect(page).toHaveTitle('Demo 2');
  await expect(page.getByRole('heading', { name: 'Demo 2' })).toBeVisible();
  await expect(page.locator('text=separate neutral app instance')).toBeVisible();
  await expect(page.locator('#demo2AppId')).toHaveText('demo2');
  await expect(page.locator('#demo2MountPath')).toHaveText('/demo2');

  const contextResponse = await request.get('/demo2/api/app-context');
  expect(contextResponse.status()).toBe(200);
  await expect(page.locator('text=App ID:')).toBeVisible();
});

test('administrative pages are protected server-side', async ({ request }) => {
  const response = await request.get('/admin');
  expect(response.status()).toBe(403);
});

test('administrative pages load with the server token', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:8000',
    extraHTTPHeaders: {
      'x-admin-access-token': 'playwright-admin'
    }
  });

  const adminPage = await context.newPage();
  await adminPage.goto('/admin');
  await expect(adminPage.getByRole('heading', { name: 'Platform Administration' })).toBeVisible();
  await expect(adminPage.locator('#authPanel')).toBeVisible();
});
