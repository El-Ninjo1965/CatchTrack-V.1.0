/*
 * CatchTrack Core Session
 * Version: 1.0
 *
 * Technische Laufzeitverwaltung der aktuellen Sitzung.
 * Benutzerkonten und Authentifizierung gehören in das User-Modul.
 */

(() => {
    'use strict';

    let session = null;

    const CoreSession = {
        start(data = {}) {
            if (session) {
                return session;
            }

            session = {
                id: window.CatchTrackCoreUtils?.generateId('session')
                    || `session-${Date.now()}`,
                startedAt:
                    window.CatchTrackCoreUtils?.now()
                    || new Date().toISOString(),
                data: {
                    ...data
                }
            };

            window.CatchTrackCoreEventBus?.publish(
                'session:started',
                {
                    ...session
                }
            );

            return session;
        },

        get() {
            return session
                ? {
                    ...session,
                    data: {
                        ...session.data
                    }
                }
                : null;
        },

        isActive() {
            return session !== null;
        },

        set(key, value) {
            if (!session) {
                this.start();
            }

            if (
                typeof key !== 'string' ||
                !key.trim()
            ) {
                throw new Error('Session key is required.');
            }

            session.data[key] = value;
        },

        getValue(key, defaultValue = null) {
            if (!session) {
                return defaultValue;
            }

            return Object.prototype.hasOwnProperty.call(
                session.data,
                key
            )
                ? session.data[key]
                : defaultValue;
        },

        end() {
            if (!session) {
                return false;
            }

            const endedSession = {
                ...session,
                data: {
                    ...session.data
                },
                endedAt:
                    window.CatchTrackCoreUtils?.now()
                    || new Date().toISOString()
            };

            session = null;

            window.CatchTrackCoreEventBus?.publish(
                'session:ended',
                endedSession
            );

            return true;
        }
    };

    window.CatchTrackCoreSession =
        Object.freeze(CoreSession);
})();