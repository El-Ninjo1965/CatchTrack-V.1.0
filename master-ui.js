(() => {
  'use strict';

  const pageType = document.body.dataset.page || 'user';
  const state = { activeView: 'dashboard', redirectTimer: null };

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
      return window.UserModule.getCurrentUser();
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

  const styleButton = (viewTarget, menuId) => {
    const targets = document.querySelectorAll(`#${menuId} [data-view]`);
    targets.forEach((button) => {
      const active = button.dataset.view === viewTarget;
      button.classList.toggle('active', active);
    });
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

    if (!currentUser) {
      if (currentUserName) currentUserName.textContent = 'Not logged in';
      if (currentUserInitial) currentUserInitial.textContent = '—';
      if (summaryUsername) summaryUsername.textContent = 'Not logged in';
      if (summaryStatus) summaryStatus.textContent = 'logged out';
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
    if (summaryRoleBadge) {
      summaryRoleBadge.textContent = role;
      summaryRoleBadge.className = `role-badge ${role}`;
      summaryRoleBadge.setAttribute('data-user-role', role);
    }

    const modules = getVisibleModules();
    if (activeModules) {
      activeModules.innerHTML = modules.length
        ? modules.map((module) => `<span class="chip">${escapeHtml(module.name)}</span>`).join('')
        : '<span class="chip">No accessible modules</span>';
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
      { id: 'profile', label: 'Profil' },
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
      const adminItems = [
        { id: 'admin:dashboard', label: 'Dashboard' },
        { id: 'admin:users', label: 'Users' },
        { id: 'admin:roles', label: 'Roles' },
        { id: 'admin:permissions', label: 'Permissions' },
        { id: 'admin:modules', label: 'Modules' },
        { id: 'admin:audit', label: 'Audit' },
        { id: 'admin:system', label: 'Systemstatus' },
        { id: 'admin:link', label: 'Administration', href: 'admin.html' }
      ];
      if (adminSection) adminSection.classList.remove('hidden');
      if (adminMenu) {
        adminMenu.innerHTML = adminItems.map((item) => `
          <button type="button" class="nav-item ${state.activeView === item.id ? 'active' : ''}" data-view="${escapeHtml(item.id)}" data-href="${escapeHtml(item.href || '')}">${escapeHtml(item.label)}</button>
        `).join('');
        bindButtonGroup('adminMenu', (view) => {
          state.activeView = view;
          renderUserMenu();
          renderPageContent();
        });
      }
    } else if (adminSection) {
      adminSection.classList.add('hidden');
      const adminPanel = document.getElementById('adminPanel');
      if (adminPanel) adminPanel.classList.add('hidden');
      if (adminMenu) adminMenu.innerHTML = '';
    }

    if (canViewDeveloper(currentUser)) {
      const devItems = [
        { id: 'developer:core', label: 'Core Status' },
        { id: 'developer:auth', label: 'Auth Status' },
        { id: 'developer:access', label: 'Access Status' },
        { id: 'developer:database', label: 'Database Status' },
        { id: 'developer:modules', label: 'Module Status' },
        { id: 'developer:diagnostics', label: 'Diagnostics' },
        { id: 'developer:console', label: 'Console' },
        { id: 'developer:audit', label: 'Audit' },
        { id: 'developer:link', label: 'Developer UI', href: 'dev.html' }
      ];
      const developerPanel = document.getElementById('developerPanel');
      if (developerSection) developerSection.classList.remove('hidden');
      if (developerPanel) developerPanel.classList.remove('hidden');
      if (developerMenu) {
        developerMenu.innerHTML = devItems.map((item) => `
          <button type="button" class="nav-item ${state.activeView === item.id ? 'active' : ''}" data-view="${escapeHtml(item.id)}" data-href="${escapeHtml(item.href || '')}">${escapeHtml(item.label)}</button>
        `).join('');
        bindButtonGroup('developerMenu', (view) => {
          state.activeView = view;
          renderUserMenu();
          renderPageContent();
        });
      }
    } else if (developerSection) {
      developerSection.classList.add('hidden');
      const developerPanel = document.getElementById('developerPanel');
      if (developerPanel) developerPanel.classList.add('hidden');
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
        <div class="card-header">
          <h2 class="card-title">Dashboard</h2>
          <span class="role-badge ${escapeHtml(Array.isArray(currentUser && currentUser.roles) && currentUser.roles[0] ? currentUser.roles[0] : 'user')}">${escapeHtml(Array.isArray(currentUser && currentUser.roles) && currentUser.roles[0] ? currentUser.roles[0] : 'user')}</span>
        </div>
        <div class="content-wrap">
          <div class="summary-username">Welcome ${escapeHtml(currentUser ? currentUser.displayName || currentUser.username : 'User')}</div>
          <div class="small-muted">${escapeHtml(currentUser ? currentUser.username : 'guest')} · ${escapeHtml(currentUser ? (Array.isArray(currentUser.roles) ? currentUser.roles.join(', ') : 'user') : 'guest')}</div>
          <div class="grid" style="margin-top:16px;">
            <div class="metric"><span class="metric-label">Available modules</span><div class="metric-value">${modules.length}</div></div>
            <div class="metric"><span class="metric-label">Status</span><div class="metric-value">${escapeHtml(currentUser ? currentUser.status || 'active' : 'logged-out')}</div></div>
            <div class="metric"><span class="metric-label">Access</span><div class="metric-value">${escapeHtml(currentUser && currentUser.roles ? currentUser.roles.join(', ') : 'user')}</div></div>
          </div>
        </div>
      </div>
    `;
  };

  const renderProfile = () => {
    const page = document.getElementById('mainContent');
    const currentUser = getCurrentUser();
    if (!page || !currentUser) return;
    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Profile</h2></div>
        <div class="info-grid">
          <div class="info-box"><strong>Username</strong><div>${escapeHtml(currentUser.username || '—')}</div></div>
          <div class="info-box"><strong>User ID</strong><div>${escapeHtml(currentUser.id || '—')}</div></div>
          <div class="info-box"><strong>Display ID</strong><div>${escapeHtml(currentUser.displayId || '—')}</div></div>
          <div class="info-box"><strong>Role</strong><div>${escapeHtml(Array.isArray(currentUser.roles) ? currentUser.roles.join(', ') : 'user')}</div></div>
          <div class="info-box"><strong>Status</strong><div>${escapeHtml(currentUser.status || 'active')}</div></div>
          <div class="info-box"><strong>Protected</strong><div>${escapeHtml(currentUser.protected ? 'Yes' : 'No')}</div></div>
        </div>
      </div>
    `;
  };

  const renderModuleCard = (moduleId) => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const module = getVisibleModules().find((entry) => entry.id === moduleId.replace(/^module:/, ''));
    if (!module) {
      page.innerHTML = '<div class="empty-state">Module not found or not accessible.</div>';
      return;
    }

    page.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">${escapeHtml(module.name)}</h2>
          <span class="status-badge ok">${escapeHtml(module.status || 'available')}</span>
        </div>
        <p class="subtle">${escapeHtml(module.description || 'Module available – UI not implemented yet.')}</p>
        <div class="empty-state">Module available - UI not implemented yet.</div>
      </div>
    `;
  };

  const renderAdminContent = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const currentUser = getCurrentUser();
    if (!currentUser || !canViewAdmin(currentUser)) {
      page.innerHTML = '<div class="empty-state">Access denied. Administrator rights required.</div>';
      return;
    }

    const view = state.activeView || 'admin:dashboard';
    if (view === 'admin:dashboard') {
      const stats = window.AdminModule && typeof window.AdminModule.getSystemStats === 'function' ? await window.AdminModule.getSystemStats() : { userCount: 0, moduleCount: 0, modules: [] };
      const users = window.AdminModule && typeof window.AdminModule.listUsers === 'function' ? await window.AdminModule.listUsers() : { data: { items: [] } };
      page.innerHTML = `
        <div class="card">
          <div class="card-header"><h2 class="card-title">Administration Dashboard</h2></div>
          <div class="grid">
            <div class="metric"><span class="metric-label">Users</span><div class="metric-value">${stats.userCount ?? (users.data && users.data.items ? users.data.items.length : 0)}</div></div>
            <div class="metric"><span class="metric-label">Modules</span><div class="metric-value">${stats.moduleCount ?? 0}</div></div>
            <div class="metric"><span class="metric-label">Roles</span><div class="metric-value">${new Set((users.data && users.data.items || []).flatMap((entry) => Array.isArray(entry.roles) ? entry.roles : [entry.role || 'user'])).size}</div></div>
          </div>
        </div>
      `;
      return;
    }

    if (view === 'admin:users') {
      const result = window.AdminModule && typeof window.AdminModule.listUsers === 'function' ? await window.AdminModule.listUsers() : { data: { items: [] } };
      const users = result && result.data && Array.isArray(result.data.items) ? result.data.items : [];
      page.innerHTML = `
        <div class="card">
          <div class="card-header"><h2 class="card-title">Users</h2></div>
          <div class="table-wrap"><table><thead><tr><th>Username</th><th>Display ID</th><th>Role</th><th>Status</th></tr></thead><tbody>
            ${users.length ? users.map((user) => `
              <tr><td>${escapeHtml(user.username || '—')}</td><td>${escapeHtml(user.displayId || '—')}</td><td>${escapeHtml(Array.isArray(user.roles) ? user.roles.join(', ') : (user.role || 'user'))}</td><td><span class="status-pill ${user.status === 'active' ? 'active' : user.status === 'deleted' ? 'deleted' : 'warning'}">${escapeHtml(user.status || 'active')}</span></td></tr>
            `).join('') : '<tr><td colspan="4"><div class="empty-state">No users available.</div></td></tr>'}
          </tbody></table></div>
        </div>
      `;
      return;
    }

    if (view === 'admin:roles') {
      const result = window.AdminModule && typeof window.AdminModule.listUsers === 'function' ? await window.AdminModule.listUsers() : { data: { items: [] } };
      const entries = result && result.data && Array.isArray(result.data.items) ? result.data.items : [];
      const roles = [...new Set(entries.flatMap((entry) => Array.isArray(entry.roles) ? entry.roles : [entry.role || 'user']))];
      page.innerHTML = `<div class="card"><div class="card-header"><h2 class="card-title">Roles</h2></div><div class="chip-list">${roles.length ? roles.map((role) => `<span class="chip">${escapeHtml(role)}</span>`).join('') : '<span class="chip">No roles found</span>'}</div></div>`;
      return;
    }

    if (view === 'admin:permissions') {
      const permissions = Array.from(new Set([
        ...(Array.isArray(currentUser.permissions) ? currentUser.permissions : []),
        ...(Array.isArray(currentUser.roles) ? currentUser.roles.flatMap((role) => role === 'admin' ? ['system:view', 'user:read', 'user:write'] : role === 'developer' ? ['system:view', 'module:read', 'module:update'] : []) : [])
      ]));
      page.innerHTML = `<div class="card"><div class="card-header"><h2 class="card-title">Permissions</h2></div><div class="chip-list">${permissions.length ? permissions.map((permission) => `<span class="chip">${escapeHtml(permission)}</span>`).join('') : '<span class="chip">No permissions</span>'}</div></div>`;
      return;
    }

    if (view === 'admin:modules') {
      const modules = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function' ? window.ModuleRegistry.getAll() : [];
      page.innerHTML = `
        <div class="card">
          <div class="card-header"><h2 class="card-title">Modules</h2></div>
          <div class="table-wrap"><table><thead><tr><th>Name</th><th>Status</th><th>Permissions</th></tr></thead><tbody>
            ${modules.length ? modules.map((module) => `
              <tr><td>${escapeHtml(module.name || module.id)}</td><td><span class="status-pill ${module.status === 'enabled' || module.active ? 'active' : 'warning'}">${escapeHtml(module.status || (module.active ? 'enabled' : 'available'))}</span></td><td>${escapeHtml(Array.isArray(module.permissions) ? module.permissions.join(', ') : '—')}</td></tr>
            `).join('') : '<tr><td colspan="3"><div class="empty-state">No modules registered.</div></td></tr>'}
          </tbody></table></div>
        </div>
      `;
      return;
    }

    if (view === 'admin:audit') {
      const audit = window.CoreAudit && typeof window.CoreAudit.list === 'function' ? window.CoreAudit.list() : [];
      page.innerHTML = `<div class="card"><div class="card-header"><h2 class="card-title">Audit</h2></div><div class="table-wrap"><table><thead><tr><th>Actor</th><th>Action</th><th>Resource</th><th>Result</th></tr></thead><tbody>${audit.length ? audit.slice(-10).reverse().map((entry) => `<tr><td>${escapeHtml(entry.actor || 'system')}</td><td>${escapeHtml(entry.action || 'unknown')}</td><td>${escapeHtml(entry.resource || 'resource')}</td><td>${escapeHtml(entry.result || 'unknown')}</td></tr>`).join('') : '<tr><td colspan="4"><div class="empty-state">No audit entries.</div></td></tr>'}</tbody></table></div></div>`;
      return;
    }

    if (view === 'admin:system') {
      const stats = window.DatabaseManager && typeof window.DatabaseManager.getStats === 'function' ? await window.DatabaseManager.getStats() : { storeStats: {} };
      const status = { core: !!window.Core, auth: !!window.CoreAuth, access: !!window.CoreAccess, storage: !!window.CoreStorage, database: !!window.DatabaseManager, moduleManager: !!window.ModuleManager };
      page.innerHTML = `<div class="content-wrap"><div class="card"><div class="card-header"><h2 class="card-title">Systemstatus</h2></div><div class="info-grid">${Object.entries(status).map(([key, value]) => `<div class="info-box"><strong>${escapeHtml(key)}</strong><div>${value ? 'Available' : 'Missing'}</div></div>`).join('')}</div></div><div class="card"><div class="card-header"><h2 class="card-title">Database</h2></div><pre>${escapeHtml(JSON.stringify(stats, null, 2))}</pre></div></div>`;
      return;
    }

    page.innerHTML = '<div class="empty-state">Select an admin view.</div>';
  };

  const renderDeveloperContent = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const currentUser = getCurrentUser();
    if (!currentUser || !canViewDeveloper(currentUser)) {
      page.innerHTML = '<div class="empty-state">Developer access denied.</div>';
      return;
    }

    const view = state.activeView || 'developer:core';
    if (view === 'developer:core') {
      page.innerHTML = `<div class="card"><div class="card-header"><h2 class="card-title">Core Status</h2></div><div class="info-grid"><div class="info-box"><strong>Core</strong><div>${!!window.Core ? 'Loaded' : 'Missing'}</div></div><div class="info-box"><strong>Auth</strong><div>${!!window.CoreAuth ? 'Loaded' : 'Missing'}</div></div><div class="info-box"><strong>Access</strong><div>${!!window.CoreAccess ? 'Loaded' : 'Missing'}</div></div><div class="info-box"><strong>Audit</strong><div>${!!window.CoreAudit ? 'Loaded' : 'Missing'}</div></div></div></div>`;
      return;
    }

    if (view === 'developer:auth') {
      const sessions = window.CoreAuth && typeof window.CoreAuth.listSessions === 'function' ? window.CoreAuth.listSessions() : [];
      page.innerHTML = `<div class="card"><div class="card-header"><h2 class="card-title">Auth Status</h2></div><pre>${escapeHtml(JSON.stringify({ authenticated: !!(window.CoreAuth && window.CoreAuth.isAuthenticated && window.CoreAuth.isAuthenticated()), sessions }, null, 2))}</pre></div>`;
      return;
    }

    if (view === 'developer:access') {
      const user = getCurrentUser();
      page.innerHTML = `<div class="card"><div class="card-header"><h2 class="card-title">Access Status</h2></div><pre>${escapeHtml(JSON.stringify({ user: user || null, admin: canViewAdmin(user), developer: canViewDeveloper(user) }, null, 2))}</pre></div>`;
      return;
    }

    if (view === 'developer:database') {
      const stats = window.DatabaseManager && typeof window.DatabaseManager.getStats === 'function' ? await window.DatabaseManager.getStats() : { storeStats: {} };
      page.innerHTML = `<div class="card"><div class="card-header"><h2 class="card-title">Database / Storage Status</h2></div><pre>${escapeHtml(JSON.stringify(stats, null, 2))}</pre></div>`;
      return;
    }

    if (view === 'developer:modules') {
      const modules = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function' ? window.ModuleRegistry.getAll() : [];
      page.innerHTML = `<div class="card"><div class="card-header"><h2 class="card-title">Module Status</h2></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Status</th><th>Permissions</th></tr></thead><tbody>${modules.length ? modules.map((module) => `<tr><td>${escapeHtml(module.name || module.id)}</td><td><span class="status-pill ${module.status === 'enabled' || module.active ? 'active' : 'warning'}">${escapeHtml(module.status || (module.active ? 'enabled' : 'available'))}</span></td><td>${escapeHtml(Array.isArray(module.permissions) ? module.permissions.join(', ') : '—')}</td></tr>`).join('') : '<tr><td colspan="3"><div class="empty-state">No modules registered.</div></td></tr>'}</tbody></table></div></div>`;
      return;
    }

    if (view === 'developer:diagnostics') {
      const health = window.AdminModule && typeof window.AdminModule.healthCheck === 'function' ? window.AdminModule.healthCheck() : {};
      page.innerHTML = `<div class="card"><div class="card-header"><h2 class="card-title">Diagnostics</h2></div><pre>${escapeHtml(JSON.stringify(health, null, 2))}</pre></div>`;
      return;
    }

    if (view === 'developer:console') {
      const userCount = window.UserModule && typeof window.UserModule.listUsers === 'function' ? (await window.UserModule.listUsers()).data?.count ?? 0 : 0;
      const payload = { core: !!window.Core, modules: window.ModuleRegistry && window.ModuleRegistry.getAll ? window.ModuleRegistry.getAll().length : 0, users: userCount };
      page.innerHTML = `<div class="card"><div class="card-header"><h2 class="card-title">Console</h2></div><pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre></div>`;
      return;
    }

    if (view === 'developer:audit') {
      const audit = window.CoreAudit && typeof window.CoreAudit.list === 'function' ? window.CoreAudit.list() : [];
      page.innerHTML = `<div class="card"><div class="card-header"><h2 class="card-title">Audit</h2></div><pre>${escapeHtml(JSON.stringify(audit.slice(-20), null, 2))}</pre></div>`;
      return;
    }

    page.innerHTML = '<div class="empty-state">Select a developer view.</div>';
  };

  const renderPageContent = async () => {
    if (pageType === 'admin') {
      await renderAdminContent();
      return;
    }
    if (pageType === 'developer') {
      await renderDeveloperContent();
      return;
    }

    switch (state.activeView || 'dashboard') {
      case 'dashboard':
        renderDashboard();
        break;
      case 'profile':
        renderProfile();
        break;
      default:
        if (state.activeView && state.activeView.startsWith('module:')) {
          renderModuleCard(state.activeView);
        } else if (state.activeView && state.activeView.startsWith('admin:')) {
          await renderAdminContent();
        } else if (state.activeView && state.activeView.startsWith('developer:')) {
          await renderDeveloperContent();
        } else {
          renderDashboard();
        }
    }
  };

  const bindStaticNavigation = () => {
    const root = document.getElementById('userMenu');
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
        state.activeView = button.dataset.view;
        renderPageContent();
        styleButton(button.dataset.view, 'userMenu');
      });
    });
  };

  const bindAuth = () => {
    const loginBtn = document.getElementById('loginBtn');
    const setPasswordBtn = document.getElementById('setPasswordBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutBtnAlt = document.getElementById('logoutBtnAlt');

    const doLogin = async () => {
      await ensureRuntime();
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      const username = usernameInput ? usernameInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!window.UserModule || typeof window.UserModule.login !== 'function') {
        notify('User module is unavailable.', 'error');
        return;
      }

      const result = await window.UserModule.login({ username, password });
      if (!result || !result.ok) {
        notify(result && result.message ? result.message : 'Login failed.', 'error');
        return;
      }

      renderLoginState();
      renderSummary();
      renderUserMenu();
      await renderPageContent();
      notify('Login successful.', 'success');
    };

    if (loginBtn) loginBtn.addEventListener('click', doLogin);

    const doLogout = async () => {
      if (window.UserModule && typeof window.UserModule.logout === 'function') {
        await window.UserModule.logout();
      } else if (window.CoreAuth && typeof window.CoreAuth.logout === 'function') {
        await window.CoreAuth.logout();
      }
      renderLoginState();
      renderSummary();
      renderUserMenu();
      state.activeView = 'dashboard';
      await renderPageContent();
      notify('Logged out.', 'info');
    };

    if (logoutBtn) logoutBtn.addEventListener('click', doLogout);
    if (logoutBtnAlt) logoutBtnAlt.addEventListener('click', doLogout);

    if (setPasswordBtn) {
      setPasswordBtn.addEventListener('click', () => {
        const passwordInput = document.getElementById('developerPassword');
        const value = passwordInput ? passwordInput.value : '';
        if (!window.CoreAuth || typeof window.CoreAuth.setDeveloperPassword !== 'function') {
          notify('Core auth is not available.', 'error');
          return;
        }
        const result = window.CoreAuth.setDeveloperPassword(value);
        if (result && result.ok) {
          notify('Developer password saved.', 'success');
        } else {
          notify((result && result.message) || 'Password update failed.', 'error');
        }
      });
    }
  };

  const renderLoginState = () => {
    const currentUser = getCurrentUser();
    const authPanel = document.getElementById('authPanel');
    const appShell = document.getElementById('appShell');

    if (!currentUser) {
      if (authPanel) authPanel.classList.remove('hidden');
      if (appShell) appShell.classList.add('hidden');
      return;
    }

    if (authPanel) authPanel.classList.add('hidden');
    if (appShell) appShell.classList.remove('hidden');
  };

  const enforceAccess = () => {
    if (state.redirectTimer) {
      window.clearTimeout(state.redirectTimer);
      state.redirectTimer = null;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      return true;
    }

    if (pageType === 'admin' && !canViewAdmin(currentUser)) {
      const main = document.getElementById('mainContent');
      if (main) main.innerHTML = '<div class="empty-state">Access denied. Redirecting to the user app.</div>';
      state.redirectTimer = window.setTimeout(() => { window.location.href = 'index.html'; }, 1200);
      return false;
    }
    if (pageType === 'developer' && !canViewDeveloper(currentUser)) {
      const main = document.getElementById('mainContent');
      if (main) main.innerHTML = '<div class="empty-state">Developer access denied. Redirecting to the user app.</div>';
      state.redirectTimer = window.setTimeout(() => { window.location.href = 'index.html'; }, 1200);
      return false;
    }

    return true;
  };

  const init = async () => {
    await ensureRuntime();
    renderLoginState();
    renderSummary();
    if (pageType === 'user') {
      renderUserMenu();
    } else {
      bindStaticNavigation();
    }
    bindAuth();
    enforceAccess();
    await renderPageContent();
  };

  window.addEventListener('DOMContentLoaded', init);
})();
