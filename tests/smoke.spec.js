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
  await expect(page.getByRole('button', { name: 'GPS Tracker' })).toBeVisible();
  await expect(page.locator('.user-module-card')).toContainText('Ready to use');
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.locator('h1')).toHaveText('Your app, kept simple.');
  await page.getByRole('button', { name: 'Modules' }).click();

  await page.getByRole('button', { name: 'GPS Tracker' }).click();
  await expect(page.locator('h1')).toHaveText('GPS');
  await expect(page.locator('#gpsUserStatus')).toContainText(/Ready|Tracking active/);
  await expect(page.locator('.gps-location-card')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start tracking' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Stop tracking' })).toBeVisible();
  await page.getByRole('button', { name: 'Get current position' }).click();
  await expect(page.locator('#gpsPosition')).toContainText('52.52');
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

  try {
    const adminPage = await context.newPage();
    await adminPage.goto('/admin');
    await expect(adminPage.getByRole('heading', { name: 'Platform Administration' })).toBeVisible();
    await expect(adminPage.locator('#authPanel')).toBeVisible();
    await adminPage.getByLabel('Bootstrap password').fill('playwright-admin-password');
    await adminPage.getByRole('button', { name: 'Set password' }).click();
    await adminPage.locator('#loginPassword').fill('playwright-admin-password');
    await adminPage.getByRole('button', { name: 'Sign in' }).click();
    await adminPage.waitForFunction(() => {
      const appShell = document.getElementById('appShell');
      return appShell && !appShell.classList.contains('hidden');
    });
    await expect(adminPage.locator('#appShell')).toBeVisible();
    await expect(adminPage.locator('#connectionManagerCard')).toBeVisible();
    await adminPage.getByLabel('App ID').fill('playwright-app');
    await adminPage.getByLabel('App name').fill('Playwright App');
    await adminPage.getByLabel('Server/API address').fill('https://playwright.example');
    await adminPage.getByLabel('API base path').fill('/api');
    await adminPage.getByLabel('Connection status').selectOption('configured');
    await adminPage.getByLabel('Parameters (JSON)').fill('{"region":"test"}');
    await adminPage.getByRole('button', { name: 'Save connection' }).click();
    await expect(adminPage.locator('#connectionManagerCard')).toContainText('Playwright App');
    await adminPage.locator('[data-connection-delete="playwright-app"]').click();
  } finally {
    await context.close();
  }
});
