/*
 * Generic Admin Module
 * Version: 1.0.0
 *
 * Administrative functions for a reusable framework.
 * No application-specific logic is included here.
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

        init() {
            if (this.initialized) {
                return this;
            }

            this.systemStats.startedAt = new Date().toISOString();
            this.initialized = true;

            if (window.Core) {
                window.Core.on('error:handled', (data) => {
                    this.logError(data && data.error ? data.error : data);
                });

                window.Core.on('module:registered', (data) => {
                    this.addModuleStats(data);
                });

                window.Core.emit('admin-module:initialized', {
                    message: 'Admin module initialized',
                    timestamp: new Date().toISOString()
                });
            }

            return this;
        },

        logError(error) {
            const entry = error && typeof error === 'object'
                ? {
                    timestamp: new Date().toISOString(),
                    message: error.message || String(error),
                    stack: error.stack || '',
                    type: error.name || 'Unknown'
                }
                : {
                    timestamp: new Date().toISOString(),
                    message: String(error),
                    stack: '',
                    type: 'Unknown'
                };

            this.systemStats.errors.push(entry);

            if (this.systemStats.errors.length > 100) {
                this.systemStats.errors.shift();
            }

            if (window.Core) {
                window.Core.emit('admin-module:error-logged', entry);
            }
        },

        addModuleStats(data) {
            const moduleEntry = {
                name: data && data.name ? data.name : 'Unknown',
                version: data && data.version ? data.version : 'Unknown',
                registeredAt: new Date().toISOString(),
                status: 'registered'
            };

            this.systemStats.modules.push(moduleEntry);
        },

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

        getUptime() {
            if (!this.systemStats.startedAt) {
                return 0;
            }

            const startTime = new Date(this.systemStats.startedAt);
            const now = new Date();
            return now.getTime() - startTime.getTime();
        },

        getLoadedModules() {
            return this.systemStats.modules;
        },

        getErrorLog() {
            return this.systemStats.errors;
        },

        clearErrorLog() {
            this.systemStats.errors = [];

            if (window.Core) {
                window.Core.emit('admin-module:error-log-cleared', {
                    timestamp: new Date().toISOString()
                });
            }
        },

        performHealthCheck() {
            const checks = {
                timestamp: new Date().toISOString(),
                coreLoaded: !!window.Core,
                moduleManagerLoaded: !!window.ModuleManager,
                userModuleLoaded: !!window.UserModule,
                eventsWorking: this.testEventEmission(),
                storageAccessible: this.testStorageAccess()
            };

            checks.healthy = Object.values(checks)
                .filter((value) => typeof value === 'boolean')
                .every((value) => value === true);

            return checks;
        },

        testEventEmission() {
            try {
                if (!window.Core) {
                    return false;
                }

                let testPassed = false;
                const listener = () => {
                    testPassed = true;
                };

                window.Core.once('admin-test:event', listener);
                window.Core.emit('admin-test:event');

                return testPassed;
            } catch (error) {
                return false;
            }
        },

        testStorageAccess() {
            try {
                if (typeof window.localStorage !== 'undefined') {
                    const testKey = 'admin-health-check-test';
                    const testValue = Date.now().toString();
                    window.localStorage.setItem(testKey, testValue);
                    const read = window.localStorage.getItem(testKey);
                    window.localStorage.removeItem(testKey);
                    return read === testValue;
                }

                return !!window.DatabaseManager;
            } catch (error) {
                return false;
            }
        },

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

    if (!window.AdminModule) {
        window.AdminModule = AdminModule;
    }
})();
