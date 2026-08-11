/*
 * CatchTrack Core Session API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * technische Laufzeit-Sitzung.
 *
 * Benutzerkonten und Authentifizierung gehören
 * weiterhin in das User-Modul.
 */

(() => {
    'use strict';

    const SessionAPI = {
        start(data = {}) {
            return window.CatchTrackCoreSession.start(data);
        },

        get() {
            return window.CatchTrackCoreSession.get();
        },

        isActive() {
            return window.CatchTrackCoreSession.isActive();
        },

        set(key, value) {
            return window.CatchTrackCoreSession.set(
                key,
                value
            );
        },

        getValue(key, defaultValue = null) {
            return window.CatchTrackCoreSession.getValue(
                key,
                defaultValue
            );
        },

        end() {
            return window.CatchTrackCoreSession.end();
        }
    };

    window.CatchTrackCoreSessionAPI =
        Object.freeze(SessionAPI);
})();