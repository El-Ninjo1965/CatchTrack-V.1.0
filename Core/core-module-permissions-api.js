/*
 * CatchTrack Core Module Permissions API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * technischen Berechtigungen einzelner Module.
 */

(() => {
    'use strict';

    const ModulePermissionsAPI = {
        register(moduleId, permissions = []) {
            return window.CatchTrackCorePermissions.register(
                moduleId,
                permissions
            );
        },

        get(moduleId) {
            return window.CatchTrackCorePermissions.get(
                moduleId
            );
        },

        has(moduleId, permission) {
            return window.CatchTrackCorePermissions.has(
                moduleId,
                permission
            );
        },

        remove(moduleId) {
            return window.CatchTrackCorePermissions.remove(
                moduleId
            );
        }
    };

    window.CatchTrackCoreModulePermissionsAPI =
        Object.freeze(ModulePermissionsAPI);
})();