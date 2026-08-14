/*
 * Core Runtime
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

            if (!window.CoreStartup) {
                throw new Error('Core Startup is not available.');
            }

            window.CoreStartup.start();

            window.CoreLifecycle.setPhase(
                window.CoreLifecycle.phases.RUNNING
            );

            running = true;

            window.Core.emit('runtime:started');
        },

        stop() {
            if (!running) {
                return;
            }

            if (!window.CoreShutdown) {
                throw new Error('Core Shutdown is not available.');
            }

            window.CoreShutdown.stop();

            running = false;

            window.Core.emit('runtime:stopped');
        },

        isRunning() {
            return running;
        }
    };

    window.CoreRuntime =
        Object.freeze(CoreRuntime);
})();
