const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://127.0.0.1:8000';

test('developer shell shows bootstrap user and dynamic menu', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForSelector('[data-shell-root="true"]');

  await page.fill('#loginUsername', 'developer');
  await page.fill('#loginPassword', 'local-preview-password');
  await page.click('#loginBtn');

  await expect(page.locator('[data-user-display-id]').first()).toContainText('USR-000001');
  await expect(page.locator('[data-user-role]').first()).toContainText('developer');
  await expect(page.locator('#userMenu')).toContainText('Dashboard');
  await expect(page.locator('#adminSection')).toContainText('ADMIN');
  await expect(page.locator('#developerSection')).toContainText('DEVELOPER');

  await expect(page.locator('#mainContent')).toContainText('Dashboard');
  await page.click('#userMenu .nav-item >> text=Profil');
  await expect(page.locator('#mainContent')).toContainText('Profil');
  await page.click('#logoutBtnAlt');
  await expect(page.locator('#currentUserName')).toContainText('Not logged in');
});

test('developer can switch to admin and developer views in the main content area', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForSelector('[data-shell-root="true"]');

  await page.fill('#loginUsername', 'developer');
  await page.fill('#loginPassword', 'local-preview-password');
  await page.click('#loginBtn');

  await page.click('#adminMenu .nav-item >> text=Systemstatus');
  await expect(page.locator('#mainContent')).toContainText('Systemstatus');

  await page.click('#developerMenu .nav-item >> text=Console');
  await expect(page.locator('#mainContent')).toContainText('Console');

  await page.click('#userMenu .nav-item >> text=Profil');
  await expect(page.locator('#mainContent')).toContainText('Profil');
});

test('standard user sees limited menu and cannot access admin area', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.waitForSelector('[data-shell-root="true"]');

  const adminUser = 'developer';
  const adminPassword = 'local-preview-password';

  await page.fill('#loginUsername', adminUser);
  await page.fill('#loginPassword', adminPassword);
  await page.click('#loginBtn');

  await page.fill('#newUserUsername', 'normalshelluser');
  await page.selectOption('#newUserRole', 'user');
  await page.click('#createUserBtn');
  await page.click('#logoutBtnAlt');

  await page.fill('#loginUsername', 'normalshelluser');
  await page.fill('#loginPassword', '');
  await page.click('#loginBtn');

  await expect(page.locator('#currentUserName')).toContainText('normalshelluser');
  await expect(page.locator('#userMenu')).toContainText('Dashboard');
  await expect(page.locator('#adminSection')).not.toBeVisible();
  await expect(page.locator('#developerSection')).not.toBeVisible();

  await page.click('#userMenu .nav-item >> text=Profil');
  await expect(page.locator('#mainContent')).toContainText('Profil');
});
