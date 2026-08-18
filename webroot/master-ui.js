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

  const renderPageContent = () => {
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
        window.CoreAuth.setDeveloperPassword(value);
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (window.UserModule && typeof window.UserModule.logout === 'function') {
          window.UserModule.logout();
        } else if (window.CoreAuth && typeof window.CoreAuth.logout === 'function') {
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
    renderFrameworkPreview();
    renderSummary();
    renderUserMenu();
    syncShellVisibility();
    renderPageContent();
    bindAuth();
  };

  init();
})();
