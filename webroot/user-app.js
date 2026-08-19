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

  const getModules = () => window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
    ? window.ModuleRegistry.getAll().filter((module) => module && module.id && (module.active || module.status === 'enabled' || module.status === 'active'))
    : [];

  const setActiveView = (view) => document.querySelectorAll('[data-user-view]').forEach((button) => {
    button.classList.toggle('active', button.dataset.userView === view);
  });

  const showLoginForm = () => {
    setActiveView('modules');
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
    const module = getModules().find((entry) => entry.id === moduleId);
    if (!module) return renderModules();
    content.innerHTML = '<section class="user-app-panel"><button class="user-app-back" type="button" data-user-view="modules">Modules</button><div id="moduleUserInterface"></div></section>';
    const target = document.getElementById('moduleUserInterface');
    if (typeof module.renderUserInterface === 'function') {
      module.renderUserInterface(target);
    } else {
      target.innerHTML = '<span class="user-app-eyebrow">Module</span><h1>' + escapeHtml(module.name || module.id) + '</h1><p>This module does not provide a user interface.</p>';
    }
    bindNavigation();
    content.focus();
  };

  const renderModules = () => {
    const modules = getModules();
    const currentUser = getCurrentUser();
    setActiveView('modules');
    content.innerHTML = '<section class="user-app-panel"><div class="user-app-section-heading"><div><span class="user-app-eyebrow">Your tools</span><h1>Modules</h1></div><span class="user-app-count">' + modules.length + '</span></div>' + (modules.length
      ? '<div class="user-module-list">' + modules.map((module) => '<button type="button" class="user-module-card" data-module-id="' + escapeHtml(module.id) + '"><span class="user-module-icon" aria-hidden="true">' + escapeHtml((module.name || module.id).charAt(0)) + '</span><span class="user-module-copy"><strong>' + escapeHtml(module.name || module.id) + '</strong><small>Ready to use</small></span><span class="user-module-arrow" aria-hidden="true">›</span></button>').join('') + '</div>'
      : '<div class="user-app-empty"><p>No modules are currently active.</p></div>') + '</section>';
    content.querySelectorAll('[data-module-id]').forEach((button) => button.addEventListener('click', () => renderModule(button.dataset.moduleId)));

    if (currentUser) {
      const status = document.createElement('div');
      status.className = 'user-app-status';
      status.textContent = `Signed in as ${currentUser.displayName || currentUser.username || 'User'} (${(currentUser.roles || ['user']).join(', ')})`;
      content.appendChild(status);
    }
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
      showLoginForm();
    }
    bindNavigation();
  };

  start();
})();
