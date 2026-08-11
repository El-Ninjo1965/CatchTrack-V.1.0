/*
 * CatchTrack Core Database Adapter API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für den
 * Datenbank-Adapter des Core.
 */

(() => {
    'use strict';

    const DatabaseAdapterAPI = {
        register(adapter) {
            return window.CatchTrackCoreDatabaseAdapter.register(
                adapter
            );
        },

        get() {
            return window.CatchTrackCoreDatabaseAdapter.get();
        },

        has() {
            return window.CatchTrackCoreDatabaseAdapter.has();
        },

        remove() {
            return window.CatchTrackCoreDatabaseAdapter.remove();
        }
    };

    window.CatchTrackCoreDatabaseAdapterAPI =
        Object.freeze(DatabaseAdapterAPI);
})();