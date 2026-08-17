(() => {
  'use strict';

  const content = document.getElementById('userAppContent');
  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  const getModules = () => window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
    ? window.ModuleRegistry.getAll().filter((module) => module && module.id && (module.active || module.status === 'enabled'))
    : [];

  const setActiveView = (view) => document.querySelectorAll('[data-user-view]').forEach((button) => {
    button.classList.toggle('active', button.dataset.userView === view);
  });

  const renderSettings = () => {
    setActiveView('settings');
    content.innerHTML = '<section class="user-app-panel user-app-empty"><span class="user-app-eyebrow">Settings</span><h1>Your app, kept simple.</h1><p>There are no user settings available yet.</p></section>';
  };

  const bindNavigation = () => document.querySelectorAll('[data-user-view]').forEach((button) => button.addEventListener('click', () => {
    button.dataset.userView === 'settings' ? renderSettings() : renderModules();
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
    setActiveView('modules');
    content.innerHTML = '<section class="user-app-panel"><div class="user-app-section-heading"><div><span class="user-app-eyebrow">Your tools</span><h1>Modules</h1></div><span class="user-app-count">' + modules.length + '</span></div>' + (modules.length
      ? '<div class="user-module-list">' + modules.map((module) => '<button type="button" class="user-module-card" data-module-id="' + escapeHtml(module.id) + '"><span class="user-module-icon" aria-hidden="true">' + escapeHtml((module.name || module.id).charAt(0)) + '</span><span class="user-module-copy"><strong>' + escapeHtml(module.name || module.id) + '</strong><small>Ready to use</small></span><span class="user-module-arrow" aria-hidden="true">›</span></button>').join('') + '</div>'
      : '<div class="user-app-empty"><p>No modules are currently active.</p></div>') + '</section>';
    content.querySelectorAll('[data-module-id]').forEach((button) => button.addEventListener('click', () => renderModule(button.dataset.moduleId)));
  };

  const start = async () => {
    if (window.CoreStartup && typeof window.CoreStartup.start === 'function') await window.CoreStartup.start();
    if (window.ModuleManager && typeof window.ModuleManager.discoverModules === 'function') await window.ModuleManager.discoverModules();
    renderModules();
    bindNavigation();
  };

  start();
})();
