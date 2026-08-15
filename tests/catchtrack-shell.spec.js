const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://127.0.0.1:8000';

async function loginAs(page, username, password) {
  await page.fill('#loginUsername', username);
  await page.fill('#loginPassword', password);
  await page.click('#loginBtn');

  await expect(page.locator('#appShell')).toBeVisible();
  await expect(page.locator('#authPanel')).toHaveClass(/hidden/);
}

test('index.html is the user app and developer login unlocks the master shell', async ({ page }) => {
  await page.goto(BASE_URL);

  await expect(page.locator('body')).toHaveAttribute('data-page', 'user');
  await expect(page.locator('#authPanel')).toBeVisible();
  await expect(page.locator('#appShell')).toHaveClass(/hidden/);

  await loginAs(page, 'developer', 'local-preview-password');

  await expect(page.locator('#currentUserName')).toContainText(/Developer|Developer User/i);
  await expect(page.locator('#summaryRoleBadge')).toContainText(/developer/i);
  await expect(page.locator('#adminSection')).toBeVisible();
  await expect(page.locator('#adminSection')).toContainText(/Admin/i);
  await expect(page.locator('#developerSection')).toBeVisible();
  await expect(page.locator('#developerSection')).toContainText(/Developer/i);
  await expect(page.locator('#userMenu')).toContainText('Dashboard');
  await expect(page.locator('#userMenu')).toContainText('Profil');
  await expect(page.locator('#mainContent')).toContainText('Dashboard');

  await page.click('#userMenu [data-view="profile"]');
  await expect(page.locator('#mainContent')).toContainText('Profile');

  await page.click('#logoutBtnAlt');
  await expect(page.locator('#authPanel')).toBeVisible();
  await expect(page.locator('#currentUserName')).toContainText('Not logged in');
});

test('developer can open the admin app and the developer app directly', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin.html`);
  await loginAs(page, 'developer', 'local-preview-password');

  await expect(page.locator('body')).toHaveAttribute('data-page', 'admin');
  await expect(page.locator('#appShell')).toBeVisible();
  await expect(page.locator('#summaryRoleBadge')).toContainText(/developer/i);
  await expect(page.locator('#mainContent')).toContainText('Select an admin view.');

  await page.goto(`${BASE_URL}/dev.html`);
  await loginAs(page, 'developer', 'local-preview-password');

  await expect(page.locator('body')).toHaveAttribute('data-page', 'developer');
  await expect(page.locator('#appShell')).toBeVisible();
  await expect(page.locator('#mainContent')).toContainText('Select a developer view.');
});

test('normal user sees no admin or developer access and direct route access is denied without permission', async ({ page }) => {
  const username = `shelluser-${Date.now()}`;

  await page.goto(BASE_URL);
  await loginAs(page, 'developer', 'local-preview-password');

  await page.evaluate(async (targetUser) => {
    const result = await window.UserModule.createUser({
      username: targetUser,
      displayName: 'Shell User',
      roles: ['user'],
      permissions: []
    });
    if (!result || !result.ok) {
      throw new Error(result && result.message ? result.message : 'create user failed');
    }
  }, username);

  await page.click('#logoutBtnAlt');
  await page.fill('#loginUsername', username);
  await page.fill('#loginPassword', '');
  await page.click('#loginBtn');

  await expect(page.locator('#currentUserName')).toContainText(/Shell User|shelluser/i);
  await expect(page.locator('#adminSection')).toHaveClass(/hidden/);
  await expect(page.locator('#developerSection')).toHaveClass(/hidden/);
  await expect(page.locator('#userMenu')).toContainText('Dashboard');
  await expect(page.locator('#userMenu')).not.toContainText('Systemstatus');

  await page.goto(`${BASE_URL}/admin.html`);
  await page.fill('#loginUsername', username);
  await page.fill('#loginPassword', '');
  await page.click('#loginBtn');
  await expect(page.locator('#mainContent')).toContainText(/Access denied|Administrator rights required/i);

  await page.goto(`${BASE_URL}/dev.html`);
  await page.fill('#loginUsername', username);
  await page.fill('#loginPassword', '');
  await page.click('#loginBtn');
  await expect(page.locator('#mainContent')).toContainText(/Developer access denied/i);
});

test('dashboard and dynamic module behavior work in the current master UI', async ({ page }) => {
  await page.goto(BASE_URL);
  await loginAs(page, 'developer', 'local-preview-password');

  await expect(page.locator('#mainContent')).toContainText('Dashboard');
  await expect(page.locator('#summaryRoleBadge')).toContainText(/developer/i);

  const dynamicRegistered = await page.evaluate(() => {
    const module = {
      id: 'playwright-dynamic-module',
      name: 'Playwright Dynamic Module',
      description: 'Live module from the browser test',
      status: 'enabled',
      active: true,
      permissions: []
    };

    try {
      window.ModuleRegistry.register(module);
    } catch (error) {
      // Ignore duplicates in reruns.
    }

    return window.ModuleRegistry.getAll().some((entry) => entry.id === 'playwright-dynamic-module');
  });

  expect(dynamicRegistered).toBeTruthy();

  await page.click('#userMenu [data-view="profile"]');
  await expect(page.locator('#mainContent')).toContainText('Profile');

  await page.click('#logoutBtnAlt');
  await expect(page.locator('#authPanel')).toBeVisible();
  await expect(page.locator('#currentUserName')).toContainText('Not logged in');
});
