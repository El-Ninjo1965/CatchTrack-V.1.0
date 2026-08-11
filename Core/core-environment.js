/*
 * CatchTrack Core Environment
 * Version: 1.0
 *
 * Liefert grundlegende Informationen über die Laufzeitumgebung.
 */

(() => {
    'use strict';

    const CoreEnvironment = {
        isOnline() {
            return navigator.onLine;
        },

        isStandalone() {
            return window.matchMedia &&
                window.matchMedia('(display-mode: standalone)').matches;
        },

        getLanguage() {
            return navigator.language || 'en';
        },

        getPlatform() {
            return navigator.platform || '';
        },

        getUserAgent() {
            return navigator.userAgent || '';
        },

        getScreen() {
            return {
                width: window.innerWidth,
                height: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio || 1
            };
        },

        getInfo() {
            return {
                online: this.isOnline(),
                standalone: this.isStandalone(),
                language: this.getLanguage(),
                platform: this.getPlatform(),
                userAgent: this.getUserAgent(),
                screen: this.getScreen()
            };
        }
    };

    window.CatchTrackCoreEnvironment = Object.freeze(CoreEnvironment);
})();