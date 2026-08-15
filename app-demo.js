(() => {
  'use strict';

  const elements = {
    appState: document.getElementById('appState'),
    appShell: document.getElementById('appShell'),
    authPanel: document.getElementById('authPanel'),
    currentUserName: document.getElementById('currentUserName'),
    currentUserInitial: document.getElementById('currentUserInitial'),
    summaryUsername: document.getElementById('summaryUsername'),
    summaryStatus: document.getElementById('summaryStatus'),
    summaryRoleBadge: document.getElementById('summaryRoleBadge'),
    bootstrapUserStats: document.getElementById('bootstrapUserStats'),
    userMenu: document.getElementById('userMenu'),
    adminSection: document.getElementById('adminSection'),
    adminMenu: document.getElementById('adminMenu'),
    developerSection: document.getElementById('developerSection'),
    developerMenu: document.getElementById('developerMenu'),
    activeModules: document.getElementById('activeModules'),
    systemStatus: document.getElementById('systemStatus'),
    consoleLog: document.getElementById('consoleLog'),
    adminView: document.getElementById('adminView'),
    adminPanel: document.getElementById('adminPanel'),
    adminActions: document.getElementById('adminActions'),
    developerPanel: document.getElementById('developerPanel'),
    permissionView: document.getElementById('permissionView'),
    auditView: document.getElementById('auditView'),
    loginUsername: document.getElementById('loginUsername'),
    loginPassword: document.getElementById('loginPassword'),
    developerUsername: document.getElementById('developerUsername'),
    developerPassword: document.getElementById('developerPassword')
  };

  const statusMeta = {
    core: { label: 'Core', key: 'core' },
    auth: { label: 'Auth', key: 'auth' },
    access: { label: 'Access', key: 'access' },
    database: { label: 'Storage/Database', key: 'database' },
    services: { label: 'Services', key: 'services' },
    user: { label: 'User Module', key: 'user' },
    admin: { label: 'Admin Module', key: 'admin' },
    modules: { label: 'ModuleManager', key: 'modules' },
    eventbus: { label: 'EventBus', key: 'eventbus' },
    audit: { label: 'Audit', key: 'audit' }
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

  const setConsole = (message) => {
    const entry = typeof message === 'string' ? message : JSON.stringify(message, null, 2);
    const next = `${new Date().toLocaleTimeString()} ${entry}\n${elements.consoleLog.textContent || ''}`;
    elements.consoleLog.textContent = next.slice(0, 4000);
  };

  const getCurrentUser = () => {
    return window.UserModule && typeof window.UserModule.getCurrentUser === 'function'
      ? window.UserModule.getCurrentUser()
      : null;
  };

  const getVisibleModules = () => {
    const registry = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
      ? window.ModuleRegistry.getAll()
      : [];
    const currentUser = getCurrentUser();

    return registry
      .filter((module) => {
        if (!module || !module.id) return false;
        const active = module.active === true || module.status === 'enabled' || module.status === 'active';
        if (!active) return false;
        if (!currentUser) return false;
        const required = Array.isArray(module.permissions) && module.permissions.length > 0
          ? module.permissions
          : Array.isArray(module.manifest && module.manifest.permissions) ? module.manifest.permissions : [];
        if (required.length === 0) return true;
        return required.some((permission) => {
          const allowed = window.CoreAccess && typeof window.CoreAccess.hasPermission === 'function'
            ? window.CoreAccess.hasPermission(currentUser, permission)
            : Array.isArray(currentUser.permissions) && currentUser.permissions.includes(permission);
          return allowed;
        });
      })
      .map((module) => ({
        id: module.id,
        name: module.name || module.id,
        status: module.status || (module.active ? 'enabled' : 'available'),
        permissions: Array.isArray(module.permissions) ? module.permissions : (module.manifest ? (module.manifest.permissions || []) : []),
        menu: module.menu || module.name || module.id,
        capability: Array.isArray(module.capabilities) ? module.capabilities[0] : null
      }));
  };

  const buildNavItems = (items, container) => {
    container.innerHTML = '';
    items.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'nav-item';
      button.textContent = item.label;
      button.addEventListener('click', () => {
        setConsole(`Activated menu: ${item.label}`);
      });
      container.appendChild(button);
    });
  };

  const roleClass = (role) => (role || 'user').toLowerCase();

  const renderUserState = () => {
    const currentUser = getCurrentUser();
    const loggedOut = !currentUser;

    elements.appState.textContent = loggedOut ? 'logged out' : `logged in as ${currentUser.username}`;
    elements.appState.className = `status-badge ${loggedOut ? 'warn' : 'ok'}`;

    if (loggedOut) {
      elements.authPanel.classList.remove('hidden');
      elements.appShell.classList.add('hidden');
      elements.currentUserName.textContent = 'Not logged in';
      elements.currentUserInitial.textContent = '—';
      elements.summaryUsername.textContent = 'Not logged in';
      elements.summaryStatus.textContent = 'logged out';
      elements.summaryRoleBadge.textContent = 'guest';
      elements.summaryRoleBadge.className = 'role-badge guest';
      Array.from(document.querySelectorAll('[data-user-display-id]')).forEach((node) => {
        node.textContent = 'Not logged in';
      });
      elements.bootstrapUserStats.textContent = 'Bootstrap user not initialized.';
      elements.consoleLog.textContent = 'System waiting for login.';
      return;
    }

    elements.authPanel.classList.add('hidden');
    elements.appShell.classList.remove('hidden');

    const role = Array.isArray(currentUser.roles) && currentUser.roles.length > 0 ? currentUser.roles[0] : 'user';
    const initial = (currentUser.username || 'U').charAt(0).toUpperCase();

    elements.currentUserName.textContent = currentUser.displayName || currentUser.username || 'User';
    elements.currentUserInitial.textContent = initial;
    elements.summaryUsername.textContent = currentUser.displayName || currentUser.username || 'User';
    elements.summaryRoleBadge.textContent = role;
    elements.summaryRoleBadge.className = `role-badge ${roleClass(role)}`;
    elements.summaryStatus.textContent = currentUser.status || 'active';

    Array.from(document.querySelectorAll('[data-user-display-id]')).forEach((node) => {
      node.textContent = currentUser.displayId || 'USR-000000';
    });

    elements.bootstrapUserStats.textContent = `Visible user: ${currentUser.username} / ${currentUser.displayId} / ${role}`;
    setConsole({ user: currentUser.username, displayId: currentUser.displayId, role, permissions: currentUser.permissions || [] });
  };

  const renderAccessMenu = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      buildNavItems([], elements.userMenu);
      buildNavItems([], elements.adminMenu);
      buildNavItems([], elements.developerMenu);
      elements.adminSection.classList.add('hidden');
      elements.developerSection.classList.add('hidden');
      return;
    }

    const userMenuItems = [
      { label: 'Dashboard' },
      { label: 'Profil' },
      { label: 'Einstellungen' }
    ];

    const systemModules = getVisibleModules();
    const dynamicUserMenu = systemModules.map((module) => ({ label: module.name || module.id }));
    const mergedUserMenu = [...userMenuItems, ...dynamicUserMenu];
    buildNavItems(mergedUserMenu, elements.userMenu);

    const adminAllowed = window.CoreAccess && typeof window.CoreAccess.can === 'function'
      ? window.CoreAccess.can(currentUser, 'system:view', 'user')
      : { ok: false };

    if (adminAllowed.ok) {
      const adminEntries = ['Benutzer', 'Rollen', 'Permissions', 'Audit', 'Systemstatus', 'Module'];
      buildNavItems(adminEntries.map((label) => ({ label })), elements.adminMenu);
      elements.adminSection.classList.remove('hidden');
      elements.adminPanel.classList.remove('hidden');
    } else {
      buildNavItems([], elements.adminMenu);
      elements.adminSection.classList.add('hidden');
      elements.adminPanel.classList.add('hidden');
    }

    const developerAllowed = window.CoreAccess && typeof window.CoreAccess.can === 'function'
      ? window.CoreAccess.can(currentUser, 'module:read', 'module')
      : { ok: false };

    if (developerAllowed.ok) {
      const devEntries = ['Core Status', 'Module Status', 'Event Monitor', 'Audit', 'Console', 'Diagnostics'];
      buildNavItems(devEntries.map((label) => ({ label })), elements.developerMenu);
      elements.developerSection.classList.remove('hidden');
      elements.developerPanel.classList.remove('hidden');
    } else {
      buildNavItems([], elements.developerMenu);
      elements.developerSection.classList.add('hidden');
      elements.developerPanel.classList.add('hidden');
    }
  };

  const renderModules = () => {
    const moduleList = getVisibleModules();
    if (!moduleList.length) {
      elements.activeModules.innerHTML = '<span class="chip muted">No active modules</span>';
      return;
    }

    elements.activeModules.innerHTML = moduleList.map((module) => `<span class="chip">${module.name}</span>`).join('');
  };

  const renderSystemStatus = () => {
    const checks = {
      core: !!window.Core,
      auth: !!window.CoreAuth,
      access: !!window.CoreAccess,
      database: !!window.DatabaseManager,
      services: !!window.ServiceManager,
      user: !!window.UserModule,
      admin: !!window.AdminModule,
      modules: !!window.ModuleManager,
      eventbus: !!window.CoreEventBus,
      audit: !!window.CoreAudit
    };

    const rows = Object.entries(statusMeta).map(([key, meta]) => `
      <div class="status-item ${checks[key] ? 'ok' : 'warn'}">
        <span>${meta.label}</span>
        <strong>${checks[key] ? 'OK' : 'MISSING'}</strong>
      </div>
    `).join('');

    elements.systemStatus.innerHTML = rows;
  };

  const renderAuditState = () => {
    const audit = window.CoreAudit && typeof window.CoreAudit.list === 'function'
      ? window.CoreAudit.list()
      : [];

    const recent = audit.slice(-6);
    elements.auditView.textContent = recent.length === 0
      ? 'No audit entries yet.'
      : JSON.stringify(recent, null, 2);
  };

  const renderPermissions = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      elements.permissionView.textContent = 'No permission data while logged out.';
      return;
    }

    const permissionChecks = {
      userRead: !!(window.CoreAccess && window.CoreAccess.hasPermission && window.CoreAccess.hasPermission(currentUser, 'user:read')),
      userWrite: !!(window.CoreAccess && window.CoreAccess.hasPermission && window.CoreAccess.hasPermission(currentUser, 'user:write')),
      systemView: !!(window.CoreAccess && window.CoreAccess.hasPermission && window.CoreAccess.hasPermission(currentUser, 'system:view')),
      moduleRead: !!(window.CoreAccess && window.CoreAccess.hasPermission && window.CoreAccess.hasPermission(currentUser, 'module:read')),
      roles: currentUser.roles,
      permissions: currentUser.permissions,
      protected: !!currentUser.protected
    };

    elements.permissionView.textContent = JSON.stringify(permissionChecks, null, 2);
  };

  const renderAdminState = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      elements.adminView.textContent = 'Admin area is not open.';
      elements.adminActions.classList.add('hidden');
      return;
    }

    const adminAccess = window.CoreAccess && typeof window.CoreAccess.can === 'function'
      ? window.CoreAccess.can(currentUser, 'system:view', 'user')
      : { ok: false };

    if (!adminAccess.ok) {
      elements.adminView.textContent = 'Admin area is blocked by access rules.';
      elements.adminActions.classList.add('hidden');
      return;
    }

    elements.adminView.textContent = JSON.stringify({
      currentUser: { username: currentUser.username, displayId: currentUser.displayId, role: currentUser.roles },
      systemViewAllowed: adminAccess.ok,
      permissions: currentUser.permissions,
      roles: currentUser.roles
    }, null, 2);
    elements.adminActions.classList.remove('hidden');
  };

  const refreshUi = async () => {
    renderUserState();
    renderAccessMenu();
    renderModules();
    renderSystemStatus();
    renderPermissions();
    renderAdminState();
    renderAuditState();
  };

  const boot = async () => {
    if (!window.ConfigManager) {
      elements.appState.textContent = 'config unavailable';
      return;
    }

    window.ConfigManager.init();
    const bootstrapConfig = readBootstrapConfig();
    if (!bootstrapConfig.developerUsername || !bootstrapConfig.developerPassword) {
      writeBootstrapConfig({
        enabled: true,
        developerUsername: bootstrapConfig.developerUsername || 'developer',
        developerDisplayId: bootstrapConfig.developerDisplayId || 'USR-000001',
        passwordRequired: true,
        passwordSource: 'local-config-or-storage',
        developerPassword: bootstrapConfig.developerPassword || 'local-preview-password'
      });
    }

    const bootstrap = readBootstrapConfig();
    elements.developerUsername.value = bootstrap.developerUsername || 'developer';
    elements.developerPassword.value = bootstrap.developerPassword || 'local-preview-password';

    if (window.UserModule && typeof window.UserModule.init === 'function') {
      window.UserModule.init();
      window.UserModule.bootstrapDeveloperUser();
    }

    if (window.CoreRuntime && typeof window.CoreRuntime.start === 'function') {
      await window.CoreRuntime.start();
    }

    if (window.ModuleManager && typeof window.ModuleManager.discoverModules === 'function') {
      await window.ModuleManager.discoverModules();
    }

    await refreshUi();
  };

  const setPassword = () => {
    const password = elements.developerPassword.value.trim();
    const username = elements.developerUsername.value.trim() || 'developer';
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
      developerPassword: password,
      authMode: 'development-preview'
    });

    if (window.CoreAuth && typeof window.CoreAuth.setDeveloperPassword === 'function') {
      window.CoreAuth.setDeveloperPassword(password);
    }

    setConsole('Developer preview password set.');
  };

  const login = async () => {
    const username = elements.loginUsername.value.trim();
    const password = elements.loginPassword.value.trim();
    if (!username) {
      alert('Username is required.');
      return;
    }

    const result = await window.UserModule.login({ username, password });
    if (!result || !result.ok) {
      alert(result && result.message ? result.message : 'Login failed.');
      return;
    }

    await refreshUi();
  };

  const logout = async () => {
    if (!window.UserModule || typeof window.UserModule.logout !== 'function') {
      return;
    }
    await window.UserModule.logout();
    await refreshUi();
  };

  document.getElementById('setPasswordBtn').addEventListener('click', setPassword);
  document.getElementById('loginBtn').addEventListener('click', login);
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('logoutBtnAlt').addEventListener('click', logout);
  document.getElementById('refreshBtn').addEventListener('click', refreshUi);

  document.querySelectorAll('[data-account-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const action = button.getAttribute('data-account-action');
      if (action === 'logout') {
        await logout();
      } else {
        setConsole(`Account action: ${action}`);
      }
    });
  });

  document.getElementById('createUserBtn').addEventListener('click', async () => {
    const username = document.getElementById('newUserUsername').value.trim();
    const role = document.getElementById('newUserRole').value;
    if (!username) {
      alert('Username required.');
      return;
    }

    const currentUser = getCurrentUser();
    const result = await window.UserModule.createUser({
      username,
      displayName: username,
      roles: [role],
      permissions: role === 'admin' ? ['user:read', 'user:write', 'system:view'] : ['user:read']
    }, currentUser ? currentUser.id : 'system');

    alert(result && result.ok ? `Created user ${result.data.username}` : `User create failed: ${result && result.message ? result.message : 'unknown error'}`);
    await refreshUi();
  });

  boot();
})();
