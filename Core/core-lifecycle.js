/*
 * CatchTrack Core Lifecycle
 * Version: 1.0
 *
 * Zentrale Verwaltung der grundlegenden Lebenszyklusphasen
 * der Anwendung.
 */

(() => {
    'use strict';

    const phases = Object.freeze({
        CREATED: 'created',
        INITIALIZING: 'initializing',
        READY: 'ready',
        RUNNING: 'running',
        STOPPED: 'stopped'
    });

    let currentPhase = phases.CREATED;

    const CoreLifecycle = {
        phases,

        getPhase() {
            return currentPhase;
        },

        setPhase(phase) {
            if (!Object.values(phases).includes(phase)) {
                throw new Error(`Invalid lifecycle phase: ${phase}`);
            }

            const previousPhase = currentPhase;

            if (previousPhase === phase) {
                return;
            }

            currentPhase = phase;

            window.CatchTrackCore.emit('lifecycle:changed', {
                previousPhase,
                currentPhase: phase
            });
        },

        is(phase) {
            return currentPhase === phase;
        }
    };

    window.CatchTrackCoreLifecycle =
        Object.freeze(CoreLifecycle);
})();
