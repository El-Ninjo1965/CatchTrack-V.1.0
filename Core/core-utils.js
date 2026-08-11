/*
 * CatchTrack Core Utilities
 * Version: 1.0
 *
 * Allgemeine Hilfsfunktionen des Core.
 * Fachspezifische Funktionen gehören nicht hier hinein.
 */

(() => {
    'use strict';

    const CoreUtils = {
        isObject(value) {
            return value !== null &&
                typeof value === 'object' &&
                !Array.isArray(value);
        },

        isEmpty(value) {
            if (value === null || value === undefined) {
                return true;
            }

            if (typeof value === 'string') {
                return value.trim().length === 0;
            }

            if (Array.isArray(value)) {
                return value.length === 0;
            }

            if (this.isObject(value)) {
                return Object.keys(value).length === 0;
            }

            return false;
        },

        clone(value) {
            if (value === undefined) {
                return undefined;
            }

            return JSON.parse(JSON.stringify(value));
        },

        generateId(prefix = 'id') {
            const timestamp = Date.now().toString(36);
            const random = Math.random()
                .toString(36)
                .substring(2, 10);

            return `${prefix}-${timestamp}-${random}`;
        },

        now() {
            return new Date().toISOString();
        }
    };

    window.CatchTrackCoreUtils = Object.freeze(CoreUtils);
})();