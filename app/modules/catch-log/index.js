(() => {
  'use strict';

  const STORAGE_KEY = 'catchtrack.catch-log.entries.v1';
  const defaultSettings = Object.freeze({
    defaultUnits: 'metric',
    maxEntries: 200,
    allowWeatherTag: true
  });

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const readSettings = () => {
    const configured = window.ConfigManager && typeof window.ConfigManager.getPath === 'function'
      ? window.ConfigManager.getPath('moduleSettings.catchLog', {})
      : {};

    return {
      ...defaultSettings,
      ...(configured && typeof configured === 'object' ? configured : {})
    };
  };

  const getStorageAdapter = () => {
    if (typeof window !== 'undefined' && window.StorageManager && typeof window.StorageManager.getRuntimeAdapter === 'function') {
      return window.StorageManager.getRuntimeAdapter();
    }
    if (typeof globalThis !== 'undefined' && globalThis.StorageManager && typeof globalThis.StorageManager.getRuntimeAdapter === 'function') {
      return globalThis.StorageManager.getRuntimeAdapter();
    }
    return null;
  };

  const readEntries = () => {
    try {
      const adapter = getStorageAdapter();
      if (adapter && typeof adapter.read === 'function') {
        const value = adapter.read('catch-log', 'entries', []);
        if (Array.isArray(value)) {
          return value;
        }
      }

      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      }
    } catch (error) {
      return [];
    }
    return [];
  };

  const writeEntries = (entries) => {
    try {
      const adapter = getStorageAdapter();
      if (adapter && typeof adapter.write === 'function') {
        adapter.write('catch-log', 'entries', entries);
        return entries;
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      }
    } catch (error) {
      // Ignore storage failure in preview mode.
    }
    return entries;
  };

  const normalizeEntry = (entry) => {
    if (!entry || typeof entry !== 'object') {
      return null;
    }

    const now = new Date().toISOString();
    const species = String(entry.species || '').trim() || 'Unbekannt';
    const weight = Number(entry.weight || 0);
    const length = Number(entry.length || 0);
    const location = String(entry.location || '').trim() || 'Offline';
    const bait = String(entry.bait || '').trim() || '—';
    const notes = String(entry.notes || '').trim();
    const weather = String(entry.weather || '').trim();

    return {
      id: String(entry.id || `catch-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`),
      species,
      weight: Number.isFinite(weight) ? weight : 0,
      length: Number.isFinite(length) ? length : 0,
      location,
      bait,
      weather,
      notes,
      createdAt: entry.createdAt || now,
      updatedAt: entry.updatedAt || now
    };
  };

  const getEntries = () => readEntries().map((entry) => normalizeEntry(entry)).filter(Boolean);

  const saveEntry = (entry) => {
    const normalized = normalizeEntry(entry);
    if (!normalized) {
      return { ok: false, code: 'INVALID_ENTRY', message: 'A catch entry is required.' };
    }

    const settings = readSettings();
    const current = getEntries();
    const nextEntries = [...current, normalized].slice(-Math.max(1, Number(settings.maxEntries) || defaultSettings.maxEntries));
    writeEntries(nextEntries);

    return {
      ok: true,
      code: 'ENTRY_SAVED',
      data: normalized,
      entries: nextEntries
    };
  };

  const deleteEntry = (entryId) => {
    const current = getEntries().filter((entry) => entry.id !== entryId);
    writeEntries(current);
    return current;
  };

  const CatchLogModule = {
    id: 'catch-log',
    name: 'Catch Log',
    displayName: 'Catch Log',
    version: '1.0.0',
    description: 'First real CatchTrack business module for logging and tracking fishing catches in a local, modular flow.',
    permissions: ['module:read'],
    capabilities: ['catch-log', 'tracking', 'data-entry'],
    appId: 'catchtrack',
    status: 'available',
    active: false,
    admin: {
      title: 'Catch log settings',
      description: 'Settings for the local catch logging workflow and default behavior.',
      settings: [
        {
          key: 'defaultUnits',
          path: 'moduleSettings.catchLog.defaultUnits',
          label: 'Default unit system',
          type: 'select',
          defaultValue: 'metric',
          options: ['metric', 'imperial'],
          description: 'Default measurement system for weight and length entries.'
        },
        {
          key: 'maxEntries',
          path: 'moduleSettings.catchLog.maxEntries',
          label: 'Maximum entries',
          type: 'number',
          defaultValue: 200,
          min: 10,
          step: 10,
          description: 'Maximum number of stored catch entries before older ones are dropped.'
        },
        {
          key: 'allowWeatherTag',
          path: 'moduleSettings.catchLog.allowWeatherTag',
          label: 'Allow weather notes',
          type: 'boolean',
          defaultValue: true,
          description: 'Enable weather entries in the catch form.'
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
    renderUserInterface(container) {
      const settings = readSettings();
      const makeSummary = () => {
        const entries = getEntries();
        const totalWeight = entries.reduce((sum, item) => sum + Number(item.weight || 0), 0);
        return {
          entries,
          totalWeight,
          totalCount: entries.length
        };
      };

      const render = () => {
        const summary = makeSummary();
        const units = settings.defaultUnits === 'imperial' ? 'lb' : 'kg';
        container.innerHTML = `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Log a catch</h3>
            </div>
            <div class="content-wrap">
              <form id="catchLogForm" class="form-grid">
                <div class="form-field"><label>Species</label><input name="species" type="text" placeholder="Zander" required /></div>
                <div class="form-field"><label>Weight (${escapeHtml(units)})</label><input name="weight" type="number" min="0" step="0.1" placeholder="2.4" /></div>
                <div class="form-field"><label>Length (cm)</label><input name="length" type="number" min="0" step="1" placeholder="42" /></div>
                <div class="form-field"><label>Location</label><input name="location" type="text" placeholder="Lake shore" /></div>
                <div class="form-field"><label>Bait</label><input name="bait" type="text" placeholder="Spinner" /></div>
                ${settings.allowWeatherTag ? `<div class="form-field"><label>Weather</label><input name="weather" type="text" placeholder="Cloudy" /></div>` : ''}
                <div class="form-field" style="grid-column: 1 / -1;"><label>Notes</label><textarea name="notes" rows="3" placeholder="Strong strike near the reeds."></textarea></div>
                <div class="action-list" style="grid-column: 1 / -1;">
                  <button type="submit" class="primary">Save catch</button>
                </div>
              </form>
            </div>
          </div>
          <div class="card" style="margin-top: 18px;">
            <div class="card-header">
              <h3 class="card-title">Recent catches</h3>
            </div>
            <div class="content-wrap">
              <div class="grid">
                <div class="metric"><span class="metric-label">Entries</span><div class="metric-value">${escapeHtml(String(summary.totalCount))}</div></div>
                <div class="metric"><span class="metric-label">Total weight</span><div class="metric-value">${escapeHtml(String(summary.totalWeight.toFixed(1)))} ${escapeHtml(units)}</div></div>
              </div>
              <div class="table-wrap" style="margin-top: 16px;">
                <table>
                  <thead><tr><th>Species</th><th>Weight</th><th>Location</th><th>Notes</th><th>Action</th></tr></thead>
                  <tbody>
                    ${summary.entries.length ? summary.entries.slice().reverse().map((entry) => `
                      <tr>
                        <td>${escapeHtml(entry.species)}</td>
                        <td>${escapeHtml(entry.weight ? `${Number(entry.weight).toFixed(1)} ${units}` : '—')}</td>
                        <td>${escapeHtml(entry.location)}</td>
                        <td>${escapeHtml((entry.notes || entry.weather || 'No notes').slice(0, 80))}</td>
                        <td><button type="button" class="secondary" data-catch-delete="${escapeHtml(entry.id)}">Delete</button></td>
                      </tr>
                    `).join('') : '<tr><td colspan="5">No catches recorded yet.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;

        const form = container.querySelector('#catchLogForm');
        form?.addEventListener('submit', (event) => {
          event.preventDefault();
          const formData = new FormData(form);
          const payload = Object.fromEntries(formData.entries());
          const result = saveEntry({
            species: payload.species,
            weight: payload.weight,
            length: payload.length,
            location: payload.location,
            bait: payload.bait,
            weather: payload.weather,
            notes: payload.notes
          });

          if (result && result.ok) {
            form.reset();
            render();
          }
        });

        container.querySelectorAll('[data-catch-delete]').forEach((button) => {
          button.addEventListener('click', () => {
            deleteEntry(button.dataset.catchDelete);
            render();
          });
        });
      };

      render();
      return container;
    }
  };

  window.CatchLogModule = CatchLogModule;

  if (Array.isArray(window.FrameworkModuleCatalog) && !window.FrameworkModuleCatalog.some((entry) => entry && entry.id === CatchLogModule.id)) {
    window.FrameworkModuleCatalog.push({
      id: CatchLogModule.id,
      name: CatchLogModule.name,
      version: CatchLogModule.version,
      description: CatchLogModule.description,
      permissions: CatchLogModule.permissions,
      capabilities: CatchLogModule.capabilities,
      source: 'app/modules/catch-log/index.js',
      entry: 'index.js',
      appId: CatchLogModule.appId,
      globalName: 'CatchLogModule'
    });
  }
})();
