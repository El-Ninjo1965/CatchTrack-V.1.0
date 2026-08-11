/*
 * CatchTrack Weather Provider
 * Version: 1.0.0
 *
 * Provider-Abstraktion für Wetterdatenquellen.
 * Implementiert: Open-Meteo (open-meteo.com)
 *
 * LIZENZ Open-Meteo:
 * Kostenlos für nicht-kommerzielle Nutzung (CC BY 4.0).
 * Kommerzielle Nutzung erfordert einen kostenpflichtigen Plan.
 * Pflichtangabe: "Wetterdaten von Open-Meteo (open-meteo.com)"
 *
 * Provider-Wechsel: WeatherProviderRegistry.register() + setActive() verwenden.
 * Das Weather-Modul ist vollständig provider-agnostisch.
 */

(() => {
    'use strict';

    // Jeder Provider muss name, fetchWeather(lat, lon), getName(), getAttribution() implementieren
    const OpenMeteoProvider = {
        name: 'open-meteo',
        _baseUrl: 'https://api.open-meteo.com/v1/forecast',

        getName() {
            return 'Open-Meteo';
        },

        getAttribution() {
            return 'Wetterdaten bereitgestellt von Open-Meteo (open-meteo.com) – CC BY 4.0';
        },

        async fetchWeather(lat, lon) {
            const params = new URLSearchParams({
                latitude:  lat,
                longitude: lon,
                current: [
                    'temperature_2m',
                    'apparent_temperature',
                    'relative_humidity_2m',
                    'surface_pressure',
                    'wind_speed_10m',
                    'wind_direction_10m',
                    'wind_gusts_10m',
                    'precipitation',
                    'precipitation_probability',
                    'cloud_cover',
                    'weather_code',
                    'is_day'
                ].join(','),
                hourly: [
                    'temperature_2m',
                    'precipitation_probability',
                    'precipitation',
                    'wind_speed_10m',
                    'wind_direction_10m',
                    'wind_gusts_10m',
                    'weather_code'
                ].join(','),
                daily: [
                    'temperature_2m_max',
                    'temperature_2m_min',
                    'precipitation_sum',
                    'precipitation_probability_max',
                    'wind_speed_10m_max',
                    'wind_direction_10m_dominant',
                    'weather_code',
                    'sunrise',
                    'sunset'
                ].join(','),
                forecast_days:   7,
                timezone:        'auto',
                wind_speed_unit: 'kmh'
            });

            const controller = new AbortController();
            // 10s Timeout
            const timeout = setTimeout(() => controller.abort(), 10000);

            try {
                const response = await fetch(`${this._baseUrl}?${params}`, {
                    signal: controller.signal
                });
                clearTimeout(timeout);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                if (!data.current || !data.hourly || !data.daily) {
                    throw new Error('Unvollständige Daten vom Provider erhalten');
                }

                return data;
            } catch (err) {
                clearTimeout(timeout);
                if (err.name === 'AbortError') {
                    throw new Error('Zeitüberschreitung beim Abrufen der Wetterdaten (10s)');
                }
                throw err;
            }
        }
    };

    // Registry – ermöglicht späteren Provider-Wechsel ohne Modulumbau
    const WeatherProviderRegistry = {
        _providers: new Map(),
        _active:    null,

        register(provider) {
            if (!provider || !provider.name || typeof provider.fetchWeather !== 'function') {
                throw new Error('Ungültiger Provider: name und fetchWeather() erforderlich');
            }
            this._providers.set(provider.name, provider);
        },

        setActive(name) {
            if (!this._providers.has(name)) {
                throw new Error(`Provider "${name}" nicht registriert`);
            }
            this._active = this._providers.get(name);
        },

        getActive() {
            if (!this._active) {
                throw new Error('Kein aktiver Weather-Provider gesetzt');
            }
            return this._active;
        },

        getAll() {
            return Array.from(this._providers.keys());
        }
    };

    WeatherProviderRegistry.register(OpenMeteoProvider);
    WeatherProviderRegistry.setActive('open-meteo');

    if (!window.CatchTrackWeatherProviderRegistry) {
        window.CatchTrackWeatherProviderRegistry = WeatherProviderRegistry;
    }
})();
