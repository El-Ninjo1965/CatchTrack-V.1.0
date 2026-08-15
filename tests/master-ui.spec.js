const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://127.0.0.1:8000';
const DEVELOPER = { username: 'developer', password: 'playwright-developer-password' };

async function setDeveloperPassword(page, password) {
  await page.evaluate((value) => {
    localStorage.setItem('core.bootstrap.developerPassword', value);
    if (window.ConfigManager && typeof window.ConfigManager.get === 'function') {
      const current = window.ConfigManager.get('bootstrap', {}) || {};
      window.ConfigManager.set('bootstrap', {
        ...current,
        developerPassword: value,
        passwordRequired: true,
        passwordSource: 'browser-test'
      });
    }
  }, password);
}

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
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await setDeveloperPassword(page, DEVELOPER.password);
    await page.reload();
  });

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
    await expect(page.locator('#authPanel')).toHaveClass(/hidden/);
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
    await expect(page.locator('#authPanel')).toHaveClass(/hidden/);
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
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await setDeveloperPassword(page, DEVELOPER.password);
    await page.reload();
  });

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
    await expect(page.locator('#accessDenied')).toBeVisible();
    await expect(page.locator('#accessDenied')).toContainText('Zugriff verweigert');
    await expect(page.locator('#appShell')).toHaveClass(/hidden/);

    await page.click('#backToAppLink');
    await expect(page).toHaveURL(/index\.html$/);

    await page.goto(`${BASE_URL}/dev.html`);
    await expect(page.locator('#accessDenied')).toBeVisible();
    await expect(page.locator('#accessDenied')).toContainText('Zugriff verweigert');
    await expect(page.locator('#appShell')).toHaveClass(/hidden/);

    await page.goto(BASE_URL);
    await expect(page.locator('#appShell')).not.toHaveClass(/hidden/);
    await expect(page.locator('#mainContent')).toContainText('Dashboard');
    await page.click('#logoutBtn');
    await expect(page.locator('#authPanel')).toBeVisible();
  });
});

test('session persists across user, admin and developer surfaces without a second login', async ({ page }) => {
  await page.goto(BASE_URL);
  await setDeveloperPassword(page, DEVELOPER.password);
  await page.reload();
  await loginIntoShell(page, DEVELOPER.username, DEVELOPER.password);

  await page.goto(`${BASE_URL}/admin.html`);
  await expect(page.locator('#authPanel')).toHaveClass(/hidden/);
  await expect(page.locator('body')).toHaveAttribute('data-page', 'admin');
  await expect(page.locator('#mainContent')).toContainText('Administration Dashboard');

  await page.goto(`${BASE_URL}/dev.html`);
  await expect(page.locator('#authPanel')).toHaveClass(/hidden/);
  await expect(page.locator('body')).toHaveAttribute('data-page', 'developer');
  await expect(page.locator('#mainContent')).toContainText('Core Status');

  await page.goto(BASE_URL);
  await page.click('#logoutBtn');
  await expect(page.locator('#authPanel')).toBeVisible();
});

test('admin can create users and assign roles through the management UI', async ({ page }) => {
  await page.goto(BASE_URL);
  await setDeveloperPassword(page, DEVELOPER.password);
  await page.reload();
  await loginIntoShell(page, DEVELOPER.username, DEVELOPER.password);

  await page.click('#adminMenu [data-view="admin:link"]');
  await expect(page).toHaveURL(/admin\.html$/);

  await page.click('#userMenu [data-view="admin:users"]');
  await expect(page.locator('#adminUserForm')).toBeVisible();

  const username = `ui-user-${Date.now()}`;
  await page.fill('#adminUserUsername', username);
  await page.fill('#adminUserDisplayName', 'UI Test User');
  await page.selectOption('#adminUserStatus', 'active');
  await page.selectOption('#adminUserRoles', 'user');
  await page.click('#adminUserSubmit');

  await expect(page.locator('#mainContent')).toContainText(username);
  await expect(page.locator('#mainContent')).toContainText('UI Test User');

  await page.selectOption('#adminUserRoleFilter', 'user');
  await expect(page.locator('#adminUserTable')).toContainText(username);
});

test('admin roles and permissions pages show the core role model', async ({ page }) => {
  await page.goto(BASE_URL);
  await setDeveloperPassword(page, DEVELOPER.password);
  await page.reload();
  await loginIntoShell(page, DEVELOPER.username, DEVELOPER.password);

  await page.click('#adminMenu [data-view="admin:link"]');
  await expect(page).toHaveURL(/admin\.html$/);

  await page.click('#userMenu [data-view="admin:roles"]');
  await expect(page.locator('#adminRoleList')).toContainText('admin');
  await expect(page.locator('#adminRoleList')).toContainText('developer');
  await expect(page.locator('#adminRoleList')).toContainText('user');

  await page.click('#userMenu [data-view="admin:permissions"]');
  await expect(page.locator('#adminPermissionList')).toContainText('user:read');
  await expect(page.locator('#adminPermissionList')).toContainText('system:view');
});

test('dynamically registered modules appear in the user menu', async ({ page }) => {
  await page.goto(BASE_URL);
  await setDeveloperPassword(page, DEVELOPER.password);
  await page.reload();
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
