/*
 * CatchTrack Module Interface
 * Version: 1.0
 *
 * Einheitliche Grundstruktur für alle CatchTrack-Module.
 * Die eigentliche Funktionalität wird ausschließlich
 * innerhalb des jeweiligen Moduls implementiert.
 */

(() => {
    'use strict';

    const moduleStatuses = Object.freeze({
        AVAILABLE: 'available',
        INSTALLED: 'installed',
        ENABLED: 'enabled',
        DISABLED: 'disabled'
    });

    const ModuleInterface = {
        statuses: moduleStatuses,

        create(definition = {}) {
            if (!definition.id || typeof definition.id !== 'string') {
                throw new Error('Module ID is required.');
            }

            if (!definition.name || typeof definition.name !== 'string') {
                throw new Error('Module name is required.');
            }

            const module = {
                id: definition.id,
                name: definition.name,
                version: definition.version || '1.0.0',
                description: definition.description || '',
                status: moduleStatuses.AVAILABLE,
                active: false,
                dependencies: Array.isArray(definition.dependencies)
                    ? [...definition.dependencies]
                    : [],
                permissions: Array.isArray(definition.permissions)
                    ? [...definition.permissions]
                    : [],
                capabilities: Array.isArray(definition.capabilities)
                    ? [...definition.capabilities]
                    : [],

                install() {
                    if (this.status === moduleStatuses.INSTALLED) {
                        return this;
                    }

                    this.status = moduleStatuses.INSTALLED;
                    this.active = false;

                    if (typeof definition.onInstall === 'function') {
                        definition.onInstall(this);
                    }

                    return this;
                },

                initialize() {
                    if (typeof definition.onInitialize === 'function') {
                        definition.onInitialize(this);
                    }

                    if (this.status === moduleStatuses.AVAILABLE) {
                        this.status = moduleStatuses.INSTALLED;
                    }

                    return this;
                },

                enable() {
                    if (this.status === moduleStatuses.ENABLED) {
                        return this;
                    }

                    this.status = moduleStatuses.ENABLED;
                    this.active = true;

                    if (typeof definition.onEnable === 'function') {
                        definition.onEnable(this);
                    }

                    if (typeof definition.onActivate === 'function') {
                        definition.onActivate(this);
                    }

                    return this;
                },

                disable() {
                    if (this.status === moduleStatuses.DISABLED && !this.active) {
                        return this;
                    }

                    this.status = moduleStatuses.DISABLED;
                    this.active = false;

                    if (typeof definition.onDisable === 'function') {
                        definition.onDisable(this);
                    }

                    if (typeof definition.onDeactivate === 'function') {
                        definition.onDeactivate(this);
                    }

                    return this;
                },

                update() {
                    if (typeof definition.onUpdate === 'function') {
                        definition.onUpdate(this);
                    }

                    return this;
                },

                uninstall() {
                    this.status = moduleStatuses.AVAILABLE;
                    this.active = false;

                    if (typeof definition.onUninstall === 'function') {
                        definition.onUninstall(this);
                    }

                    return this;
                },

                activate() {
                    return this.enable();
                },

                deactivate() {
                    return this.disable();
                }
            };

            return module;
        }
    };

    if (!window.CatchTrackModuleInterface) {
        window.CatchTrackModuleInterface = ModuleInterface;
    }
})();