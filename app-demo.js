(() => {
  'use strict';

  const ui = {
    appState: document.getElementById('appState'),
    currentUserView: document.getElementById('currentUserView'),
    userToolsView: document.getElementById('userToolsView'),
    adminView: document.getElementById('adminView'),
    adminActions: document.getElementById('adminActions'),
    auditView: document.getElementById('auditView'),
    loginUsername: document.getElementById('loginUsername'),
    loginPassword: document.getElementById('loginPassword'),
    developerUsername: document.getElementById('developerUsername'),
    developerPassword: document.getElementById('developerPassword')
  };

  const readBootstrapConfig = () => {
    const manager = window.ConfigManager;
    const current = manager && typeof manager.get === 'function' ? manager.get('bootstrap', {}) : {};
    return current && typeof current === 'object' ? current : {};
  };

  const writeBootstrapConfig = (patch) => {
    const manager = window.ConfigManager;
    if (!manager || typeof manager.get !== 'function' || typeof manager.set !== 'function') {
      return null;
    }
    const current = manager.get('bootstrap', {});
    const next = { ...(current || {}), ...patch };
    manager.set('bootstrap', next);
    return next;
  };

  const renderUserState = () => {
    const currentUser = window.UserModule && typeof window.UserModule.getCurrentUser === 'function'
      ? window.UserModule.getCurrentUser()
      : null;

    if (!currentUser) {
      ui.currentUserView.textContent = 'Not logged in.';
      ui.userToolsView.textContent = 'User tools are unavailable until login.';
      ui.appState.textContent = 'logged out';
      ui.appState.style.color = '#fbbf24';
      return;
    }

    ui.currentUserView.textContent = JSON.stringify({
      id: currentUser.id,
      displayId: currentUser.displayId,
      username: currentUser.username,
      roles: currentUser.roles,
      permissions: currentUser.permissions,
      protected: currentUser.protected
    }, null, 2);

    ui.appState.textContent = `logged in as ${currentUser.username}`;
    ui.appState.style.color = '#86efac';

    ui.userToolsView.textContent = JSON.stringify({
      currentUser,
      canReadUser: window.CoreAccess.can(currentUser, 'user:read', 'user').ok,
      canWriteUser: window.CoreAccess.can(currentUser, 'user:write', 'user').ok,
      canViewSystem: window.CoreAccess.can(currentUser, 'system:view', 'user').ok
    }, null, 2);
  };

  const renderAdminState = () => {
    const currentUser = window.UserModule && typeof window.UserModule.getCurrentUser === 'function'
      ? window.UserModule.getCurrentUser()
      : null;

    if (!currentUser) {
      ui.adminView.textContent = 'Admin area is not open.';
      ui.adminActions.classList.add('hidden');
      return;
    }

    const developerAccess = window.CoreAccess && typeof window.CoreAccess.can === 'function'
      ? window.CoreAccess.can(currentUser, 'system:view', 'user')
      : { ok: false };

    if (!developerAccess.ok) {
      ui.adminView.textContent = 'Admin area is blocked by access rules.';
      ui.adminActions.classList.add('hidden');
      return;
    }

    ui.adminView.textContent = JSON.stringify({
      currentUser,
      systemViewAllowed: developerAccess.ok,
      permissions: currentUser.permissions,
      roles: currentUser.roles
    }, null, 2);
    ui.adminActions.classList.remove('hidden');
  };

  const renderAuditState = () => {
    const audit = window.CoreAudit && typeof window.CoreAudit.list === 'function'
      ? window.CoreAudit.list()
      : [];

    ui.auditView.textContent = audit.length === 0
      ? 'No audit entries yet.'
      : JSON.stringify(audit.slice(-8), null, 2);
  };

  const refreshUi = () => {
    renderUserState();
    renderAdminState();
    renderAuditState();
  };

  const boot = async () => {
    if (!window.ConfigManager) {
      ui.appState.textContent = 'config unavailable';
      return;
    }

    window.ConfigManager.init();
    const bootstrapConfig = readBootstrapConfig();
    if (!bootstrapConfig.developerUsername) {
      writeBootstrapConfig({
        enabled: true,
        developerUsername: 'developer',
        developerDisplayId: 'USR-000001',
        passwordRequired: true,
        passwordSource: 'local-config-or-storage',
        developerPassword: ''
      });
    }

    if (window.UserModule && typeof window.UserModule.init === 'function') {
      window.UserModule.init();
      window.UserModule.bootstrapDeveloperUser();
      const devUser = window.UserModule.getUserByUsername('developer');
      if (devUser && devUser.ok && devUser.data) {
        console.info('Bootstrap developer present', devUser.data.displayId, devUser.data.username);
      }
    }

    if (window.CoreRuntime && typeof window.CoreRuntime.start === 'function') {
      await window.CoreRuntime.start();
    }

    const bootstrap = readBootstrapConfig();
    ui.developerUsername.value = bootstrap.developerUsername || 'developer';
    refreshUi();
  };

  document.getElementById('setPasswordBtn').addEventListener('click', () => {
    const password = ui.developerPassword.value.trim();
    const username = ui.developerUsername.value.trim() || 'developer';
    if (!password) {
      alert('Set a local developer password before login.');
      return;
    }

    writeBootstrapConfig({
      enabled: true,
      developerUsername: username,
      developerDisplayId: 'USR-000001',
      passwordRequired: true,
      passwordSource: 'local-config-or-storage',
      developerPassword: password
    });
    if (window.CoreAuth && typeof window.CoreAuth.setDeveloperPassword === 'function') {
      window.CoreAuth.setDeveloperPassword(password);
    }
    alert('Local developer password saved in the browser storage/config.');
  });

  document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = ui.loginUsername.value.trim();
    const password = ui.loginPassword.value.trim();
    if (!username) {
      alert('Username is required.');
      return;
    }

    const result = await window.UserModule.login({ username, password });
    if (!result || !result.ok) {
      alert(result && result.message ? result.message : 'Login failed.');
      return;
    }

    refreshUi();
  });

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (!window.UserModule || typeof window.UserModule.logout !== 'function') {
      return;
    }
    await window.UserModule.logout();
    refreshUi();
  });

  document.getElementById('profileBtn').addEventListener('click', () => {
    const currentUser = window.UserModule && typeof window.UserModule.getCurrentUser === 'function'
      ? window.UserModule.getCurrentUser()
      : null;
    ui.userToolsView.textContent = currentUser
      ? JSON.stringify({ profile: currentUser, session: window.CoreAuth && window.CoreAuth.getCurrentSession ? window.CoreAuth.getCurrentSession() : null }, null, 2)
      : 'No user logged in.';
  });

  document.getElementById('refreshUserBtn').addEventListener('click', () => {
    refreshUi();
  });

  document.getElementById('createUserBtn').addEventListener('click', async () => {
    const username = document.getElementById('newUserUsername').value.trim();
    const role = document.getElementById('newUserRole').value;
    if (!username) {
      alert('Username required.');
      return;
    }

    const result = await window.UserModule.createUser({
      username,
      displayName: username,
      roles: [role],
      permissions: role === 'admin' ? ['user:read', 'user:write', 'system:view'] : ['user:read']
    }, window.UserModule.getCurrentUser()?.id || 'system');

    alert(result && result.ok ? `Created user ${result.data.username}` : `User create failed: ${result && result.message ? result.message : 'unknown error'}`);
    refreshUi();
  });

  boot();
})();
