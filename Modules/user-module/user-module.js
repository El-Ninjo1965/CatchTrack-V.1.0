/*
 * CatchTrack User Module
 * Version: 1.0
 *
 * Verwaltung von Benutzern und Authentifizierung für die CatchTrack-Anwendung.
 * Dieses Modul stellt Benutzerfunktionen bereit und verwaltet Benutzerdaten.
 */

(() => {
    'use strict';

    const UserModule = {
        name: 'user-module',
        version: '1.0.0',
        initialized: false,
        currentUser: null,
        users: new Map(),

        /**
         * Initialisiert das User-Modul
         */
        init() {
            if (this.initialized) {
                return;
            }

            // Testbenutzer hinzufügen
            this.createTestUsers();

            this.initialized = true;

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('user-module:initialized', {
                    message: 'User-Modul initialisiert',
                    userCount: this.users.size
                });
            }
        },

        /**
         * Erstellt Test-Benutzer für die Entwicklung
         */
        createTestUsers() {
            const testUsers = [
                {
                    id: 'test-user-001',
                    name: 'Test Developer',
                    email: 'dev@catchtrack.local',
                    role: 'developer',
                    active: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'test-admin-001',
                    name: 'Test Administrator',
                    email: 'admin@catchtrack.local',
                    role: 'admin',
                    active: true,
                    createdAt: new Date().toISOString()
                }
            ];

            testUsers.forEach(user => {
                this.users.set(user.id, user);
            });
        },

        /**
         * Authentifiziert einen Benutzer
         * @param {string} userId - Benutzer-ID
         * @returns {object|null} Benutzer-Objekt oder null
         */
        authenticate(userId) {
            const user = this.users.get(userId);
            if (user && user.active) {
                this.currentUser = { ...user };
                
                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('user-module:authenticated', {
                        userId: user.id,
                        name: user.name,
                        role: user.role
                    });
                }

                return this.currentUser;
            }

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('user-module:auth-failed', {
                    userId: userId,
                    timestamp: new Date().toISOString()
                });
            }

            return null;
        },

        /**
         * Gibt den aktuellen Benutzer zurück
         * @returns {object|null} Aktueller Benutzer oder null
         */
        getCurrentUser() {
            return this.currentUser;
        },

        /**
         * Logout des aktuellen Benutzers
         */
        logout() {
            const previousUser = this.currentUser;
            this.currentUser = null;

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('user-module:logout', {
                    userId: previousUser?.id,
                    timestamp: new Date().toISOString()
                });
            }
        },

        /**
         * Gibt alle Benutzer zurück
         * @returns {array} Array von Benutzerobjekten
         */
        getAllUsers() {
            return Array.from(this.users.values());
        },

        /**
         * Gibt einen Benutzer nach ID zurück
         * @param {string} userId - Benutzer-ID
         * @returns {object|undefined} Benutzerobjekt oder undefined
         */
        getUserById(userId) {
            return this.users.get(userId);
        },

        /**
         * Erstellt einen neuen Benutzer
         * @param {object} userData - Benutzerdaten
         * @returns {object} Neu erstelltes Benutzerobjekt
         */
        createUser(userData) {
            const userId = `user-${Date.now()}`;
            const newUser = {
                id: userId,
                name: userData.name || 'Unknown',
                email: userData.email || '',
                role: userData.role || 'user',
                active: true,
                createdAt: new Date().toISOString()
            };

            this.users.set(userId, newUser);

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('user-module:user-created', {
                    userId: newUser.id,
                    name: newUser.name
                });
            }

            return newUser;
        },

        /**
         * Aktualisiert einen Benutzer
         * @param {string} userId - Benutzer-ID
         * @param {object} updates - Zu aktualisierende Felder
         * @returns {object|null} Aktualisiertes Benutzerobjekt oder null
         */
        updateUser(userId, updates) {
            const user = this.users.get(userId);
            if (!user) {
                return null;
            }

            const updatedUser = { ...user, ...updates, id: userId };
            this.users.set(userId, updatedUser);

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('user-module:user-updated', {
                    userId: userId,
                    changes: updates
                });
            }

            return updatedUser;
        },

        /**
         * Löscht einen Benutzer
         * @param {string} userId - Benutzer-ID
         * @returns {boolean} Erfolgreich gelöscht
         */
        deleteUser(userId) {
            if (this.users.has(userId)) {
                this.users.delete(userId);

                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('user-module:user-deleted', {
                        userId: userId
                    });
                }

                return true;
            }

            return false;
        },

        /**
         * Prüft, ob ein Benutzer eine bestimmte Rolle hat
         * @param {string} role - Zu prüfende Rolle
         * @returns {boolean} Hat der aktuelle Benutzer die Rolle
         */
        hasRole(role) {
            return this.currentUser?.role === role;
        },

        /**
         * Prüft, ob ein Benutzer Admin ist
         * @returns {boolean} Ist der aktuelle Benutzer ein Admin
         */
        isAdmin() {
            return this.hasRole('admin');
        }
    };

    if (!window.CatchTrackUserModule) {
        window.CatchTrackUserModule = Object.freeze(UserModule);
    }
})();
