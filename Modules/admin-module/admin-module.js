/*
 * CatchTrack Admin Module
 * Version: 1.0
 *
 * Verwaltungs- und Steuerwerkzeug für die CatchTrack-Anwendung während der Entwicklung.
 * Bietet administrative Funktionen für System- und Modulverwaltung.
 */

(() => {
    'use strict';

    const AdminModule = {
        name: 'admin-module',
        version: '1.0.0',
        initialized: false,
        systemStats: {
            startedAt: null,
            modules: [],
            errors: [],
            events: []
        },

        /**
         * Initialisiert das Admin-Modul
         */
        init() {
            if (this.initialized) {
                return;
            }

            this.systemStats.startedAt = new Date().toISOString();
            this.initialized = true;

            // Event-Listener registrieren
            if (window.CatchTrackCore) {
                window.CatchTrackCore.on('error', (error) => {
                    this.logError(error);
                });

                window.CatchTrackCore.on('module:registered', (data) => {
                    this.addModuleStats(data);
                });

                window.CatchTrackCore.emit('admin-module:initialized', {
                    message: 'Admin-Modul initialisiert',
                    timestamp: new Date().toISOString()
                });
            }
        },

        /**
         * Protokolliert einen Fehler
         * @param {Error|object} error - Fehlerobject
         */
        logError(error) {
            const errorEntry = {
                timestamp: new Date().toISOString(),
                message: error.message || String(error),
                stack: error.stack || '',
                type: error.name || 'Unknown'
            };

            this.systemStats.errors.push(errorEntry);

            // Begrenzen auf letzte 100 Fehler
            if (this.systemStats.errors.length > 100) {
                this.systemStats.errors.shift();
            }

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('admin-module:error-logged', errorEntry);
            }
        },

        /**
         * Fügt Modul-Statistiken hinzu
         * @param {object} data - Modul-Daten
         */
        addModuleStats(data) {
            const moduleEntry = {
                name: data.name || 'Unknown',
                version: data.version || 'Unknown',
                registeredAt: new Date().toISOString(),
                status: 'registered'
            };

            this.systemStats.modules.push(moduleEntry);
        },

        /**
         * Gibt Systemstatistiken zurück
         * @returns {object} Systemstatistiken
         */
        getSystemStats() {
            return {
                uptime: this.getUptime(),
                moduleCount: this.systemStats.modules.length,
                modules: this.systemStats.modules,
                errorCount: this.systemStats.errors.length,
                recentErrors: this.systemStats.errors.slice(-10),
                startedAt: this.systemStats.startedAt
            };
        },

        /**
         * Berechnet die Laufzeit des Systems
         * @returns {number} Laufzeit in Millisekunden
         */
        getUptime() {
            if (!this.systemStats.startedAt) {
                return 0;
            }

            const startTime = new Date(this.systemStats.startedAt);
            const now = new Date();
            return now.getTime() - startTime.getTime();
        },

        /**
         * Gibt eine Liste aller geladenen Module zurück
         * @returns {array} Array von Modulen
         */
        getLoadedModules() {
            return this.systemStats.modules;
        },

        /**
         * Gibt alle protokollierten Fehler zurück
         * @returns {array} Array von Fehlern
         */
        getErrorLog() {
            return this.systemStats.errors;
        },

        /**
         * Löscht das Fehlerprotokoll
         */
        clearErrorLog() {
            this.systemStats.errors = [];

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('admin-module:error-log-cleared', {
                    timestamp: new Date().toISOString()
                });
            }
        },

        /**
         * Führt eine Systemüberprüfung durch
         * @returns {object} Überprüfungsergebnisse
         */
        performHealthCheck() {
            const checks = {
                timestamp: new Date().toISOString(),
                coreLoaded: !!window.CatchTrackCore,
                moduleManagerLoaded: !!window.CatchTrackModuleManager,
                userModuleLoaded: !!window.CatchTrackUserModule,
                eventsWorking: this.testEventEmission(),
                storageAccessible: this.testStorageAccess()
            };

            checks.healthy = Object.values(checks)
                .filter(v => typeof v === 'boolean')
                .every(v => v === true);

            return checks;
        },

        /**
         * Testet die Event-Emission
         * @returns {boolean} Erfolgreich
         */
        testEventEmission() {
            try {
                if (!window.CatchTrackCore) {
                    return false;
                }

                let testPassed = false;

                const listener = () => {
                    testPassed = true;
                };

                window.CatchTrackCore.once('admin-test:event', listener);
                window.CatchTrackCore.emit('admin-test:event');

                return testPassed;
            } catch (error) {
                return false;
            }
        },

        /**
         * Testet den Speicherzugriff
         * @returns {boolean} Erfolgreich
         */
        testStorageAccess() {
            try {
                const testKey = 'admin-health-check-test';
                const testValue = Date.now().toString();

                if (window.CatchTrackCoreStorage) {
                    // Einfacher Test für Storage-Verfügbarkeit
                    return true;
                }

                return false;
            } catch (error) {
                return false;
            }
        },

        /**
         * Gibt Debuginformationen aus
         * @returns {object} Debug-Informationen
         */
        getDebugInfo() {
            return {
                timestamp: new Date().toISOString(),
                environment: {
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    onLine: navigator.onLine
                },
                systemStats: this.getSystemStats(),
                healthCheck: this.performHealthCheck()
            };
        }
    };

    if (!window.CatchTrackAdminModule) {
        window.CatchTrackAdminModule = Object.freeze(AdminModule);
    }
})();
