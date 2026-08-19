(() => {
  'use strict';

  const pageType = document.body.dataset.page || 'user';
  const defaultView = pageType === 'admin'
    ? 'admin:dashboard'
    : pageType === 'developer'
      ? 'developer:core'
      : pageType === 'setup'
        ? 'setup:overview'
        : 'dashboard';
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

    if (hasRole(user, 'developer') || hasRole(user, 'admin') || hasPermission(user, 'system:view')) {
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

  const fetchJson = async (url, fallback = { ok: false }, options = {}) => {
    try {
      const response = await fetch(url, { cache: 'no-store', ...options });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { ...fallback, ok: false, status: response.status, payload };
      }
      return { ok: true, ...payload, status: response.status };
    } catch (error) {
      console.warn(`Admin fetch failed for ${url}:`, error);
      return { ...fallback, ok: false, message: error && error.message ? error.message : 'Request failed.' };
    }
  };

  const getCurrentRoleHeaders = () => {
    const user = getCurrentUser();
    const roles = user && Array.isArray(user.roles) ? user.roles.filter(Boolean).map(String) : [];
    const primaryRole = roles.length ? roles[0] : 'user';

    return {
      'x-framework-user-id': user && user.id ? String(user.id) : '',
      'x-framework-role': roles.join(','),
      'x-user-role': primaryRole,
      'x-admin-role': roles.join(','),
      'x-framework-permissions': user && Array.isArray(user.permissions) ? user.permissions.filter(Boolean).map(String).join(',') : ''
    };
  };

  const postJson = async (url, payload, fallback = { ok: false }) => fetchJson(url, fallback, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getCurrentRoleHeaders() },
    body: JSON.stringify(payload)
  });

  const bindActionButtons = () => {
    document.querySelectorAll('[data-admin-action]').forEach((button) => {
      button.onclick = async (event) => {
        event.preventDefault();
        const action = button.dataset.adminAction;
        const statusTarget = document.getElementById('adminActionStatus');

        try {
          if (action === 'server-test') {
            const payload = { serverUrl: document.getElementById('serverUrlInput') ? document.getElementById('serverUrlInput').value : '', apiBase: document.getElementById('serverApiBaseInput') ? document.getElementById('serverApiBaseInput').value : '/api' };
            const result = await postJson('/api/server/test', payload, { ok: false, result: { status: 'ERROR', message: 'Server test failed.' } });
            if (statusTarget) {
              statusTarget.textContent = result && result.result && result.result.message ? result.result.message : 'Server test failed.';
              statusTarget.className = result && result.ok ? 'message success' : 'message error';
            }
          }

          if (action === 'database-test') {
            const payload = {
              type: document.getElementById('dbTypeInput') ? document.getElementById('dbTypeInput').value : 'indexeddb',
              name: document.getElementById('dbNameInput') ? document.getElementById('dbNameInput').value : '',
              host: document.getElementById('dbHostInput') ? document.getElementById('dbHostInput').value : '',
              url: document.getElementById('dbUrlInput') ? document.getElementById('dbUrlInput').value : ''
            };
            const result = await postJson('/api/database/test', payload, { ok: false, status: 'NOT_CONFIGURED', database: { message: 'Database not configured.' } });
            if (statusTarget) {
              statusTarget.textContent = result && result.database && result.database.message ? result.database.message : 'Database test unavailable.';
              statusTarget.className = result && result.ok ? 'message success' : 'message warning';
            }
          }

          if (action === 'connection-save') {
            const form = button.closest('form');
            if (!form) return;
            const payload = Object.fromEntries(new FormData(form).entries());
            const result = await postJson('/api/connections', payload, { ok: false, connection: null });
            if (statusTarget) {
              statusTarget.textContent = result && result.ok ? 'Connection saved.' : (result && result.message ? result.message : 'Connection save failed.');
              statusTarget.className = result && result.ok ? 'message success' : 'message error';
            }
          }

          if (action === 'device-save') {
            const payload = {
              deviceId: document.getElementById('deviceIdInput') ? document.getElementById('deviceIdInput').value : '',
              name: document.getElementById('deviceNameInput') ? document.getElementById('deviceNameInput').value : '',
              type: document.getElementById('deviceTypeInput') ? document.getElementById('deviceTypeInput').value : 'generic',
              status: document.getElementById('deviceStatusInput') ? document.getElementById('deviceStatusInput').value : 'inactive',
              userId: document.getElementById('deviceUserIdInput') ? document.getElementById('deviceUserIdInput').value : '',
              lastContactAt: document.getElementById('deviceContactInput') ? document.getElementById('deviceContactInput').value : ''
            };
            const result = await postJson('/api/devices', payload, { ok: false, device: null });
            if (statusTarget) {
              statusTarget.textContent = result && result.ok ? 'Device saved.' : (result && result.message ? result.message : 'Device save failed.');
              statusTarget.className = result && result.ok ? 'message success' : 'message error';
            }
          }

          if (action === 'license-save') {
            const payload = {
              licenseId: document.getElementById('licenseIdInput') ? document.getElementById('licenseIdInput').value : '',
              type: document.getElementById('licenseTypeInput') ? document.getElementById('licenseTypeInput').value : 'standard',
              status: document.getElementById('licenseStatusInput') ? document.getElementById('licenseStatusInput').value : 'inactive',
              validUntil: document.getElementById('licenseValidUntilInput') ? document.getElementById('licenseValidUntilInput').value : '',
              userId: document.getElementById('licenseUserIdInput') ? document.getElementById('licenseUserIdInput').value : '',
              deviceId: document.getElementById('licenseDeviceIdInput') ? document.getElementById('licenseDeviceIdInput').value : ''
            };
            const result = await postJson('/api/licenses', payload, { ok: false, license: null });
            if (statusTarget) {
              statusTarget.textContent = result && result.ok ? 'License saved.' : (result && result.message ? result.message : 'License save failed.');
              statusTarget.className = result && result.ok ? 'message success' : 'message error';
            }
          }

          if (action === 'user-save') {
            const actor = getCurrentUser();
            if (!actor) {
              throw new Error('User management requires an authenticated admin or developer.');
            }
            const payload = {
              username: document.getElementById('newUserUsernameInput') ? document.getElementById('newUserUsernameInput').value : '',
              displayName: document.getElementById('newUserDisplayNameInput') ? document.getElementById('newUserDisplayNameInput').value : '',
              email: document.getElementById('newUserEmailInput') ? document.getElementById('newUserEmailInput').value : '',
              roles: [document.getElementById('newUserRoleInput') ? document.getElementById('newUserRoleInput').value : 'user'].filter(Boolean)
            };
            if (!window.AdminModule || typeof window.AdminModule.createUser !== 'function') {
              throw new Error('User management is unavailable.');
            }
            const result = await window.AdminModule.createUser(payload, actor);
            if (statusTarget) {
              statusTarget.textContent = result && result.ok ? 'User created.' : (result && result.message ? result.message : 'User creation failed.');
              statusTarget.className = result && result.ok ? 'message success' : 'message error';
            }
          }

          if (action === 'updates-check') {
            const payload = {
              currentVersion: document.getElementById('updateCurrentVersionInput') ? document.getElementById('updateCurrentVersionInput').value : '',
              availableVersion: document.getElementById('updateAvailableVersionInput') ? document.getElementById('updateAvailableVersionInput').value : '',
              source: document.getElementById('updateSourceInput') ? document.getElementById('updateSourceInput').value : 'local'
            };
            const result = await postJson('/api/updates/check', payload, { ok: false, updates: {} });
            if (statusTarget) {
              statusTarget.textContent = result && result.updates && result.updates.message ? result.updates.message : 'Update check failed.';
              statusTarget.className = result && result.ok ? 'message success' : 'message error';
            }
          }

          if (action === 'setup-save') {
            const form = button.closest('form');
            if (!form) return;
            const payload = {
              appId: form.querySelector('[name="appId"]') ? form.querySelector('[name="appId"]').value : 'neutral-app',
              appName: form.querySelector('[name="appName"]') ? form.querySelector('[name="appName"]').value : 'Neutral App',
              configuration: {
                serverUrl: form.querySelector('[name="serverUrl"]') ? form.querySelector('[name="serverUrl"]').value : '',
                apiBase: form.querySelector('[name="apiBase"]') ? form.querySelector('[name="apiBase"]').value : '/api',
                database: {
                  type: form.querySelector('[name="databaseType"]') ? form.querySelector('[name="databaseType"]').value : 'indexeddb',
                  name: form.querySelector('[name="databaseName"]') ? form.querySelector('[name="databaseName"]').value : ''
                }
              },
              bootstrapState: {
                configured: true,
                enabled: true,
                username: 'developer',
                displayId: 'USR-000001',
                role: 'developer'
              }
            };
            const result = await postJson('/api/setup', payload, { ok: false, setup: {} });
            if (statusTarget) {
              statusTarget.textContent = result && result.ok ? 'Setup saved successfully.' : 'Setup could not be saved.';
              statusTarget.className = result && result.ok ? 'message success' : 'message error';
            }
          }

          if (action === 'setup-activate') {
            const result = await postJson('/api/setup/activate', {
              currentStep: 'runtime',
              message: 'Installation activated.'
            }, { ok: false, setup: {} });
            if (statusTarget) {
              statusTarget.textContent = result && result.ok ? 'System activated. Redirecting to admin workspace.' : 'Activation failed.';
              statusTarget.className = result && result.ok ? 'message success' : 'message error';
            }
            if (result && result.ok) {
              setTimeout(() => { window.location.replace('admin.html'); }, 500);
            }
          }
        } catch (error) {
          if (statusTarget) {
            statusTarget.className = 'message error';
            statusTarget.textContent = error && error.message ? error.message : 'Action failed.';
          }
        }
      };
    });
  };

  const getModuleCatalog = () => window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
    ? window.ModuleRegistry.getAll()
    : [];

  const getFrameworkVersion = () => {
    if (window.CoreConfig && window.CoreConfig.core && typeof window.CoreConfig.core.version === 'string') {
      return window.CoreConfig.core.version;
    }
    if (window.MasterFramework && typeof window.MasterFramework.version === 'string') {
      return window.MasterFramework.version;
    }
    if (window.App && typeof window.App.version === 'string') {
      return window.App.version;
    }
    return '1.0.0';
  };

  const getAppVersion = () => {
    if (window.App && typeof window.App.version === 'string') {
      return window.App.version;
    }
    if (window.MasterFramework && window.MasterFramework.getApp && typeof window.MasterFramework.getApp === 'function') {
      const app = window.MasterFramework.getApp('neutral-app');
      if (app && app.version) return app.version;
    }
    return '1.0.0';
  };

  const getDatabaseStatus = () => {
    if (window.DatabaseManager && typeof window.DatabaseManager.getStatus === 'function') {
      const status = window.DatabaseManager.getStatus();
      if (status && typeof status === 'object') {
        return status;
      }
    }
    return {
      status: 'NOT_CONFIGURED',
      configured: false,
      initialized: false,
      message: 'Database not configured.'
    };
  };

  const describeDatabaseStatus = (status) => {
    if (!status) return 'Database not configured';
    if (typeof status === 'string') return status;
    return status.message || status.status || 'Database not configured';
  };

  const getServerStatus = async () => {
    const [healthResult, statusResult] = await Promise.all([
      fetchJson('/health', { ok: true, status: 'unknown' }),
      fetchJson('/api/status', { ok: true, runtime: {}, framework: {} })
    ]);
    return {
      health: healthResult && healthResult.status ? healthResult.status : 'unknown',
      api: statusResult && statusResult.ok ? 'healthy' : 'unavailable',
      runtime: statusResult && statusResult.runtime ? statusResult.runtime : {},
      framework: statusResult && statusResult.framework ? statusResult.framework : {}
    };
  };

  const renderAdminDashboard = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const registry = getModuleCatalog();
    const activeCount = registry.filter((module) => module && (module.active || module.status === 'enabled' || module.status === 'active')).length;
    const currentUser = getCurrentUser();
    const sessionState = window.CoreAuth && typeof window.CoreAuth.getSessionStateSnapshot === 'function'
      ? window.CoreAuth.getSessionStateSnapshot()
      : { authenticated: !!currentUser, username: currentUser ? currentUser.username : null, roles: currentUser ? currentUser.roles || [] : [] };
    const stats = window.AdminModule && typeof window.AdminModule.getSystemStats === 'function'
      ? await window.AdminModule.getSystemStats()
      : { moduleCount: registry.length, userCount: 0, uptime: 0 };
    const serverStatus = await getServerStatus();
    const errorCount = window.ErrorLog && typeof window.ErrorLog.getAll === 'function' ? window.ErrorLog.getAll().length : 0;
    const frameworkStats = serverStatus.framework && serverStatus.framework.framework ? serverStatus.framework.framework : {};

    const cards = [
      { label: 'Framework version', value: getFrameworkVersion() },
      { label: 'API version', value: (serverStatus.framework && serverStatus.framework.apiVersion) || 'v1' },
      { label: 'App version', value: getAppVersion() },
      { label: 'System status', value: window.AdminModule && typeof window.AdminModule.healthCheck === 'function' ? (window.AdminModule.healthCheck().healthy ? 'Operational' : 'Warning') : 'Unknown' },
      { label: 'Server status', value: serverStatus.api === 'healthy' ? 'Healthy' : 'Unavailable' },
      { label: 'Database status', value: describeDatabaseStatus(getDatabaseStatus()) },
      { label: 'Connection status', value: typeof serverStatus.framework.connections === 'number' ? `${serverStatus.framework.connections} configured` : 'Unknown' },
      { label: 'Module count', value: String(stats.moduleCount || registry.length) },
      { label: 'Active modules', value: String(activeCount) },
      { label: 'Device count', value: String(typeof frameworkStats.devices === 'number' ? frameworkStats.devices : 0) },
      { label: 'License count', value: String(typeof frameworkStats.licenses === 'number' ? frameworkStats.licenses : 0) },
      { label: 'Update status', value: frameworkStats.updateStatus || 'NOT_CONFIGURED' },
      { label: 'Error count', value: String(errorCount) },
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

  const renderAdminApps = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const appRegistry = window.MasterFramework && typeof window.MasterFramework.listApps === 'function'
      ? window.MasterFramework.listApps()
      : [];
    const apps = appRegistry.length ? appRegistry : [{
      appId: 'neutral-app',
      name: 'Neutral App',
      version: getAppVersion(),
      status: 'active',
      description: 'Default neutral application shell.'
    }];

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Apps</h2></div>
        <div class="content-wrap">
          <div class="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Version</th><th>Status</th><th>Description</th></tr></thead>
              <tbody>
                ${apps.map((app) => `
                  <tr>
                    <td>${escapeHtml(app.appId || app.id || 'unknown')}</td>
                    <td>${escapeHtml(app.name || app.appId || 'Unnamed app')}</td>
                    <td>${escapeHtml(app.version || '1.0.0')}</td>
                    <td><span class="status-badge ${app.active || app.status === 'active' ? 'ok' : 'warning'}">${escapeHtml(app.status || (app.active ? 'active' : 'inactive'))}</span></td>
                    <td>${escapeHtml(app.description || 'No description available')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  const renderAdminModules = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;
    const modules = getModuleCatalog();

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Modules</h2></div>
        <div class="content-wrap">
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Version</th><th>Status</th><th>Type</th><th>Dependencies</th><th>Capabilities</th></tr>
              </thead>
              <tbody>
                ${modules.length ? modules.map((module) => `
                  <tr>
                    <td>${escapeHtml(module.id || 'unknown')}</td>
                    <td>${escapeHtml(module.name || module.id || 'Module')}</td>
                    <td>${escapeHtml(module.version || '1.0.0')}</td>
                    <td><span class="status-badge ${module.active || module.status === 'enabled' || module.status === 'active' ? 'ok' : 'warning'}">${escapeHtml(module.status || (module.active ? 'enabled' : 'available'))}</span></td>
                    <td>${escapeHtml(module.type || 'framework')}</td>
                    <td>${escapeHtml(Array.isArray(module.dependencies) ? module.dependencies.join(', ') : '')}</td>
                    <td>${escapeHtml(Array.isArray(module.capabilities) ? module.capabilities.join(', ') : '')}</td>
                  </tr>
                `).join('') : '<tr><td colspan="7">No modules discovered.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  const renderAdminMarketplace = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const [marketplaceResult, moduleResult] = await Promise.all([
      fetchJson('/api/marketplace', { ok: true, marketplace: { catalog: [] }, modules: [] }),
      fetchJson('/api/marketplace/modules', { ok: true, modules: [] })
    ]);

    const catalog = Array.isArray(marketplaceResult.marketplace && marketplaceResult.marketplace.catalog)
      ? marketplaceResult.marketplace.catalog
      : [];
    const modules = Array.isArray(moduleResult.modules) ? moduleResult.modules : [];

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Marketplace</h2></div>
        <div class="content-wrap">
          <div id="adminActionStatus" class="message ${catalog.length || modules.length ? 'success' : 'warning'}">
            ${escapeHtml(catalog.length || modules.length ? 'Local catalog loaded.' : 'No marketplace entries configured.')}
          </div>
          <div class="small-muted" style="margin: 12px 0 18px;">Only local and discovered entries are displayed. No external marketplace or automatic installation is used.</div>
          <h3 style="margin: 0 0 10px;">Configured catalog</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Type</th><th>Name</th><th>Version</th><th>Status</th><th>Source</th><th>Description</th></tr></thead>
              <tbody>
                ${catalog.length ? catalog.map((item) => `
                  <tr>
                    <td>${escapeHtml(item.type || 'module')}</td>
                    <td>${escapeHtml(item.name || item.id || 'Unknown')}</td>
                    <td>${escapeHtml(item.version || '1.0.0')}</td>
                    <td><span class="status-badge ${item.status === 'enabled' || item.status === 'active' ? 'ok' : 'warning'}">${escapeHtml(item.status || 'available')}</span></td>
                    <td>${escapeHtml(item.source || 'local')}</td>
                    <td>${escapeHtml(item.description || 'No description available')}</td>
                  </tr>
                `).join('') : '<tr><td colspan="6">No catalog entries configured.</td></tr>'}
              </tbody>
            </table>
          </div>
          <h3 style="margin: 20px 0 10px;">Discovered modules</h3>
          <div class="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Version</th><th>Status</th><th>Source</th><th>Capabilities</th></tr></thead>
              <tbody>
                ${modules.length ? modules.map((item) => `
                  <tr>
                    <td>${escapeHtml(item.id || item.moduleId || 'unknown')}</td>
                    <td>${escapeHtml(item.name || item.id || 'Unknown')}</td>
                    <td>${escapeHtml(item.version || '1.0.0')}</td>
                    <td><span class="status-badge ${item.status === 'enabled' || item.status === 'active' ? 'ok' : 'warning'}">${escapeHtml(item.status || 'available')}</span></td>
                    <td>${escapeHtml(item.modulePath || item.source || 'local')}</td>
                    <td>${escapeHtml(Array.isArray(item.capabilities) && item.capabilities.length ? item.capabilities.join(', ') : '—')}</td>
                  </tr>
                `).join('') : '<tr><td colspan="6">No modules discovered in the local catalog.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  const renderAdminConnections = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const fromFramework = window.MasterFramework && typeof window.MasterFramework.listConnections === 'function'
      ? window.MasterFramework.listConnections()
      : [];
    const apiResult = await fetchJson('/api/connections', { ok: true, connections: [] });
    const connections = fromFramework.length ? fromFramework : (apiResult.connections || []);

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Connections</h2></div>
        <div class="content-wrap">
          <form class="form-grid" style="margin-bottom: 18px;">
            <div class="form-field"><label>Name</label><input type="text" name="connectionId" value="default-connection" /></div>
            <div class="form-field"><label>App</label><input type="text" name="appId" value="neutral-app" /></div>
            <div class="form-field"><label>Server URL</label><input id="connectionServerUrl" type="text" name="serverUrl" value="http://127.0.0.1:3000" /></div>
            <div class="form-field"><label>API base</label><input type="text" name="apiBase" value="/api" /></div>
            <div class="form-field"><label>Type</label><input type="text" name="authType" value="none" /></div>
            <div class="form-field"><label>Status</label><input type="text" name="status" value="inactive" /></div>
            <div class="action-list">
              <button type="button" class="primary" data-admin-action="connection-save">Save connection</button>
            </div>
          </form>
          <div id="adminActionStatus" class="message info">Connection settings are saved to the framework runtime, not stored in the repository.</div>
          <div class="table-wrap" style="margin-top: 20px;">
            <table>
              <thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Target</th><th>Service</th><th>Last test</th></tr></thead>
              <tbody>
                ${connections.length ? connections.map((connection) => `
                  <tr>
                    <td>${escapeHtml(connection.connectionId || connection.id || connection.name || 'Unknown')}</td>
                    <td>${escapeHtml(connection.authType || connection.type || 'none')}</td>
                    <td><span class="status-badge ${connection.active || connection.status === 'active' || connection.status === 'healthy' ? 'ok' : 'warning'}">${escapeHtml(connection.status || (connection.active ? 'active' : 'inactive'))}</span></td>
                    <td>${escapeHtml(connection.serverUrl || connection.url || '—')}</td>
                    <td>${escapeHtml(connection.appId || connection.service || 'framework')}</td>
                    <td>${escapeHtml(connection.lastTestAt || connection.updatedAt || 'never')}</td>
                  </tr>
                `).join('') : '<tr><td colspan="6">No connections configured.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    bindActionButtons();
  };

  const renderAdminServer = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const status = await getServerStatus();
    const health = window.AdminModule && typeof window.AdminModule.healthCheck === 'function' ? window.AdminModule.healthCheck() : { healthy: false };
    const setupStatus = await fetchJson('/api/setup/status', { ok: true, status: 'NOT_CONFIGURED', setup: {} });

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Server</h2></div>
        <div class="content-wrap">
          <div class="form-grid" style="margin-bottom: 18px;">
            <div class="form-field"><label>Server URL</label><input id="serverUrlInput" type="text" value="http://127.0.0.1:3000" /></div>
            <div class="form-field"><label>API base</label><input id="serverApiBaseInput" type="text" value="/api" /></div>
            <div class="action-list">
              <button type="button" class="primary" data-admin-action="server-test">Test server connection</button>
            </div>
          </div>
          <div id="adminActionStatus" class="message info">${escapeHtml((setupStatus && setupStatus.status) || 'NOT_CONFIGURED')}</div>
          <div class="grid">
            <div class="metric"><span class="metric-label">Server reachable</span><div class="metric-value">${status.health === 'healthy' ? 'Yes' : 'No'}</div></div>
            <div class="metric"><span class="metric-label">API reachable</span><div class="metric-value">${status.api === 'healthy' ? 'Yes' : 'No'}</div></div>
            <div class="metric"><span class="metric-label">Version</span><div class="metric-value">${escapeHtml(getFrameworkVersion())}</div></div>
            <div class="metric"><span class="metric-label">Response time</span><div class="metric-value">${status.runtime && typeof status.runtime.uptime === 'number' ? `${status.runtime.uptime}s` : 'n/a'}</div></div>
            <div class="metric"><span class="metric-label">Last check</span><div class="metric-value">${new Date().toLocaleTimeString()}</div></div>
            <div class="metric"><span class="metric-label">Error state</span><div class="metric-value">${health.healthy ? 'None' : 'Warning'}</div></div>
          </div>
        </div>
      </div>
    `;
    bindActionButtons();
  };

  const renderAdminDatabase = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const statusResponse = await fetchJson('/api/database/status', { ok: false, status: 'NOT_CONFIGURED', database: { configured: false, message: 'Database not configured' } });
    const status = statusResponse && statusResponse.database ? statusResponse.database : { configured: false, status: 'NOT_CONFIGURED', message: 'Database not configured' };

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Database</h2></div>
        <div class="content-wrap">
          <div class="form-grid" style="margin-bottom: 18px;">
            <div class="form-field"><label>Database type</label><input id="dbTypeInput" type="text" value="indexeddb" /></div>
            <div class="form-field"><label>Database name</label><input id="dbNameInput" type="text" value="CoreDB" /></div>
            <div class="form-field"><label>Host</label><input id="dbHostInput" type="text" value="" /></div>
            <div class="form-field"><label>URL</label><input id="dbUrlInput" type="text" value="" /></div>
            <div class="action-list">
              <button type="button" class="primary" data-admin-action="database-test">Test database configuration</button>
            </div>
          </div>
          <div id="adminActionStatus" class="message ${status.configured ? 'success' : 'warning'}">${escapeHtml(status.message || 'Database not configured')}</div>
          <div class="grid">
            <div class="metric"><span class="metric-label">State</span><div class="metric-value">${escapeHtml(status.status || 'NOT_CONFIGURED')}</div></div>
            <div class="metric"><span class="metric-label">Configured</span><div class="metric-value">${status.configured ? 'Yes' : 'No'}</div></div>
            <div class="metric"><span class="metric-label">Diagnostics</span><div class="metric-value">${escapeHtml(status.message || 'No database driver configured.')}</div></div>
          </div>
        </div>
      </div>
    `;
    bindActionButtons();
  };

  const renderAdminUsers = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    let rows = [];
    if (window.UserModule && typeof window.UserModule.listUsers === 'function') {
      const result = await window.UserModule.listUsers();
      rows = result && result.data && Array.isArray(result.data.items) ? result.data.items : (Array.isArray(result) ? result : []);
    }

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Users</h2></div>
        <div class="content-wrap">
          <div class="form-grid" style="margin-bottom: 18px;">
            <div class="form-field"><label>Username</label><input id="newUserUsernameInput" type="text" placeholder="new.user" /></div>
            <div class="form-field"><label>Display name</label><input id="newUserDisplayNameInput" type="text" placeholder="New User" /></div>
            <div class="form-field"><label>Email</label><input id="newUserEmailInput" type="email" placeholder="user@example.com" /></div>
            <div class="form-field"><label>Role</label><input id="newUserRoleInput" type="text" placeholder="user" /></div>
            <div class="action-list">
              <button type="button" class="primary" data-admin-action="user-save">Create user</button>
            </div>
          </div>
          <div id="adminActionStatus" class="message info">User management uses the central framework identity layer.</div>
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
    bindActionButtons();
  };

  const renderAdminRoles = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    let users = [];
    if (window.UserModule && typeof window.UserModule.listUsers === 'function') {
      const result = await window.UserModule.listUsers();
      users = result && result.data && Array.isArray(result.data.items) ? result.data.items : [];
    }

    const defaultRoles = {
      admin: ['user:read', 'user:write', 'system:view'],
      developer: ['user:read', 'user:write', 'system:view', 'module:read', 'module:update'],
      manager: ['user:read', 'user:write'],
      member: ['user:read'],
      user: ['user:read']
    };

    const roles = Object.entries(defaultRoles).map(([role, permissions]) => ({
      role,
      permissions,
      userCount: users.filter((user) => Array.isArray(user.roles) && user.roles.includes(role)).length
    }));

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Roles</h2></div>
        <div class="content-wrap">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Role</th><th>Users</th><th>Permissions</th></tr></thead>
              <tbody>
                ${roles.map((entry) => `<tr><td>${escapeHtml(entry.role)}</td><td>${escapeHtml(String(entry.userCount))}</td><td>${escapeHtml(entry.permissions.join(', '))}</td></tr>`).join('')}
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
    const permissions = [
      { permission: 'framework:read', source: 'Core framework diagnostics' },
      { permission: 'auth:read', source: 'Core auth' },
      { permission: 'auth:write', source: 'Core auth' },
      { permission: 'module:read', source: 'Core access / module registry' },
      { permission: 'module:update', source: 'Developer access' },
      { permission: 'system:view', source: 'Admin access' },
      { permission: 'user:read', source: 'Core user module' },
      { permission: 'user:write', source: 'Core user module' },
      { permission: 'connection:read', source: 'Master framework' },
      { permission: 'connection:write', source: 'Master framework' }
    ];

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Permissions</h2></div>
        <div class="content-wrap">
          <div class="grid">
            ${permissions.map((entry) => `<div class="metric"><span class="metric-label">${escapeHtml(entry.permission)}</span><div class="metric-value" style="font-size:0.85rem;">${escapeHtml(entry.source)}</div></div>`).join('')}
          </div>
        </div>
      </div>
    `;
  };

  const renderAdminDevices = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const result = await fetchJson('/api/devices', { ok: true, devices: [] });
    const devices = Array.isArray(result.devices) ? result.devices : [];
    const statusText = result.ok
      ? (devices.length ? 'Device registry loaded from the framework runtime.' : 'No devices registered yet.')
      : (result.message || 'Device registry unavailable.');

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Devices</h2></div>
        <div class="content-wrap">
          <div class="message info">${escapeHtml(statusText)}</div>
          <div class="form-grid" style="margin: 18px 0;">
            <div class="form-field"><label>Device ID</label><input id="deviceIdInput" type="text" placeholder="device-001" /></div>
            <div class="form-field"><label>Name</label><input id="deviceNameInput" type="text" placeholder="Scanner" /></div>
            <div class="form-field"><label>Type</label><input id="deviceTypeInput" type="text" placeholder="generic" /></div>
            <div class="form-field"><label>Status</label><input id="deviceStatusInput" type="text" placeholder="inactive" /></div>
            <div class="form-field"><label>User ID</label><input id="deviceUserIdInput" type="text" placeholder="optional user" /></div>
            <div class="form-field"><label>Last contact</label><input id="deviceContactInput" type="text" placeholder="2026-01-01T00:00:00.000Z" /></div>
            <div class="action-list">
              <button type="button" class="primary" data-admin-action="device-save">Save device</button>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Status</th><th>User</th><th>Last contact</th></tr></thead>
              <tbody>
                ${devices.length ? devices.map((device) => `
                  <tr>
                    <td>${escapeHtml(device.deviceId || device.id || '—')}</td>
                    <td>${escapeHtml(device.name || 'Unnamed device')}</td>
                    <td>${escapeHtml(device.type || 'generic')}</td>
                    <td><span class="status-badge ${device.status === 'active' || device.status === 'online' ? 'ok' : 'warning'}">${escapeHtml(device.status || 'inactive')}</span></td>
                    <td>${escapeHtml(device.userDisplayId || device.userId || '—')}</td>
                    <td>${escapeHtml(device.lastContactAt || device.updatedAt || 'never')}</td>
                  </tr>
                `).join('') : '<tr><td colspan="6">No devices registered.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    bindActionButtons();
  };

  const renderAdminLicenses = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const result = await fetchJson('/api/licenses', { ok: true, licenses: [] });
    const licenses = Array.isArray(result.licenses) ? result.licenses : [];
    const statusText = result.ok
      ? (licenses.length ? 'License registry loaded from the framework runtime.' : 'No licenses registered yet.')
      : (result.message || 'License registry unavailable.');

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Licenses</h2></div>
        <div class="content-wrap">
          <div class="message info">${escapeHtml(statusText)}</div>
          <div class="form-grid" style="margin: 18px 0;">
            <div class="form-field"><label>License ID</label><input id="licenseIdInput" type="text" placeholder="lic-001" /></div>
            <div class="form-field"><label>Type</label><input id="licenseTypeInput" type="text" placeholder="standard" /></div>
            <div class="form-field"><label>Status</label><input id="licenseStatusInput" type="text" placeholder="inactive" /></div>
            <div class="form-field"><label>Valid until</label><input id="licenseValidUntilInput" type="text" placeholder="2027-01-01" /></div>
            <div class="form-field"><label>User ID</label><input id="licenseUserIdInput" type="text" placeholder="optional user" /></div>
            <div class="form-field"><label>Device ID</label><input id="licenseDeviceIdInput" type="text" placeholder="optional device" /></div>
            <div class="action-list">
              <button type="button" class="primary" data-admin-action="license-save">Save license</button>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Type</th><th>Status</th><th>Valid from</th><th>Valid until</th><th>Assignment</th></tr></thead>
              <tbody>
                ${licenses.length ? licenses.map((license) => `
                  <tr>
                    <td>${escapeHtml(license.licenseId || license.id || '—')}</td>
                    <td>${escapeHtml(license.type || 'standard')}</td>
                    <td><span class="status-badge ${license.status === 'active' ? 'ok' : 'warning'}">${escapeHtml(license.status || 'inactive')}</span></td>
                    <td>${escapeHtml(license.validFrom || '—')}</td>
                    <td>${escapeHtml(license.validUntil || '—')}</td>
                    <td>${escapeHtml([license.userId, license.deviceId, license.appId, license.moduleId].filter(Boolean).join(' · ') || '—')}</td>
                  </tr>
                `).join('') : '<tr><td colspan="6">No licenses registered.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    bindActionButtons();
  };

  const renderAdminUpdates = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const [updatesResult, statusResult] = await Promise.all([
      fetchJson('/api/updates', { ok: true, updates: {} }),
      fetchJson('/api/status', { ok: true, framework: { framework: {} } })
    ]);
    const updates = updatesResult && updatesResult.updates ? updatesResult.updates : {};
    const frameworkVersion = statusResult && statusResult.framework && statusResult.framework.framework ? statusResult.framework.framework.version : getFrameworkVersion();

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Updates</h2></div>
        <div class="content-wrap">
          <div class="form-grid" style="margin-bottom: 18px;">
            <div class="form-field"><label>Current version</label><input id="updateCurrentVersionInput" type="text" value="${escapeHtml(updates.currentVersion || frameworkVersion)}" /></div>
            <div class="form-field"><label>Available version</label><input id="updateAvailableVersionInput" type="text" value="${escapeHtml(updates.availableVersion || '')}" placeholder="optional" /></div>
            <div class="form-field"><label>Source</label><input id="updateSourceInput" type="text" value="${escapeHtml(updates.source || 'local')}" /></div>
            <div class="action-list">
              <button type="button" class="primary" data-admin-action="updates-check">Check updates</button>
            </div>
          </div>
          <div id="adminActionStatus" class="message ${updates.status === 'AVAILABLE' ? 'warning' : updates.status === 'ERROR' ? 'error' : 'info'}">${escapeHtml(updates.message || 'Update state is ready.')}</div>
          <div class="grid">
            <div class="metric"><span class="metric-label">Current version</span><div class="metric-value">${escapeHtml(updates.currentVersion || frameworkVersion)}</div></div>
            <div class="metric"><span class="metric-label">Available version</span><div class="metric-value">${escapeHtml(updates.availableVersion || 'n/a')}</div></div>
            <div class="metric"><span class="metric-label">Status</span><div class="metric-value">${escapeHtml(updates.status || 'NOT_CONFIGURED')}</div></div>
            <div class="metric"><span class="metric-label">Last checked</span><div class="metric-value">${escapeHtml(updates.lastCheckedAt || 'never')}</div></div>
          </div>
          <div class="small-muted" style="margin-top:12px;">Automatic internet installation is not enabled. The API only checks locally configured update metadata.</div>
        </div>
      </div>
    `;
    bindActionButtons();
  };

  const renderAdminDiagnostics = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const errors = window.ErrorLog && typeof window.ErrorLog.getAll === 'function' ? window.ErrorLog.getAll() : [];
    const ring = window.CoreEventRing && typeof window.CoreEventRing.get === 'function' ? window.CoreEventRing.get() : {};
    const audit = window.CoreAudit && typeof window.CoreAudit.list === 'function' ? window.CoreAudit.list() : [];

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Diagnostics</h2></div>
        <div class="content-wrap">
          <div class="grid">
            <div class="metric"><span class="metric-label">Errors</span><div class="metric-value">${errors.length}</div></div>
            <div class="metric"><span class="metric-label">Audit entries</span><div class="metric-value">${audit.length}</div></div>
            <div class="metric"><span class="metric-label">Event ring keys</span><div class="metric-value">${Object.keys(ring).length}</div></div>
          </div>
          <div class="table-wrap" style="margin-top:16px;">
            <table>
              <thead><tr><th>Time</th><th>Module</th><th>Message</th><th>Status</th></tr></thead>
              <tbody>
                ${errors.length ? errors.slice(0, 8).map((entry) => `
                  <tr>
                    <td>${escapeHtml(entry.timestamp || 'unknown')}</td>
                    <td>${escapeHtml((entry.context && entry.context.type) || 'system')}</td>
                    <td>${escapeHtml(entry.message || 'No message')}</td>
                    <td><span class="status-badge warning">logged</span></td>
                  </tr>
                `).join('') : '<tr><td colspan="4">No errors recorded.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  const renderAdminAudit = () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const entries = window.CoreAudit && typeof window.CoreAudit.list === 'function' ? window.CoreAudit.list() : [];

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Audit</h2></div>
        <div class="content-wrap">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Time</th><th>Category</th><th>Action</th><th>Result</th></tr></thead>
              <tbody>
                ${entries.length ? entries.slice(0, 12).map((entry) => `
                  <tr>
                    <td>${escapeHtml(entry.timestamp || entry.createdAt || 'unknown')}</td>
                    <td>${escapeHtml(entry.category || 'system')}</td>
                    <td>${escapeHtml(entry.event || entry.action || 'unknown')}</td>
                    <td><span class="status-badge ok">${escapeHtml(entry.result || 'ok')}</span></td>
                  </tr>
                `).join('') : '<tr><td colspan="4">No audit entries available.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  const renderAdminSettings = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const setupResult = await fetchJson('/api/setup/status', { ok: true, status: 'NOT_CONFIGURED', setup: {} });
    const setup = setupResult.setup || {};
    const configuration = setup.configuration || {};
    const installation = setup.installation || {};

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Settings</h2></div>
        <div class="content-wrap">
          <form class="form-grid" style="margin-bottom: 18px;">
            <div class="form-field"><label>App ID</label><input type="text" name="appId" value="${escapeHtml(setup.appId || 'neutral-app')}" /></div>
            <div class="form-field"><label>App name</label><input type="text" name="appName" value="${escapeHtml(setup.appName || 'Neutral App')}" /></div>
            <div class="form-field"><label>Server URL</label><input type="text" name="serverUrl" value="${escapeHtml(configuration.serverUrl || 'http://127.0.0.1:3000')}" /></div>
            <div class="form-field"><label>API base</label><input type="text" name="apiBase" value="${escapeHtml(configuration.apiBase || '/api')}" /></div>
            <div class="form-field"><label>Database type</label><input type="text" name="databaseType" value="${escapeHtml((configuration.database && configuration.database.type) || 'indexeddb')}" /></div>
            <div class="form-field"><label>Database name</label><input type="text" name="databaseName" value="${escapeHtml((configuration.database && configuration.database.name) || 'CoreDB')}" /></div>
            <div class="action-list">
              <button type="button" class="primary" data-admin-action="setup-save">Save framework settings</button>
            </div>
          </form>
          <div id="adminActionStatus" class="message info">Setup status: ${escapeHtml(setup.status || 'NOT_CONFIGURED')} · installation: ${escapeHtml((installation && installation.state) || 'draft')}</div>
          <div class="grid" style="margin-top: 18px;">
            <div class="metric"><span class="metric-label">Status</span><div class="metric-value">${escapeHtml(setup.status || 'NOT_CONFIGURED')}</div></div>
            <div class="metric"><span class="metric-label">Current step</span><div class="metric-value">${escapeHtml(setup.currentStep || 'system-check')}</div></div>
            <div class="metric"><span class="metric-label">Installation active</span><div class="metric-value">${installation && installation.active ? 'Yes' : 'No'}</div></div>
            <div class="metric"><span class="metric-label">Updated at</span><div class="metric-value">${escapeHtml(setup.updatedAt || 'n/a')}</div></div>
          </div>
        </div>
      </div>
    `;
    bindActionButtons();
  };

  const renderSetupPage = async () => {
    const page = document.getElementById('mainContent');
    if (!page) return;

    const setupResult = await fetchJson('/api/setup/status', { ok: true, status: 'NOT_CONFIGURED', setup: {} });
    const setup = setupResult.setup || {};
    const configuration = setup.configuration || {};
    const installation = setup.installation || {};

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">First-run setup</h2></div>
        <div class="content-wrap">
          <div class="message info">This installation is not active yet. Configure the server, test the connections, and activate the system before using the admin workspace.</div>
          <div class="form-grid" style="margin-top: 18px; margin-bottom: 18px;">
            <div class="form-field"><label>Application ID</label><input type="text" name="appId" value="${escapeHtml(setup.appId || 'neutral-app')}" /></div>
            <div class="form-field"><label>Application name</label><input type="text" name="appName" value="${escapeHtml(setup.appName || 'Neutral App')}" /></div>
            <div class="form-field"><label>Server URL</label><input type="text" name="serverUrl" value="${escapeHtml(configuration.serverUrl || 'https://your-domain.example')}" /></div>
            <div class="form-field"><label>API base</label><input type="text" name="apiBase" value="${escapeHtml(configuration.apiBase || '/api')}" /></div>
            <div class="form-field"><label>Database type</label><input type="text" name="databaseType" value="${escapeHtml((configuration.database && configuration.database.type) || 'indexeddb')}" /></div>
            <div class="form-field"><label>Database name</label><input type="text" name="databaseName" value="${escapeHtml((configuration.database && configuration.database.name) || 'CoreDB')}" /></div>
          </div>
          <div class="action-list" style="margin-bottom: 18px;">
            <button type="button" class="primary" data-admin-action="setup-save">Save configuration</button>
            <button type="button" class="secondary" data-admin-action="server-test">Test server</button>
            <button type="button" class="secondary" data-admin-action="database-test">Test database</button>
            <button type="button" class="primary" data-admin-action="setup-activate">Activate system</button>
          </div>
          <div id="adminActionStatus" class="message info">Setup state: ${escapeHtml(setup.status || 'NOT_CONFIGURED')} · Server: ${escapeHtml((setup.serverState && setup.serverState.status) || 'NOT_CONFIGURED')} · Database: ${escapeHtml((setup.databaseState && setup.databaseState.status) || 'NOT_CONFIGURED')}</div>
          <div class="grid" style="margin-top: 18px;">
            <div class="metric"><span class="metric-label">Status</span><div class="metric-value">${escapeHtml(setup.status || 'NOT_CONFIGURED')}</div></div>
            <div class="metric"><span class="metric-label">Current step</span><div class="metric-value">${escapeHtml(setup.currentStep || 'system-check')}</div></div>
            <div class="metric"><span class="metric-label">Server</span><div class="metric-value">${escapeHtml(configuration.serverUrl || 'not configured')}</div></div>
            <div class="metric"><span class="metric-label">Database</span><div class="metric-value">${escapeHtml((configuration.database && configuration.database.name) || 'not configured')}</div></div>
            <div class="metric"><span class="metric-label">Framework</span><div class="metric-value">${escapeHtml((setup.frameworkState && setup.frameworkState.status) || 'NOT_INITIALIZED')}</div></div>
            <div class="metric"><span class="metric-label">Bootstrap</span><div class="metric-value">${escapeHtml((setup.bootstrapState && setup.bootstrapState.status) || 'NOT_CONFIGURED')}</div></div>
          </div>
        </div>
      </div>
    `;
    bindActionButtons();
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
            <div class="metric"><span class="metric-label">Core</span><div class="metric-value">${window.Core ? 'Available' : 'Unavailable'}</div></div>
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
      if (state.activeView === 'admin:apps') {
        renderAdminApps();
        return;
      }
      if (state.activeView === 'admin:modules') {
        renderAdminModules();
        return;
      }
      if (state.activeView === 'admin:marketplace') {
        await renderAdminMarketplace();
        return;
      }
      if (state.activeView === 'admin:connections') {
        await renderAdminConnections();
        return;
      }
      if (state.activeView === 'admin:server') {
        await renderAdminServer();
        return;
      }
      if (state.activeView === 'admin:database') {
        await renderAdminDatabase();
        return;
      }
      if (state.activeView === 'admin:users') {
        await renderAdminUsers();
        return;
      }
      if (state.activeView === 'admin:roles') {
        await renderAdminRoles();
        return;
      }
      if (state.activeView === 'admin:permissions') {
        renderAdminPermissions();
        return;
      }
      if (state.activeView === 'admin:devices') {
        await renderAdminDevices();
        return;
      }
      if (state.activeView === 'admin:licenses') {
        await renderAdminLicenses();
        return;
      }
      if (state.activeView === 'admin:updates') {
        renderAdminUpdates();
        return;
      }
      if (state.activeView === 'admin:diagnostics') {
        renderAdminDiagnostics();
        return;
      }
      if (state.activeView === 'admin:audit') {
        renderAdminAudit();
        return;
      }
      if (state.activeView === 'admin:settings') {
        await renderAdminSettings();
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

    if (pageType === 'setup') {
      await renderSetupPage();
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
        ? !!currentUser && (hasRole(currentUser, 'admin') || hasRole(currentUser, 'developer') || hasPermission(currentUser, 'system:view'))
        : !!currentUser && (hasRole(currentUser, 'developer') || hasRole(currentUser, 'admin') || hasPermission(currentUser, 'module:read'));

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
        ? !!currentUser && (hasRole(currentUser, 'admin') || hasRole(currentUser, 'developer') || hasPermission(currentUser, 'system:view'))
        : !!currentUser && (hasRole(currentUser, 'developer') || hasRole(currentUser, 'admin') || hasPermission(currentUser, 'module:read'));
      if (currentUser && !pageAllowed && targetPage && targetPage !== currentPath) {
        window.location.replace(targetPage);
        return;
      }
      if (currentUser && pageAllowed && targetPage && targetPage !== currentPath && targetPage !== 'admin.html') {
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
