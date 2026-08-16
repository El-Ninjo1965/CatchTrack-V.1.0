/*
 * Generic Admin Module
 * Version: 1.0.0
 *
 * Administrative facade for the generic platform architecture.
 * It orchestrates user, access, audit and module management without creating
 * a second auth or session truth.
 */

(() => {
    'use strict';

    const AdminModule = {
        name: 'admin-module',
        version: '1.0.0',
        initialized: false,
        startedAt: new Date().toISOString(),

        init() {
            if (this.initialized) {
                return this;
            }

            this.initialized = true;

            if (window.Core) {
                window.Core.on('error:handled', (data) => {
                    if (window.CoreAudit && typeof window.CoreAudit.record === 'function') {
                        window.CoreAudit.record('system', 'admin:error', data && data.context ? data.context.type || 'error' : 'error', 'handled', data || {});
                    }
                });

                window.Core.emit('admin:initialized', {
                    timestamp: new Date().toISOString(),
                    startedAt: this.startedAt
                });
            }

            return this;
        },

        getUptime() {
            const start = new Date(this.startedAt);
            return Date.now() - start.getTime();
        },

        async listUsers() {
            if (!window.UserModule || typeof window.UserModule.listUsers !== 'function') {
                return { ok: false, code: 'USER_MODULE_UNAVAILABLE', message: 'User module is not available.' };
            }

            return await window.UserModule.listUsers();
        },

        async getUserById(userId) {
            if (!window.UserModule || typeof window.UserModule.getUserById !== 'function') {
                return { ok: false, code: 'USER_MODULE_UNAVAILABLE', message: 'User module is not available.' };
            }

            return await window.UserModule.getUserById(userId);
        },

        async createUser(userData, actor = 'system') {
            if (!window.UserModule || typeof window.UserModule.createUser !== 'function') {
                return { ok: false, code: 'USER_MODULE_UNAVAILABLE', message: 'User module is not available.' };
            }

            return await window.UserModule.createUser(userData, actor);
        },

        async updateUser(userId, updates, actor = 'system') {
            if (!window.UserModule || typeof window.UserModule.updateUser !== 'function') {
                return { ok: false, code: 'USER_MODULE_UNAVAILABLE', message: 'User module is not available.' };
            }

            return await window.UserModule.updateUser(userId, updates, actor);
        },

        async deleteUser(userId, actor = 'system') {
            if (!window.UserModule || typeof window.UserModule.deleteUser !== 'function') {
                return { ok: false, code: 'USER_MODULE_UNAVAILABLE', message: 'User module is not available.' };
            }

            return await window.UserModule.deleteUser(userId, actor);
        },

        getCurrentUser() {
            if (!window.UserModule || typeof window.UserModule.getCurrentUser !== 'function') {
                return null;
            }

            return window.UserModule.getCurrentUser();
        },

        getAuditLog() {
            return window.CoreAudit && typeof window.CoreAudit.list === 'function'
                ? window.CoreAudit.list()
                : [];
        },

        getEventRingBuffer() {
            return window.CoreEventRing && typeof window.CoreEventRing.get === 'function'
                ? window.CoreEventRing.get()
                : {};
        },

        async getSystemStats() {
            const registry = window.ModuleRegistry && typeof window.ModuleRegistry.getAll === 'function'
                ? window.ModuleRegistry.getAll()
                : [];

            let userCount = 0;
            if (window.UserModule && typeof window.UserModule.listUsers === 'function') {
                const usersResult = await window.UserModule.listUsers();
                userCount = usersResult && usersResult.data && typeof usersResult.data.count === 'number'
                    ? usersResult.data.count
                    : 0;
            }

            return {
                startedAt: this.startedAt,
                uptime: this.getUptime(),
                moduleCount: registry.length,
                userCount,
                modules: registry.map((module) => ({ id: module.id, name: module.name, status: module.status || 'available' }))
            };
        },

        async canAccess(subject, action, resource = null) {
            if (!window.CoreAccess || typeof window.CoreAccess.can !== 'function') {
                return { ok: false, code: 'ACCESS_UNAVAILABLE', message: 'Core access is not available.' };
            }

            return window.CoreAccess.can(subject, action, resource);
        },

        healthCheck() {
            const checks = {
                timestamp: new Date().toISOString(),
                coreLoaded: !!window.Core,
                authLoaded: !!window.CoreAuth,
                accessLoaded: !!window.CoreAccess,
                auditLoaded: !!window.CoreAudit,
                eventRingLoaded: !!window.CoreEventRing,
                userModuleLoaded: !!window.UserModule,
                moduleManagerLoaded: !!window.ModuleManager
            };

            checks.healthy = Object.values(checks)
                .filter((value) => typeof value === 'boolean')
                .every((value) => value === true);

            return checks;
        },

        async getDebugInfo() {
            return {
                timestamp: new Date().toISOString(),
                environment: {
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
                    language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
                    onLine: typeof navigator !== 'undefined' ? navigator.onLine : true
                },
                stats: await this.getSystemStats(),
                health: this.healthCheck()
            };
        }
    };

    const moduleManifest = Object.freeze({
        id: 'core-admin',
        name: 'Core Admin',
        version: '1.0.0',
        type: 'framework',
        description: 'Framework administration and governance facade.',
        dependencies: ['core-user', 'core-auth', 'core-access', 'core-audit', 'core-event-ring'],
        permissions: ['framework:read', 'system:view', 'user:read', 'user:write'],
        capabilities: ['diagnostics', 'audit', 'admin'],
        source: 'platform/core-admin.js'
    });

    if (!Array.isArray(window.FrameworkModuleCatalog)) {
        window.FrameworkModuleCatalog = [];
    }

    if (!window.FrameworkModuleCatalog.some((entry) => entry && entry.id === moduleManifest.id)) {
        window.FrameworkModuleCatalog.push(moduleManifest);
    }

    if (!window.AdminModule) {
        window.AdminModule = AdminModule;
    }
})();
