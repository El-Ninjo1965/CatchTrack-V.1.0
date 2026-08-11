/*
 * CatchTrack Core Events
 * Version: 1.0
 *
 * Zentrale Ereignisverwaltung des Core.
 * Ermöglicht die Kommunikation zwischen Core und Modulen,
 * ohne direkte Abhängigkeiten zwischen einzelnen Modulen.
 */

(() => {
    'use strict';

    const listeners = new Map();

    const CoreEvents = {
        on(eventName, callback) {
            if (typeof eventName !== 'string' || !eventName) {
                throw new Error('Event name is required.');
            }

            if (typeof callback !== 'function') {
                throw new TypeError('Event callback must be a function.');
            }

            if (!listeners.has(eventName)) {
                listeners.set(eventName, new Set());
            }

            listeners.get(eventName).add(callback);

            return () => {
                this.off(eventName, callback);
            };
        },

        off(eventName, callback) {
            const eventListeners = listeners.get(eventName);

            if (!eventListeners) {
                return;
            }

            eventListeners.delete(callback);

            if (eventListeners.size === 0) {
                listeners.delete(eventName);
            }
        },

        emit(eventName, data = null) {
            const eventListeners = listeners.get(eventName);

            if (!eventListeners) {
                return;
            }

            eventListeners.forEach((callback) => {
                callback(data);
            });
        },

        clear(eventName) {
            if (typeof eventName === 'string') {
                listeners.delete(eventName);
                return;
            }

            listeners.clear();
        }
    };

    window.CatchTrackCoreEvents = Object.freeze(CoreEvents);
})();