/*
 * GPS Tracker Module
 * Version: 1.0.0
 *
 * Neutral GPS tracking module for the platform.
 * Provides geolocation access, CoreEventBus integration,
 * CoreStorage / DatabaseManager persistence, CoreAudit recording
 * and a full ModuleInterface lifecycle.
 *
 * This module is roleless – no permissions are required to use it.
 * It is a functional test module and does not contain domain logic.
 */

(() => {
    'use strict';

    // ── Internal state ────────────────────────────────────────────────────────

    let watchId = null;
    let tracking = false;
    let status = 'available'; // available | installed | enabled | disabled
    let lastPosition = null;

    // ── Helpers ───────────────────────────────────────────────────────────────

    const emit = (event, data) => {
        if (window.CoreEventBus && typeof window.CoreEventBus.emit === 'function') {
            window.CoreEventBus.emit(event, data);
        }
    };

    const audit = (action, detail = {}) => {
        if (window.CoreAudit && typeof window.CoreAudit.record === 'function') {
            window.CoreAudit.record(action, detail);
        }
    };

    const persistPosition = (position) => {
        const record = {
            id: `gps-${Date.now()}`,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            speed: position.coords.speed,
            heading: position.coords.heading,
            timestamp: new Date(position.timestamp).toISOString()
        };

        // Prefer DatabaseManager sync store when available.
        if (window.DatabaseManager && typeof window.DatabaseManager.save === 'function') {
            window.DatabaseManager.save('sync', record).catch(() => {
                // Fallback is intentionally silent.
            });
        }

        // Always keep the last position in CoreStorage for quick read.
        if (window.CoreStorage && typeof window.CoreStorage.set === 'function') {
            window.CoreStorage.set('gps:lastPosition', record);
        }

        return record;
    };

    // ── Geolocation handlers ──────────────────────────────────────────────────

    const onPosition = (position) => {
        const record = persistPosition(position);
        lastPosition = record;
        emit('gps:position', record);
    };

    const onError = (error) => {
        const detail = { code: error.code, message: error.message };
        emit('gps:error', detail);
        audit('gps:error', detail);
    };

    const geolocationOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    // ── Public API ────────────────────────────────────────────────────────────

    const GpsModule = {
        id: 'gps',
        name: 'GPS Tracker',
        version: '1.0.0',
        description: 'Neutral GPS tracking module.',
        permissions: [],
        capabilities: ['gps', 'geolocation'],
        status: 'available',
        active: false,

        // ── Lifecycle ─────────────────────────────────────────────────────────

        install() {
            status = 'installed';
            this.status = status;
            audit('gps:install', { moduleId: this.id });
            emit('gps:installed', { moduleId: this.id });
            return { ok: true, status };
        },

        initialize() {
            if (!navigator || !navigator.geolocation) {
                return { ok: false, code: 'GEOLOCATION_UNAVAILABLE', status };
            }
            audit('gps:initialize', { moduleId: this.id });
            emit('gps:initialized', { moduleId: this.id });
            return { ok: true, status };
        },

        enable() {
            status = 'enabled';
            this.status = status;
            this.active = true;
            audit('gps:enable', { moduleId: this.id });
            emit('gps:enabled', { moduleId: this.id });
            return { ok: true, status };
        },

        disable() {
            this.stopTracking();
            status = 'disabled';
            this.status = status;
            this.active = false;
            audit('gps:disable', { moduleId: this.id });
            emit('gps:disabled', { moduleId: this.id });
            return { ok: true, status };
        },

        uninstall() {
            this.stopTracking();
            status = 'available';
            this.status = status;
            this.active = false;
            lastPosition = null;
            audit('gps:uninstall', { moduleId: this.id });
            emit('gps:uninstalled', { moduleId: this.id });
            return { ok: true, status };
        },

        getStatus() {
            return status;
        },

        // ── Tracking ──────────────────────────────────────────────────────────

        startTracking() {
            if (tracking) {
                return { ok: false, code: 'ALREADY_TRACKING' };
            }

            if (status !== 'enabled') {
                return { ok: false, code: 'MODULE_NOT_ENABLED', status };
            }

            if (!navigator || !navigator.geolocation) {
                return { ok: false, code: 'GEOLOCATION_UNAVAILABLE' };
            }

            watchId = navigator.geolocation.watchPosition(
                onPosition,
                onError,
                geolocationOptions
            );

            tracking = true;
            audit('gps:startTracking', { watchId });
            emit('gps:trackingStarted', { watchId });
            return { ok: true, watchId };
        },

        stopTracking() {
            if (!tracking || watchId === null) {
                return { ok: false, code: 'NOT_TRACKING' };
            }

            if (navigator && navigator.geolocation) {
                navigator.geolocation.clearWatch(watchId);
            }

            tracking = false;
            watchId = null;
            audit('gps:stopTracking', {});
            emit('gps:trackingStopped', {});
            return { ok: true };
        },

        isTracking() {
            return tracking;
        },

        // ── One-shot position ─────────────────────────────────────────────────

        getCurrentPosition() {
            return new Promise((resolve, reject) => {
                if (!navigator || !navigator.geolocation) {
                    reject(new Error('Geolocation API not available.'));
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const record = persistPosition(position);
                        lastPosition = record;
                        emit('gps:position', record);
                        resolve(record);
                    },
                    (error) => {
                        onError(error);
                        reject(error);
                    },
                    geolocationOptions
                );
            });
        },

        // ── State reads ───────────────────────────────────────────────────────

        getLastPosition() {
            // Prefer CoreStorage if a previous position was saved there.
            if (window.CoreStorage && typeof window.CoreStorage.get === 'function') {
                const stored = window.CoreStorage.get('gps:lastPosition');
                if (stored) {
                    return stored;
                }
            }

            return lastPosition;
        }
    };

    // ── Register on window ────────────────────────────────────────────────────

    GpsModule.renderUserInterface = (container) => {
        if (!container) return;
        const render = (message = '', isError = false) => {
            const position = GpsModule.getLastPosition();
            const trackingNow = GpsModule.isTracking();
            const label = trackingNow ? 'Tracking active' : status === 'enabled' ? 'Ready' : 'Not active';
            container.innerHTML = `<div class="gps-user-module"><div class="gps-heading"><div><span class="user-app-eyebrow">Location</span><h1>GPS</h1></div><span id="gpsUserStatus" class="gps-status ${isError ? 'error' : ''}">${label}</span></div><div class="gps-location-card"><span class="gps-location-label">Current position</span><dl id="gpsPosition" class="gps-position">${position ? `<div><dt>Latitude</dt><dd>${position.lat}</dd></div><div><dt>Longitude</dt><dd>${position.lng}</dd></div>` : '<div><dt>Position</dt><dd>Not available</dd></div>'}</dl></div><div class="gps-actions"><button type="button" class="gps-primary-action" data-gps-action="current">Get current position</button><button type="button" data-gps-action="start" ${trackingNow ? 'disabled' : ''}>Start tracking</button><button type="button" data-gps-action="stop" ${trackingNow ? '' : 'disabled'}>Stop tracking</button></div><p id="gpsUserMessage" class="gps-message">${message}</p></div>`;
            container.querySelector('[data-gps-action="current"]').addEventListener('click', async () => { render('Requesting location...'); try { await GpsModule.getCurrentPosition(); render('Location updated.'); } catch (error) { render(error && error.code === 1 ? 'Location permission was denied.' : 'Location could not be retrieved.', true); } });
            container.querySelector('[data-gps-action="start"]').addEventListener('click', () => { const result = GpsModule.startTracking(); render(result.ok ? 'Tracking started.' : 'Location tracking is unavailable.', !result.ok); });
            container.querySelector('[data-gps-action="stop"]').addEventListener('click', () => { GpsModule.stopTracking(); render('Tracking stopped.'); });
        };
        render();
    };

    window.GpsModule = GpsModule;

})();
