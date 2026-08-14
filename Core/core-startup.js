/*
 * Core Startup
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

            if (window.CoreShutdown && typeof window.CoreShutdown.reset === 'function') {
                window.CoreShutdown.reset();
            }

            started = true;

            try {
                const requiredComponents = [
                    'Core',
                    'CoreLoader',
                    'CoreContext',
                    'CoreConfig',
                    'CoreLifecycle',
                    'ModuleRegistry',
                    'ModuleManager'
                ];

                const missingComponents = requiredComponents.filter(
                    (component) => !window[component]
                );

                if (missingComponents.length > 0) {
                    throw new Error(
                        `Missing Core components: ${missingComponents.join(', ')}`
                    );
                }

                window.CoreLifecycle.setPhase(
                    window.CoreLifecycle.phases.INITIALIZING
                );

                window.CoreLoader.init();

                if (window.ConfigManager && typeof window.ConfigManager.init === 'function') {
                    window.ConfigManager.init();
                }

                if (window.ServiceManager && typeof window.ServiceManager.init === 'function') {
                    window.ServiceManager.init();
                }

                if (window.DatabaseManager && typeof window.DatabaseManager.init === 'function') {
                    window.DatabaseManager.init().catch((error) => {
                        if (window.CoreErrorHandler) {
                            window.CoreErrorHandler.handle(error, {
                                type: 'database-init'
                            });
                        }
                    });
                }

                if (window.UserModule && typeof window.UserModule.init === 'function') {
                    window.UserModule.init();
                }

                if (window.AdminModule && typeof window.AdminModule.init === 'function') {
                    window.AdminModule.init();
                }

                if (window.I18nModule && typeof window.I18nModule.init === 'function') {
                    window.I18nModule.init();
                }

                if (window.ModuleManager && typeof window.ModuleManager.discoverModules === 'function') {
                    window.ModuleManager.discoverModules();
                }

                window.CoreContext.setRuntimeValue(
                    'initialized',
                    true
                );

                window.CoreContext.setRuntimeValue(
                    'startedAt',
                    new Date().toISOString()
                );

                window.CoreLifecycle.setPhase(
                    window.CoreLifecycle.phases.READY
                );

                window.Core.emit('core:started', {
                    version: window.CoreConfig.core.version
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

    if (!window.CoreStartup) {
        window.CoreStartup =
            Object.freeze(CoreStartup);
    }
})();
