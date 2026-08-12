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

            const modulesToDisable =
                window.CatchTrackCore
                    ? window.CatchTrackCore.getModules()
                    : [];

            modulesToDisable.forEach((module) => {
                const isEnabled = module && (
                    module.status === 'enabled' ||
                    module.active === true
                );

                if (!isEnabled) {
                    return;
                }

                try {
                    if (window.CatchTrackModuleManager) {
                        window.CatchTrackModuleManager.disable(module.id);
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
            });

            if (window.CatchTrackCoreLifecycle.getPhase() !== window.CatchTrackCoreLifecycle.phases.STOPPED) {
                window.CatchTrackCoreLifecycle.setPhase(
                    window.CatchTrackCoreLifecycle.phases.STOPPED
                );
            }

            if (window.CatchTrackCore && typeof window.CatchTrackCore.emit === 'function') {
                window.CatchTrackCore.emit('core:stopped');
            }

            stopped = true;
        }
    };

    window.CatchTrackCoreShutdown =
        Object.freeze(CoreShutdown);
})();
