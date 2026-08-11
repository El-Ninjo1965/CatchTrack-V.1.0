/*
 * CatchTrack Core Runtime
 * Version: 1.0
 *
 * Zentrale Laufzeitsteuerung des Core.
 */

(() => {
    'use strict';

    const CoreRuntime = {
        running: false,

        start() {
            if (this.running) {
                return;
            }

            window.CatchTrackCoreStartup.start();

            window.CatchTrackCoreLifecycle.setPhase(
                window.CatchTrackCoreLifecycle.phases.RUNNING
            );

            this.running = true;

            window.CatchTrackCoreEventBus.publish(
                'runtime:started'
            );
        },

        stop() {
            if (!this.running) {
                return;
            }

            window.CatchTrackCoreShutdown.stop();

            this.running = false;

            window.CatchTrackCoreEventBus.publish(
                'runtime:stopped'
            );
        },

        isRunning() {
            return this.running;
        }
    };

    window.CatchTrackCoreRuntime =
        Object.freeze(CoreRuntime);
})();