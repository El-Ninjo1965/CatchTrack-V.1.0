/*
 * Generic User Module
 * Version: 1.0.0
 *
 * User facade for the approved master architecture.
 * It delegates identity, auth, access and audit to central core services.
 */

(() => {
    'use strict';

    const generateUuid = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        if (typeof require === 'function' && typeof process !== 'undefined') {
            return require('crypto').randomUUID();
        }

        return `uuid-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const serializeUser = (user) => {
        if (!user || typeof user !== 'object') {
            return null;
        }

        return {
            ...user,
            roles: Array.isArray(user.roles) ? [...user.roles] : [],
            permissions: Array.isArray(user.permissions) ? [...user.permissions] : [],
            protected: !!user.protected,
            metadata: user.metadata && typeof user.metadata === 'object' ? { ...user.metadata } : {}
        };
    };

    const normalizePermissions = (user = {}) => {
        const rolePermissions = {
            member: ['user:read'],
            manager: ['user:read', 'user:write'],
            admin: ['user:read', 'user:write', 'system:view'],
            developer: ['user:read', 'user:write', 'system:view', 'module:read', 'module:update']
        };

        const explicit = Array.isArray(user.permissions)
            ? user.permissions.filter(Boolean).map(String)
            : [];
        const roles = Array.isArray(user.roles)
            ? user.roles.filter(Boolean).map(String)
            : (typeof user.role === 'string' && user.role.trim() ? [user.role.trim()] : []);

        const set = new Set(explicit);
        roles.forEach((role) => {
            const mapped = rolePermissions[role] || [];
            mapped.forEach((permission) => set.add(permission));
        });

        return Array.from(set);
    };

    const ensureUserLayout = (user) => {
        if (!user || typeof user !== 'object') {
            return null;
        }

        const roles = Array.isArray(user.roles) && user.roles.length > 0
            ? user.roles.map(String)
            : (typeof user.role === 'string' && user.role.trim() ? [user.role.trim()] : ['member']);

        return {
            id: String(user.id || generateUuid()),
            displayId: user.displayId || '',
            username: String(user.username || '').trim(),
            displayName: user.displayName || user.username || '',
            email: user.email || '',
            status: user.status || 'active',
            roles,
            permissions: normalizePermissions({
                roles,
                permissions: user.permissions || []
            }),
            protected: !!user.protected,
            createdAt: user.createdAt || new Date().toISOString(),
            updatedAt: user.updatedAt || new Date().toISOString(),
            schemaVersion: user.schemaVersion || 1,
            metadata: user.metadata && typeof user.metadata === 'object' ? { ...user.metadata } : {}
        };
    };

    const UserModule = {
        name: 'user-module',
        version: '1.0.0',
        initialized: false,
        currentUser: null,
        currentSession: null,
        users: new Map(),

        init() {
            if (this.initialized) {
                if (this.users.size === 0) {
                    this.createDefaultUsers();
                }
                return this;
            }

            this.ready();
            this.initialized = true;

            if (window.Core) {
                window.Core.emit('user:initialized', {
                    userCount: this.users.size,
                    timestamp: new Date().toISOString()
                });
            }

            return this;
        },

        ready() {
            if (this.users.size === 0) {
                this.createDefaultUsers();
            }
        },

        createDefaultUsers() {
            const now = new Date().toISOString();
            const users = [
                {
                    id: generateUuid(),
                    displayId: 'USR-000001',
                    username: 'developer',
                    displayName: 'Developer User',
                    email: 'developer@example.local',
                    status: 'active',
                    roles: ['developer'],
                    permissions: ['user:read', 'user:write', 'system:view', 'module:read', 'module:update'],
                    protected: true,
                    createdAt: now,
                    updatedAt: now,
                    schemaVersion: 1
                },
                {
                    id: generateUuid(),
                    displayId: 'USR-000002',
                    username: 'admin',
                    displayName: 'Administrator',
                    email: 'admin@example.local',
                    status: 'active',
                    roles: ['admin'],
                    permissions: ['user:read', 'user:write', 'system:view'],
                    protected: true,
                    createdAt: now,
                    updatedAt: now,
                    schemaVersion: 1
                }
            ];

            users.forEach((user) => {
                const normalized = ensureUserLayout(user);
                if (normalized) {
                    this.users.set(normalized.id, normalized);
                }
            });
        },

        getNextDisplayId() {
            const sequence = this.users.size + 1;
            return `USR-${String(sequence).padStart(6, '0')}`;
        },

        async listUsers() {
            const items = Array.from(this.users.values()).map((user) => serializeUser(user));
            return {
                ok: true,
                code: 'USERS_LISTED',
                data: {
                    items,
                    count: items.length
                }
            };
        },

        async getUserById(userId) {
            if (!userId) {
                return {
                    ok: false,
                    code: 'INVALID_USER_ID',
                    message: 'User ID is required.'
                };
            }

            const user = this.users.get(userId);
            if (!user) {
                return {
                    ok: false,
                    code: 'USER_NOT_FOUND',
                    message: 'User not found.'
                };
            }

            return {
                ok: true,
                code: 'USER_FOUND',
                data: serializeUser(user)
            };
        },

        async getUserByUsername(username) {
            const normalized = String(username || '').trim();
            if (!normalized) {
                return {
                    ok: false,
                    code: 'INVALID_USERNAME',
                    message: 'Username is required.'
                };
            }

            for (const user of this.users.values()) {
                if (user.username === normalized) {
                    return {
                        ok: true,
                        code: 'USER_FOUND',
                        data: serializeUser(user)
                    };
                }
            }

            return {
                ok: false,
                code: 'USER_NOT_FOUND',
                message: 'User not found.'
            };
        },

        isUsernameAvailable(username, excludeId = null) {
            const normalized = String(username || '').trim();
            if (!normalized || normalized.length < 3) {
                return false;
            }

            for (const [id, user] of this.users.entries()) {
                if (user.username === normalized && id !== excludeId) {
                    return false;
                }
            }
            return true;
        },

        async createUser(userData, actor = null) {
            if (!userData || typeof userData !== 'object') {
                return {
                    ok: false,
                    code: 'INVALID_USER_DATA',
                    message: 'User data is required.'
                };
            }

            const username = String(userData.username || '').trim();
            if (!this.isUsernameAvailable(username)) {
                return {
                    ok: false,
                    code: 'USERNAME_INVALID',
                    message: 'Username must be at least 3 characters and unique.'
                };
            }

            const nextDisplayId = this.getNextDisplayId();
            const createdAt = new Date().toISOString();
            const newUser = ensureUserLayout({
                id: generateUuid(),
                displayId: nextDisplayId,
                username,
                displayName: userData.displayName || username,
                email: userData.email || '',
                status: userData.status || 'active',
                roles: Array.isArray(userData.roles) && userData.roles.length > 0 ? userData.roles.map(String) : [userData.role || 'member'],
                permissions: userData.permissions || [],
                protected: !!userData.protected,
                createdAt,
                updatedAt: createdAt,
                schemaVersion: userData.schemaVersion || 1,
                metadata: userData.metadata || {}
            });

            if (!newUser) {
                return {
                    ok: false,
                    code: 'USER_CREATE_FAILED',
                    message: 'User could not be created.'
                };
            }

            this.users.set(newUser.id, newUser);

            if (window.CoreAudit && typeof window.CoreAudit.record === 'function') {
                window.CoreAudit.record(actor || 'system', 'user:create', newUser.id, 'success', {
                    username: newUser.username,
                    displayId: newUser.displayId
                });
            }

            if (window.Core) {
                window.Core.emit('user:created', {
                    userId: newUser.id,
                    displayId: newUser.displayId,
                    username: newUser.username,
                    timestamp: new Date().toISOString()
                });
            }

            return {
                ok: true,
                code: 'USER_CREATED',
                data: serializeUser(newUser)
            };
        },

        async updateUser(userId, updates = {}, actor = null) {
            const currentResult = await this.getUserById(userId);
            if (!currentResult.ok) {
                return currentResult;
            }

            const currentUser = currentResult.data;
            if (!currentUser) {
                return { ok: false, code: 'USER_NOT_FOUND', message: 'User not found.' };
            }

            if (updates.username && String(updates.username).trim().length >= 3) {
                const username = String(updates.username).trim();
                if (!this.isUsernameAvailable(username, userId)) {
                    return { ok: false, code: 'USERNAME_INVALID', message: 'Username must be unique and at least 3 characters.' };
                }
            }

            const merged = {
                ...currentUser,
                ...updates,
                updatedAt: new Date().toISOString(),
                roles: Array.isArray(updates.roles) ? updates.roles.map(String) : currentUser.roles,
                permissions: Array.isArray(updates.permissions) ? updates.permissions.map(String) : currentUser.permissions,
                protected: typeof updates.protected === 'boolean' ? updates.protected : currentUser.protected,
                metadata: updates.metadata && typeof updates.metadata === 'object' ? { ...currentUser.metadata, ...updates.metadata } : currentUser.metadata
            };

            merged.permissions = normalizePermissions(merged);
            const stored = ensureUserLayout(merged);
            this.users.set(userId, stored);

            if (window.CoreAudit && typeof window.CoreAudit.record === 'function') {
                window.CoreAudit.record(actor || 'system', 'user:update', userId, 'success', {
                    username: stored.username,
                    displayId: stored.displayId
                });
            }

            if (window.Core) {
                window.Core.emit('user:updated', {
                    userId,
                    timestamp: new Date().toISOString()
                });
            }

            return {
                ok: true,
                code: 'USER_UPDATED',
                data: serializeUser(stored)
            };
        },

        async deleteUser(userId, actor = null) {
            const currentResult = await this.getUserById(userId);
            if (!currentResult.ok) {
                return currentResult;
            }

            const user = currentResult.data;
            const updated = {
                ...user,
                status: 'deleted',
                updatedAt: new Date().toISOString(),
                protected: !!user.protected
            };

            this.users.set(userId, ensureUserLayout(updated));

            if (window.CoreAudit && typeof window.CoreAudit.record === 'function') {
                window.CoreAudit.record(actor || 'system', 'user:delete', userId, 'success', {
                    username: user.username,
                    displayId: user.displayId
                });
            }

            if (window.Core) {
                window.Core.emit('user:deleted', {
                    userId,
                    timestamp: new Date().toISOString()
                });
            }

            return {
                ok: true,
                code: 'USER_DELETED',
                data: { userId }
            };
        },

        async setStatus(userId, status, actor = null) {
            const currentResult = await this.getUserById(userId);
            if (!currentResult.ok) {
                return currentResult;
            }

            const user = currentResult.data;
            const updated = {
                ...user,
                status,
                updatedAt: new Date().toISOString()
            };

            const stored = ensureUserLayout(updated);
            this.users.set(userId, stored);

            if (window.CoreAudit && typeof window.CoreAudit.record === 'function') {
                window.CoreAudit.record(actor || 'system', 'user:set-status', userId, 'success', { status });
            }

            return {
                ok: true,
                code: 'USER_STATUS_UPDATED',
                data: serializeUser(stored)
            };
        },

        async login(credentials) {
            if (!window.CoreAuth || typeof window.CoreAuth.login !== 'function') {
                return { ok: false, code: 'AUTH_NOT_AVAILABLE', message: 'Core auth is not available.' };
            }

            const result = await window.CoreAuth.login(credentials);
            if (!result.ok) {
                return result;
            }

            this.currentUser = result.data.user;
            this.currentSession = result.data.session;
            return result;
        },

        async logout(sessionId = null) {
            if (!window.CoreAuth || typeof window.CoreAuth.logout !== 'function') {
                return { ok: false, code: 'AUTH_NOT_AVAILABLE', message: 'Core auth is not available.' };
            }

            const result = await window.CoreAuth.logout(sessionId);
            this.currentUser = null;
            this.currentSession = null;
            return result;
        },

        getCurrentUser() {
            const authUser = window.CoreAuth && typeof window.CoreAuth.getCurrentUser === 'function'
                ? window.CoreAuth.getCurrentUser()
                : this.currentUser;
            return authUser ? serializeUser(authUser) : null;
        },

        getCurrentSession() {
            return window.CoreAuth && typeof window.CoreAuth.getCurrentSession === 'function'
                ? window.CoreAuth.getCurrentSession()
                : this.currentSession;
        },

        hasRole(role) {
            const user = this.getCurrentUser();
            return !!user && Array.isArray(user.roles) && user.roles.includes(role);
        },

        hasPermission(permission) {
            const user = this.getCurrentUser();
            if (!user) {
                return false;
            }

            if (window.CoreAccess && typeof window.CoreAccess.hasPermission === 'function') {
                return !!window.CoreAccess.hasPermission(user, permission);
            }

            return Array.isArray(user.permissions) && user.permissions.includes(permission);
        },

        isAdmin() {
            return this.hasRole('admin');
        },

        isDeveloper() {
            return this.hasRole('developer');
        }
    };

    const moduleManifest = Object.freeze({
        id: 'core-user',
        name: 'Core User',
        version: '1.0.0',
        type: 'framework',
        description: 'Framework identity, session and access facade.',
        dependencies: ['core-auth', 'core-access', 'core-audit'],
        permissions: ['framework:read', 'user:read', 'user:write'],
        capabilities: ['identity', 'session', 'access'],
        source: 'Core/core-user.js'
    });

    if (!Array.isArray(window.FrameworkModuleCatalog)) {
        window.FrameworkModuleCatalog = [];
    }

    if (!window.FrameworkModuleCatalog.some((entry) => entry && entry.id === moduleManifest.id)) {
        window.FrameworkModuleCatalog.push(moduleManifest);
    }

    if (!window.UserModule) {
        window.UserModule = UserModule;
    }
})();
