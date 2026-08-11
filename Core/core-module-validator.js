/*
 * CatchTrack Core Module Validator
 * Version: 1.0
 *
 * Prüft die technische Grundstruktur eines Moduls,
 * bevor es registriert oder installiert wird.
 */

(() => {
    'use strict';

    const ModuleValidator = {
        validate(moduleDefinition) {
            const errors = [];

            if (
                !moduleDefinition ||
                typeof moduleDefinition !== 'object'
            ) {
                return {
                    valid: false,
                    errors: ['Module definition is required.']
                };
            }

            if (
                !moduleDefinition.id ||
                typeof moduleDefinition.id !== 'string'
            ) {
                errors.push('Module ID is required.');
            }

            if (
                moduleDefinition.id &&
                !window.CatchTrackCoreSecurity?.isValidModuleId(
                    moduleDefinition.id
                )
            ) {
                errors.push('Module ID contains invalid characters.');
            }

            if (
                !moduleDefinition.name ||
                typeof moduleDefinition.name !== 'string'
            ) {
                errors.push('Module name is required.');
            }

            if (
                moduleDefinition.version !== undefined &&
                typeof moduleDefinition.version !== 'string'
            ) {
                errors.push('Module version must be a string.');
            }

            return {
                valid: errors.length === 0,
                errors
            };
        },

        isValid(moduleDefinition) {
            return this.validate(moduleDefinition).valid;
        }
    };

    window.CatchTrackCoreModuleValidator =
        Object.freeze(ModuleValidator);
})();