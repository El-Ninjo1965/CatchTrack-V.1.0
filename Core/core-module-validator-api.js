/*
 * CatchTrack Core Module Validator API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle zur Prüfung
 * von Moduldefinitionen.
 */

(() => {
    'use strict';

    const ValidatorAPI = {
        validate(moduleDefinition) {
            if (!window.CatchTrackCoreModuleValidator) {
                throw new Error(
                    'Core Module Validator is not available.'
                );
            }

            return window.CatchTrackCoreModuleValidator.validate(
                moduleDefinition
            );
        },

        isValid(moduleDefinition) {
            if (!window.CatchTrackCoreModuleValidator) {
                return false;
            }

            return window.CatchTrackCoreModuleValidator.isValid(
                moduleDefinition
            );
        }
    };

    window.CatchTrackCoreModuleValidatorAPI =
        Object.freeze(ValidatorAPI);
})();