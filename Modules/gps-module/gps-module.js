/*
 * CatchTrack GPS Module
 * Version: 1.0.0
 *
 * Erfasst, verarbeitet und stellt geografische Positionsdaten bereit.
 * Eigenständig – keine Abhängigkeiten zu anderen CatchTrack-Modulen.
 *
 * Datenfluss: Andere Module → GPS-Schnittstelle
 * Das GPS-Modul kennt keine anderen Module und benötigt sie nicht.
 */

(() => {
    'use strict';

    const STALE_MINUTES = 5;

    const GpsModule = {
        name:        'gps-module',
        version:     '1.0.0',
        initialized: false,

        _status:    'idle',   // idle|requesting|available|stale|denied|unavailable|timeout|error
        _position:  null,     // normalisiertes Positionsobjekt
        _watchId:   null,     // für kontinuierliches Tracking
        _simulated: false,    // simulierte Position aktiv (nur für Tests)

        init() {
            if (this.initialized) return;
            this.initialized = true;

            if (!navigator.geolocation) {
                this._status = 'unavailable';
            }

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('gps-module:initialized', {
                    version:   this.version,
                    supported: !!navigator.geolocation
                });
            }
        },

        isSupported() {
            return !!navigator.geolocation;
        },

        getStatus() {
            if (this._status === 'available' && this._position && this._isStale(this._position)) {
                this._status = 'stale';
            }
            return this._status;
        },

        // Gibt eine Kopie der letzten Position zurück – null wenn keine vorhanden
        getLastPosition() {
            if (!this._position) return null;
            return Object.assign({}, this._position, {
                isStale: this._isStale(this._position)
            });
        },

        // true nur wenn frische, gültige Position vorhanden
        hasValidPosition() {
            return this._status === 'available'
                && this._position !== null
                && !this._isStale(this._position);
        },

        // Browser-Permission-Status abfragen (sofern API verfügbar)
        async checkPermission() {
            if (!navigator.permissions) return 'unknown';
            try {
                const result = await navigator.permissions.query({ name: 'geolocation' });
                return result.state; // 'granted' | 'denied' | 'prompt'
            } catch (_) {
                return 'unknown';
            }
        },

        // Einmalige Positionsabfrage
        async getCurrentPosition(options) {
            if (!this.isSupported()) {
                this._status = 'unavailable';
                throw new Error('Geolocation wird von diesem Browser nicht unterstützt');
            }

            if (this._simulated && this._position) {
                return Object.assign({}, this._position);
            }

            this._status = 'requesting';
            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('gps-module:requesting', {});
            }

            const opts = Object.assign({
                enableHighAccuracy: true,
                timeout:            15000,
                maximumAge:         30000
            }, options || {});

            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (geoPos) => {
                        const pos = this._normalize(geoPos, 'gps');
                        this._position = pos;
                        this._status   = 'available';

                        if (window.CatchTrackCore) {
                            window.CatchTrackCore.emit('gps-module:position-updated', {
                                latitude:  pos.latitude,
                                longitude: pos.longitude,
                                accuracy:  pos.accuracy,
                                source:    pos.source
                            });
                        }

                        resolve(Object.assign({}, pos));
                    },
                    (err) => {
                        this._status = this._mapErrorCode(err.code);

                        if (window.CatchTrackCore) {
                            window.CatchTrackCore.emit('gps-module:error', {
                                status:  this._status,
                                message: err.message,
                                code:    err.code
                            });
                        }

                        reject(new Error(this._statusLabel(this._status)));
                    },
                    opts
                );
            });
        },

        // Kontinuierliches Positions-Tracking starten
        startTracking(options, onUpdate, onError) {
            if (!this.isSupported()) {
                if (onError) onError(new Error('Geolocation wird von diesem Browser nicht unterstützt'));
                return;
            }

            if (this._watchId !== null) {
                this.stopTracking();
            }

            // Bei aktiver Simulation: einmalig onUpdate aufrufen
            if (this._simulated && this._position) {
                if (onUpdate) onUpdate(Object.assign({}, this._position));
                return;
            }

            const opts = Object.assign({
                enableHighAccuracy: true,
                timeout:            15000,
                maximumAge:         10000
            }, options || {});

            this._status = 'requesting';

            this._watchId = navigator.geolocation.watchPosition(
                (geoPos) => {
                    const pos = this._normalize(geoPos, 'gps');
                    this._position = pos;
                    this._status   = 'available';

                    if (window.CatchTrackCore) {
                        window.CatchTrackCore.emit('gps-module:position-updated', {
                            latitude:  pos.latitude,
                            longitude: pos.longitude,
                            accuracy:  pos.accuracy,
                            source:    pos.source
                        });
                    }

                    if (onUpdate) onUpdate(Object.assign({}, pos));
                },
                (err) => {
                    this._status = this._mapErrorCode(err.code);

                    if (window.CatchTrackCore) {
                        window.CatchTrackCore.emit('gps-module:error', {
                            status:  this._status,
                            message: err.message,
                            code:    err.code
                        });
                    }

                    if (onError) onError(new Error(this._statusLabel(this._status)));
                },
                opts
            );

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('gps-module:tracking-started', {});
            }
        },

        stopTracking() {
            if (this._watchId !== null) {
                if (navigator.geolocation) {
                    navigator.geolocation.clearWatch(this._watchId);
                }
                this._watchId = null;
            }

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('gps-module:tracking-stopped', {});
            }
        },

        isTracking() {
            return this._watchId !== null;
        },

        // Simulierte Position für Tests – verfälscht keinen produktiven GPS-Datenfluss
        setSimulatedPosition(lat, lon, options) {
            if (typeof lat !== 'number' || typeof lon !== 'number') {
                throw new Error('Ungültige Koordinaten: lat und lon müssen Zahlen sein');
            }
            if (lat < -90 || lat > 90) throw new Error('Latitude muss zwischen -90 und 90 liegen');
            if (lon < -180 || lon > 180) throw new Error('Longitude muss zwischen -180 und 180 liegen');

            const opts = options || {};
            this._position = {
                latitude:         lat,
                longitude:        lon,
                accuracy:         opts.accuracy  !== undefined ? opts.accuracy  : 10,
                altitude:         opts.altitude  !== undefined ? opts.altitude  : null,
                altitudeAccuracy: opts.altitudeAccuracy !== undefined ? opts.altitudeAccuracy : null,
                speed:            opts.speed     !== undefined ? opts.speed     : null,
                heading:          opts.heading   !== undefined ? opts.heading   : null,
                timestamp:        new Date().toISOString(),
                source:           'simulated',
                status:           'available'
            };
            this._status    = 'available';
            this._simulated = true;

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('gps-module:position-updated', {
                    latitude:  lat,
                    longitude: lon,
                    accuracy:  this._position.accuracy,
                    source:    'simulated'
                });
            }
        },

        clearSimulatedPosition() {
            if (!this._simulated) return;
            this._position  = null;
            this._status    = 'idle';
            this._simulated = false;
        },

        isSimulated() {
            return this._simulated;
        },

        // Geocoding-Ergebnis in _position zurückschreiben (damit getLastPosition() es enthält)
        setLocationInfo(city, province, country) {
            if (this._position) {
                this._position.city     = city    || null;
                this._position.province = province || null;
                this._position.country  = country  || null;
            }
        },
        // Quelle: Nominatim (OpenStreetMap) – kein API-Key, Attribution erforderlich
        // Lizenz: ODbL (OpenStreetMap) – kostenlos, Attribution: "© OpenStreetMap-Mitwirkende"
        async reverseGeocode(lat, lon) {
            if (typeof lat !== 'number' || typeof lon !== 'number') {
                throw new Error('Ungültige Koordinaten für Reverse Geocoding');
            }
            const locale = this._getPreferredLocale();
            const langHeader = this._getPreferredLanguage();
            const om = await this._reverseGeocodeOpenMeteo(lat, lon, locale).catch(() => null);
            const nm = await this._reverseGeocodeNominatim(lat, lon, langHeader).catch(() => null);

            if (!om && !nm) {
                throw new Error('Reverse Geocoding fehlgeschlagen');
            }

            const city = (om && om.city) || (nm && nm.city) || null;
            const province = (om && om.province) || (nm && nm.province) || null;
            const countryCode = (om && om.countryCode) || (nm && nm.countryCode) || null;
            const countryRaw = (om && om.country) || (nm && nm.country) || null;
            const country = this._localizeCountryName(countryRaw, countryCode, locale);
            const displayName = (om && om.displayName) || (nm && nm.displayName) || null;

            return {
                city,
                province,
                country,
                countryCode,
                displayName
            };
        },

        async _reverseGeocodeOpenMeteo(lat, lon, locale) {
            const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=${encodeURIComponent(locale)}&count=1`;
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);

            try {
                const resp = await fetch(url, {
                    signal: controller.signal,
                    headers: { 'User-Agent': 'CatchTrack/1.0 (catchtrack-app)' }
                });
                clearTimeout(timeout);

                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                const r = Array.isArray(data.results) && data.results[0] ? data.results[0] : null;
                if (!r) throw new Error('Keine Open-Meteo Reverse-Geocoding-Daten');

                const city = r.name || r.city || null;
                const province = r.admin1 || r.admin2 || null;
                const countryCode = (r.country_code || '').toUpperCase() || null;
                const countryRaw = r.country || null;
                const country = this._localizeCountryName(countryRaw, countryCode, locale);
                const displayName = [city, province, country].filter(Boolean).join(', ') || null;

                return {
                    city,
                    province,
                    country,
                    countryCode,
                    displayName
                };
            } catch (err) {
                clearTimeout(timeout);
                if (err.name === 'AbortError') {
                    throw new Error('Reverse Geocoding (Open-Meteo): Zeitüberschreitung');
                }
                throw err;
            }
        },

        async _reverseGeocodeNominatim(lat, lon, langHeader) {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=${encodeURIComponent(langHeader)}`;
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);

            try {
                const resp = await fetch(url, {
                    signal: controller.signal,
                    headers: { 'User-Agent': 'CatchTrack/1.0 (catchtrack-app)' }
                });
                clearTimeout(timeout);

                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                const a = data.address || {};

                return {
                    city:        a.city || a.town || a.village || a.hamlet || a.suburb || null,
                    province:    a.state || a.region || a.county || null,
                    country:     a.country || null,
                    countryCode: (a.country_code || '').toUpperCase() || null,
                    displayName: data.display_name || null
                };
            } catch (err) {
                clearTimeout(timeout);
                if (err.name === 'AbortError') {
                    throw new Error('Reverse Geocoding: Zeitüberschreitung');
                }
                throw err;
            }
        },

        _getPreferredLocale() {
            const fromI18n = window.CatchTrackI18n?.getLocale?.() || window.CatchTrackI18n?.getDeviceLocale?.();
            const fromNav = navigator.language || navigator.userLanguage || 'de';
            const raw = (fromI18n || fromNav || 'de').toString().replace('_', '-').toLowerCase();
            return raw.split('-')[0] || 'de';
        },

        _getPreferredLanguage() {
            const langs = [];
            const appLocale = this._getPreferredLocale();

            if (appLocale) langs.push(appLocale);

            if (Array.isArray(navigator.languages)) {
                navigator.languages.forEach((l) => {
                    if (typeof l === 'string' && l.trim()) {
                        langs.push(l.trim().replace('_', '-').toLowerCase());
                    }
                });
            }

            langs.push('en');

            const normalized = [];
            langs.forEach((l) => {
                const short = l.split('-')[0];
                if (short && !normalized.includes(short)) normalized.push(short);
            });

            return normalized.join(',');
        },

        _localizeCountryName(country, countryCode, locale) {
            const code = (countryCode || '').toUpperCase();
            if (!code) return country || null;
            try {
                if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
                    const display = new Intl.DisplayNames([locale || 'de'], { type: 'region' });
                    const localized = display.of(code);
                    if (localized) return localized;
                }
            } catch (_) {
                // Fallback unten
            }
            return country || code;
        },

        // ──── Interne Methoden ────

        _normalize(geoPos, source) {
            const c = geoPos.coords;
            return {
                latitude:         c.latitude,
                longitude:        c.longitude,
                accuracy:         c.accuracy              != null ? c.accuracy              : null,
                altitude:         c.altitude              != null ? c.altitude              : null,
                altitudeAccuracy: c.altitudeAccuracy      != null ? c.altitudeAccuracy      : null,
                speed:            c.speed                 != null ? c.speed                 : null,
                heading:          c.heading               != null ? c.heading               : null,
                timestamp:        new Date(geoPos.timestamp).toISOString(),
                source:           source || 'gps',
                status:           'available'
            };
        },

        _isStale(pos) {
            if (!pos || !pos.timestamp) return true;
            return (Date.now() - new Date(pos.timestamp).getTime()) / 60000 > STALE_MINUTES;
        },

        // GeolocationPositionError: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
        _mapErrorCode(code) {
            if (code === 1) return 'denied';
            if (code === 2) return 'unavailable';
            if (code === 3) return 'timeout';
            return 'error';
        },

        _statusLabel(status) {
            const labels = {
                denied:      'Standortberechtigung wurde verweigert',
                unavailable: 'Standortdienste nicht verfügbar oder deaktiviert',
                timeout:     'Zeitüberschreitung bei der Positionsermittlung',
                error:       'Fehler bei der Positionsermittlung'
            };
            return labels[status] || 'Unbekannter GPS-Fehler';
        }
    };

    if (!window.CatchTrackGpsModule) {
        window.CatchTrackGpsModule = GpsModule;
    }
})();
