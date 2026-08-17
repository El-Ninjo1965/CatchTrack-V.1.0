/*
 * GPS Tracker Module
 * Version: 1.0.0
 *
 * Neutral GPS tracking module for the neutral app platform.
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

        // ── Lifecycle ─────────────────────────────────────────────────────────

        install() {
            status = 'installed';
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
            audit('gps:enable', { moduleId: this.id });
            emit('gps:enabled', { moduleId: this.id });
            return { ok: true, status };
        },

        disable() {
            this.stopTracking();
            status = 'disabled';
            audit('gps:disable', { moduleId: this.id });
            emit('gps:disabled', { moduleId: this.id });
            return { ok: true, status };
        },

        uninstall() {
            this.stopTracking();
            status = 'available';
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

    window.GpsModule = GpsModule;

})();
