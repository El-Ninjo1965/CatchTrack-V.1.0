/*
 * CatchTrack Core Shutdown
 * Version: 1.0
 *
 * Kontrolliertes Beenden der Core-Laufzeit.
 */

(() => {
    'use strict';

    const CoreShutdown = {
        stopped: false,

        stop() {
            if (this.stopped) {
                return;
            }

            if (!window.CatchTrackCoreLifecycle) {
                throw new Error('CatchTrack Core Lifecycle is not available.');
            }

            const activeModules =
                window.CatchTrackCore?.getModules() || [];

            activeModules.forEach((module) => {
                if (module.active) {
                    try {
                        window.CatchTrackModuleManager?.deactivate(
                            module.id
                        );
                    } catch (error) {
                        window.CatchTrackCoreErrorHandler?.handle(
                            error,
                            {
                                type: 'module-shutdown',
                                moduleId: module.id
                            }
                        );
                    }
                }
            });

            window.CatchTrackCoreLifecycle.setPhase(
                window.CatchTrackCoreLifecycle.phases.STOPPED
            );

            window.CatchTrackCore.emit('core:stopped');

            this.stopped = true;
        }
    };

    window.CatchTrackCoreShutdown =
        Object.freeze(CoreShutdown);
})();
