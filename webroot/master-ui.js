(() => {
  'use strict';

  const pageType = document.body.dataset.page || 'user';
  const defaultView = pageType === 'admin' ? 'admin:dashboard' : pageType === 'developer' ? 'developer:core' : 'dashboard';
  const state = { activeView: defaultView };

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const getCurrentUser = () => {
    if (window.UserModule && typeof window.UserModule.getCurrentUser === 'function') {
      const user = window.UserModule.getCurrentUser();
      if (user) return user;
    }
    if (window.CoreAuth && typeof window.CoreAuth.getCurrentUser === 'function') {
      return window.CoreAuth.getCurrentUser();
    }
    return null;
  };

  const hasRole = (user, role) => !!user && Array.isArray(user.roles) && user.roles.includes(role);
  const hasPermission = (user, permission) => {
    if (!user) return false;
    if (window.CoreAccess && typeof window.CoreAccess.hasPermission === 'function') {
      return !!window.CoreAccess.hasPermission(user, permission);
    }
    return Array.isArray(user.permissions) && user.permissions.includes(permission);
  };

  const canViewAdmin = (user) => !!user && (hasRole(user, 'admin') || hasPermission(user, 'system:view'));
  const canViewDeveloper = (user) => !!user && (hasRole(user, 'developer') || hasPermission(user, 'module:read'));

  const resolveRoleRoute = (user) => {
    if (!user) {
      return null;
    }

    if (hasRole(user, 'developer')) {
      return 'dev.html';
    }

    if (hasRole(user, 'admin') || hasPermission(user, 'system:view')) {
      return 'admin.html';
    }

    return 'index.html';
  };

  const getVisibleModules = () => {
    const registry = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function' ? window.ModuleRegistry.getAll() : [];
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    return registry.filter((module) => {
      if (!module || !module.id) return false;
      const active = module.active === true || module.status === 'enabled' || module.status === 'active';
      if (!active) return false;
      const permissions = Array.isArray(module.permissions) && module.permissions.length ? module.permissions : [];
      if (!permissions.length) return true;
      return permissions.some((permission) => hasPermission(currentUser, permission));
    }).map((module) => ({
      id: module.id,
      name: module.name || module.id,
      status: module.status || (module.active ? 'enabled' : 'available')
    }));
  };

  const renderFrameworkPreview = () => {
    const registry = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
      ? window.ModuleRegistry
      : null;
    const modules = registry ? registry.getAll().filter((module) => module && module.id) : [];
    const frameworkStatus = document.getElementById('frameworkStatus');
    const discoveryStatus = document.getElementById('moduleDiscoveryStatus');
    const discoveredModules = document.getElementById('discoveredModules');
    const moduleCount = document.getElementById('moduleCount');

    if (frameworkStatus) frameworkStatus.textContent = window.Core ? 'OK' : 'Unavailable';
    if (discoveryStatus) discoveryStatus.textContent = registry ? 'OK' : 'Unavailable';
    if (moduleCount) moduleCount.textContent = String(modules.length);
    if (discoveredModules) {
      discoveredModules.innerHTML = modules.length
        ? modules.map((module) => '<span class="chip">' + escapeHtml(module.name || module.id) + '</span>').join('')
        : '<span class="chip">No modules installed</span>';
    }
  };

  const renderSummary = () => {
    const currentUser = getCurrentUser();
    const currentUserName = document.getElementById('currentUserName');
    const currentUserInitial = document.getElementById('currentUserInitial');
    const summaryUsername = document.getElementById('summaryUsername');
    const summaryStatus = document.getElementById('summaryStatus');
    const summaryRoleBadge = document.getElementById('summaryRoleBadge');
    const activeModules = document.getElementById('activeModules');
    const displayIdTargets = document.querySelectorAll('[data-user-display-id]');

    if (!currentUser) {
      if (currentUserName) currentUserName.textContent = 'Not signed in';
      if (currentUserInitial) currentUserInitial.textContent = '—';
      if (summaryUsername) summaryUsername.textContent = 'Not signed in';
      if (summaryStatus) summaryStatus.textContent = 'signed out';
      displayIdTargets.forEach((target) => { target.textContent = '—'; });
      if (summaryRoleBadge) {
        summaryRoleBadge.textContent = 'guest';
        summaryRoleBadge.className = 'role-badge user';
      }
      if (activeModules) activeModules.innerHTML = '<span class="chip">No active modules</span>';
      return;
    }

    const role = Array.isArray(currentUser.roles) && currentUser.roles.length ? currentUser.roles[0] : 'user';
    const initials = (currentUser.displayName || currentUser.username || 'U').charAt(0).toUpperCase();

    if (currentUserName) currentUserName.textContent = currentUser.displayName || currentUser.username || 'User';
    if (currentUserInitial) currentUserInitial.textContent = initials;
    if (summaryUsername) summaryUsername.textContent = currentUser.displayName || currentUser.username || 'User';
    if (summaryStatus) summaryStatus.textContent = currentUser.status || 'active';
    displayIdTargets.forEach((target) => { target.textContent = currentUser.displayId || currentUser.id || '—'; });
    if (summaryRoleBadge) {
      summaryRoleBadge.textContent = role;
      summaryRoleBadge.className = `role-badge ${role}`;
    }

    const modules = getVisibleModules();
    if (activeModules) {
      activeModules.innerHTML = modules.length
        ? modules.map((module) => `<span class="chip">${escapeHtml(module.name)}</span>`).join('')
        : '<span class="chip">No active modules</span>';
    }
  };

  const renderAdminDashboard = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const registry = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
      ? window.ModuleRegistry.getAll()
      : [];
    const activeCount = registry.filter((module) => module && (module.active || module.status === 'enabled')).length;
    const currentUser = getCurrentUser();
    const sessionState = window.CoreAuth && typeof window.CoreAuth.getSessionStateSnapshot === 'function'
      ? window.CoreAuth.getSessionStateSnapshot()
      : { authenticated: !!currentUser, username: currentUser ? currentUser.username : null, roles: currentUser ? currentUser.roles || [] : [] };
    const stats = window.AdminModule && typeof window.AdminModule.getSystemStats === 'function'
      ? await window.AdminModule.getSystemStats()
      : { moduleCount: registry.length, userCount: 0, uptime: 0 };

    const cards = [
      { label: 'Framework version', value: window.CoreConfig && window.CoreConfig.core ? window.CoreConfig.core.version : '1.0.0' },
      { label: 'API version', value: 'v1' },
      { label: 'App version', value: '1.0.0' },
      { label: 'System status', value: 'Operational' },
      { label: 'Server status', value: 'Healthy' },
      { label: 'Database status', value: window.DatabaseManager && typeof window.DatabaseManager.getStatus === 'function' ? window.DatabaseManager.getStatus() : 'Not configured' },
      { label: 'Module count', value: String(stats.moduleCount || registry.length) },
      { label: 'Active modules', value: String(activeCount) },
      { label: 'Error count', value: '0' },
      { label: 'Current user', value: sessionState.username || (currentUser ? currentUser.username : 'guest') },
      { label: 'Current role', value: (sessionState.roles && sessionState.roles.length ? sessionState.roles.join(', ') : 'user') }
    ];

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Framework dashboard</h2></div>
        <div class="content-wrap">
          <div class="grid">
            ${cards.map((card) => `
              <div class="metric">
                <span class="metric-label">${escapeHtml(card.label)}</span>
                <div class="metric-value">${escapeHtml(card.value)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  };

  const renderAdminModules = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const modules = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
      ? window.ModuleRegistry.getAll()
      : [];

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Modules</h2></div>
        <div class="content-wrap">
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Version</th><th>Status</th><th>Type</th><th>Capabilities</th></tr>
              </thead>
              <tbody>
                ${modules.length ? modules.map((module) => `
                  <tr>
                    <td>${escapeHtml(module.id || 'unknown')}</td>
                    <td>${escapeHtml(module.name || module.id || 'Module')}</td>
                    <td>${escapeHtml(module.version || '1.0.0')}</td>
                    <td><span class="status-badge ${module.active || module.status === 'enabled' ? 'ok' : 'warning'}">${escapeHtml(module.status || (module.active ? 'enabled' : 'available'))}</span></td>
                    <td>${escapeHtml(module.type || 'framework')}</td>
                    <td>${escapeHtml(Array.isArray(module.capabilities) ? module.capabilities.join(', ') : '')}</td>
                  </tr>
                `).join('') : '<tr><td colspan="6">No modules discovered.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  const renderAdminUsers = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    let rows = [];
    if (window.UserModule && typeof window.UserModule.listUsers === 'function') {
      const result = await window.UserModule.listUsers();
      rows = result && result.data && Array.isArray(result.data.items) ? result.data.items : [];
    }

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Users</h2></div>
        <div class="content-wrap">
          <div class="table-wrap">
            <table>
              <thead><tr><th>User ID</th><th>Username</th><th>Name</th><th>Status</th><th>Roles</th></tr></thead>
              <tbody>
                ${rows.length ? rows.map((user) => `
                  <tr>
                    <td>${escapeHtml(user.displayId || user.id || '—')}</td>
                    <td>${escapeHtml(user.username || '—')}</td>
                    <td>${escapeHtml(user.displayName || user.username || '—')}</td>
                    <td><span class="status-badge ${user.status === 'active' ? 'ok' : 'warning'}">${escapeHtml(user.status || 'active')}</span></td>
                    <td>${escapeHtml(Array.isArray(user.roles) ? user.roles.join(', ') : '')}</td>
                  </tr>
                `).join('') : '<tr><td colspan="5">No users available.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  const renderAdminRoles = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const roles = [
      { role: 'admin', permissions: ['system:view', 'admin:read', 'admin:write'] },
      { role: 'developer', permissions: ['module:read', 'module:write', 'system:view'] },
      { role: 'user', permissions: ['user:read'] }
    ];

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Roles</h2></div>
        <div class="content-wrap">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Role</th><th>Permissions</th></tr></thead>
              <tbody>
                ${roles.map((entry) => `<tr><td>${escapeHtml(entry.role)}</td><td>${escapeHtml(entry.permissions.join(', '))}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  const renderAdminPermissions = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const permissions = ['framework:read', 'auth:read', 'auth:write', 'module:read', 'module:write', 'admin:read', 'admin:write'];

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Permissions</h2></div>
        <div class="content-wrap">
          <div class="grid">
            ${permissions.map((permission) => `<div class="metric"><span class="metric-label">Permission</span><div class="metric-value">${escapeHtml(permission)}</div></div>`).join('')}
          </div>
        </div>
      </div>
    `;
  };

  const renderAdminSystem = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const health = window.AdminModule && typeof window.AdminModule.healthCheck === 'function'
      ? window.AdminModule.healthCheck()
      : { healthy: false };
    const sessionState = window.CoreAuth && typeof window.CoreAuth.getSessionStateSnapshot === 'function'
      ? window.CoreAuth.getSessionStateSnapshot()
      : { authenticated: false };

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">System status</h2></div>
        <div class="content-wrap">
          <div class="grid">
            <div class="metric"><span class="metric-label">Healthy</span><div class="metric-value">${health.healthy ? 'Yes' : 'No'}</div></div>
            <div class="metric"><span class="metric-label">Auth state</span><div class="metric-value">${sessionState.authenticated ? 'authenticated' : 'anonymous'}</div></div>
            <div class="metric"><span class="metric-label">Core</span><div class="metric-value">${health.coreLoaded ? 'Loaded' : 'Missing'}</div></div>
            <div class="metric"><span class="metric-label">Modules</span><div class="metric-value">${window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function' ? window.ModuleRegistry.getAll().length : 0}</div></div>
          </div>
        </div>
      </div>
    `;
  };

  const renderDeveloperOverview = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const registry = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
      ? window.ModuleRegistry.getAll()
      : [];
    const health = window.AdminModule && typeof window.AdminModule.healthCheck === 'function'
      ? window.AdminModule.healthCheck()
      : { healthy: false };
    const audit = window.AdminModule && typeof window.AdminModule.getAuditLog === 'function'
      ? window.AdminModule.getAuditLog()
      : [];

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Developer overview</h2></div>
        <div class="content-wrap">
          <div class="grid">
            <div class="metric"><span class="metric-label">Runtime health</span><div class="metric-value">${health.healthy ? 'Healthy' : 'Warning'}</div></div>
            <div class="metric"><span class="metric-label">Discovered modules</span><div class="metric-value">${registry.length}</div></div>
            <div class="metric"><span class="metric-label">Audit entries</span><div class="metric-value">${Array.isArray(audit) ? audit.length : 0}</div></div>
          </div>
        </div>
      </div>
    `;
  };

  const renderUserMenu = () => {
    const userMenu = document.getElementById('userMenu');
    const adminSection = document.getElementById('adminSection');
    const adminMenu = document.getElementById('adminMenu');
    const developerSection = document.getElementById('developerSection');
    const developerMenu = document.getElementById('developerMenu');
    const currentUser = getCurrentUser();

    if (!userMenu) return;

    if (!currentUser) {
      userMenu.innerHTML = '';
      if (adminSection) adminSection.classList.add('hidden');
      if (adminMenu) adminMenu.innerHTML = '';
      if (developerSection) developerSection.classList.add('hidden');
      if (developerMenu) developerMenu.innerHTML = '';
      return;
    }

    const items = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'profile', label: 'Profile' },
      { id: 'modules', label: 'Modules' },
      ...getVisibleModules().map((module) => ({ id: `module:${module.id}`, label: module.name }))
    ];

    userMenu.innerHTML = items.map((item) => `
      <button type="button" class="nav-item ${state.activeView === item.id ? 'active' : ''}" data-view="${escapeHtml(item.id)}">${escapeHtml(item.label)}</button>
    `).join('');

    userMenu.querySelectorAll('[data-view]').forEach((button) => {
      button.addEventListener('click', () => {
        state.activeView = button.dataset.view;
        renderPageContent();
        renderSummary();
      });
    });

    if (canViewAdmin(currentUser)) {
      if (adminSection) adminSection.classList.remove('hidden');
      if (adminMenu) {
        adminMenu.innerHTML = '<button type="button" class="nav-item" data-view="admin:dashboard" data-href="admin.html">Administration</button>';
      }
    } else if (adminSection) {
      adminSection.classList.add('hidden');
      if (adminMenu) adminMenu.innerHTML = '';
    }

    if (canViewDeveloper(currentUser)) {
      if (developerSection) developerSection.classList.remove('hidden');
      if (developerMenu) {
        developerMenu.innerHTML = '<button type="button" class="nav-item" data-view="developer:core" data-href="dev.html">Developer</button>';
      }
    } else if (developerSection) {
      developerSection.classList.add('hidden');
      if (developerMenu) developerMenu.innerHTML = '';
    }
  };

  const renderDashboard = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const currentUser = getCurrentUser();
    const modules = getVisibleModules();

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Dashboard</h2></div>
        <div class="content-wrap">
          <div class="summary-username">Welcome ${escapeHtml(currentUser ? currentUser.displayName || currentUser.username : 'User')}</div>
          <div class="small-muted">${escapeHtml(currentUser ? currentUser.username : 'guest')} · ${escapeHtml(currentUser ? (Array.isArray(currentUser.roles) ? currentUser.roles.join(', ') : 'user') : 'guest')}</div>
          <div class="grid" style="margin-top:16px;">
            <div class="metric"><span class="metric-label">Available modules</span><div class="metric-value">${modules.length}</div></div>
            <div class="metric"><span class="metric-label">Status</span><div class="metric-value">${escapeHtml(currentUser ? currentUser.status || 'active' : 'logged-out')}</div></div>
            <div class="metric"><span class="metric-label">Access</span><div class="metric-value">${escapeHtml(currentUser && Array.isArray(currentUser.roles) ? currentUser.roles.join(', ') : 'user')}</div></div>
          </div>
        </div>
      </div>
    `;
  };

  const renderProfile = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const user = getCurrentUser();

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Profile</h2></div>
        <div class="content-wrap">
          <div class="summary-username">${escapeHtml(user ? user.displayName || user.username || 'User' : 'Guest')}</div>
          <div class="small-muted">${escapeHtml(user ? user.username || 'guest' : 'guest')}</div>
          <div class="grid" style="margin-top:16px;">
            <div class="metric"><span class="metric-label">Display ID</span><div class="metric-value">${escapeHtml(user ? user.displayId || user.id || '—' : '—')}</div></div>
            <div class="metric"><span class="metric-label">Role</span><div class="metric-value">${escapeHtml(user && Array.isArray(user.roles) ? user.roles.join(', ') : 'user')}</div></div>
            <div class="metric"><span class="metric-label">Status</span><div class="metric-value">${escapeHtml(user ? user.status || 'active' : 'signed-out')}</div></div>
          </div>
        </div>
      </div>
    `;
  };

  const renderModules = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const modules = getVisibleModules();

    page.innerHTML = modules.length ? `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Modules</h2></div>
        <div class="content-wrap">
          <div class="grid">
            ${modules.map((module) => `
              <div class="metric">
                <span class="metric-label">${escapeHtml(module.name)}</span>
                <div class="metric-value" style="font-size: 0.85rem;">${escapeHtml(module.status)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    ` : '<div class="card"><div class="card-header"><h2 class="card-title">Modules</h2></div><div class="content-wrap">No modules are active for the current user context.</div></div>';
  };

  const renderPageContent = async () => {
    if (pageType === 'admin') {
      if (state.activeView === 'admin:dashboard') {
        await renderAdminDashboard();
        return;
      }
      if (state.activeView === 'admin:modules') {
        renderAdminModules();
        return;
      }
      if (state.activeView === 'admin:users') {
        await renderAdminUsers();
        return;
      }
      if (state.activeView === 'admin:roles') {
        renderAdminRoles();
        return;
      }
      if (state.activeView === 'admin:permissions') {
        renderAdminPermissions();
        return;
      }
      if (state.activeView === 'admin:system') {
        await renderAdminSystem();
        return;
      }
      await renderAdminDashboard();
      return;
    }

    if (pageType === 'developer') {
      if (state.activeView === 'developer:core') {
        await renderDeveloperOverview();
        return;
      }
      await renderDeveloperOverview();
      return;
    }

    if (state.activeView === 'profile') {
      renderProfile();
      return;
    }
    if (state.activeView === 'modules') {
      renderModules();
      return;
    }
    renderDashboard();
  };

  const bindAuth = () => {
    const loginBtn = document.getElementById('loginBtn');
    const setPasswordBtn = document.getElementById('setPasswordBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn) {
      loginBtn.addEventListener('click', async () => {
        const usernameInput = document.getElementById('loginUsername');
        const passwordInput = document.getElementById('loginPassword');
        const username = usernameInput ? usernameInput.value.trim() : 'developer';
        const password = passwordInput ? passwordInput.value : '';

        if (!window.UserModule || typeof window.UserModule.login !== 'function') {
          return;
        }

        const result = await window.UserModule.login({ username, password });
        if (!result || !result.ok) {
          const authMessage = document.getElementById('authMessage');
          if (authMessage) {
            authMessage.className = 'message error';
            authMessage.textContent = result && result.message ? result.message : 'Authentication failed.';
          }
          return;
        }

        const user = result.data && result.data.user ? result.data.user : null;
        const target = resolveRoleRoute(user);
        if (target && target !== window.location.pathname.replace(/^\//, '')) {
          window.location.replace(target);
          return;
        }

        renderSummary();
        renderUserMenu();
        renderPageContent();
      });
    }

    if (setPasswordBtn) {
      setPasswordBtn.addEventListener('click', () => {
        const passwordInput = document.getElementById('developerPassword');
        const value = passwordInput ? passwordInput.value : '';
        if (!window.CoreAuth || typeof window.CoreAuth.setDeveloperPassword !== 'function') {
          return;
        }
        const result = window.CoreAuth.setDeveloperPassword(value);
        const authMessage = document.getElementById('authMessage');
        if (authMessage) {
          authMessage.className = result && result.ok ? 'message success' : 'message error';
          authMessage.textContent = result && result.message ? result.message : (result && result.ok ? 'Developer password configured.' : 'Password is required.');
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        if (window.UserModule && typeof window.UserModule.logout === 'function') {
          await window.UserModule.logout();
        } else if (window.CoreAuth && typeof window.CoreAuth.logout === 'function') {
          await window.CoreAuth.logout();
        }
        const target = pageType === 'developer' ? 'dev.html' : pageType === 'admin' ? 'admin.html' : 'index.html';
        window.location.replace(target);
      });
    }
  };

  const syncShellVisibility = () => {
    const authPanel = document.getElementById('authPanel');
    const appShell = document.getElementById('appShell');
    const accessDenied = document.getElementById('accessDenied');
    const currentUser = getCurrentUser();

    if (pageType === 'admin' || pageType === 'developer') {
      const pageAllowed = pageType === 'admin'
        ? !!currentUser && (hasRole(currentUser, 'admin') || hasPermission(currentUser, 'system:view'))
        : !!currentUser && (hasRole(currentUser, 'developer') || hasPermission(currentUser, 'module:read'));

      if (authPanel) authPanel.classList.toggle('hidden', !!currentUser && pageAllowed);
      if (appShell) appShell.classList.toggle('hidden', !currentUser || !pageAllowed);
      if (accessDenied) accessDenied.classList.toggle('hidden', !!currentUser && pageAllowed);
      return;
    }

    if (authPanel) authPanel.classList.toggle('hidden', !!currentUser);
    if (appShell) appShell.classList.toggle('hidden', !currentUser);
  };

  const ensureRuntime = async () => {
    if (window.CoreStartup && typeof window.CoreStartup.start === 'function') {
      await window.CoreStartup.start();
    }
    if (window.ModuleManager && typeof window.ModuleManager.discoverModules === 'function') {
      await window.ModuleManager.discoverModules();
    }
  };

  const init = async () => {
    await ensureRuntime();
    const currentUser = getCurrentUser();
    const targetPage = resolveRoleRoute(currentUser);
    const currentPath = window.location.pathname.replace(/^\//, '');

    if (pageType === 'admin' || pageType === 'developer') {
      const pageAllowed = pageType === 'admin'
        ? !!currentUser && (hasRole(currentUser, 'admin') || hasPermission(currentUser, 'system:view'))
        : !!currentUser && (hasRole(currentUser, 'developer') || hasPermission(currentUser, 'module:read'));
      if (currentUser && !pageAllowed && targetPage && targetPage !== currentPath) {
        window.location.replace(targetPage);
        return;
      }
      if (currentUser && pageAllowed && targetPage && targetPage !== currentPath && targetPage !== (pageType === 'admin' ? 'admin.html' : 'dev.html')) {
        window.location.replace(targetPage);
        return;
      }
    } else if (currentUser && targetPage && targetPage !== currentPath) {
      window.location.replace(targetPage);
      return;
    }

    renderFrameworkPreview();
    renderSummary();
    renderUserMenu();
    syncShellVisibility();
    await renderPageContent();
    bindAuth();
  };

  init();
})();
