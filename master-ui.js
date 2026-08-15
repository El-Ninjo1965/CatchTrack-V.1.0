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
      if (user) {
        return user;
      }
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
    const displayIdTargets = document.querySelectorAll('[data-user-display-id]');

    if (!currentUser) {
      if (currentUserName) currentUserName.textContent = 'Nicht angemeldet';
      if (currentUserInitial) currentUserInitial.textContent = '—';
      if (summaryUsername) summaryUsername.textContent = 'Nicht angemeldet';
      if (summaryStatus) summaryStatus.textContent = 'abgemeldet';
      displayIdTargets.forEach((target) => { target.textContent = '—'; });
      if (summaryRoleBadge) {
        summaryRoleBadge.textContent = 'guest';
        summaryRoleBadge.className = 'role-badge user';
      }
      if (activeModules) activeModules.innerHTML = '<span class="chip">Keine aktiven Module</span>';
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
        : '<span class="chip">Keine freigeschalteten Module</span>';
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
      { id: 'modules', label: 'Module' },
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

  const refreshNavigation = () => {
    if (pageType === 'user') {
      renderUserMenu();
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
          <div class="summary-username">Willkommen ${escapeHtml(currentUser ? currentUser.displayName || currentUser.username : 'User')}</div>
          <div class="small-muted">${escapeHtml(currentUser ? currentUser.username : 'guest')} · ${escapeHtml(currentUser ? (Array.isArray(currentUser.roles) ? currentUser.roles.join(', ') : 'user') : 'guest')}</div>
          <div class="grid" style="margin-top:16px;">
            <div class="metric"><span class="metric-label">Verfügbare Module</span><div class="metric-value">${modules.length}</div></div>
            <div class="metric"><span class="metric-label">Status</span><div class="metric-value">${escapeHtml(currentUser ? currentUser.status || 'active' : 'logged-out')}</div></div>
            <div class="metric"><span class="metric-label">Zugriff</span><div class="metric-value">${escapeHtml(currentUser && currentUser.roles ? currentUser.roles.join(', ') : 'user')}</div></div>
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
        <div class="card-header"><h2 class="card-title">Profil</h2></div>
        <div class="info-grid">
          <div class="info-box"><strong>Benutzername</strong><div>${escapeHtml(currentUser.username || '—')}</div></div>
          <div class="info-box"><strong>User ID</strong><div>${escapeHtml(currentUser.id || '—')}</div></div>
          <div class="info-box"><strong>Display ID</strong><div>${escapeHtml(currentUser.displayId || '—')}</div></div>
          <div class="info-box"><strong>Rolle</strong><div>${escapeHtml(Array.isArray(currentUser.roles) ? currentUser.roles.join(', ') : 'user')}</div></div>
          <div class="info-box"><strong>Status</strong><div>${escapeHtml(currentUser.status || 'active')}</div></div>
          <div class="info-box"><strong>Geschützt</strong><div>${escapeHtml(currentUser.protected ? 'Ja' : 'Nein')}</div></div>
        </div>
      </div>
    `;
  };

  const renderModuleList = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const modules = getVisibleModules();
    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Module</h2></div>
        ${modules.length
          ? `<div class="table-wrap"><table><thead><tr><th>Modul</th><th>Status</th></tr></thead><tbody>${modules.map((module) => `<tr><td>${escapeHtml(module.name)}</td><td><span class="status-pill active">${escapeHtml(module.status || 'available')}</span></td></tr>`).join('')}</tbody></table></div>`
          : '<div class="empty-state">Keine freigeschalteten Module verfügbar.</div>'}
      </div>
    `;
  };

  const renderModuleCard = (moduleId) => {    const page = document.getElementById('mainContent');
    if (!page) return;
    const module = getVisibleModules().find((entry) => entry.id === moduleId.replace(/^module:/, ''));
    if (!module) {
      page.innerHTML = '<div class="empty-state">Modul nicht gefunden oder nicht freigegeben.</div>';
      return;
    }

    page.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">${escapeHtml(module.name)}</h2>
          <span class="status-badge ok">${escapeHtml(module.status || 'available')}</span>
        </div>
        <p class="subtle">${escapeHtml(module.description || 'Modul verfügbar – UI noch nicht implementiert.')}</p>
        <div class="empty-state">Modul verfügbar – UI noch nicht implementiert.</div>
      </div>
    `;
  };

  const renderAdminUsers = async () => {
    const result = window.AdminModule && typeof window.AdminModule.listUsers === 'function' ? await window.AdminModule.listUsers() : { ok: true, data: { items: [] } };
    const users = result && result.data && Array.isArray(result.data.items) ? result.data.items : [];

    const html = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Users</h2></div>
        <div id="adminUserForm" class="admin-form-grid">
          <div class="form-field">
            <label for="adminUserUsername">Username</label>
            <input id="adminUserUsername" type="text" placeholder="new username" />
          </div>
          <div class="form-field">
            <label for="adminUserDisplayName">Display name</label>
            <input id="adminUserDisplayName" type="text" placeholder="display name" />
          </div>
          <div class="form-field">
            <label for="adminUserStatus">Status</label>
            <select id="adminUserStatus">
              <option value="active">active</option>
              <option value="inactive">inactive</option>
              <option value="locked">locked</option>
            </select>
          </div>
          <div class="form-field">
            <label for="adminUserRoles">Role</label>
            <select id="adminUserRoles">
              <option value="user">user</option>
              <option value="admin">admin</option>
              <option value="developer">developer</option>
            </select>
          </div>
          <div class="action-list">
            <button id="adminUserSubmit" type="button" class="primary">Add user</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2 class="card-title">User list</h2></div>
        <div class="form-field compact">
          <label for="adminUserRoleFilter">Role filter</label>
          <select id="adminUserRoleFilter">
            <option value="all">All</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="developer">developer</option>
          </select>
        </div>
        <div class="table-wrap">
          <table id="adminUserTable">
            <thead><tr><th>Username</th><th>Display name</th><th>Display ID</th><th>Role</th><th>Status</th></tr></thead>
            <tbody>
              ${users.length ? users.map((user) => `
                <tr data-user-row="${escapeHtml(user.id || '')}" data-role="${escapeHtml(Array.isArray(user.roles) ? user.roles.join(',') : (user.role || 'user'))}">
                  <td>${escapeHtml(user.username || '—')}</td>
                  <td>${escapeHtml(user.displayName || user.username || '—')}</td>
                  <td>${escapeHtml(user.displayId || '—')}</td>
                  <td>${escapeHtml(Array.isArray(user.roles) ? user.roles.join(', ') : (user.role || 'user'))}</td>
                  <td><span class="status-pill ${user.status === 'active' ? 'active' : user.status === 'deleted' ? 'deleted' : 'warning'}">${escapeHtml(user.status || 'active')}</span></td>
                </tr>
              `).join('') : '<tr><td colspan="5"><div class="empty-state">No users available.</div></td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;

    return html;
  };

  const renderAdminRoles = async () => {
    const result = window.AdminModule && typeof window.AdminModule.listUsers === 'function' ? await window.AdminModule.listUsers() : { ok: true, data: { items: [] } };
    const entries = result && result.data && Array.isArray(result.data.items) ? result.data.items : [];
    const roles = ['user', 'admin', 'developer', ...new Set(entries.flatMap((entry) => Array.isArray(entry.roles) ? entry.roles : [entry.role || 'user']))].filter((role, index, source) => source.indexOf(role) === index);

    const html = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Roles</h2></div>
        <div id="adminRoleList" class="chip-list">
          ${roles.map((role) => `<span class="chip">${escapeHtml(role)}</span>`).join('')}
        </div>
      </div>
    `;
    return html;
  };

  const renderAdminPermissions = async () => {
    const currentUser = getCurrentUser();
    const permissions = Array.from(new Set([
      ...(Array.isArray(currentUser && currentUser.permissions) ? currentUser.permissions : []),
      'user:read',
      'user:write',
      'system:view',
      'module:read',
      'module:update'
    ]));

    const html = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Permissions</h2></div>
        <div id="adminPermissionList" class="chip-list">
          ${permissions.map((permission) => `<span class="chip">${escapeHtml(permission)}</span>`).join('')}
        </div>
      </div>
    `;
    return html;
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
      page.innerHTML = await renderAdminUsers();

      const createButton = document.getElementById('adminUserSubmit');
      if (createButton) {
        createButton.addEventListener('click', async () => {
          const usernameInput = document.getElementById('adminUserUsername');
          const displayNameInput = document.getElementById('adminUserDisplayName');
          const statusInput = document.getElementById('adminUserStatus');
          const roleInput = document.getElementById('adminUserRoles');

          const payload = {
            username: usernameInput ? usernameInput.value.trim() : '',
            displayName: displayNameInput ? displayNameInput.value.trim() : '',
            status: statusInput ? statusInput.value : 'active',
            roles: roleInput ? [roleInput.value] : ['user'],
            permissions: []
          };

          if (!payload.username) {
            notify('Username ist erforderlich.', 'error');
            return;
          }

          const result = window.AdminModule && typeof window.AdminModule.createUser === 'function'
            ? await window.AdminModule.createUser(payload, currentUser)
            : await window.UserModule.createUser(payload, currentUser);

          if (!result || !result.ok) {
            notify((result && result.message) || 'Benutzer konnte nicht erstellt werden.', 'error');
            return;
          }

          notify('Benutzer erstellt.', 'success');
          state.activeView = 'admin:users';
          await renderPageContent();
        });
      }

      const filter = document.getElementById('adminUserRoleFilter');
      if (filter) {
        filter.addEventListener('change', async () => {
          const rows = document.querySelectorAll('#adminUserTable tbody tr[data-user-row]');
          const selected = filter.value;
          rows.forEach((row) => {
            const roleValue = (row.getAttribute('data-role') || '').split(',').map((value) => value.trim());
            const shouldShow = selected === 'all' || roleValue.includes(selected);
            row.style.display = shouldShow ? '' : 'none';
          });
        });
      }
      return;
    }

    if (view === 'admin:roles') {
      page.innerHTML = await renderAdminRoles();
      return;
    }

    if (view === 'admin:permissions') {
      page.innerHTML = await renderAdminPermissions();
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

    if (view === 'developer:tests') {
      const checks = [
        { name: 'Core', ok: !!window.Core },
        { name: 'CoreAuth', ok: !!window.CoreAuth },
        { name: 'CoreAccess', ok: !!window.CoreAccess },
        { name: 'CoreAudit', ok: !!window.CoreAudit },
        { name: 'ModuleRegistry', ok: !!window.ModuleRegistry },
        { name: 'ModuleManager', ok: !!window.ModuleManager },
        { name: 'DatabaseManager', ok: !!window.DatabaseManager },
        { name: 'UserModule', ok: !!window.UserModule }
      ];
      page.innerHTML = `<div class="card"><div class="card-header"><h2 class="card-title">Technische Tests</h2></div><div class="table-wrap"><table><thead><tr><th>Prüfung</th><th>Ergebnis</th></tr></thead><tbody>${checks.map((check) => `<tr><td>${escapeHtml(check.name)}</td><td><span class="status-pill ${check.ok ? 'active' : 'disabled'}">${check.ok ? 'pass' : 'fail'}</span></td></tr>`).join('')}</tbody></table></div></div>`;
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
      case 'modules':
        renderModuleList();
        break;
      default:
        if (state.activeView && state.activeView.startsWith('module:')) {
          renderModuleCard(state.activeView);
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
    const profileBtn = document.getElementById('profileBtn');

    const doLogin = async () => {
      await ensureRuntime();
      const usernameInput = document.getElementById('loginUsername');
      const passwordInput = document.getElementById('loginPassword');
      const username = usernameInput ? usernameInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!window.UserModule || typeof window.UserModule.login !== 'function') {
        notify('Das User-Modul ist nicht verfügbar.', 'error');
        return;
      }

      const result = await window.UserModule.login({ username, password });
      if (!result || !result.ok) {
        notify(result && result.message ? result.message : 'Anmeldung fehlgeschlagen.', 'error');
        return;
      }

      renderLoginState();
      renderSummary();
      refreshNavigation();
      if (!enforceAccess()) {
        return;
      }
      await renderPageContent();
      notify('Anmeldung erfolgreich.', 'success');
    };

    if (loginBtn) loginBtn.addEventListener('click', doLogin);

    const doLogout = async () => {
      if (window.UserModule && typeof window.UserModule.logout === 'function') {
        await window.UserModule.logout();
      } else if (window.CoreAuth && typeof window.CoreAuth.logout === 'function') {
        await window.CoreAuth.logout();
      }
      state.activeView = defaultView;
      renderLoginState();
      renderSummary();
      refreshNavigation();
      await renderPageContent();
      notify('Abgemeldet.', 'info');
    };

    if (logoutBtn) logoutBtn.addEventListener('click', doLogout);

    if (profileBtn) {
      profileBtn.addEventListener('click', async () => {
        state.activeView = 'profile';
        refreshNavigation();
        await renderPageContent();
      });
    }

    if (setPasswordBtn) {
      setPasswordBtn.addEventListener('click', () => {
        const passwordInput = document.getElementById('developerPassword');
        const value = passwordInput ? passwordInput.value : '';
        if (!window.CoreAuth || typeof window.CoreAuth.setDeveloperPassword !== 'function') {
          notify('Core Auth ist nicht verfügbar.', 'error');
          return;
        }
        const result = window.CoreAuth.setDeveloperPassword(value);
        if (result && result.ok) {
          notify('Developer-Passwort gespeichert.', 'success');
        } else {
          notify((result && result.message) || 'Passwort konnte nicht gesetzt werden.', 'error');
        }
      });
    }
  };

  const renderLoginState = () => {
    const currentUser = getCurrentUser();
    const authPanel = document.getElementById('authPanel');
    const appShell = document.getElementById('appShell');
    const accessDenied = document.getElementById('accessDenied');

    if (accessDenied) accessDenied.classList.add('hidden');

    if (!currentUser) {
      if (authPanel) authPanel.classList.remove('hidden');
      if (appShell) appShell.classList.add('hidden');
      return;
    }

    if (authPanel) authPanel.classList.add('hidden');
    if (appShell) appShell.classList.remove('hidden');
  };

  const denyAccess = (message) => {
    const authPanel = document.getElementById('authPanel');
    const appShell = document.getElementById('appShell');
    const accessDenied = document.getElementById('accessDenied');
    const main = document.getElementById('mainContent');

    if (authPanel) authPanel.classList.add('hidden');
    if (appShell) appShell.classList.add('hidden');
    if (accessDenied) accessDenied.classList.remove('hidden');
    if (main) main.innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
  };

  const enforceAccess = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return true;
    }

    if (pageType === 'admin' && !canViewAdmin(currentUser)) {
      denyAccess('Zugriff verweigert. Admin-Berechtigung erforderlich.');
      return false;
    }

    if (pageType === 'developer' && !canViewDeveloper(currentUser)) {
      denyAccess('Zugriff verweigert. Developer-Berechtigung erforderlich.');
      return false;
    }

    return true;
  };

  const init = async () => {
    await ensureRuntime();

    if (window.CoreAuth && typeof window.CoreAuth.init === 'function') {
      window.CoreAuth.init();
    }

    if (window.UserModule && typeof window.UserModule.init === 'function') {
      window.UserModule.init();
    }

    renderLoginState();
    renderSummary();
    if (pageType === 'user') {
      renderUserMenu();
    } else {
      bindStaticNavigation();
    }
    bindAuth();
    if (!enforceAccess()) {
      return;
    }
    await renderPageContent();
  };

  window.addEventListener('DOMContentLoaded', init);
})();
