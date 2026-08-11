/*
 * CatchTrack User Module Interface
 * Version: 1.0
 *
 * Definiert die öffentliche Schnittstelle des User-Moduls für den CatchTrack-Core.
 */

(() => {
    'use strict';

    const UserModuleInterface = {
        name: 'user-module',
        version: '1.0.0',
        description: 'Verwaltung von Benutzern und Authentifizierung',

        definition: {
            /**
             * Wird beim Aktivieren des Moduls aufgerufen
             */
            onActivate(moduleContext) {
                if (!window.CatchTrackUserModule) {
                    throw new Error('UserModule nicht geladen');
                }

                window.CatchTrackUserModule.init();

                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('user-module:activated', {
                        version: this.version
                    });
                }
            },

            /**
             * Wird beim Deaktivieren des Moduls aufgerufen
             */
            onDeactivate(moduleContext) {
                if (window.CatchTrackUserModule) {
                    window.CatchTrackUserModule.logout();
                }

                if (window.CatchTrackCore) {
                    window.CatchTrackCore.emit('user-module:deactivated', {
                        timestamp: new Date().toISOString()
                    });
                }
            },

            /**
             * Öffentliche API des User-Moduls
             */
            api: {
                authenticate: (userId) => window.CatchTrackUserModule ? window.CatchTrackUserModule.authenticate(userId) : undefined,
                getCurrentUser: () => window.CatchTrackUserModule ? window.CatchTrackUserModule.getCurrentUser() : undefined,
                logout: () => window.CatchTrackUserModule ? window.CatchTrackUserModule.logout() : undefined,
                getAllUsers: () => window.CatchTrackUserModule ? window.CatchTrackUserModule.getAllUsers() : undefined,
                getUserById: (userId) => window.CatchTrackUserModule ? window.CatchTrackUserModule.getUserById(userId) : undefined,
                getUserByUsername: (username) => window.CatchTrackUserModule ? window.CatchTrackUserModule.getUserByUsername(username) : undefined,
                createUser: (userData) => window.CatchTrackUserModule ? window.CatchTrackUserModule.createUser(userData) : undefined,
                updateUser: (userId, updates) => window.CatchTrackUserModule ? window.CatchTrackUserModule.updateUser(userId, updates) : undefined,
                deleteUser: (userId) => window.CatchTrackUserModule ? window.CatchTrackUserModule.deleteUser(userId) : undefined,
                hasRole: (role) => window.CatchTrackUserModule ? window.CatchTrackUserModule.hasRole(role) : undefined,
                isAdmin: () => window.CatchTrackUserModule ? window.CatchTrackUserModule.isAdmin() : undefined
            }
        }
    };

    if (!window.CatchTrackUserModuleInterface) {
        window.CatchTrackUserModuleInterface = Object.freeze(UserModuleInterface);
    }
})();
