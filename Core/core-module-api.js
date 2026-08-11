/*
 * CatchTrack Core Module API
 * Version: 1.0
 *
 * Einheitliche technische Schnittstelle, die ein Modul
 * für den Zugriff auf Core-Funktionen verwenden kann.
 */

(() => {
    'use strict';

    const ModuleAPI = {
        register(module) {
            return window.CatchTrackCoreAPI.registerModule(module);
        },

        unregister(moduleId) {
            return window.CatchTrackCoreAPI.unregisterModule(moduleId);
        },

        activate(moduleId) {
            return window.CatchTrackCoreAPI.activateModule(moduleId);
        },

        deactivate(moduleId) {
            return window.CatchTrackCoreAPI.deactivateModule(moduleId);
        },

        get(moduleId) {
            return window.CatchTrackCoreAPI.getModule(moduleId);
        },

        getAll() {
            return window.CatchTrackCoreAPI.getModules();
        },

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
        },

        storage: {
            set(key, value) {
                return window.CatchTrackCoreStorage.set(key, value);
            },

            get(key, defaultValue = null) {
                return window.CatchTrackCoreStorage.get(
                    key,
                    defaultValue
                );
            },

            remove(key) {
                return window.CatchTrackCoreStorage.remove(key);
            },

            has(key) {
                return window.CatchTrackCoreStorage.has(key);
            }
        },

        database: {
            execute(...args) {
                return window.CatchTrackCoreDatabase.execute(...args);
            },

            query(...args) {
                return window.CatchTrackCoreDatabase.query(...args);
            },

            transaction(...args) {
                return window.CatchTrackCoreDatabase.transaction(
                    ...args
                );
            }
        },

        log: {
            info(message, context = {}) {
                return window.CatchTrackCoreLogger.info(
                    message,
                    context
                );
            },

            warn(message, context = {}) {
                return window.CatchTrackCoreLogger.warn(
                    message,
                    context
                );
            },

            error(message, context = {}) {
                return window.CatchTrackCoreLogger.error(
                    message,
                    context
                );
            }
        }
    };

    window.CatchTrackCoreModuleAPI =
        Object.freeze(ModuleAPI);
})();