(() => {
  'use strict';

  const STORAGE_KEY = 'catchtrack.fishing-spots.entries.v1';
  const defaultSettings = Object.freeze({
    defaultType: 'lake',
    maxEntries: 100,
    allowGPSFill: true
  });

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const readSettings = () => {
    const configured = window.ConfigManager && typeof window.ConfigManager.getPath === 'function'
      ? window.ConfigManager.getPath('moduleSettings.fishingSpots', {})
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

  const readSpots = () => {
    try {
      const adapter = getStorageAdapter();
      if (adapter && typeof adapter.read === 'function') {
        const value = adapter.read('fishing-spots', 'spots', []);
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

  const writeSpots = (spots) => {
    try {
      const adapter = getStorageAdapter();
      if (adapter && typeof adapter.write === 'function') {
        adapter.write('fishing-spots', 'spots', spots);
        return spots;
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
      }
    } catch (error) {
      // Ignore storage failure in preview mode.
    }
    return spots;
  };

  const normalizeSpot = (entry) => {
    if (!entry || typeof entry !== 'object') {
      return null;
    }

    const type = String(entry.type || '').trim() || 'lake';
    const name = String(entry.name || '').trim() || 'Unnamed spot';
    const latitude = Number(entry.latitude || 0);
    const longitude = Number(entry.longitude || 0);
    const depth = Number(entry.depth || 0);
    const rating = Number(entry.rating || 0);
    const notes = String(entry.notes || '').trim();
    const now = new Date().toISOString();

    return {
      id: String(entry.id || `spot-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`),
      name,
      type,
      latitude: Number.isFinite(latitude) ? latitude : 0,
      longitude: Number.isFinite(longitude) ? longitude : 0,
      depth: Number.isFinite(depth) ? depth : 0,
      rating: Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0,
      notes,
      createdAt: entry.createdAt || now,
      updatedAt: entry.updatedAt || now
    };
  };

  const getSpots = () => readSpots().map((entry) => normalizeSpot(entry)).filter(Boolean);

  const saveSpot = (entry) => {
    const normalized = normalizeSpot(entry);
    if (!normalized) {
      return { ok: false, code: 'INVALID_SPOT', message: 'A fishing spot is required.' };
    }

    const settings = readSettings();
    const current = getSpots();
    const nextSpots = [...current, normalized].slice(-Math.max(10, Number(settings.maxEntries) || defaultSettings.maxEntries));
    writeSpots(nextSpots);

    return {
      ok: true,
      code: 'SPOT_SAVED',
      data: normalized,
      spots: nextSpots
    };
  };

  const deleteSpot = (spotId) => {
    const updated = getSpots().filter((spot) => spot.id !== spotId);
    writeSpots(updated);
    return updated;
  };

  const getCurrentLocation = () => new Promise((resolve, reject) => {
    if (window.GpsModule && typeof window.GpsModule.getCurrentPosition === 'function') {
      window.GpsModule.getCurrentPosition().then(() => {
        const state = window.GpsModule.getRuntimeState ? window.GpsModule.getRuntimeState() : {};
        const fallbackPosition = window.GpsModule.getLastPosition && typeof window.GpsModule.getLastPosition === 'function'
          ? window.GpsModule.getLastPosition()
          : null;
        const position = state.lastPosition || fallbackPosition;
        const latitude = Number(position && (position.latitude ?? position.lat));
        const longitude = Number(position && (position.longitude ?? position.lng));
        if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
          resolve({ latitude, longitude, accuracy: position && position.accuracy ? position.accuracy : null });
          return;
        }
        reject(new Error('No location available yet.'));
      }).catch(reject);
      return;
    }

    if (navigator && navigator.geolocation && typeof navigator.geolocation.getCurrentPosition === 'function') {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy || null
        });
      }, reject, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
      return;
    }

    reject(new Error('Geolocation is not available on this device.'));
  });

  const FishingSpotsModule = {
    id: 'fishing-spots',
    name: 'Fishing Spots',
    displayName: 'Fishing Spots',
    version: '1.0.0',
    description: 'Save favorite fishing areas with coordinates, notes, and quick GPS lookup support.',
    permissions: ['module:read'],
    capabilities: ['spots', 'fishing', 'location-planning'],
    appId: 'catchtrack',
    status: 'available',
    active: false,
    admin: {
      title: 'Fishing spots settings',
      description: 'Configuration for sorting, saving, and retrieving favorite fishing locations.',
      settings: [
        {
          key: 'defaultType',
          path: 'moduleSettings.fishingSpots.defaultType',
          label: 'Default spot type',
          type: 'select',
          defaultValue: 'lake',
          options: ['shore', 'lake', 'river', 'pier', 'reef'],
          description: 'Default category for new saved spots.'
        },
        {
          key: 'maxEntries',
          path: 'moduleSettings.fishingSpots.maxEntries',
          label: 'Maximum saved spots',
          type: 'number',
          defaultValue: 100,
          min: 10,
          step: 10,
          description: 'Maximum number of saved spots before the oldest are purged.'
        },
        {
          key: 'allowGPSFill',
          path: 'moduleSettings.fishingSpots.allowGPSFill',
          label: 'Enable GPS autofill',
          type: 'boolean',
          defaultValue: true,
          description: 'Enable automatic GPS coordinates when creating a new spot.'
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
      const render = () => {
        const spots = getSpots();
        const averageDepth = spots.length ? (spots.reduce((sum, spot) => sum + Number(spot.depth || 0), 0) / spots.length).toFixed(1) : '0.0';

        container.innerHTML = `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Favorite fishing spots</h3>
            </div>
            <div class="content-wrap">
              <form id="fishingSpotForm" class="form-grid">
                <div class="form-field"><label>Spot name</label><input name="name" type="text" placeholder="Old reed point" required /></div>
                <div class="form-field"><label>Type</label>
                  <select name="type">
                    ${['shore', 'lake', 'river', 'pier', 'reef'].map((type) => `<option value="${type}" ${type === settings.defaultType ? 'selected' : ''}>${type}</option>`).join('')}
                  </select>
                </div>
                <div class="form-field"><label>Latitude</label><input name="latitude" type="number" step="0.000001" placeholder="52.511232" /></div>
                <div class="form-field"><label>Longitude</label><input name="longitude" type="number" step="0.000001" placeholder="13.400812" /></div>
                <div class="form-field"><label>Depth (m)</label><input name="depth" type="number" step="0.1" placeholder="4.2" /></div>
                <div class="form-field"><label>Rating</label>
                  <select name="rating">
                    <option value="0">No rating</option>
                    <option value="1">1 / 5</option>
                    <option value="2">2 / 5</option>
                    <option value="3">3 / 5</option>
                    <option value="4">4 / 5</option>
                    <option value="5">5 / 5</option>
                  </select>
                </div>
                <div class="form-field" style="grid-column: 1 / -1;"><label>Notes</label><textarea name="notes" rows="3" placeholder="Good early morning drift, soft bottom, strong current."></textarea></div>
                <div class="action-list" style="grid-column: 1 / -1;">
                  <button type="button" class="secondary" data-spot-action="gps">Use current GPS</button>
                  <button type="submit" class="primary">Save spot</button>
                </div>
              </form>
            </div>
          </div>
          <div class="card" style="margin-top: 18px;">
            <div class="card-header">
              <h3 class="card-title">Saved spots</h3>
            </div>
            <div class="content-wrap">
              <div class="grid">
                <div class="metric"><span class="metric-label">Spots</span><div class="metric-value">${spots.length}</div></div>
                <div class="metric"><span class="metric-label">Avg. depth</span><div class="metric-value">${averageDepth} m</div></div>
              </div>
              <div class="table-wrap" style="margin-top: 16px;">
                <table>
                  <thead><tr><th>Name</th><th>Type</th><th>Coordinates</th><th>Depth</th><th>Rating</th><th>Action</th></tr></thead>
                  <tbody>
                    ${spots.length ? spots.slice().reverse().map((spot) => `
                      <tr>
                        <td>${escapeHtml(spot.name)}</td>
                        <td>${escapeHtml(spot.type)}</td>
                        <td>${escapeHtml(`${spot.latitude.toFixed(5)}, ${spot.longitude.toFixed(5)}`)}</td>
                        <td>${escapeHtml(spot.depth ? `${Number(spot.depth).toFixed(1)} m` : '—')}</td>
                        <td>${escapeHtml(spot.rating ? `${Number(spot.rating).toFixed(0)} / 5` : '—')}</td>
                        <td><button type="button" class="secondary" data-spot-delete="${escapeHtml(spot.id)}">Delete</button></td>
                      </tr>
                    `).join('') : '<tr><td colspan="6">No fishing spots saved yet.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;

        const form = container.querySelector('#fishingSpotForm');
        form?.addEventListener('submit', (event) => {
          event.preventDefault();
          const formData = new FormData(form);
          const payload = Object.fromEntries(formData.entries());
          const result = saveSpot({
            name: payload.name,
            type: payload.type,
            latitude: payload.latitude,
            longitude: payload.longitude,
            depth: payload.depth,
            rating: payload.rating,
            notes: payload.notes
          });

          if (result && result.ok) {
            form.reset();
            render();
          }
        });

        container.querySelector('[data-spot-action="gps"]')?.addEventListener('click', async () => {
          if (!settings.allowGPSFill) {
            return;
          }

          try {
            const position = await getCurrentLocation();
            const latitudeInput = form?.querySelector('[name="latitude"]');
            const longitudeInput = form?.querySelector('[name="longitude"]');
            if (latitudeInput) latitudeInput.value = position.latitude;
            if (longitudeInput) longitudeInput.value = position.longitude;
          } catch (error) {
            console.warn('Unable to fill GPS coordinates for fishing spot.', error);
          }
        });

        container.querySelectorAll('[data-spot-delete]').forEach((button) => {
          button.addEventListener('click', () => {
            deleteSpot(button.dataset.spotDelete);
            render();
          });
        });
      };

      render();
      return container;
    }
  };

  window.FishingSpotsModule = FishingSpotsModule;

  if (Array.isArray(window.FrameworkModuleCatalog) && !window.FrameworkModuleCatalog.some((entry) => entry && entry.id === FishingSpotsModule.id)) {
    window.FrameworkModuleCatalog.push({
      id: FishingSpotsModule.id,
      name: FishingSpotsModule.name,
      version: FishingSpotsModule.version,
      description: FishingSpotsModule.description,
      permissions: FishingSpotsModule.permissions,
      capabilities: FishingSpotsModule.capabilities,
      source: 'app/modules/fishing-spots/index.js',
      entry: 'index.js',
      appId: FishingSpotsModule.appId,
      globalName: 'FishingSpotsModule'
    });
  }
})();
