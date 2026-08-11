/*
 * CatchTrack Core Event API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für
 * einzelne Core-Ereignisse.
 */

(() => {
    'use strict';

    const EventAPI = {
        subscribe(eventName, callback) {
            return window.CatchTrackCoreEventBus.subscribe(
                eventName,
                callback
            );
        },

        unsubscribe(eventName, callback) {
            return window.CatchTrackCoreEventBus.unsubscribe(
                eventName,
                callback
            );
        },

        publish(eventName, data = null) {
            return window.CatchTrackCoreEventBus.publish(
                eventName,
                data
            );
        },

        clear(eventName) {
            return window.CatchTrackCoreEventBus.clear(
                eventName
            );
        }
    };

    window.CatchTrackCoreEventAPI =
        Object.freeze(EventAPI);
})();