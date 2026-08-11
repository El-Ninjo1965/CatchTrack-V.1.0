/*
 * CatchTrack Core Startup
 * Version: 1.0
 *
 * Kontrollierter Start des Core nach dem Laden aller
 * benötigten Core-Komponenten.
 */

(() => {
    'use strict';

    const CoreStartup = {
        started: false,

        start() {
            if (this.started) {
                return;
            }

            const requiredComponents = [
                'CatchTrackCore',
                'CatchTrackModuleManager',
                'CatchTrackModuleInterface',
                'CatchTrackErrorLog',
                'CatchTrackCoreConfig',
                'CatchTrackCoreAPI',
                'CatchTrackCoreEvents',
                'CatchTrackCoreStorage',
                'CatchTrackCoreRouter',
                'CatchTrackCoreUI',
                'CatchTrackCoreContext',
                'CatchTrackCoreModuleLoader',
                'CatchTrackCoreDiagnostics',
                'CatchTrackCoreEnvironment',
                'CatchTrackCoreVersion',
                'CatchTrackCoreLogger',
                'CatchTrackCoreUtils',
                'CatchTrackCoreRegistry',
                'CatchTrackCorePermissions',
                'CatchTrackCoreServices',
                'CatchTrackCoreState',
                'CatchTrackCoreModuleRegistry',
                'CatchTrackCoreLifecycle',
                'CatchTrackCoreConstants',
                'CatchTrackCoreErrorHandler',
                'CatchTrackCoreDatabase',
                'CatchTrackCoreMigration',
                'CatchTrackCoreDatabaseAdapter',
                'CatchTrackCoreModuleState',
                'CatchTrackCoreModuleConfig',
                'CatchTrackCoreSecurity',
                'CatchTrackCoreDependencyManager',
                'CatchTrackCoreModuleInstaller',
                'CatchTrackCoreModuleValidator',
                'CatchTrackCoreModuleLifecycle',
                'CatchTrackCoreEventBus',
                'CatchTrackCoreModuleAPI'
            ];

            const missingComponents =
                requiredComponents.filter(
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

            this.started = true;

            window.CatchTrackCoreEventBus.publish(
                'core:started',
                {
                    version:
                        window.CatchTrackCoreConfig.core.version
                }
            );
        }
    };

    window.CatchTrackCoreStartup =
        Object.freeze(CoreStartup);
})();