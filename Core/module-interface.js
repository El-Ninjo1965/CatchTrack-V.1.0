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

    const ModuleInterface = {
        create(definition = {}) {
            if (!definition.id || typeof definition.id !== 'string') {
                throw new Error('Module ID is required.');
            }

            if (!definition.name || typeof definition.name !== 'string') {
                throw new Error('Module name is required.');
            }

            return {
                id: definition.id,
                name: definition.name,
                version: definition.version || '1.0.0',
                description: definition.description || '',
                active: false,

                activate() {
                    this.active = true;

                    if (typeof definition.onActivate === 'function') {
                        definition.onActivate(this);
                    }
                },

                deactivate() {
                    if (typeof definition.onDeactivate === 'function') {
                        definition.onDeactivate(this);
                    }

                    this.active = false;
                }
            };
        }
    };

    if (!window.CatchTrackModuleInterface) {
        window.CatchTrackModuleInterface = ModuleInterface;
    }
})();