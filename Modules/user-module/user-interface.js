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
                authenticate: (userId) => window.CatchTrackUserModule?.authenticate(userId),
                getCurrentUser: () => window.CatchTrackUserModule?.getCurrentUser(),
                logout: () => window.CatchTrackUserModule?.logout(),
                getAllUsers: () => window.CatchTrackUserModule?.getAllUsers(),
                getUserById: (userId) => window.CatchTrackUserModule?.getUserById(userId),
                createUser: (userData) => window.CatchTrackUserModule?.createUser(userData),
                updateUser: (userId, updates) => window.CatchTrackUserModule?.updateUser(userId, updates),
                deleteUser: (userId) => window.CatchTrackUserModule?.deleteUser(userId),
                hasRole: (role) => window.CatchTrackUserModule?.hasRole(role),
                isAdmin: () => window.CatchTrackUserModule?.isAdmin()
            }
        }
    };

    if (!window.CatchTrackUserModuleInterface) {
        window.CatchTrackUserModuleInterface = Object.freeze(UserModuleInterface);
    }
})();
