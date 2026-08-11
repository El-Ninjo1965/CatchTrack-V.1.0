/*
 * CatchTrack Core Event Bus API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für den
 * zentralen Event Bus.
 */

(() => {
    'use strict';

    const EventBusAPI = {
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
        },

        clearAll() {
            return window.CatchTrackCoreEventBus.clearAll();
        }
    };

    window.CatchTrackCoreEventBusAPI =
        Object.freeze(EventBusAPI);
})();