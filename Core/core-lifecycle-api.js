/*
 * CatchTrack Core Lifecycle API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für
 * die Phasen des Core-Lebenszyklus.
 */

(() => {
    'use strict';

    const LifecycleAPI = {
        getPhase() {
            return window.CatchTrackCoreLifecycle.getPhase();
        },

        setPhase(phase) {
            return window.CatchTrackCoreLifecycle.setPhase(
                phase
            );
        },

        getPhases() {
            return window.CatchTrackCoreLifecycle.phases;
        },

        is(phase) {
            return window.CatchTrackCoreLifecycle.is(phase);
        }
    };

    window.CatchTrackCoreLifecycleAPI =
        Object.freeze(LifecycleAPI);
})();