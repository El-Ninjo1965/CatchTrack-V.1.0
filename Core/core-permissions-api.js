/*
 * CatchTrack Core Permissions API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * technische Rechteprüfung von Modulen.
 *
 * Die eigentliche Benutzer- und Rollenverwaltung
 * gehört nicht zum Core.
 */

(() => {
    'use strict';

    const PermissionsAPI = {
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

    window.CatchTrackCorePermissionsAPI =
        Object.freeze(PermissionsAPI);
})();