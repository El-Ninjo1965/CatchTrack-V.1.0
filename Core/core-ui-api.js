/*
 * CatchTrack Core UI API
 * Version: 1.0
 *
 * Öffentliche technische Schnittstelle für die
 * Darstellung und Verwaltung von Core-/Modulansichten.
 */

(() => {
    'use strict';

    const UIAPI = {
        mount(container, content) {
            return window.CatchTrackCoreUI.mount(
                container,
                content
            );
        },

        unmount(container) {
            return window.CatchTrackCoreUI.unmount(
                container
            );
        },

        show(view) {
            return window.CatchTrackCoreUI.show(view);
        },

        hide(view) {
            return window.CatchTrackCoreUI.hide(view);
        },

        getCurrentView() {
            return window.CatchTrackCoreUI.getCurrentView();
        }
    };

    window.CatchTrackCoreUIAPI =
        Object.freeze(UIAPI);
})();