/*
 * CatchTrack Core Test Mode
 * Version: 1.0
 *
 * Entwicklungsunterstützung für den Aufbau und Test
 * der CatchTrack-Anwendung.
 *
 * Keine produktive Benutzer- oder Rechteverwaltung.
 */

(() => {
    'use strict';

    let enabled = false;

    const TestMode = {
        enable() {
            enabled = true;

            window.CatchTrackCoreEventBus?.publish(
                'test-mode:enabled'
            );
        },

        disable() {
            enabled = false;

            window.CatchTrackCoreEventBus?.publish(
                'test-mode:disabled'
            );
        },

        isEnabled() {
            return enabled;
        },

        getInfo() {
            return {
                enabled,
                purpose: 'development'
            };
        }
    };

    window.CatchTrackCoreTestMode =
        Object.freeze(TestMode);
})();