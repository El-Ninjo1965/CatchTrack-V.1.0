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
    mainContent: document.getElementById('mainContent'),
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

  const state = {
    activeView: 'dashboard'
  };

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

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
          : Array.isArray(module.manifest && module.manifest.permissions)
            ? module.manifest.permissions
            : [];
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
        description: module.description || (module.manifest ? module.manifest.description : '') || '',
        menu: module.menu || module.name || module.id,
        capability: Array.isArray(module.capabilities) ? module.capabilities[0] : null
      }));
  };

  const buildNavItems = (items, container) => {
    container.innerHTML = '';
    items.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `nav-item${state.activeView === item.id ? ' active' : ''}`;
      button.textContent = item.label;
      button.addEventListener('click', () => {
        setConsole(`Activated menu: ${item.label}`);
        state.activeView = item.id;
        void renderMainContent();
        Array.from(container.querySelectorAll('.nav-item')).forEach((navButton) => {
          navButton.classList.toggle('active', navButton.textContent === item.label && navButton === button);
        });
      });
      container.appendChild(button);
    });
  };

  const roleClass = (role) => (role || 'user').toLowerCase();

  const ensureDefaultView = () => {
    if (!state.activeView || !state.activeView.trim()) {
      state.activeView = 'dashboard';
    }
  };

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
      state.activeView = 'dashboard';
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

    ensureDefaultView();

    const userMenuItems = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'profile', label: 'Profil' },
      { id: 'settings', label: 'Einstellungen' }
    ];

    const systemModules = getVisibleModules();
    const dynamicUserMenu = systemModules.map((module) => ({ id: `module:${module.id}`, label: module.name || module.id }));
    const mergedUserMenu = [...userMenuItems, ...dynamicUserMenu];
    buildNavItems(mergedUserMenu, elements.userMenu);

    const adminAllowed = window.CoreAccess && typeof window.CoreAccess.can === 'function'
      ? window.CoreAccess.can(currentUser, 'system:view', 'user')
      : { ok: false };

    if (adminAllowed.ok) {
      const adminEntries = [
        { id: 'admin:users', label: 'Benutzer' },
        { id: 'admin:roles', label: 'Rollen' },
        { id: 'admin:permissions', label: 'Permissions' },
        { id: 'admin:module', label: 'Module' },
        { id: 'admin:audit', label: 'Audit' },
        { id: 'admin:systemstatus', label: 'Systemstatus' }
      ];
      buildNavItems(adminEntries, elements.adminMenu);
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
      const devEntries = [
        { id: 'developer:core-status', label: 'Core Status' },
        { id: 'developer:module-status', label: 'Module Status' },
        { id: 'developer:diagnostics', label: 'Diagnostics' },
        { id: 'developer:console', label: 'Console' },
        { id: 'developer:audit', label: 'Audit' }
      ];
      buildNavItems(devEntries, elements.developerMenu);
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

    elements.activeModules.innerHTML = moduleList.map((module) => `<span class="chip">${escapeHtml(module.name)}</span>`).join('');
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

  const renderHtmlTable = (headers, rows) => {
    if (!rows || rows.length === 0) {
      return '<p>Keine Einträge verfügbar.</p>';
    }

    const headerMarkup = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('');
    const rowMarkup = rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell ?? '')}</td>`).join('')}</tr>`).join('');
    return `
      <table>
        <thead><tr>${headerMarkup}</tr></thead>
        <tbody>${rowMarkup}</tbody>
      </table>
    `;
  };

  const renderDashboardView = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return '<div class="view-shell"><h2 class="view-title">Dashboard</h2><p>Bitte melden Sie sich an.</p></div>';
    }

    const activeModules = getVisibleModules();
    const stats = window.AdminModule && typeof window.AdminModule.getSystemStats === 'function'
      ? await Promise.resolve(window.AdminModule.getSystemStats())
      : null;
    const totalModules = stats && typeof stats.moduleCount === 'number' ? stats.moduleCount : activeModules.length;
    const systemHint = stats && stats.healthy !== undefined
      ? 'System operational'
      : 'System ready';

    return `
      <div class="view-shell">
        <div class="view-header">
          <h2 class="view-title">Dashboard</h2>
          <span class="pill">${escapeHtml(currentUser.status || 'active')}</span>
        </div>

        <div class="stats-grid">
          <div class="stat-card"><span class="stat-label">Benutzer</span><span class="stat-value">${escapeHtml(currentUser.username)}</span></div>
          <div class="stat-card"><span class="stat-label">Rolle</span><span class="stat-value">${escapeHtml((currentUser.roles || ['user']).join(', '))}</span></div>
          <div class="stat-card"><span class="stat-label">Status</span><span class="stat-value">${escapeHtml(currentUser.status || 'active')}</span></div>
          <div class="stat-card"><span class="stat-label">Apps</span><span class="stat-value">${activeModules.length}</span></div>
          <div class="stat-card"><span class="stat-label">Aktive Module</span><span class="stat-value">${totalModules}</span></div>
          <div class="stat-card"><span class="stat-label">Hinweis</span><span class="stat-value">${escapeHtml(systemHint)}</span></div>
        </div>

        <div class="meta-grid">
          <div class="meta-card">
            <strong>Aktuelle Benutzerinformationen</strong>
            <div>Username: ${escapeHtml(currentUser.username)}</div>
            <div>Display ID: ${escapeHtml(currentUser.displayId || 'USR-000000')}</div>
            <div>Rolle: ${escapeHtml((currentUser.roles || ['user']).join(', '))}</div>
          </div>
          <div class="meta-card">
            <strong>Verfügbare Apps</strong>
            <div class="tag-list">${activeModules.length > 0 ? activeModules.map((module) => `<span class="tag">${escapeHtml(module.name)}</span>`).join('') : '<span class="tag">Keine Apps</span>'}</div>
          </div>
        </div>
      </div>
    `;
  };

  const renderProfileView = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return '<div class="view-shell"><h2 class="view-title">Profil</h2><p>Bitte melden Sie sich an.</p></div>';
    }

    const permissions = Array.isArray(currentUser.permissions) && currentUser.permissions.length > 0
      ? currentUser.permissions
      : ['Keine expliziten Permissions'];

    return `
      <div class="view-shell">
        <div class="view-header">
          <h2 class="view-title">Profil</h2>
          <span class="pill">${escapeHtml((currentUser.roles || ['user']).join(', '))}</span>
        </div>

        <div class="meta-grid">
          <div class="meta-card">
            <strong>Account</strong>
            <div>Username: ${escapeHtml(currentUser.username)}</div>
            <div>Display ID: ${escapeHtml(currentUser.displayId || 'USR-000000')}</div>
            <div>Status: ${escapeHtml(currentUser.status || 'active')}</div>
          </div>
          <div class="meta-card">
            <strong>Rolle und Schutz</strong>
            <div>Rolle: ${escapeHtml((currentUser.roles || ['user']).join(', '))}</div>
            <div>Protected: ${currentUser.protected ? 'Ja' : 'Nein'}</div>
          </div>
        </div>

        <div class="meta-card" style="margin-top: 16px;">
          <strong>Permissions</strong>
          <div class="tag-list">${permissions.map((permission) => `<span class="tag">${escapeHtml(permission)}</span>`).join('')}</div>
        </div>
      </div>
    `;
  };

  const renderModuleView = async (moduleId) => {
    const registry = window.ModuleRegistry && typeof window.ModuleRegistry.get === 'function'
      ? window.ModuleRegistry.get(moduleId)
      : null;
    const module = registry || getVisibleModules().find((entry) => entry.id === moduleId) || null;

    if (!module) {
      return `
        <div class="view-shell">
          <h2 class="view-title">Modul nicht gefunden</h2>
          <p>Das ausgewählte Modul ist nicht verfügbar.</p>
        </div>
      `;
    }

    const permissions = Array.isArray(module.permissions) && module.permissions.length > 0
      ? module.permissions
      : ['module:read'];

    return `
      <div class="view-shell">
        <div class="view-header">
          <h2 class="view-title">${escapeHtml(module.name || module.id)}</h2>
          <span class="pill">${escapeHtml(module.status || 'active')}</span>
        </div>
        <p>${escapeHtml(module.description || 'Modul verfügbar')}</p>
        <div class="meta-grid">
          <div class="meta-card">
            <strong>Modulstatus</strong>
            <div>Status: ${escapeHtml(module.status || 'active')}</div>
            <div>Capability: ${escapeHtml(module.capability || 'n/a')}</div>
          </div>
          <div class="meta-card">
            <strong>Platzhalter-UI</strong>
            <div>Modul verfügbar</div>
            <div>Dieses Modul ist registriert und aktiv.</div>
            <div>UI noch nicht implementiert.</div>
          </div>
        </div>
        <div class="meta-card" style="margin-top: 16px;">
          <strong>Permissions</strong>
          <div class="tag-list">${permissions.map((permission) => `<span class="tag">${escapeHtml(permission)}</span>`).join('')}</div>
        </div>
      </div>
    `;
  };

  const renderAdminUsersView = async () => {
    const usersResult = window.UserModule && typeof window.UserModule.listUsers === 'function'
      ? await window.UserModule.listUsers()
      : null;
    const items = usersResult && Array.isArray(usersResult.data && usersResult.data.items) ? usersResult.data.items : [];
    const rows = items.map((user) => [
      user.username || '',
      user.displayId || '',
      Array.isArray(user.roles) ? user.roles.join(', ') : '',
      user.status || '',
      user.protected ? 'Ja' : 'Nein'
    ]);

    return `
      <div class="view-shell">
        <h2 class="view-title">Benutzer</h2>
        ${renderHtmlTable(['Username', 'Display ID', 'Rolle', 'Status', 'Protected'], rows)}
      </div>
    `;
  };

  const renderAdminRolesView = async () => {
    const usersResult = window.UserModule && typeof window.UserModule.listUsers === 'function'
      ? await window.UserModule.listUsers()
      : null;
    const items = usersResult && Array.isArray(usersResult.data && usersResult.data.items) ? usersResult.data.items : [];
    const roles = Array.from(new Set(items.flatMap((user) => Array.isArray(user.roles) ? user.roles : [user.role || 'user'])));

    return `
      <div class="view-shell">
        <h2 class="view-title">Rollen</h2>
        <div class="tag-list">${roles.length > 0 ? roles.map((role) => `<span class="tag">${escapeHtml(role)}</span>`).join('') : '<span class="tag">Keine Rollen</span>'}</div>
      </div>
    `;
  };

  const renderAdminPermissionsView = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return '<div class="view-shell"><h2 class="view-title">Permissions</h2><p>Bitte melden Sie sich an.</p></div>';
    }

    const permissions = Array.isArray(currentUser.permissions) ? currentUser.permissions : [];
    const checks = ['user:read', 'user:write', 'system:view', 'module:read'];
    const tableRows = checks.map((permission) => [permission, window.CoreAccess && typeof window.CoreAccess.hasPermission === 'function' && window.CoreAccess.hasPermission(currentUser, permission) ? 'Ja' : 'Nein']);

    return `
      <div class="view-shell">
        <h2 class="view-title">Permissions</h2>
        ${renderHtmlTable(['Permission', 'Zugriff'], tableRows)}
        <div class="meta-card" style="margin-top: 16px;">
          <strong>Aktive Permissions</strong>
          <div class="tag-list">${permissions.length > 0 ? permissions.map((permission) => `<span class="tag">${escapeHtml(permission)}</span>`).join('') : '<span class="tag">Keine Permissions</span>'}</div>
        </div>
      </div>
    `;
  };

  const renderAdminModuleView = async () => {
    const modules = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
      ? window.ModuleRegistry.getAll()
      : [];
    const rows = modules.map((module) => [module.id || '', module.name || '', module.status || 'available', Array.isArray(module.capabilities) ? module.capabilities.join(', ') : '']);

    return `
      <div class="view-shell">
        <h2 class="view-title">Module</h2>
        ${renderHtmlTable(['ID', 'Name', 'Status', 'Capabilities'], rows)}
      </div>
    `;
  };

  const renderAdminAuditView = async () => {
    const audit = window.CoreAudit && typeof window.CoreAudit.list === 'function'
      ? window.CoreAudit.list()
      : [];
    const rows = audit.slice(-12).map((entry) => [
      entry && entry.type ? entry.type : '',
      entry && entry.action ? entry.action : '',
      entry && entry.result ? entry.result : '',
      entry && entry.timestamp ? new Date(entry.timestamp).toISOString() : ''
    ]);

    return `
      <div class="view-shell">
        <h2 class="view-title">Audit</h2>
        ${renderHtmlTable(['Type', 'Action', 'Result', 'Timestamp'], rows)}
      </div>
    `;
  };

  const renderAdminSystemStatusView = async () => {
    const health = window.AdminModule && typeof window.AdminModule.getDebugInfo === 'function'
      ? await Promise.resolve(window.AdminModule.getDebugInfo())
      : null;

    return `
      <div class="view-shell">
        <h2 class="view-title">Systemstatus</h2>
        <pre class="log">${escapeHtml(health ? JSON.stringify(health, null, 2) : 'System status unavailable.')}</pre>
      </div>
    `;
  };

  const renderDeveloperCoreStatusView = async () => {
    const health = window.AdminModule && typeof window.AdminModule.healthCheck === 'function'
      ? window.AdminModule.healthCheck()
      : { healthy: false, message: 'Health check unavailable' };

    return `
      <div class="view-shell">
        <h2 class="view-title">Core Status</h2>
        <pre class="log">${escapeHtml(JSON.stringify(health, null, 2))}</pre>
      </div>
    `;
  };

  const renderDeveloperModuleStatusView = async () => {
    const modules = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
      ? window.ModuleRegistry.getAll()
      : [];
    const rows = modules.map((module) => [module.id || '', module.name || '', module.status || 'available', Array.isArray(module.permissions) ? module.permissions.join(', ') : '']);

    return `
      <div class="view-shell">
        <h2 class="view-title">Module Status</h2>
        ${renderHtmlTable(['ID', 'Name', 'Status', 'Permissions'], rows)}
      </div>
    `;
  };

  const renderDeveloperDiagnosticsView = async () => {
    const debugInfo = window.AdminModule && typeof window.AdminModule.getDebugInfo === 'function'
      ? await Promise.resolve(window.AdminModule.getDebugInfo())
      : null;

    return `
      <div class="view-shell">
        <h2 class="view-title">Diagnostics</h2>
        <pre class="log">${escapeHtml(debugInfo ? JSON.stringify(debugInfo, null, 2) : 'No diagnostics available.')}</pre>
      </div>
    `;
  };

  const renderDeveloperConsoleView = async () => {
    return `
      <div class="view-shell">
        <h2 class="view-title">Console</h2>
        <pre class="log">${escapeHtml(elements.consoleLog.textContent || 'Console is empty.')}</pre>
      </div>
    `;
  };

  const renderDeveloperAuditView = async () => {
    const audit = window.CoreAudit && typeof window.CoreAudit.list === 'function'
      ? window.CoreAudit.list()
      : [];
    const rows = audit.slice(-10).map((entry) => [
      entry && entry.type ? entry.type : '',
      entry && entry.action ? entry.action : '',
      entry && entry.result ? entry.result : '',
      entry && entry.timestamp ? new Date(entry.timestamp).toISOString() : ''
    ]);

    return `
      <div class="view-shell">
        <h2 class="view-title">Audit</h2>
        ${renderHtmlTable(['Type', 'Action', 'Result', 'Timestamp'], rows)}
      </div>
    `;
  };

  const renderMainContent = async () => {
    if (!elements.mainContent) {
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      elements.mainContent.innerHTML = '<div class="view-shell"><h2 class="view-title">Bitte anmelden</h2><p>Bitte melden Sie sich an, um den Master-Content zu sehen.</p></div>';
      return;
    }

    const viewId = state.activeView || 'dashboard';

    if (viewId === 'dashboard') {
      elements.mainContent.innerHTML = await renderDashboardView();
      return;
    }

    if (viewId === 'profile') {
      elements.mainContent.innerHTML = await renderProfileView();
      return;
    }

    if (viewId === 'settings') {
      elements.mainContent.innerHTML = '<div class="view-shell"><h2 class="view-title">Einstellungen</h2><p>Diese Ansicht ist noch nicht implementiert.</p></div>';
      return;
    }

    if (viewId.startsWith('module:')) {
      elements.mainContent.innerHTML = await renderModuleView(viewId.replace(/^module:/, ''));
      return;
    }

    if (viewId === 'admin:users') {
      elements.mainContent.innerHTML = await renderAdminUsersView();
      return;
    }

    if (viewId === 'admin:roles') {
      elements.mainContent.innerHTML = await renderAdminRolesView();
      return;
    }

    if (viewId === 'admin:permissions') {
      elements.mainContent.innerHTML = await renderAdminPermissionsView();
      return;
    }

    if (viewId === 'admin:module') {
      elements.mainContent.innerHTML = await renderAdminModuleView();
      return;
    }

    if (viewId === 'admin:audit') {
      elements.mainContent.innerHTML = await renderAdminAuditView();
      return;
    }

    if (viewId === 'admin:systemstatus') {
      elements.mainContent.innerHTML = await renderAdminSystemStatusView();
      return;
    }

    if (viewId === 'developer:core-status') {
      elements.mainContent.innerHTML = await renderDeveloperCoreStatusView();
      return;
    }

    if (viewId === 'developer:module-status') {
      elements.mainContent.innerHTML = await renderDeveloperModuleStatusView();
      return;
    }

    if (viewId === 'developer:diagnostics') {
      elements.mainContent.innerHTML = await renderDeveloperDiagnosticsView();
      return;
    }

    if (viewId === 'developer:console') {
      elements.mainContent.innerHTML = await renderDeveloperConsoleView();
      return;
    }

    if (viewId === 'developer:audit') {
      elements.mainContent.innerHTML = await renderDeveloperAuditView();
      return;
    }

    elements.mainContent.innerHTML = await renderDashboardView();
  };

  const refreshUi = async () => {
    renderUserState();
    renderAccessMenu();
    renderModules();
    renderSystemStatus();
    renderPermissions();
    renderAdminState();
    renderAuditState();
    await renderMainContent();
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
        developerPassword: ''
      });
    }

    const bootstrap = readBootstrapConfig();
    elements.developerUsername.value = bootstrap.developerUsername || 'developer';
    elements.developerPassword.value = bootstrap.developerPassword || '';

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

    state.activeView = 'dashboard';
    await refreshUi();
  };

  const logout = async () => {
    if (!window.UserModule || typeof window.UserModule.logout !== 'function') {
      return;
    }
    await window.UserModule.logout();
    state.activeView = 'dashboard';
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
      }
      if (action === 'profile') {
        state.activeView = 'profile';
        await renderMainContent();
      }
      if (action === 'settings') {
        state.activeView = 'settings';
        await renderMainContent();
      }
      setConsole(`Account action: ${action}`);
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
