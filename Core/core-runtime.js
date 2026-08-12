/*
 * CatchTrack Core Runtime
 * Version: 1.0
 *
 * Zentrale Laufzeitsteuerung des Core.
 */

(() => {
    'use strict';

    let running = false;

    const CoreRuntime = {
        start() {
            if (running) {
                return;
            }

            window.CatchTrackCoreStartup.start();

            window.CatchTrackCoreLifecycle.setPhase(
                window.CatchTrackCoreLifecycle.phases.RUNNING
            );

            running = true;

            window.CatchTrackCore.emit('runtime:started');
        },

        stop() {
            if (!running) {
                return;
            }

            window.CatchTrackCoreShutdown.stop();

            running = false;

            window.CatchTrackCore.emit('runtime:stopped');
        },

        isRunning() {
            return running;
        }
    };

    window.CatchTrackCoreRuntime =
        Object.freeze(CoreRuntime);
})();
