/*
 * CatchTrack Core Events API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für
 * Core-Ereignisse.
 */

(() => {
    'use strict';

    const EventsAPI = {
        on(eventName, callback) {
            return window.CatchTrackCoreEvents.on(
                eventName,
                callback
            );
        },

        off(eventName, callback) {
            return window.CatchTrackCoreEvents.off(
                eventName,
                callback
            );
        },

        emit(eventName, data = null) {
            return window.CatchTrackCoreEvents.emit(
                eventName,
                data
            );
        },

        getRegistered() {
            return window.CatchTrackCoreEvents.getRegistered();
        }
    };

    window.CatchTrackCoreEventsAPI =
        Object.freeze(EventsAPI);
})();