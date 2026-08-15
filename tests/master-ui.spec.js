const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://127.0.0.1:8000';
const DEVELOPER = { username: 'developer', password: 'local-preview-password' };

async function login(page, username, password) {
  await page.fill('#loginUsername', username);
  await page.fill('#loginPassword', password);
  await page.click('#loginBtn');
}

async function loginIntoShell(page, username, password) {
  await login(page, username, password);
  await expect(page.locator('#appShell')).toBeVisible();
  await expect(page.locator('#authPanel')).toHaveClass(/hidden/);
}

async function createUser(page, username) {
  await page.evaluate(async (targetUser) => {
    const result = await window.UserModule.createUser({
      username: targetUser,
      displayName: 'Test User',
      roles: ['user'],
      permissions: []
    });
    if (!result || !result.ok) {
      throw new Error(result && result.message ? result.message : 'create user failed');
    }
  }, username);
}

test.describe('Developer', () => {
  test('index.html is the user app with dashboard, profile, modules and admin/developer links', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(page.locator('body')).toHaveAttribute('data-page', 'user');
    await expect(page.locator('#authPanel')).toBeVisible();
    await expect(page.locator('#appShell')).toHaveClass(/hidden/);

    await loginIntoShell(page, DEVELOPER.username, DEVELOPER.password);

    await expect(page.locator('#currentUserName')).toContainText(/Developer/i);
    await expect(page.locator('#summaryRoleBadge')).toContainText(/developer/i);
    await expect(page.locator('#mainContent')).toContainText('Dashboard');

    await expect(page.locator('#userMenu')).toContainText('Dashboard');
    await expect(page.locator('#userMenu')).toContainText('Profil');
    await expect(page.locator('#userMenu')).toContainText('Module');

    await page.click('#userMenu [data-view="profile"]');
    await expect(page.locator('#mainContent')).toContainText('Profil');

    await page.click('#userMenu [data-view="modules"]');
    await expect(page.locator('#mainContent')).toContainText('Module');

    await expect(page.locator('#adminSection')).toBeVisible();
    await expect(page.locator('#adminMenu')).toContainText('Administration');
    await expect(page.locator('#developerSection')).toBeVisible();
    await expect(page.locator('#developerMenu')).toContainText('Developer');

    await expect(page.locator('#mainContent')).not.toContainText('Core Status');
    await expect(page.locator('#mainContent')).not.toContainText('Console');

    await page.click('#logoutBtn');
    await expect(page.locator('#authPanel')).toBeVisible();
    await expect(page.locator('#appShell')).toHaveClass(/hidden/);
  });

  test('admin link opens admin.html and every admin area renders', async ({ page }) => {
    await page.goto(BASE_URL);
    await loginIntoShell(page, DEVELOPER.username, DEVELOPER.password);

    await page.click('#adminMenu [data-view="admin:link"]');
    await expect(page).toHaveURL(/admin\.html$/);

    await loginIntoShell(page, DEVELOPER.username, DEVELOPER.password);
    await expect(page.locator('body')).toHaveAttribute('data-page', 'admin');
    await expect(page.locator('#mainContent')).toContainText('Administration Dashboard');

    const areas = [
      ['admin:users', 'Users'],
      ['admin:roles', 'Roles'],
      ['admin:permissions', 'Permissions'],
      ['admin:modules', 'Modules'],
      ['admin:audit', 'Audit'],
      ['admin:system', 'Systemstatus'],
      ['admin:dashboard', 'Administration Dashboard']
    ];

    for (const [view, expected] of areas) {
      await page.click(`#userMenu [data-view="${view}"]`);
      await expect(page.locator('#mainContent')).toContainText(expected);
    }

    await page.click('#logoutBtn');
    await expect(page.locator('#authPanel')).toBeVisible();
  });

  test('developer link opens dev.html and every diagnostic area renders', async ({ page }) => {
    await page.goto(BASE_URL);
    await loginIntoShell(page, DEVELOPER.username, DEVELOPER.password);

    await page.click('#developerMenu [data-view="developer:link"]');
    await expect(page).toHaveURL(/dev\.html$/);

    await loginIntoShell(page, DEVELOPER.username, DEVELOPER.password);
    await expect(page.locator('body')).toHaveAttribute('data-page', 'developer');
    await expect(page.locator('#mainContent')).toContainText('Core Status');

    const areas = [
      ['developer:auth', 'Auth Status'],
      ['developer:access', 'Access Status'],
      ['developer:database', 'Database / Storage Status'],
      ['developer:modules', 'Module Status'],
      ['developer:diagnostics', 'Diagnostics'],
      ['developer:console', 'Console'],
      ['developer:audit', 'Audit'],
      ['developer:tests', 'Technische Tests'],
      ['developer:core', 'Core Status']
    ];

    for (const [view, expected] of areas) {
      await page.click(`#userMenu [data-view="${view}"]`);
      await expect(page.locator('#mainContent')).toContainText(expected);
    }

    await page.click('#logoutBtn');
    await expect(page.locator('#authPanel')).toBeVisible();
  });
});

