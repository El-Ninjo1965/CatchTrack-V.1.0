(() => {
  'use strict';

  const defaultSettings = Object.freeze({
    showSummaryCards: true,
    defaultTileCount: 3
  });

  const readSettings = () => {
    const configured = window.ConfigManager && typeof window.ConfigManager.getPath === 'function'
      ? window.ConfigManager.getPath('moduleSettings.dashboard', {})
      : {};

    return {
      ...defaultSettings,
      ...(configured && typeof configured === 'object' ? configured : {})
    };
  };

  const getSummaryTiles = () => {
    const modules = (window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function')
      ? window.ModuleRegistry.getAll().filter((module) => module && module.id)
      : [];

    return [
      {
        title: 'App shell',
        value: 'Ready',
        detail: 'Neutral app framework is active.'
      },
      {
        title: 'Modules',
        value: String(modules.length),
        detail: 'Available module definitions.'
      },
      {
        title: 'User access',
        value: 'Role based',
        detail: 'Admin and user permissions by role.'
      }
    ];
  };

  const DashboardModule = {
    id: 'dashboard',
    name: 'Dashboard',
    displayName: 'Dashboard',
    version: '1.0.0',
    description: 'Starter dashboard module for the first CatchTrack application shell.',
    permissions: ['module:read'],
    capabilities: ['dashboard', 'overview'],
    appId: 'catchtrack',
    status: 'available',
    active: false,
    admin: {
      title: 'Dashboard settings',
      description: 'Controls for the default overview experience in the CatchTrack app shell.',
      settings: [
        {
          key: 'showSummaryCards',
          path: 'moduleSettings.dashboard.showSummaryCards',
          label: 'Show summary cards',
          type: 'boolean',
          defaultValue: true,
          description: 'Display the quick overview cards on the dashboard screen.'
        },
        {
          key: 'defaultTileCount',
          path: 'moduleSettings.dashboard.defaultTileCount',
          label: 'Default card count',
          type: 'number',
          defaultValue: 3,
          min: 1,
          step: 1,
          description: 'Number of summary tiles displayed on the landing dashboard.'
        }
      ]
    },

    init() {
      this.status = 'installed';
      this.active = true;
      return this;
    },

    install() {
      this.status = 'installed';
      return this;
    },

    enable() {
      this.status = 'enabled';
      this.active = true;
      return this;
    },

    disable() {
      this.status = 'disabled';
      this.active = false;
      return this;
    },

    render(container) {
      if (!container || typeof container.innerHTML !== 'string' && typeof container.innerHTML !== 'undefined') {
        return null;
      }

      const settings = readSettings();
      const tiles = getSummaryTiles().slice(0, Number.isFinite(Number(settings.defaultTileCount)) ? Number(settings.defaultTileCount) : defaultSettings.defaultTileCount);
      const user = window.UserModule && typeof window.UserModule.getCurrentUser === 'function'
        ? window.UserModule.getCurrentUser()
        : (window.CoreAuth && typeof window.CoreAuth.getCurrentUser === 'function' ? window.CoreAuth.getCurrentUser() : null);
      const welcome = user && (user.displayName || user.username) ? `${user.displayName || user.username}` : 'Neues Team';

      container.innerHTML = `
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">CatchTrack dashboard</h2>
          </div>
          <div class="content-wrap">
            <div class="small-muted" style="margin-bottom: 18px;">Willkommen ${escapeHtml(welcome)} · erste modulare App-Basis</div>
            ${settings.showSummaryCards ? `
              <div class="grid">
                ${tiles.map((tile) => `
                  <div class="metric">
                    <span class="metric-label">${escapeHtml(tile.title)}</span>
                    <div class="metric-value">${escapeHtml(tile.value)}</div>
                    <div style="font-size: 0.8rem; color: var(--muted, #6b7280); margin-top: 6px;">${escapeHtml(tile.detail)}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            <div class="mt-18">
              <strong>Aktivierte Module:</strong>
              <div class="action-list" style="margin-top: 12px;">
                ${(window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function' ? window.ModuleRegistry.getAll() : [])
                  .filter((module) => module && module.id)
                  .map((module) => `<span class="status-badge ok">${escapeHtml(module.displayName || module.name || module.id)}</span>`)
                  .join(' ') || '<span class="status-badge warning">Noch keine Module aktiv</span>'}
              </div>
            </div>
          </div>
        </div>
      `;

      return container;
    }
  };

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  window.DashboardModule = DashboardModule;

  if (Array.isArray(window.FrameworkModuleCatalog) && !window.FrameworkModuleCatalog.some((entry) => entry && entry.id === DashboardModule.id)) {
    window.FrameworkModuleCatalog.push({
      id: DashboardModule.id,
      name: DashboardModule.name,
      version: DashboardModule.version,
      description: DashboardModule.description,
      permissions: DashboardModule.permissions,
      capabilities: DashboardModule.capabilities,
      source: 'app/modules/dashboard/index.js',
      entry: 'index.js',
      appId: DashboardModule.appId,
      globalName: 'DashboardModule'
    });
  }
})();
