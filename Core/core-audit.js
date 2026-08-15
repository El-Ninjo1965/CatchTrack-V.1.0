/*
 * Core Audit
 * Version: 1.0.0
 *
 * Central audit trail for user/admin actions and access decisions.
 * This is separate from the in-memory event ring buffer used for debug output.
 */

(() => {
    'use strict';

    const MAX_AUDIT_ENTRIES = 1000;

    const CoreAudit = {
        entries: [],
        initialized: false,

        init() {
            if (this.initialized) {
                return this;
            }

            this.initialized = true;

            if (window.Core) {
                window.Core.emit('audit:initialized', {
                    timestamp: new Date().toISOString()
                });
            }

            return this;
        },

        record(actor, action, resource, result, metadata = {}) {
            const entry = {
                id: `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                actor: actor && typeof actor === 'object' ? actor.id || actor.username || 'system' : String(actor || 'system'),
                action: String(action || 'unknown'),
                resource: resource && typeof resource === 'object' ? resource.id || resource.name || 'resource' : String(resource || 'resource'),
                result: String(result || 'unknown'),
                timestamp: new Date().toISOString(),
                metadata: metadata && typeof metadata === 'object' ? { ...metadata } : {}
            };

            this.entries.push(entry);

            if (this.entries.length > MAX_AUDIT_ENTRIES) {
                this.entries.shift();
            }

            if (window.Core) {
                window.Core.emit('audit:recorded', {
                    id: entry.id,
                    action: entry.action,
                    resource: entry.resource,
                    result: entry.result
                });
            }

            return entry;
        },

        list() {
            return this.entries.map((entry) => ({ ...entry, metadata: { ...entry.metadata } }));
        },

        clear() {
            this.entries = [];
            if (window.Core) {
                window.Core.emit('audit:cleared', {
                    timestamp: new Date().toISOString()
                });
            }
            return true;
        }
    };

    const moduleManifest = Object.freeze({
        id: 'core-audit',
        name: 'Core Audit',
        version: '1.0.0',
        type: 'framework',
        description: 'Central audit trail for user and admin activity.',
        dependencies: [],
        permissions: ['framework:read', 'audit:read', 'audit:write'],
        capabilities: ['audit', 'trace'],
        source: 'Core/core-audit.js'
    });

    if (!Array.isArray(window.FrameworkModuleCatalog)) {
        window.FrameworkModuleCatalog = [];
    }

    if (!window.FrameworkModuleCatalog.some((entry) => entry && entry.id === moduleManifest.id)) {
        window.FrameworkModuleCatalog.push(moduleManifest);
    }

    if (!window.CoreAudit) {
        window.CoreAudit = CoreAudit;
    }
})();
