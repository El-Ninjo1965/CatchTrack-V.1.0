const { test, expect } = require('@playwright/test');

test('neutral platform web shell loads', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Neutral Platform|Platform/i);
  await expect(page.locator('h2').first()).toContainText(/Neutral Platform|Platform/i);
  await expect(page.locator('link[rel="stylesheet"]').first()).toHaveAttribute('href', /style\.css/i);
});
