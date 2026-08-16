(() => {
  'use strict';

  const pageType = document.body.dataset.page || 'user';
  const defaultView = pageType === 'admin' ? 'admin:dashboard' : pageType === 'developer' ? 'developer:core' : 'dashboard';
  const state = { activeView: defaultView, adminEditUserId: null };

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const notify = (message, type = 'info') => {
    const target = document.getElementById('authMessage');
    if (!target) {
      return;
    }
    target.className = `message ${type}`;
    target.textContent = message;
  };

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

  const canViewAdmin = (user) => {
    if (!user) return false;
    if (window.CoreAccess && typeof window.CoreAccess.can === 'function') {
      return !!window.CoreAccess.can(user, 'system:view', 'user').ok;
    }
    return hasPermission(user, 'system:view') || hasRole(user, 'admin');
  };

  const canViewDeveloper = (user) => {
    if (!user) return false;
    if (window.CoreAccess && typeof window.CoreAccess.can === 'function') {
      return !!window.CoreAccess.can(user, 'module:read', 'module').ok || hasRole(user, 'developer');
    }
    return hasPermission(user, 'module:read') || hasRole(user, 'developer');
  };

  const getVisibleModules = () => {
    const registry = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function' ? window.ModuleRegistry.getAll() : [];
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    return registry.filter((module) => {
      if (!module || !module.id) return false;
      const active = module.active === true || module.status === 'enabled' || module.status === 'active';
      if (!active) return false;
      const permissions = Array.isArray(module.permissions) && module.permissions.length
        ? module.permissions
        : Array.isArray(module.manifest && module.manifest.permissions)
          ? module.manifest.permissions
          : [];
      if (!permissions.length) return true;
      return permissions.some((permission) => hasPermission(currentUser, permission));
    }).map((module) => ({
      id: module.id,
      name: module.name || module.id,
      status: module.status || (module.active ? 'enabled' : 'available'),
      permissions: Array.isArray(module.permissions) ? module.permissions : (module.manifest ? module.manifest.permissions || [] : []),
      description: module.description || (module.manifest ? module.manifest.description || '' : '')
    }));
  };

  const ensureRuntime = async () => {
    if (window.CoreStartup && typeof window.CoreStartup.start === 'function') {
      await window.CoreStartup.start();
    }
    if (window.ModuleManager && typeof window.ModuleManager.discoverModules === 'function') {
      await window.ModuleManager.discoverModules();
    }
  };

  const bindButtonGroup = (rootId, onSelect) => {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.querySelectorAll('[data-view]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.href) {
          window.location.href = button.dataset.href;
          return;
        }
        if (pageType !== 'user' && button.dataset.view === 'dashboard') {
          window.location.href = 'index.html';
          return;
        }
        onSelect(button.dataset.view);
      });
    });
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
      summaryRoleBadge.setAttribute('data-user-role', role);
    }

    const modules = getVisibleModules();
    if (activeModules) {
      activeModules.innerHTML = modules.length
        ? modules.map((module) => `<span class="chip">${escapeHtml(module.name)}</span>`).join('')
        : '<span class="chip">No active modules</span>';
    }
  };

  const renderUserMenu = () => {
    const userMenu = document.getElementById('userMenu');
    const adminSection = document.getElementById('adminSection');
    const adminMenu = document.getElementById('adminMenu');
    const developerSection = document.getElementById('developerSection');
    const developerMenu = document.getElementById('developerMenu');
    const currentUser = getCurrentUser();

    if (!userMenu || !currentUser) {
      if (userMenu) userMenu.innerHTML = '';
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

    bindButtonGroup('userMenu', (view) => {
      state.activeView = view;
      renderUserMenu();
      renderPageContent();
    });

    if (canViewAdmin(currentUser)) {
      if (adminSection) adminSection.classList.remove('hidden');
      if (adminMenu) {
        adminMenu.innerHTML = `
          <button type="button" class="nav-item" data-view="admin:link" data-href="admin.html">Administration</button>
        `;
        bindButtonGroup('adminMenu', () => {});
      }
    } else if (adminSection) {
      adminSection.classList.add('hidden');
      if (adminMenu) adminMenu.innerHTML = '';
    }

    if (canViewDeveloper(currentUser)) {
      if (developerSection) developerSection.classList.remove('hidden');
      if (developerMenu) {
        developerMenu.innerHTML = `
          <button type="button" class="nav-item" data-view="developer:link" data-href="dev.html">Developer</button>
        `;
        bindButtonGroup('developerMenu', () => {});
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
    const session = window.CoreAuth && typeof window.CoreAuth.getSessionStateSnapshot === 'function'
      ? window.CoreAuth.getSessionStateSnapshot()
      : { authenticated: !!currentUser, sessionId: null, expiresAt: null, status: currentUser ? 'active' : 'inactive' };

    page.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Dashboard</h2>
          <span class="role-badge ${escapeHtml(Array.isArray(currentUser && currentUser.roles) && currentUser.roles[0] ? currentUser.roles[0] : 'user')}">${escapeHtml(Array.isArray(currentUser && currentUser.roles) && currentUser.roles[0] ? currentUser.roles[0] : 'user')}</span>
        </div>
        <div class="content-wrap">
          <div class="summary-username">Welcome ${escapeHtml(currentUser ? currentUser.displayName || currentUser.username : 'User')}</div>
          <div class="small-muted">${escapeHtml(currentUser ? currentUser.username : 'guest')} · ${escapeHtml(currentUser ? (Array.isArray(currentUser.roles) ? currentUser.roles.join(', ') : 'user') : 'guest')}</div>
          <div class="grid" style="margin-top:16px;">
            <div class="metric"><span class="metric-label">Available modules</span><div class="metric-value">${modules.length}</div></div>
            <div class="metric"><span class="metric-label">Session</span><div class="metric-value">${escapeHtml(session.status || (currentUser ? 'active' : 'inactive'))}</div></div>
            <div class="metric"><span class="metric-label">Access</span><div class="metric-value">${escapeHtml(currentUser && currentUser.roles ? currentUser.roles.join(', ') : 'user')}</div></div>
          </div>
        </div>
      </div>
    `;
  };

  const renderProfile = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const user = getCurrentUser();
    const role = user && Array.isArray(user.roles) && user.roles.length ? user.roles.join(', ') : 'user';

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Profile</h2></div>
        <div class="content-wrap">
          <div class="summary-username">${escapeHtml(user ? (user.displayName || user.username || 'User') : 'Guest')}</div>
          <div class="small-muted">${escapeHtml(user ? user.username || 'guest' : 'guest')}</div>
          <div class="grid" style="margin-top:16px;">
            <div class="metric"><span class="metric-label">Display ID</span><div class="metric-value">${escapeHtml(user ? user.displayId || user.id || '—' : '—')}</div></div>
            <div class="metric"><span class="metric-label">Role</span><div class="metric-value">${escapeHtml(role)}</div></div>
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

    if (!modules.length) {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Modules</h2></div><div class="content-wrap">No modules are active for the current user context.</div></div>';
      return;
    }

    page.innerHTML = `
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
    `;
  };

  const renderAdminView = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const view = state.activeView;
    const user = getCurrentUser();
    const isAdmin = !!user && canViewAdmin(user);

    if (!isAdmin) {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Access denied</h2></div><div class="content-wrap">Administrative access is required.</div></div>';
      return;
    }

    if (view === 'admin:users') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Users</h2></div><div class="content-wrap">User management is available through the core admin facade.</div></div>';
      return;
    }

    if (view === 'admin:roles') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Roles</h2></div><div class="content-wrap"><div id="adminRoleList">admin<br>developer<br>user</div></div></div>';
      return;
    }

    if (view === 'admin:permissions') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Permissions</h2></div><div class="content-wrap"><div id="adminPermissionList">system:view<br>user:read<br>user:write<br>module:read</div></div></div>';
      return;
    }

    if (view === 'admin:modules') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Modules</h2></div><div class="content-wrap">The module registry remains the extension point for future applications.</div></div>';
      return;
    }

    if (view === 'admin:audit') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Audit</h2></div><div class="content-wrap">Audit events are recorded by the core event and access infrastructure.</div></div>';
      return;
    }

    if (view === 'admin:system') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Systemstatus</h2></div><div class="content-wrap">Runtime status is available through the neutral core and server health endpoints.</div></div>';
      return;
    }

    page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Administration Dashboard</h2></div><div class="content-wrap">System status, configuration, roles, and modules are ready for app-specific deployment layers.</div></div>';
  };

  const renderDeveloperView = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const view = state.activeView;
    const user = getCurrentUser();
    const isDeveloper = !!user && canViewDeveloper(user);

    if (!isDeveloper) {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Access denied</h2></div><div class="content-wrap">Developer diagnostics require a valid developer role.</div></div>';
      return;
    }

    if (view === 'developer:auth') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Auth Status</h2></div><div class="content-wrap">Authentication state is managed by the core auth layer and persisted through the platform session key.</div></div>';
      return;
    }

    if (view === 'developer:access') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Access Status</h2></div><div class="content-wrap">Authorization decisions are enforced server-side and verified through the access layer.</div></div>';
      return;
    }

    if (view === 'developer:database') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Database / Storage Status</h2></div><div class="content-wrap">Storage abstractions remain replaceable and separate from the application layer.</div></div>';
      return;
    }

    if (view === 'developer:modules') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Module Status</h2></div><div class="content-wrap">Modules are registered, activated, and permission-scoped without tying them to a fixed app domain.</div></div>';
      return;
    }

    if (view === 'developer:diagnostics') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Diagnostics</h2></div><div class="content-wrap">Runtime health, access policy checks, and lifecycle state are available for deployment validation.</div></div>';
      return;
    }

    if (view === 'developer:console') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Console</h2></div><div class="content-wrap">Console output is kept within the platform shell and not coupled to a specific application.</div></div>';
      return;
    }

    if (view === 'developer:audit') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Audit</h2></div><div class="content-wrap">Audit events and ring-buffer logs provide operational traceability without business logic.</div></div>';
      return;
    }

    if (view === 'developer:tests') {
      page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Technical Tests</h2></div><div class="content-wrap">Core and server smoke tests are used to validate the framework before app deployments.</div></div>';
      return;
    }

    page.innerHTML = '<div class="card"><div class="card-header"><h2 class="card-title">Core Status</h2></div><div class="content-wrap">Runtime is operating through the shared platform core.</div></div>';
  };

  const renderPageContent = () => {
    const view = state.activeView;
    if (view.startsWith('admin:') || pageType === 'admin') {
      renderAdminView();
      return;
    }
    if (view.startsWith('developer:') || pageType === 'developer') {
      renderDeveloperView();
      return;
    }
    if (view === 'profile') {
      renderProfile();
      return;
    }
    if (view === 'modules') {
      renderModules();
      return;
    }
    renderDashboard();
  };

  const initializeAuth = () => {
    const loginButton = document.getElementById('loginBtn');
    const setPasswordButton = document.getElementById('setPasswordBtn');
    const logoutButton = document.getElementById('logoutBtn');

    if (loginButton) {
      loginButton.addEventListener('click', async () => {
        const username = document.getElementById('loginUsername')?.value || 'developer';
        const password = document.getElementById('loginPassword')?.value || '';
        const loginResult = await window.UserModule.login({ username, password });
        if (!loginResult || !loginResult.ok) {
          notify(loginResult && loginResult.message ? loginResult.message : 'Login failed.', 'error');
          return;
        }
        notify('Signed in successfully.', 'success');
        renderSummary();
        renderUserMenu();
        renderPageContent();
      });
    }

    if (setPasswordButton) {
      setPasswordButton.addEventListener('click', () => {
        const password = document.getElementById('developerPassword')?.value || '';
        if (!password.trim()) {
          notify('Enter a bootstrap password before saving.', 'error');
          return;
        }
        const result = window.CoreAuth.setDeveloperPassword(password);
        notify(result && result.ok ? 'Password saved.' : 'Password rejected.', result && result.ok ? 'success' : 'error');
      });
    }

    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        if (window.CoreAuth && typeof window.CoreAuth.logout === 'function') {
          window.CoreAuth.logout();
        }
        renderSummary();
        renderUserMenu();
        renderPageContent();
        const authPanel = document.getElementById('authPanel');
        const appShell = document.getElementById('appShell');
        if (authPanel) authPanel.classList.remove('hidden');
        if (appShell) appShell.classList.add('hidden');
      });
    }
  };

  const syncShellVisibility = () => {
    const authPanel = document.getElementById('authPanel');
    const appShell = document.getElementById('appShell');
    const currentUser = getCurrentUser();
    if (authPanel) authPanel.classList.toggle('hidden', !!currentUser);
    if (appShell) appShell.classList.toggle('hidden', !currentUser);
  };

  const observeLoad = async () => {
    await ensureRuntime();
    renderSummary();
    renderUserMenu();
    syncShellVisibility();
    renderPageContent();
    initializeAuth();
  };

  observeLoad();
})();
