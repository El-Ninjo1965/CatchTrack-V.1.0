/*
 * CatchTrack Core Shutdown
 * Version: 1.0
 *
 * Kontrolliertes Beenden der Core-Laufzeit.
 */

(() => {
    'use strict';

    let stopped = false;

    const CoreShutdown = {
        stop() {
            if (stopped) {
                return;
            }

            if (!window.CatchTrackCoreLifecycle) {
                throw new Error('CatchTrack Core Lifecycle is not available.');
            }

            const activeModules =
                window.CatchTrackCore
                    ? window.CatchTrackCore.getModules()
                    : [];

            activeModules.forEach((module) => {
                if (module.active) {
                    try {
                        if (window.CatchTrackModuleManager) {
                            window.CatchTrackModuleManager.deactivate(
                                module.id
                            );
                        }
                    } catch (error) {
                        if (window.CatchTrackCoreErrorHandler) {
                            window.CatchTrackCoreErrorHandler.handle(
                                error,
                                {
                                    type: 'module-shutdown',
                                    moduleId: module.id
                                }
                            );
                        }
                    }
                }
            });

            window.CatchTrackCoreLifecycle.setPhase(
                window.CatchTrackCoreLifecycle.phases.STOPPED
            );

            window.CatchTrackCore.emit('core:stopped');

            stopped = true;
        }
    };

    window.CatchTrackCoreShutdown =
        Object.freeze(CoreShutdown);
})();
