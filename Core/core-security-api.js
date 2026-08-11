/*
 * CatchTrack Core Security API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für grundlegende
 * technische Sicherheitsfunktionen des Core.
 *
 * Benutzerkonten, Rollen und Authentifizierung gehören
 * nicht in den Core.
 */

(() => {
    'use strict';

    const SecurityAPI = {
        getContext() {
            return window.CatchTrackCoreSecurity.getContext();
        },

        isSecureContext() {
            return window.CatchTrackCoreSecurity.isSecureContext();
        },

        generateToken(...args) {
            return window.CatchTrackCoreSecurity.generateToken(
                ...args
            );
        }
    };

    window.CatchTrackCoreSecurityAPI =
        Object.freeze(SecurityAPI);
})();