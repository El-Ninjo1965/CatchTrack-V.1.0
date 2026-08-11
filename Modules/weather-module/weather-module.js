/*
 * CatchTrack Weather Module
 * Version: 1.0.0
 *
 * Verwaltet Wetterdaten für CatchTrack.
 * Ruft Daten über WeatherProviderRegistry ab, normalisiert sie
 * in ein einheitliches internes Format und cached sie in localStorage.
 *
 * Abhängigkeiten: nur CatchTrackWeatherProviderRegistry (dieses Modul)
 * Keine Abhängigkeiten zu User-, Admin-, Catch- oder anderen Modulen.
 */

(() => {
    'use strict';

    // WMO Weather Interpretation Codes → deutsche Beschreibung + Emoji-Icon
    const WMO = {
        0:  { de: 'Klarer Himmel',              icon: '☀️'  },
        1:  { de: 'Überwiegend klar',            icon: '🌤️' },
        2:  { de: 'Teilweise bewölkt',           icon: '⛅'  },
        3:  { de: 'Bedeckt',                     icon: '☁️'  },
        45: { de: 'Neblig',                      icon: '🌫️' },
        48: { de: 'Reifnebel',                   icon: '🌫️' },
        51: { de: 'Leichter Nieselregen',        icon: '🌦️' },
        53: { de: 'Nieselregen',                 icon: '🌦️' },
        55: { de: 'Starker Nieselregen',         icon: '🌧️' },
        61: { de: 'Leichter Regen',              icon: '🌧️' },
        63: { de: 'Regen',                       icon: '🌧️' },
        65: { de: 'Starker Regen',               icon: '🌧️' },
        71: { de: 'Leichter Schneefall',         icon: '🌨️' },
        73: { de: 'Schneefall',                  icon: '❄️'  },
        75: { de: 'Starker Schneefall',          icon: '❄️'  },
        77: { de: 'Schneegriesel',               icon: '🌨️' },
        80: { de: 'Leichte Regenschauer',        icon: '🌦️' },
        81: { de: 'Regenschauer',                icon: '🌧️' },
        82: { de: 'Starke Regenschauer',         icon: '⛈️' },
        85: { de: 'Schneeschauer',               icon: '🌨️' },
        86: { de: 'Starke Schneeschauer',        icon: '❄️'  },
        95: { de: 'Gewitter',                    icon: '⛈️' },
        96: { de: 'Gewitter mit Hagel',          icon: '⛈️' },
        99: { de: 'Gewitter, starker Hagel',     icon: '⛈️' }
    };

    const STALE_MINUTES = 30;
    const CACHE_KEY     = 'ct_weather_v1';

    const WeatherModule = {
        name:        'weather-module',
        version:     '1.0.0',
        initialized: false,
        location:    null,  // { lat, lon, name }
        _data:       null,  // letzter normalisierter Datensatz (RAM)
        _state:      'idle' // idle | loading | ok | stale | offline | error | no-data

        ,

        init() {
            if (this.initialized) return;
            this.initialized = true;

            // Standard-Standort für Entwicklungsphase (Köln)
            this.location = { lat: 50.938, lon: 6.960, name: 'Köln' };

            // Gecachte Daten in RAM laden
            this._data = this._loadCache();

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('weather-module:initialized', {
                    version: this.version,
                    hasCachedData: this._data !== null
                });
            }
        },

        // Standort setzen – muss aufgerufen werden bevor getWeather()
        setLocation(lat, lon, name) {
            if (typeof lat !== 'number' || typeof lon !== 'number') {
                throw new Error('Ungültige Koordinaten: lat und lon müssen Zahlen sein');
            }
            if (lat < -90 || lat > 90) {
                throw new Error('Latitude muss zwischen -90 und 90 liegen');
            }
            if (lon < -180 || lon > 180) {
                throw new Error('Longitude muss zwischen -180 und 180 liegen');
            }
            this.location = {
                lat,
                lon,
                name: (name || '').trim() || `${lat.toFixed(3)}, ${lon.toFixed(3)}`
            };
            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('weather-module:location-changed', { ...this.location });
            }
        },

        getLocation() {
            return this.location ? { ...this.location } : null;
        },

        // Hauptmethode: Wetterdaten abrufen
        // forceRefresh=true überspringt den Cache
        async getWeather(forceRefresh) {
            if (!this.initialized) this.init();
            if (!this.location) throw new Error('Kein Standort gesetzt');

            // Gültigen Cache zurückgeben wenn nicht veraltet
            if (!forceRefresh && this._data && !this._isStale(this._data)) {
                this._state = 'ok';
                return { ...this._data };
            }

            this._state = 'loading';

            try {
                const raw        = await this._fetchFromProvider();
                const normalized = this._normalize(raw);
                this._data       = normalized;
                this._state      = 'ok';
                this._saveCache(normalized);

                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('weather-module:data-updated', {
                        location:  this.location.name,
                        fetchedAt: normalized.fetchedAt,
                        source:    normalized.source
                    });
                }

                return { ...normalized };

            } catch (err) {
                // Fetch fehlgeschlagen: veralteten Cache zurückgeben (mit Kennzeichnung)
                if (this._data) {
                    this._state = 'stale';
                    if (window.CatchTrackCore) {
                        window.CatchTrackCore.emit('weather-module:data-stale', {
                            reason:    err.message,
                            fetchedAt: this._data.fetchedAt
                        });
                    }
                    return { ...this._data, _stale: true, _staleReason: err.message };
                }

                this._state = navigator.onLine === false ? 'offline' : 'error';
                this._data  = null;

                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('weather-module:error', {
                        message: err.message,
                        state:   this._state
                    });
                }

                throw err;
            }
        },

        getLastData() {
            return this._data ? { ...this._data } : null;
        },

        getState() {
            return this._state;
        },

        clearCache() {
            try { localStorage.removeItem(CACHE_KEY); } catch (_) {}
            this._data  = null;
            this._state = 'idle';
        },

        // Windrichtung in Grad → Himmelsrichtung
        windDirectionLabel(deg) {
            if (deg == null || isNaN(deg)) return '–';
            const dirs = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
            return dirs[Math.round(deg / 45) % 8];
        },

        // ──────── Interne Methoden ────────

        async _fetchFromProvider() {
            if (!window.CatchTrackWeatherProviderRegistry) {
                throw new Error('WeatherProviderRegistry nicht verfügbar');
            }
            const provider = window.CatchTrackWeatherProviderRegistry.getActive();
            return provider.fetchWeather(this.location.lat, this.location.lon);
        },

        // Open-Meteo Rohdaten → normalisiertes CatchTrack-Format
        _normalize(raw) {
            if (!raw || !raw.current) {
                throw new Error('Ungültige Wetterdaten vom Provider erhalten');
            }

            const c            = raw.current;
            const hourlyTimes  = (raw.hourly && raw.hourly.time)  || [];
            const dailyDates   = (raw.daily  && raw.daily.time)   || [];
            const provider     = window.CatchTrackWeatherProviderRegistry
                ? window.CatchTrackWeatherProviderRegistry.getActive()
                : null;

            // Aktuellen stündlichen Index bestimmen
            const nowPrefix = new Date().toISOString().slice(0, 13); // 'YYYY-MM-DDTHH'
            let hStart = hourlyTimes.findIndex(t => t.startsWith(nowPrefix));
            if (hStart < 0) hStart = 0;

            // Nächste 24 Stunden
            const hourly = hourlyTimes.slice(hStart, hStart + 24).map((time, i) => {
                const ri   = hStart + i;
                const code = this._safeGet(raw.hourly, 'weather_code', ri, 0);
                return {
                    time,
                    temperature:              this._safeGet(raw.hourly, 'temperature_2m', ri),
                    precipitation:            this._safeGet(raw.hourly, 'precipitation', ri),
                    precipitationProbability: this._safeGet(raw.hourly, 'precipitation_probability', ri),
                    windSpeed:                this._safeGet(raw.hourly, 'wind_speed_10m', ri),
                    windDirection:            this._safeGet(raw.hourly, 'wind_direction_10m', ri),
                    windGusts:                this._safeGet(raw.hourly, 'wind_gusts_10m', ri),
                    weatherCode:              code,
                    weatherIcon:              this._wmoIcon(code),
                    weatherDescription:       this._wmoDesc(code)
                };
            });

            // 7 Tage
            const daily = dailyDates.map((date, i) => {
                const code = this._safeGet(raw.daily, 'weather_code', i, 0);
                return {
                    date,
                    tempMax:                      this._safeGet(raw.daily, 'temperature_2m_max', i),
                    tempMin:                      this._safeGet(raw.daily, 'temperature_2m_min', i),
                    precipitationSum:             this._safeGet(raw.daily, 'precipitation_sum', i),
                    precipitationProbabilityMax:  this._safeGet(raw.daily, 'precipitation_probability_max', i),
                    windSpeedMax:                 this._safeGet(raw.daily, 'wind_speed_10m_max', i),
                    windDirectionDominant:        this._safeGet(raw.daily, 'wind_direction_10m_dominant', i),
                    weatherCode:                  code,
                    weatherIcon:                  this._wmoIcon(code),
                    weatherDescription:           this._wmoDesc(code),
                    sunrise:                      this._safeGet(raw.daily, 'sunrise', i),
                    sunset:                       this._safeGet(raw.daily, 'sunset', i)
                };
            });

            const currentCode = c.weather_code ?? 0;

            return {
                location:     { ...this.location },
                source:       provider ? provider.getName() : 'unknown',
                attribution:  provider ? provider.getAttribution() : '',
                fetchedAt:    new Date().toISOString(),
                timezone:     raw.timezone || 'UTC',
                current: {
                    time:                    c.time                     ?? null,
                    temperature:             c.temperature_2m           ?? null,
                    apparentTemperature:     c.apparent_temperature     ?? null,
                    humidity:                c.relative_humidity_2m     ?? null,
                    pressure:                c.surface_pressure         ?? null,
                    windSpeed:               c.wind_speed_10m           ?? null,
                    windDirection:           c.wind_direction_10m       ?? null,
                    windGusts:               c.wind_gusts_10m           ?? null,
                    precipitation:           c.precipitation            ?? null,
                    precipitationProbability: c.precipitation_probability ?? null,
                    cloudCover:              c.cloud_cover              ?? null,
                    weatherCode:             currentCode,
                    weatherDescription:      this._wmoDesc(currentCode),
                    weatherIcon:             this._wmoIcon(currentCode),
                    isDay:                   c.is_day === 1
                },
                hourly,
                daily,
                todaySunrise: daily[0] ? daily[0].sunrise : null,
                todaySunset:  daily[0] ? daily[0].sunset  : null
            };
        },

        _safeGet(obj, key, index, fallback) {
            const arr = obj && obj[key];
            const val = (Array.isArray(arr) && arr[index] !== undefined) ? arr[index] : undefined;
            return val !== undefined ? val : (fallback !== undefined ? fallback : null);
        },

        _wmoDesc(code) {
            return (WMO[code] && WMO[code].de) || 'Unbekannt';
        },

        _wmoIcon(code) {
            return (WMO[code] && WMO[code].icon) || '🌡️';
        },

        _isStale(data) {
            if (!data || !data.fetchedAt) return true;
            const ageMin = (Date.now() - new Date(data.fetchedAt).getTime()) / 60000;
            return ageMin > STALE_MINUTES;
        },

        _saveCache(data) {
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            } catch (_) {}
        },

        _loadCache() {
            try {
                const raw = localStorage.getItem(CACHE_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch (_) {
                return null;
            }
        }
    };

    if (!window.CatchTrackWeatherModule) {
        window.CatchTrackWeatherModule = WeatherModule;
    }
})();
