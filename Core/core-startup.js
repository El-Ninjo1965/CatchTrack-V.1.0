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

            const requiredComponents = [
                'CatchTrackCore',
                'CatchTrackCoreLoader',
                'CatchTrackCoreContext',
                'CatchTrackCoreConfig',
                'CatchTrackCoreLifecycle'
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

            started = true;

            window.CatchTrackCore.emit('core:started', {
                version: window.CatchTrackCoreConfig.core.version
            });
        }
    };

    if (!window.CatchTrackCoreStartup) {
        window.CatchTrackCoreStartup =
            Object.freeze(CoreStartup);
    }
})();
