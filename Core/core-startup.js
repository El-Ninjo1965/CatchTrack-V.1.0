/*
 * CatchTrack Core Startup
 * Version: 1.0
 *
 * Kontrollierter Start des Core nach dem Laden aller
 * benötigten Core-Komponenten.
 */

(() => {
    'use strict';

    let started = false;

    const CoreStartup = {
        start() {
            if (started) {
                return;
            }

            if (window.CatchTrackCoreShutdown && typeof window.CatchTrackCoreShutdown.reset === 'function') {
                window.CatchTrackCoreShutdown.reset();
            }

            started = true;

            try {
                const requiredComponents = [
                    'CatchTrackCore',
                    'CatchTrackCoreLoader',
                    'CatchTrackCoreContext',
                    'CatchTrackCoreConfig',
                    'CatchTrackCoreLifecycle',
                    'CatchTrackModuleRegistry',
                    'CatchTrackModuleManager'
                ];

                const missingComponents = requiredComponents.filter(
                    (component) => !window[component]
                );

                if (missingComponents.length > 0) {
                    throw new Error(
                        `Missing Core components: ${missingComponents.join(', ')}`
                    );
                }

                window.CatchTrackCoreLifecycle.setPhase(
                    window.CatchTrackCoreLifecycle.phases.INITIALIZING
                );

                window.CatchTrackCoreLoader.init();

                window.CatchTrackCoreContext.setRuntimeValue(
                    'initialized',
                    true
                );

                window.CatchTrackCoreContext.setRuntimeValue(
                    'startedAt',
                    new Date().toISOString()
                );

                window.CatchTrackCoreLifecycle.setPhase(
                    window.CatchTrackCoreLifecycle.phases.READY
                );

                window.CatchTrackCore.emit('core:started', {
                    version: window.CatchTrackCoreConfig.core.version
                });
            } catch (error) {
                started = false;
                throw error;
            }
        },

        reset() {
            started = false;
        }
    };

    if (!window.CatchTrackCoreStartup) {
        window.CatchTrackCoreStartup =
            Object.freeze(CoreStartup);
    }
})();
