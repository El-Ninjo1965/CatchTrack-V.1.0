/*
 * CatchTrack Core Module Loader
 * Version: 1.0
 *
 * Lädt eigenständige Module anhand ihrer Moduldefinition.
 * Die fachliche Funktionalität verbleibt vollständig im Modul.
 */

(() => {
    'use strict';

    const CoreModuleLoader = {
        loaded: new Set(),

        async load(modulePath) {
            if (typeof modulePath !== 'string' || !modulePath.trim()) {
                throw new Error('Module path is required.');
            }

            if (this.loaded.has(modulePath)) {
                return;
            }

            try {
                await this.loadScript(modulePath);

                this.loaded.add(modulePath);

                window.CatchTrackCoreEvents?.emit('module:loaded', {
                    path: modulePath
                });
            } catch (error) {
                window.CatchTrackErrorLog?.record(error, {
                    type: 'module-load',
                    path: modulePath
                });

                throw error;
            }
        },

        loadScript(modulePath) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');

                script.src = modulePath;
                script.async = false;

                script.onload = () => resolve();
                script.onerror = () => {
                    reject(
                        new Error(`Failed to load module: ${modulePath}`)
                    );
                };

                document.head.appendChild(script);
            });
        },

        isLoaded(modulePath) {
            return this.loaded.has(modulePath);
        }
    };

    window.CatchTrackCoreModuleLoader = Object.freeze(CoreModuleLoader);
})();