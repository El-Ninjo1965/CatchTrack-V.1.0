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
    const gpsStatus = document.getElementById('gpsModuleStatus');
    const discoveredModules = document.getElementById('discoveredModules');
    const optionalGpsModule = modules.find((module) => module.id === 'gps');

    if (frameworkStatus) frameworkStatus.textContent = window.Core ? 'OK' : 'Unavailable';
    if (discoveryStatus) discoveryStatus.textContent = registry ? 'OK' : 'Unavailable';
    if (gpsStatus) {
      gpsStatus.textContent = optionalGpsModule
        ? 'installed (' + (optionalGpsModule.status || 'available') + ')'
        : 'not installed';
    }
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

    if (pageType === 'user') {
      if (adminSection) {
        adminSection.classList.add('hidden');
        adminSection.innerHTML = '';
      }
      if (adminMenu) adminMenu.innerHTML = '';
      if (developerSection) {
        developerSection.classList.add('hidden');
        developerSection.innerHTML = '';
      }
      if (developerMenu) developerMenu.innerHTML = '';
      return;
    }

    if (canViewAdmin(currentUser)) {
      if (adminSection) adminSection.classList.remove('hidden');
      if (adminMenu) {
        adminMenu.innerHTML = '<button type="button" class="nav-item" data-view="admin:dashboard" data-href="/admin">Administration</button>';
      }
    } else if (adminSection) {
      adminSection.classList.add('hidden');
      if (adminMenu) adminMenu.innerHTML = '';
    }

    if (canViewDeveloper(currentUser)) {
      if (developerSection) developerSection.classList.remove('hidden');
      if (developerMenu) {
        developerMenu.innerHTML = '<button type="button" class="nav-item" data-view="developer:core" data-href="/developer">Developer</button>';
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
    const adminPanel = pageType === 'admin' ? renderConnectionPanel() : '';
    const roleLabel = pageType === 'admin'
      ? 'admin'
      : pageType === 'developer'
        ? 'developer'
        : (currentUser && Array.isArray(currentUser.roles) ? currentUser.roles.join(', ') : 'user');

    page.innerHTML = `
      <div class="card">
        <div class="card-header"><h2 class="card-title">Dashboard</h2></div>
        <div class="content-wrap">
          <div class="summary-username">Welcome ${escapeHtml(currentUser ? currentUser.displayName || currentUser.username : 'User')}</div>
          <div class="small-muted">${escapeHtml(currentUser ? currentUser.username : 'guest')} · ${escapeHtml(currentUser ? (Array.isArray(currentUser.roles) ? currentUser.roles.join(', ') : 'user') : 'guest')}</div>
          <div class="grid" style="margin-top:16px;">
            <div class="metric"><span class="metric-label">Available modules</span><div class="metric-value">${modules.length}</div></div>
            <div class="metric"><span class="metric-label">Status</span><div class="metric-value">${escapeHtml(currentUser ? currentUser.status || 'active' : 'logged-out')}</div></div>
            <div class="metric"><span class="metric-label">Access</span><div class="metric-value">${escapeHtml(roleLabel)}</div></div>
          </div>
        </div>
      </div>
      ${adminPanel}
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

  const getConnectionManager = () => window.ConnectionManager && typeof window.ConnectionManager.getConnections === 'function'
    ? window.ConnectionManager
    : null;

  const renderConnectionPanel = () => {
    const connectionManager = getConnectionManager();
    const connections = connectionManager ? connectionManager.getConnections() : [];
    const primaryConnection = connectionManager && typeof connectionManager.getPrimaryConnection === 'function'
      ? connectionManager.getPrimaryConnection()
      : null;
    const defaultConnection = connections[0] || {
      id: '',
      appId: '',
      appName: '',
      serverUrl: '',
      apiBasePath: '/api',
      connectionStatus: 'unconfigured',
      parameters: {}
    };

    const statusOptions = ['unconfigured', 'configured', 'connected', 'offline', 'error']
      .map((status) => `<option value="${escapeHtml(status)}"${defaultConnection.connectionStatus === status ? ' selected' : ''}>${escapeHtml(status)}</option>`)
      .join('');

    const connectionCards = connections.length
      ? connections.map((connection) => `
        <div class="metric" data-connection-id="${escapeHtml(connection.id)}">
          <span class="metric-label">${escapeHtml(connection.appName || connection.appId)}</span>
          <div class="metric-value" style="font-size: 0.85rem;">${escapeHtml(connection.serverUrl || 'No server URL')}</div>
          <div class="small-muted">${escapeHtml(connection.apiBasePath || '/api')} · ${escapeHtml(connection.connectionStatus || 'unconfigured')}</div>
          <div class="action-list" style="margin-top: 8px;">
            <button type="button" class="secondary connection-edit-btn" data-connection-edit="${escapeHtml(connection.id)}">Edit</button>
            <button type="button" class="secondary connection-delete-btn" data-connection-delete="${escapeHtml(connection.id)}">Delete</button>
          </div>
        </div>
      `).join('')
      : '<div class="metric"><span class="metric-label">No connections</span><div class="metric-value">No app connection profiles configured yet.</div></div>';

    return `
      <div class="card" id="connectionManagerCard">
        <div class="card-header">
          <h2 class="card-title">App connections</h2>
          <div class="small-muted">Neutral app/server configuration managed on the admin side.</div>
        </div>
        <div class="content-wrap">
          <div class="grid">
            <div class="metric">
              <span class="metric-label">Configured apps</span>
              <div class="metric-value">${connections.length}</div>
            </div>
            <div class="metric">
              <span class="metric-label">Primary status</span>
              <div class="metric-value">${escapeHtml(primaryConnection ? primaryConnection.connectionStatus : 'unconfigured')}</div>
            </div>
          </div>
          <div class="grid" style="margin-top: 16px;">
            ${connectionCards}
          </div>
          <form id="connectionForm" class="form-grid" style="margin-top: 20px;">
            <input id="connectionId" type="hidden" value="${escapeHtml(defaultConnection.id || '')}" />
            <div class="form-field">
              <label for="connectionAppId">App ID</label>
              <input id="connectionAppId" type="text" value="${escapeHtml(defaultConnection.appId || '')}" placeholder="future-app" />
            </div>
            <div class="form-field">
              <label for="connectionAppName">App name</label>
              <input id="connectionAppName" type="text" value="${escapeHtml(defaultConnection.appName || '')}" placeholder="Future App" />
            </div>
            <div class="form-field">
              <label for="connectionServerUrl">Server/API address</label>
              <input id="connectionServerUrl" type="text" value="${escapeHtml(defaultConnection.serverUrl || '')}" placeholder="https://example.org" />
            </div>
            <div class="form-field">
              <label for="connectionApiBasePath">API base path</label>
              <input id="connectionApiBasePath" type="text" value="${escapeHtml(defaultConnection.apiBasePath || '/api')}" placeholder="/api" />
            </div>
            <div class="form-field">
              <label for="connectionStatus">Connection status</label>
              <select id="connectionStatus">${statusOptions}</select>
            </div>
            <div class="form-field">
              <label for="connectionParameters">Parameters (JSON)</label>
              <textarea id="connectionParameters" rows="5" placeholder='{"region":"eu"}'>${escapeHtml(JSON.stringify(defaultConnection.parameters || {}, null, 2))}</textarea>
            </div>
            <div class="action-list">
              <button id="connectionSaveBtn" class="primary" type="submit">Save connection</button>
              <button id="connectionClearBtn" class="secondary" type="button">Clear form</button>
              <button id="connectionRefreshBtn" class="secondary" type="button">Refresh</button>
            </div>
            <div id="connectionMessage" class="message info">Connections are app-neutral and contain no credentials.</div>
          </form>
        </div>
      </div>
    `;
  };

  const bindConnectionPanel = () => {
    if (pageType !== 'admin') {
      return;
    }

    const connectionManager = getConnectionManager();
    const form = document.getElementById('connectionForm');
    const message = document.getElementById('connectionMessage');
    const clearBtn = document.getElementById('connectionClearBtn');
    const refreshBtn = document.getElementById('connectionRefreshBtn');
    const cards = document.querySelectorAll('[data-connection-edit], [data-connection-delete]');

    const setMessage = (text, type = 'info') => {
      if (!message) return;
      message.textContent = text;
      message.className = `message ${type}`;
    };

    const populateForm = (connection) => {
      const connectionId = document.getElementById('connectionId');
      const connectionAppId = document.getElementById('connectionAppId');
      const connectionAppName = document.getElementById('connectionAppName');
      const connectionServerUrl = document.getElementById('connectionServerUrl');
      const connectionApiBasePath = document.getElementById('connectionApiBasePath');
      const connectionStatus = document.getElementById('connectionStatus');
      const connectionParameters = document.getElementById('connectionParameters');

      if (connectionId) connectionId.value = connection ? connection.id || '' : '';
      if (connectionAppId) connectionAppId.value = connection ? connection.appId || '' : '';
      if (connectionAppName) connectionAppName.value = connection ? connection.appName || '' : '';
      if (connectionServerUrl) connectionServerUrl.value = connection ? connection.serverUrl || '' : '';
      if (connectionApiBasePath) connectionApiBasePath.value = connection ? connection.apiBasePath || '/api' : '/api';
      if (connectionStatus) connectionStatus.value = connection ? connection.connectionStatus || 'unconfigured' : 'unconfigured';
      if (connectionParameters) connectionParameters.value = JSON.stringify(connection ? connection.parameters || {} : {}, null, 2);
    };

    cards.forEach((button) => {
      button.addEventListener('click', async () => {
        const editId = button.dataset.connectionEdit;
        const deleteId = button.dataset.connectionDelete;

        if (editId && connectionManager) {
          const connection = connectionManager.getConnection(editId);
          populateForm(connection);
          setMessage(`Editing ${connection ? connection.appName || connection.appId : editId}.`, 'info');
          return;
        }

        if (deleteId && connectionManager) {
          const result = await connectionManager.deleteConnection(deleteId);
          if (result && result.ok) {
            setMessage('Connection removed.', 'ok');
            renderSummary();
            renderPageContent();
            bindConnectionPanel();
          } else {
            setMessage((result && result.message) || 'Unable to remove connection.', 'error');
          }
        }
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        populateForm(null);
        setMessage('Form cleared.', 'info');
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        if (!connectionManager) {
          setMessage('Connection manager is unavailable.', 'error');
          return;
        }

        await connectionManager.refresh();
        renderSummary();
        renderPageContent();
        bindConnectionPanel();
      });
    }

    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!connectionManager) {
          setMessage('Connection manager is unavailable.', 'error');
          return;
        }

        const connectionId = document.getElementById('connectionId');
        const connectionAppId = document.getElementById('connectionAppId');
        const connectionAppName = document.getElementById('connectionAppName');
        const connectionServerUrl = document.getElementById('connectionServerUrl');
        const connectionApiBasePath = document.getElementById('connectionApiBasePath');
        const connectionStatus = document.getElementById('connectionStatus');
        const connectionParameters = document.getElementById('connectionParameters');

        let parameters = {};
        if (connectionParameters && connectionParameters.value.trim()) {
          try {
            parameters = JSON.parse(connectionParameters.value);
          } catch {
            setMessage('Parameters must be valid JSON.', 'error');
            return;
          }
        }

        const payload = {
          id: connectionId ? connectionId.value.trim() : '',
          appId: connectionAppId ? connectionAppId.value.trim() : '',
          appName: connectionAppName ? connectionAppName.value.trim() : '',
          serverUrl: connectionServerUrl ? connectionServerUrl.value.trim() : '',
          apiBasePath: connectionApiBasePath ? connectionApiBasePath.value.trim() : '/api',
          connectionStatus: connectionStatus ? connectionStatus.value : 'unconfigured',
          parameters
        };

        const result = await connectionManager.saveConnection(payload);
        if (!result || !result.ok) {
          setMessage((result && result.message) || 'Unable to save connection.', 'error');
          return;
        }

        setMessage('Connection saved.', 'ok');
        renderSummary();
        renderPageContent();
        bindConnectionPanel();
      });
    }
  };

  const renderPageContent = () => {
    if (pageType === 'user' && !['dashboard', 'profile', 'modules'].includes(state.activeView)) {
      state.activeView = defaultView;
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
          return;
        }

        renderSummary();
        renderUserMenu();
        renderPageContent();
        bindConnectionPanel();
        syncShellVisibility();
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
    if (window.ConnectionManager && typeof window.ConnectionManager.init === 'function') {
      await window.ConnectionManager.init();
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
    bindConnectionPanel();
  };

  init();
})();
