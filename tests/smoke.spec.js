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
  await expect(page.getByRole('button', { name: 'GPS Tracker' })).toBeVisible();

  await page.getByRole('button', { name: 'GPS Tracker' }).click();
  await expect(page.locator('h1')).toHaveText('GPS');
  await expect(page.locator('#gpsUserStatus')).toContainText(/Ready|Tracking active/);
  await page.getByRole('button', { name: 'Get current position' }).click();
  await expect(page.locator('#gpsPosition')).toContainText('52.52');
});

test('administrative pages are protected server-side', async ({ request }) => {
  const response = await request.get('/admin.html');
  expect(response.status()).toBe(403);
});
