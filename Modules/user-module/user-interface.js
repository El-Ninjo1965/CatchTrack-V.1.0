/*
 * Generic User Module Interface
 * Version: 1.0.0
 *
 * Public interface for a neutral user module in a reusable framework.
 */

(() => {
    'use strict';

    const UserModuleInterface = {
        name: 'user-module',
        version: '1.0.0',
        description: 'User management and authentication',

        definition: {
            onActivate() {
                if (!window.UserModule) {
                    throw new Error('UserModule not loaded');
                }

                window.UserModule.init();

                if (window.Core) {
                    window.Core.emit('user-module:activated', {
                        version: this.version
                    });
                }
            },

            onDeactivate() {
                if (window.UserModule) {
                    window.UserModule.logout();
                }

                if (window.Core) {
                    window.Core.emit('user-module:deactivated', {
                        timestamp: new Date().toISOString()
                    });
                }
            },

            api: {
                authenticate: (userId) => window.UserModule ? window.UserModule.authenticate(userId) : undefined,
                getCurrentUser: () => window.UserModule ? window.UserModule.getCurrentUser() : undefined,
                logout: () => window.UserModule ? window.UserModule.logout() : undefined,
                getAllUsers: () => window.UserModule ? window.UserModule.getAllUsers() : undefined,
                getUserById: (userId) => window.UserModule ? window.UserModule.getUserById(userId) : undefined,
                getUserByUsername: (username) => window.UserModule ? window.UserModule.getUserByUsername(username) : undefined,
                createUser: (userData) => window.UserModule ? window.UserModule.createUser(userData) : undefined,
                updateUser: (userId, updates) => window.UserModule ? window.UserModule.updateUser(userId, updates) : undefined,
                deleteUser: (userId) => window.UserModule ? window.UserModule.deleteUser(userId) : undefined,
                hasRole: (role) => window.UserModule ? window.UserModule.hasRole(role) : undefined,
                hasPermission: (permission) => window.UserModule ? window.UserModule.hasPermission(permission) : undefined,
                isAdmin: () => window.UserModule ? window.UserModule.isAdmin() : undefined
            }
        }
    };

    if (!window.UserModuleInterface) {
        window.UserModuleInterface = Object.freeze(UserModuleInterface);
    }
})();
