(() => {
  'use strict';

  const content = document.getElementById('userAppContent');
  const nav = document.getElementById('userAppNav');
  const actions = document.getElementById('userAppActions');
  const brand = document.querySelector('.user-app-brand');
  const mark = document.getElementById('userAppMark');
  const state = {
    activeView: 'home',
    activeModuleId: null
  };

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const getCurrentUser = () => {
    if (window.UserModule && typeof window.UserModule.getCurrentUser === 'function') {
      return window.UserModule.getCurrentUser();
    }
    if (window.CoreAuth && typeof window.CoreAuth.getCurrentUser === 'function') {
      return window.CoreAuth.getCurrentUser();
    }
    return null;
  };

  const getAppName = () => {
    const appConfig = window.ConfigManager && typeof window.ConfigManager.get === 'function'
      ? window.ConfigManager.get('app', {})
      : {};
    return appConfig && typeof appConfig.name === 'string' && appConfig.name.trim()
      ? appConfig.name.trim()
      : 'Neutral Platform';
  };

  const getAppMark = () => {
    const name = getAppName().trim();
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  const getModuleDisplayName = (module) => {
    const explicit = module && (module.displayName || module.manifest?.displayName || module.name || module.id || 'Module');
    return String(explicit || module.id || 'Module').trim() || 'Module';
  };

  const getModules = () => window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
    ? window.ModuleRegistry.getAll().filter((module) => module && module.id && (module.active || module.status === 'enabled' || module.status === 'active'))
    : [];

  const getVisibleModules = () => {
    const modules = getModules();
    const currentUser = getCurrentUser();
    return modules.filter((module) => {
      if (!currentUser) {
        return module && (module.public === true || module.isPublic === true || module.loginRequired === false || module.requiresLogin === false || module.public !== false);
      }
      return true;
    });
  };

  const canOpenAdmin = () => {
    const currentUser = getCurrentUser();
    return !!currentUser && Array.isArray(currentUser.roles) && (currentUser.roles.includes('developer') || currentUser.roles.includes('admin'));
  };

  const applyBranding = () => {
    const appName = getAppName();
    document.title = appName;
    const title = document.querySelector('[data-app-title]');
    if (title) title.textContent = appName;
    if (brand) brand.textContent = appName;
    if (mark) mark.textContent = getAppMark();
  };

  const renderActions = () => {
    if (!actions) return;
    const currentUser = getCurrentUser();
    if (!currentUser) {
      actions.innerHTML = '<button id="userLoginButton" class="user-app-action" type="button">Login</button>';
      const loginButton = document.getElementById('userLoginButton');
      if (loginButton) {
        loginButton.addEventListener('click', () => {
          showLoginForm();
        });
      }
      return;
    }

    actions.innerHTML = `
      <span class="user-app-session-badge">${escapeHtml(currentUser.displayName || currentUser.username || 'User')}</span>
      ${canOpenAdmin() ? '<a class="user-app-link" href="admin.html">Admin</a>' : ''}
      <button id="userLogoutButton" class="user-app-link" type="button">Logout</button>
    `;
    const logoutButton = document.getElementById('userLogoutButton');
    if (logoutButton) {
      logoutButton.addEventListener('click', async () => {
        if (window.LocalAuth && typeof window.LocalAuth.logout === 'function') {
          await window.LocalAuth.logout();
        } else if (window.UserModule && typeof window.UserModule.logout === 'function') {
          await window.UserModule.logout();
        }
        state.activeView = 'home';
        state.activeModuleId = null;
        renderApp();
      });
    }
  };

  const renderModuleNav = () => {
    if (!nav) return;
    const modules = getVisibleModules();
    const items = [
      { id: 'home', label: getAppName() },
      ...modules.map((module) => ({ id: `module:${module.id}`, label: getModuleDisplayName(module) }))
    ];
    nav.innerHTML = items.map((item) => `
      <button
        type="button"
        class="user-app-nav-item ${state.activeView === item.id ? 'active' : ''}"
        data-user-nav="${escapeHtml(item.id)}"
      >${escapeHtml(item.label)}</button>
    `).join('');
    nav.querySelectorAll('[data-user-nav]').forEach((button) => {
      button.addEventListener('click', () => {
        const nextView = button.dataset.userNav;
        state.activeView = nextView;
        state.activeModuleId = nextView.startsWith('module:') ? nextView.slice('module:'.length) : null;
        renderApp();
      });
    });
  };

  const showLoginForm = () => {
    state.activeView = 'login';
    state.activeModuleId = null;
    content.innerHTML = `
      <section class="user-app-panel">
        <span class="user-app-eyebrow">Account access</span>
        <h1>Sign in</h1>
        <p>Use your local workspace account to unlock available features.</p>
        <div class="user-login-form">
          <div class="form-field">
            <label for="userLoginUsername">Username</label>
            <input id="userLoginUsername" type="text" value="Developer" autocomplete="username" />
          </div>
          <div class="form-field">
            <label for="userLoginPassword">Password</label>
            <input id="userLoginPassword" type="password" autocomplete="current-password" />
          </div>
          <div class="user-login-actions">
            <button type="button" id="userLoginSubmit" class="primary">Login</button>
          </div>
          <div id="userLoginStatus" class="message info">Developer setup is available once locally in this preview.</div>
        </div>
      </section>
    `;

    const submit = document.getElementById('userLoginSubmit');
    submit.addEventListener('click', async () => {
      const username = document.getElementById('userLoginUsername').value.trim() || 'Developer';
      const password = document.getElementById('userLoginPassword').value;
      const status = document.getElementById('userLoginStatus');

      if (!window.LocalAuth || typeof window.LocalAuth.login !== 'function') {
        status.className = 'message error';
        status.textContent = 'Local authentication is not available.';
        return;
      }

      const result = await window.LocalAuth.login({ username, password });
      if (!result || !result.ok) {
        status.className = 'message error';
        status.textContent = result && result.message ? result.message : 'Authentication failed.';
        return;
      }

      status.className = 'message success';
      status.textContent = 'Signed in successfully.';
      state.activeView = 'home';
      renderApp();
    });
  };

  const renderModule = (moduleId) => {
    const module = getVisibleModules().find((entry) => entry.id === moduleId) || getModules().find((entry) => entry.id === moduleId);
    if (!module) {
      state.activeView = 'home';
      state.activeModuleId = null;
      renderLandingPage();
      return;
    }

    state.activeView = `module:${moduleId}`;
    state.activeModuleId = moduleId;
    content.innerHTML = `
      <section class="user-app-panel">
        <button class="user-app-back" type="button" id="userModuleBackButton">Back</button>
        <div class="user-app-section-heading">
          <div>
            <span class="user-app-eyebrow">Module</span>
            <h1>${escapeHtml(getModuleDisplayName(module))}</h1>
          </div>
          <span class="user-app-count">${escapeHtml(moduleId)}</span>
        </div>
        <div class="user-app-module-intro">${escapeHtml(module.description || 'This module is active in the current application.')}</div>
        <div id="moduleUserInterface"></div>
      </section>
    `;
    const target = document.getElementById('moduleUserInterface');
    if (typeof module.renderUserInterface === 'function') {
      module.renderUserInterface(target);
    } else {
      target.innerHTML = '<span class="user-app-eyebrow">Module</span><h1>' + escapeHtml(getModuleDisplayName(module)) + '</h1><p>This module does not provide a user interface.</p>';
    }
    const backButton = document.getElementById('userModuleBackButton');
    if (backButton) {
      backButton.addEventListener('click', () => {
        state.activeView = 'home';
        state.activeModuleId = null;
        renderApp();
      });
    }
    content.focus();
  };

  const renderLandingPage = () => {
    const appName = getAppName();
    const modules = getVisibleModules();
    const currentUser = getCurrentUser();
    content.innerHTML = `
      <section class="user-app-panel">
        <div class="user-app-section-heading">
          <div>
            <span class="user-app-eyebrow">Welcome</span>
            <h1>${escapeHtml(appName)}</h1>
          </div>
          <span class="user-app-count">${modules.length}</span>
        </div>
        <p class="user-app-intro">The active modules of this application appear directly in the top menu and can also be opened from the workspace below.</p>
        ${currentUser ? `<div class="user-app-status">Signed in as ${escapeHtml(currentUser.displayName || currentUser.username || 'User')} (${escapeHtml((currentUser.roles || ['user']).join(', '))})</div>` : '<div class="user-app-status">You can already use public modules without signing in. Sign in to unlock personalized administration and role-based features.</div>'}
        <div class="user-module-list" style="margin-top: 22px;">
          ${modules.length ? modules.map((module) => `
            <button type="button" class="user-module-card" data-module-card="${escapeHtml(module.id)}">
              <span class="user-module-icon">${escapeHtml((getModuleDisplayName(module).charAt(0) || 'M').toUpperCase())}</span>
              <span class="user-module-copy">
                <strong>${escapeHtml(getModuleDisplayName(module))}</strong>
                <small>${escapeHtml(module.description || 'Open this module in the current application.')}</small>
              </span>
              <span class="user-module-arrow" aria-hidden="true">›</span>
            </button>
          `).join('') : '<div class="user-app-empty">No modules are active yet. Activate modules in the admin area to make them available here.</div>'}
        </div>
      </section>
    `;
    content.querySelectorAll('[data-module-card]').forEach((button) => {
      button.addEventListener('click', () => {
        renderModule(button.dataset.moduleCard);
      });
    });
  };

  const renderApp = () => {
    applyBranding();
    renderActions();
    renderModuleNav();

    if (state.activeView === 'login') {
      showLoginForm();
      return;
    }

    if (state.activeModuleId) {
      renderModule(state.activeModuleId);
      return;
    }

    renderLandingPage();
  };

  const start = async () => {
    if (window.CoreStartup && typeof window.CoreStartup.start === 'function') await window.CoreStartup.start();
    if (window.ModuleManager && typeof window.ModuleManager.discoverModules === 'function') await window.ModuleManager.discoverModules();
    renderApp();
  };

  start();
})();
