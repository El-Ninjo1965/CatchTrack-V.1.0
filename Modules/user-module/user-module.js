/*
 * CatchTrack User Module
 * Version: 1.1.0
 *
 * Verwaltung von Benutzern für die CatchTrack-Anwendung.
 * Vollständige Benutzeridentität inkl. Username, Anzeigename, Avatar und Status.
 */

(() => {
    'use strict';

    const UserModule = {
        name: 'user-module',
        version: '1.1.0',
        initialized: false,
        currentUser: null,
        users: new Map(),

        init() {
            if (this.initialized) return;
            this.createTestUsers();
            this.initialized = true;
            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('user-module:initialized', {
                    userCount: this.users.size
                });
            }
        },

        createTestUsers() {
            const now = new Date().toISOString();
            [
                {
                    id: 'test-user-001',
                    username: 'devuser',
                    displayName: 'Dev User',
                    email: 'dev@catchtrack.local',
                    avatar: null,
                    role: 'developer',
                    status: 'active',
                    createdAt: now,
                    lastLoginAt: null
                },
                {
                    id: 'test-admin-001',
                    username: 'admin',
                    displayName: 'Administrator',
                    email: 'admin@catchtrack.local',
                    avatar: null,
                    role: 'admin',
                    status: 'active',
                    createdAt: now,
                    lastLoginAt: null
                }
            ].forEach(user => this.users.set(user.id, user));
        },

        authenticate(userId) {
            const user = this.users.get(userId);
            if (user && user.status === 'active') {
                user.lastLoginAt = new Date().toISOString();
                this.currentUser = { ...user };
                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('user-module:authenticated', {
                        userId: user.id,
                        username: user.username,
                        role: user.role
                    });
                }
                return this.currentUser;
            }
            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('user-module:auth-failed', {
                    userId,
                    timestamp: new Date().toISOString()
                });
            }
            return null;
        },

        getCurrentUser() {
            return this.currentUser;
        },

        logout() {
            const prev = this.currentUser;
            this.currentUser = null;
            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('user-module:logout', {
                    userId: prev ? prev.id : null,
                    timestamp: new Date().toISOString()
                });
            }
        },

        getAllUsers() {
            return Array.from(this.users.values());
        },

        getUserById(userId) {
            return this.users.get(userId) || null;
        },

        // Suche nach eindeutigem Username (für Leaderboards, Catch-Einträge etc.)
        getUserByUsername(username) {
            for (const user of this.users.values()) {
                if (user.username === username) return { ...user };
            }
            return null;
        },

        isUsernameAvailable(username, excludeId = null) {
            for (const [id, user] of this.users.entries()) {
                if (user.username === username && id !== excludeId) return false;
            }
            return true;
        },

        createUser(userData) {
            if (!userData.username || !userData.username.trim()) {
                throw new Error('Username ist erforderlich');
            }
            const username = userData.username.trim();
            if (!this.isUsernameAvailable(username)) {
                throw new Error(`Username "${username}" ist bereits vergeben`);
            }
            const userId = `usr-${Date.now()}`;
            const newUser = {
                id: userId,
                username,
                displayName: userData.displayName || username,
                email: userData.email || '',
                avatar: userData.avatar || null,
                role: userData.role || 'user',
                status: 'active',
                createdAt: new Date().toISOString(),
                lastLoginAt: null
            };
            this.users.set(userId, newUser);
            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('user-module:user-created', {
                    userId: newUser.id,
                    username: newUser.username
                });
            }
            return { ...newUser };
        },

        updateUser(userId, updates) {
            const user = this.users.get(userId);
            if (!user) return null;
            if (updates.username && updates.username !== user.username) {
                if (!this.isUsernameAvailable(updates.username, userId)) {
                    throw new Error(`Username "${updates.username}" ist bereits vergeben`);
                }
            }
            // id und createdAt sind unveränderlich
            const { id: _id, createdAt: _ca, ...safeUpdates } = updates;
            const updated = { ...user, ...safeUpdates };
            this.users.set(userId, updated);
            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('user-module:user-updated', { userId });
            }
            return { ...updated };
        },

        deleteUser(userId) {
            if (!this.users.has(userId)) return false;
            this.users.delete(userId);
            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('user-module:user-deleted', { userId });
            }
            return true;
        },

        hasRole(role) {
            return !!this.currentUser && this.currentUser.role === role;
        },

        isAdmin() {
            return this.hasRole('admin');
        }
    };

    if (!window.CatchTrackUserModule) {
        window.CatchTrackUserModule = UserModule;
    }
})();
