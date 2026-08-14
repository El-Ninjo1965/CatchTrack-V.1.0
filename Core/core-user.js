/*
 * Generic User Module
 * Version: 1.0.0
 *
 * User management for a neutral framework.
 * Contains only generic identity, role, permission and session logic.
 */

(() => {
    'use strict';

    const normalizePermissions = (user) => {
        const basePermissions = Array.isArray(user && user.permissions)
            ? [...user.permissions]
            : [];

        const rolePermissions = {
            admin: ['user:read', 'user:write', 'role:read', 'role:write', 'system:view'],
            manager: ['user:read', 'user:write', 'role:read'],
            member: ['user:read']
        };

        const set = new Set([
            ...basePermissions,
            ...(rolePermissions[user && user.role] || [])
        ]);

        return Array.from(set);
    };

    const UserModule = {
        name: 'user-module',
        version: '1.0.0',
        initialized: false,
        currentUser: null,
        users: new Map(),

        init() {
            if (this.initialized) {
                if (this.users.size === 0) {
                    this.createDefaultUsers();
                }
                return this;
            }

            if (this.users.size === 0) {
                this.createDefaultUsers();
            }

            this.initialized = true;

            if (window.Core) {
                window.Core.emit('user-module:initialized', {
                    userCount: this.users.size
                });
            }

            return this;
        },

        createDefaultUsers() {
            const now = new Date().toISOString();
            const users = [
                {
                    id: 'demo-user-001',
                    username: 'demo-user',
                    displayName: 'Demo User',
                    email: 'demo@example.local',
                    avatar: null,
                    role: 'member',
                    status: 'active',
                    permissions: ['user:read'],
                    createdAt: now,
                    lastLoginAt: null
                },
                {
                    id: 'demo-admin-001',
                    username: 'admin',
                    displayName: 'Administrator',
                    email: 'admin@example.local',
                    avatar: null,
                    role: 'admin',
                    status: 'active',
                    permissions: ['user:read', 'user:write', 'role:read', 'role:write', 'system:view'],
                    createdAt: now,
                    lastLoginAt: null
                }
            ];

            users.forEach((user) => {
                const normalized = {
                    ...user,
                    permissions: normalizePermissions(user)
                };
                this.users.set(normalized.id, normalized);
            });
        },

        authenticate(userId) {
            const user = this.users.get(userId);
            if (user && user.status === 'active') {
                user.lastLoginAt = new Date().toISOString();
                this.currentUser = {
                    ...user,
                    permissions: normalizePermissions(user)
                };

                if (window.Core) {
                    window.Core.emit('user-module:authenticated', {
                        userId: user.id,
                        username: user.username,
                        role: user.role
                    });
                }

                return this.currentUser;
            }

            if (window.Core) {
                window.Core.emit('user-module:auth-failed', {
                    userId,
                    timestamp: new Date().toISOString()
                });
            }

            return null;
        },

        getCurrentUser() {
            if (!this.currentUser) {
                return null;
            }

            return {
                ...this.currentUser,
                permissions: [...this.currentUser.permissions]
            };
        },

        logout() {
            const prev = this.currentUser;
            this.currentUser = null;
            if (window.Core) {
                window.Core.emit('user-module:logout', {
                    userId: prev ? prev.id : null,
                    timestamp: new Date().toISOString()
                });
            }
        },

        getAllUsers() {
            return Array.from(this.users.values()).map((user) => ({
                ...user,
                permissions: [...user.permissions]
            }));
        },

        getUserById(userId) {
            const user = this.users.get(userId);
            if (!user) {
                return null;
            }

            return {
                ...user,
                permissions: [...user.permissions]
            };
        },

        getUserByUsername(username) {
            for (const user of this.users.values()) {
                if (user.username === username) {
                    return {
                        ...user,
                        permissions: [...user.permissions]
                    };
                }
            }
            return null;
        },

        isUsernameAvailable(username, excludeId = null) {
            for (const [id, user] of this.users.entries()) {
                if (user.username === username && id !== excludeId) {
                    return false;
                }
            }
            return true;
        },

        createUser(userData) {
            if (!userData || !userData.username || !userData.username.trim()) {
                throw new Error('Username is required');
            }

            const username = userData.username.trim();
            if (!this.isUsernameAvailable(username)) {
                throw new Error(`Username "${username}" is already taken`);
            }

            const userId = `usr-${Date.now()}`;
            const role = userData.role || 'member';
            const newUser = {
                id: userId,
                username,
                displayName: userData.displayName || username,
                email: userData.email || '',
                avatar: userData.avatar || null,
                role,
                status: 'active',
                permissions: normalizePermissions({ role, permissions: userData.permissions || [] }),
                createdAt: new Date().toISOString(),
                lastLoginAt: null
            };

            this.users.set(userId, newUser);

            if (window.Core) {
                window.Core.emit('user-module:user-created', {
                    userId: newUser.id,
                    username: newUser.username
                });
            }

            return {
                ...newUser,
                permissions: [...newUser.permissions]
            };
        },

        updateUser(userId, updates) {
            const user = this.users.get(userId);
            if (!user) {
                return null;
            }

            if (updates.username && updates.username !== user.username) {
                if (!this.isUsernameAvailable(updates.username, userId)) {
                    throw new Error(`Username "${updates.username}" is already taken`);
                }
            }

            const { id: _id, createdAt: _ca, ...safeUpdates } = updates;
            const updated = {
                ...user,
                ...safeUpdates,
                permissions: normalizePermissions({
                    role: safeUpdates.role || user.role,
                    permissions: safeUpdates.permissions || user.permissions
                })
            };

            this.users.set(userId, updated);

            if (window.Core) {
                window.Core.emit('user-module:user-updated', { userId });
            }

            return {
                ...updated,
                permissions: [...updated.permissions]
            };
        },

        deleteUser(userId) {
            if (!this.users.has(userId)) {
                return false;
            }

            this.users.delete(userId);

            if (window.Core) {
                window.Core.emit('user-module:user-deleted', { userId });
            }

            return true;
        },

        hasRole(role) {
            return !!this.currentUser && this.currentUser.role === role;
        },

        hasPermission(permission) {
            if (!this.currentUser) {
                return false;
            }

            return this.currentUser.permissions.includes(permission) || this.currentUser.role === 'admin';
        },

        isAdmin() {
            return this.hasRole('admin');
        }
    };

    const moduleManifest = Object.freeze({
        id: 'core-user',
        name: 'Core User',
        version: '1.0.0',
        type: 'framework',
        description: 'Framework identity and user access layer.',
        dependencies: [],
        permissions: ['framework:read'],
        capabilities: ['identity', 'session'],
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
