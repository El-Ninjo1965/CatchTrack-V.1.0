/*
 * CatchTrack Core Security
 * Version: 1.0
 *
 * Technische Sicherheitsgrundlagen des Core.
 * Benutzerkonten, Rollen und Authentifizierung gehören
 * ausschließlich in das User-Modul.
 */

(() => {
    'use strict';

    const CoreSecurity = {
        sanitizeText(value) {
            if (typeof value !== 'string') {
                return value;
            }

            const element = document.createElement('div');
            element.textContent = value;

            return element.textContent;
        },

        isValidModuleId(moduleId) {
            return (
                typeof moduleId === 'string' &&
                /^[a-zA-Z0-9_-]+$/.test(moduleId)
            );
        },

        isValidPermissionName(permission) {
            return (
                typeof permission === 'string' &&
                /^[a-zA-Z0-9_.:-]+$/.test(permission)
            );
        }
    };

    window.CatchTrackCoreSecurity =
        Object.freeze(CoreSecurity);
})();