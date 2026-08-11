/*
 * CatchTrack Core Module Context
 * Version: 1.0
 *
 * Stellt einem Modul einen begrenzten technischen Kontext
 * für den Zugriff auf Core-Dienste bereit.
 */

(() => {
    'use strict';

    const contexts = new Map();

    const ModuleContext = {
        create(moduleId) {
            if (
                typeof moduleId !== 'string' ||
                !moduleId.trim()
            ) {
                throw new Error('Module ID is required.');
            }

            if (contexts.has(moduleId)) {
                return contexts.get(moduleId);
            }

            const context = Object.freeze({
                moduleId,

                api: window.CatchTrackCoreModuleAPI,

                events: {
                    on(eventName, callback) {
                        return window.CatchTrackCoreEventBus.subscribe(
                            eventName,
                            callback
                        );
                    },

                    off(eventName, callback) {
                        return window.CatchTrackCoreEventBus.unsubscribe(
                            eventName,
                            callback
                        );
                    },

                    emit(eventName, data = null) {
                        return window.CatchTrackCoreEventBus.publish(
                            eventName,
                            data
                        );
                    }
                },

                config: {
                    get(defaultConfig = {}) {
                        return window.CatchTrackCoreModuleConfig.get(
                            moduleId,
                            defaultConfig
                        );
                    },

                    set(config) {
                        return window.CatchTrackCoreModuleConfig.set(
                            moduleId,
                            config
                        );
                    }
                },

                state: {
                    get(defaultState = null) {
                        return window.CatchTrackCoreModuleState.get(
                            moduleId,
                            defaultState
                        );
                    },

                    set(state) {
                        return window.CatchTrackCoreModuleState.set(
                            moduleId,
                            state
                        );
                    }
                }
            });

            contexts.set(moduleId, context);

            return context;
        },

        get(moduleId) {
            return contexts.get(moduleId) || null;
        },

        remove(moduleId) {
            return contexts.delete(moduleId);
        },

        clear() {
            contexts.clear();
        }
    };

    window.CatchTrackCoreModuleContext =
        Object.freeze(ModuleContext);
})();