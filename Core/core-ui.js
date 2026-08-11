/*
 * CatchTrack Core UI
 * Version: 1.0
 *
 * Gemeinsame UI-Grundfunktionen für Core und Module.
 * Fachspezifische Benutzeroberflächen gehören in die jeweiligen Module.
 */

(() => {
    'use strict';

    const CoreUI = {
        root: null,

        init(root = document.body) {
            this.root = root;
        },

        createElement(tagName, options = {}) {
            const element = document.createElement(tagName);

            if (options.className) {
                element.className = options.className;
            }

            if (options.text !== undefined) {
                element.textContent = options.text;
            }

            if (options.html !== undefined) {
                element.innerHTML = options.html;
            }

            if (options.attributes) {
                Object.entries(options.attributes).forEach(([name, value]) => {
                    element.setAttribute(name, value);
                });
            }

            return element;
        },

        clear(element) {
            if (!element) {
                return;
            }

            element.replaceChildren();
        },

        show(element) {
            if (element) {
                element.hidden = false;
            }
        },

        hide(element) {
            if (element) {
                element.hidden = true;
            }
        },

        getRoot() {
            return this.root;
        }
    };

    window.CatchTrackCoreUI = Object.freeze(CoreUI);
})();