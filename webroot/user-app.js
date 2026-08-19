(() => {
  'use strict';

  const content = document.getElementById('userAppContent');
  const loginButton = document.getElementById('userLoginButton');

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

  const setActiveView = (view) => document.querySelectorAll('[data-user-view]').forEach((button) => {
    button.classList.toggle('active', button.dataset.userView === view);
  });

  const showLoginForm = () => {
    setActiveView('home');
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
      const currentUser = getCurrentUser();
      if (currentUser && Array.isArray(currentUser.roles) && (currentUser.roles.includes('developer') || currentUser.roles.includes('admin'))) {
        window.location.replace('admin.html');
        return;
      }
      renderModules();
    });
  };

  const bindNavigation = () => document.querySelectorAll('[data-user-view]').forEach((button) => button.addEventListener('click', () => {
    renderModules();
  }));

  const renderModule = (moduleId) => {
    const module = getVisibleModules().find((entry) => entry.id === moduleId) || getModules().find((entry) => entry.id === moduleId);
    if (!module) return renderModules();
    content.innerHTML = '<section class="user-app-panel"><button class="user-app-back" type="button" data-user-view="home">Back</button><div id="moduleUserInterface"></div></section>';
    const target = document.getElementById('moduleUserInterface');
    if (typeof module.renderUserInterface === 'function') {
      module.renderUserInterface(target);
    } else {
      target.innerHTML = '<span class="user-app-eyebrow">Module</span><h1>' + escapeHtml(getModuleDisplayName(module)) + '</h1><p>This module does not provide a user interface.</p>';
    }
    bindNavigation();
    content.focus();
  };

  const renderLandingPage = () => {
    const modules = getVisibleModules();
    const appName = getAppName();
    content.innerHTML = '<section class="user-app-panel"><div class="user-app-section-heading"><div><span class="user-app-eyebrow">Welcome</span><h1>Welcome to ' + escapeHtml(appName) + '</h1></div></div><p class="user-app-intro">A neutral platform for local-first tools, modules, and secure access.</p>' + (modules.length
      ? '<div class="user-module-list">' + modules.map((module) => '<button type="button" class="user-module-card" data-module-id="' + escapeHtml(module.id) + '"><span class="user-module-icon" aria-hidden="true">' + escapeHtml(getModuleDisplayName(module).charAt(0) || module.id.charAt(0)) + '</span><span class="user-module-copy"><strong>' + escapeHtml(getModuleDisplayName(module)) + '</strong><small>Open</small></span><span class="user-module-arrow" aria-hidden="true">›</span></button>').join('') + '</div>'
      : '<div class="user-app-empty"><p>No public modules are currently available.</p></div>') + '</section>';
    content.querySelectorAll('[data-module-id]').forEach((button) => button.addEventListener('click', () => renderModule(button.dataset.moduleId)));
  };

  const renderModules = () => {
    const modules = getVisibleModules();
    const currentUser = getCurrentUser();
    setActiveView('home');
    if (!currentUser) {
      renderLandingPage();
      return;
    }
    content.innerHTML = '<section class="user-app-panel"><div class="user-app-section-heading"><div><span class="user-app-eyebrow">Tools</span><h1>Available</h1></div><span class="user-app-count">' + modules.length + '</span></div>' + (modules.length
      ? '<div class="user-module-list">' + modules.map((module) => '<button type="button" class="user-module-card" data-module-id="' + escapeHtml(module.id) + '"><span class="user-module-icon" aria-hidden="true">' + escapeHtml(getModuleDisplayName(module).charAt(0) || module.id.charAt(0)) + '</span><span class="user-module-copy"><strong>' + escapeHtml(getModuleDisplayName(module)) + '</strong><small>Open</small></span><span class="user-module-arrow" aria-hidden="true">›</span></button>').join('') + '</div>'
      : '<div class="user-app-empty"><p>No modules are currently available.</p></div>') + '</section>';
    content.querySelectorAll('[data-module-id]').forEach((button) => button.addEventListener('click', () => renderModule(button.dataset.moduleId)));

    const status = document.createElement('div');
    status.className = 'user-app-status';
    status.textContent = `Signed in as ${currentUser.displayName || currentUser.username || 'User'} (${(currentUser.roles || ['user']).join(', ')})`;
    content.appendChild(status);
  };

  const bindLoginButton = () => {
    if (!loginButton) return;
    loginButton.addEventListener('click', () => {
      if (getCurrentUser()) {
        if (Array.isArray(getCurrentUser().roles) && (getCurrentUser().roles.includes('developer') || getCurrentUser().roles.includes('admin'))) {
          window.location.replace('admin.html');
          return;
        }
        return;
      }
      showLoginForm();
    });
  };

  const start = async () => {
    if (window.CoreStartup && typeof window.CoreStartup.start === 'function') await window.CoreStartup.start();
    if (window.ModuleManager && typeof window.ModuleManager.discoverModules === 'function') await window.ModuleManager.discoverModules();
    bindLoginButton();

    const currentUser = getCurrentUser();
    if (currentUser) {
      if (Array.isArray(currentUser.roles) && (currentUser.roles.includes('developer') || currentUser.roles.includes('admin'))) {
        window.location.replace('admin.html');
        return;
      }
      renderModules();
    } else {
      renderLandingPage();
    }
    bindNavigation();
  };

  start();
})();