test.describe('Normal user', () => {
  test('sees only the user app and is denied on admin.html and dev.html', async ({ page }) => {
    const username = `testuser-${Date.now()}`;

    await page.goto(BASE_URL);
    await loginIntoShell(page, DEVELOPER.username, DEVELOPER.password);
    await createUser(page, username);
    await page.click('#logoutBtn');

    await loginIntoShell(page, username, '');
    await expect(page.locator('#currentUserName')).toContainText(/Test User|testuser/i);
    await expect(page.locator('#mainContent')).toContainText('Dashboard');
    await expect(page.locator('#userMenu')).toContainText('Profil');
    await expect(page.locator('#userMenu')).toContainText('Module');
    await expect(page.locator('#adminSection')).toHaveClass(/hidden/);
    await expect(page.locator('#developerSection')).toHaveClass(/hidden/);

    await page.goto(`${BASE_URL}/admin.html`);
    await login(page, username, '');
    await expect(page.locator('#accessDenied')).toBeVisible();
    await expect(page.locator('#accessDenied')).toContainText('Zugriff verweigert');
    await expect(page.locator('#appShell')).toHaveClass(/hidden/);

    await page.click('#backToAppLink');
    await expect(page).toHaveURL(/index\.html$/);

    await page.goto(`${BASE_URL}/dev.html`);
    await login(page, username, '');
    await expect(page.locator('#accessDenied')).toBeVisible();
    await expect(page.locator('#accessDenied')).toContainText('Zugriff verweigert');
    await expect(page.locator('#appShell')).toHaveClass(/hidden/);

    await page.goto(BASE_URL);
    await expect(page.locator('#authPanel')).toBeVisible();
    await loginIntoShell(page, username, '');
    await page.click('#logoutBtn');
    await expect(page.locator('#authPanel')).toBeVisible();
  });
});

test('dynamically registered modules appear in the user menu', async ({ page }) => {
  await page.goto(BASE_URL);
  await loginIntoShell(page, DEVELOPER.username, DEVELOPER.password);

  await page.evaluate(() => {
    try {
      window.ModuleRegistry.register({
        id: 'playwright-dynamic-module',
        name: 'Playwright Dynamic Module',
        description: 'Live module from the browser test',
        status: 'enabled',
        active: true,
        permissions: []
      });
    } catch (error) {
      // already registered in a rerun
    }
  });

  const registered = await page.evaluate(() => window.ModuleRegistry.getAll().some((entry) => entry.id === 'playwright-dynamic-module'));
  expect(registered).toBeTruthy();

  await page.click('#userMenu [data-view="modules"]');
  await expect(page.locator('#mainContent')).toContainText('Playwright Dynamic Module');
});
