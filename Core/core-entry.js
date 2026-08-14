/*
 * Core Entry
 * Version: 1.0
 *
 * Zentraler Einstiegspunkt für den technischen Core-Start.
 */

(() => {
    'use strict';

    const CoreEntry = {
        start() {
            if (!window.CoreRuntime) {
                throw new Error(
                    'Core Runtime is not available.'
                );
            }

            if (window.CoreRuntime.isRunning()) {
                return;
            }

            window.CoreRuntime.start();
        },

        stop() {
            if (!window.CoreRuntime) {
                throw new Error(
                    'Core Runtime is not available.'
                );
            }

            window.CoreRuntime.stop();
        }
    };

    window.CoreEntry =
        Object.freeze(CoreEntry);
})();