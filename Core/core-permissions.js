/*
 * CatchTrack Core Permissions
 * Version: 1.0
 *
 * Technische Grundlage für spätere Berechtigungsprüfungen.
 * Die eigentliche Benutzer- und Rollenverwaltung gehört
 * ausschließlich in das User-Modul.
 */

(() => {
    'use strict';

    const CorePermissions = {
        check(permission, context = {}) {
            if (typeof permission !== 'string' || !permission.trim()) {
                return false;
            }

            /*
             * Der Core entscheidet derzeit keine Benutzerrechte.
             * Das User-/Admin-Modul kann diese Schnittstelle später
             * mit einer konkreten Berechtigungsprüfung versorgen.
             */

            if (typeof context.checkPermission === 'function') {
                return context.checkPermission(permission);
            }

            return false;
        }
    };

    window.CatchTrackCorePermissions = Object.freeze(CorePermissions);
})();