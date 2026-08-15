/*
 * Core Access
 * Version: 1.0.0
 *
 * Central authorization and permission evaluation for the framework.
 * This module resolves permissions from roles, explicit permissions,
 * and protected metadata without allowing implicit admin bypasses.
 */

(() => {
    'use strict';

    const DEFAULT_ROLE_PERMISSIONS = {
        member: ['user:read'],
        manager: ['user:read', 'user:write'],
        admin: ['user:read', 'user:write', 'system:view'],
        developer: ['user:read', 'user:write', 'system:view', 'module:read', 'module:update']
    };

    const normalizeArray = (value) => Array.isArray(value)
        ? value.filter(Boolean).map(String)
        : [];

    const normalizeRoles = (user) => {
        const roles = normalizeArray(user && user.roles);
        if (roles.length === 0 && user && typeof user.role === 'string' && user.role.trim()) {
            roles.push(user.role.trim());
        }
        return roles;
    };

    const expandPermissions = (user) => {
        const explicit = normalizeArray(user && user.permissions);
        const roles = normalizeRoles(user);

        const merged = new Set(explicit);

        roles.forEach((role) => {
            const rolePermissions = DEFAULT_ROLE_PERMISSIONS[role] || [];
            rolePermissions.forEach((permission) => merged.add(permission));
        });

        return Array.from(merged);
    };

    const CoreAccess = {
        initialized: false,

        init() {
            if (this.initialized) {
                return this;
            }

            this.initialized = true;

            if (window.Core) {
                window.Core.emit('access:initialized', {
                    timestamp: new Date().toISOString()
                });
            }

            return this;
        },

        can(subject, action, resource = null, context = {}) {
            const user = subject && typeof subject === 'object' ? subject : null;
            if (!user) {
                return {
                    ok: false,
                    code: 'NO_SUBJECT',
                    message: 'User subject is required.'
                };
            }

            const permissions = expandPermissions(user);
            const actionPermission = typeof resource === 'string' && resource.trim()
                ? `${resource.trim()}:${action}`
                : action;

            const isProtected = !!(resource && resource.protected) || !!context.protected;
            const explicitAllow = permissions.includes(actionPermission) || permissions.includes(action);

            if (isProtected && !explicitAllow) {
                return {
                    ok: false,
                    code: 'ACCESS_DENIED',
                    message: 'Protected resource access denied.',
                    subject: user.id || user.username || null,
                    action,
                    resource: resource && typeof resource === 'object' ? resource.id || resource.name || null : resource
                };
            }

            if (!explicitAllow) {
                return {
                    ok: false,
                    code: 'ACCESS_DENIED',
                    message: 'Permission denied.',
                    subject: user.id || user.username || null,
                    action,
                    resource: resource && typeof resource === 'object' ? resource.id || resource.name || null : resource
                };
            }

            return {
                ok: true,
                code: 'ALLOWED',
                message: 'Access granted.',
                subject: user.id || user.username || null,
                action,
                resource: resource && typeof resource === 'object' ? resource.id || resource.name || null : resource
            };
        },

        hasRole(user, role) {
            const roles = normalizeRoles(user);
            return roles.includes(role);
        },

        hasPermission(user, permission) {
            const permissions = expandPermissions(user);
            return permissions.includes(permission);
        }
    };

    const moduleManifest = Object.freeze({
        id: 'core-access',
        name: 'Core Access',
        version: '1.0.0',
        type: 'framework',
        description: 'Central permission evaluation for roles and permissions.',
        dependencies: [],
        permissions: ['framework:read', 'access:read', 'access:write'],
        capabilities: ['authorization', 'permission-check'],
        source: 'Core/core-access.js'
    });

    if (!Array.isArray(window.FrameworkModuleCatalog)) {
        window.FrameworkModuleCatalog = [];
    }

    if (!window.FrameworkModuleCatalog.some((entry) => entry && entry.id === moduleManifest.id)) {
        window.FrameworkModuleCatalog.push(moduleManifest);
    }

    if (!window.CoreAccess) {
        window.CoreAccess = CoreAccess;
    }
})();
