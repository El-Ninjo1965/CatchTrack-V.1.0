"use strict";


window.CatchTrackLanguageManager = {

    version: "2.0.0",

    defaultLanguage: "de",

    currentLanguage: null,

    manualLanguage: null,

    translations: {},

    initialized: false,

    storageKey:
        "language",


    init() {

        if (
            this.initialized
        ) {

            return;

        }


        this.initialized =
            true;


        const saved =
            window.CatchTrackStorageManager
                ?.load(
                    this.storageKey
                );


        if (
            saved
        ) {

            this.manualLanguage =
                saved;

            this.currentLanguage =
                saved;

        }

        else {

            this.currentLanguage =
                this.detectLanguage();

        }

    },


    normalizeLanguage(language) {

        if (
            typeof language !==
            "string"
        ) {

            return this.defaultLanguage;

        }


        return language
            .trim()
            .toLowerCase()
            .split("-")[0]
            .split("_")[0];

    },


    detectLanguage() {

        const candidates = [

            navigator.language,

            ...(navigator.languages || [])

        ];


        for (
            const candidate
            of candidates
        ) {

            const language =
                this.normalizeLanguage(
                    candidate
                );


            if (
                language
            ) {

                return language;

            }

        }


        return this.defaultLanguage;

    },


    register(
        language,
        dictionary
    ) {

        const normalized =
            this.normalizeLanguage(
                language
            );


        if (
            !dictionary ||
            typeof dictionary !==
            "object"
        ) {

            return false;

        }


        this.translations[
            normalized
        ] = {

            ...this.translations[
                normalized
            ],

            ...dictionary

        };


        return true;

    },


    setLanguage(
        language,
        options = {}
    ) {

        const normalized =
            this.normalizeLanguage(
                language
            );


        this.currentLanguage =
            normalized;


        if (
            options.manual !== false
        ) {

            this.manualLanguage =
                normalized;


            if (
                window.CatchTrackStorageManager
            ) {

                CatchTrackStorageManager.save(
                    this.storageKey,
                    normalized
                );

            }

        }


        this.apply(
            document
        );


        return true;

    },


    resetLanguage() {

        this.manualLanguage =
            null;


        if (
            window.CatchTrackStorageManager
        ) {

            CatchTrackStorageManager.remove(
                this.storageKey
            );

        }


        this.currentLanguage =
            this.detectLanguage();


        this.apply(
            document
        );


        return true;

    },


    getLanguage() {

        return (
            this.currentLanguage ||
            this.defaultLanguage
        );

    },


    getAvailableLanguages() {

        return Object.keys(
            this.translations
        );

    },


    getValue(
        key,
        language
    ) {

        const target =
            this.normalizeLanguage(
                language ||
                this.getLanguage()
            );


        const dictionary =
            this.translations[
                target
            ] || {};


        return dictionary[key];

    },


    t(
        key,
        fallback = key,
        variables = {}
    ) {

        let value =
            this.getValue(
                key
            );


        if (
            value === undefined
        ) {

            value =
                this.getValue(
                    key,
                    this.defaultLanguage
                );

        }


        if (
            value === undefined
        ) {

            value =
                fallback;

        }


        return String(value)
            .replace(
                /\{([^}]+)\}/g,
                (
                    match,
                    variable
                ) =>
                    variables[
                        variable
                    ] !== undefined
                        ? variables[
                            variable
                        ]
                        : match
            );

    },


    apply(
        root = document
    ) {

        if (
            !root ||
            typeof root.querySelectorAll !==
            "function"
        ) {

            return;

        }


        root.querySelectorAll(
            "[data-i18n]"
        ).forEach(
            element => {

                const key =
                    element.dataset.i18n;

                element.textContent =
                    this.t(key);

            }
        );


        root.querySelectorAll(
            "[data-i18n-placeholder]"
        ).forEach(
            element => {

                const key =
                    element.dataset
                        .i18nPlaceholder;

                element.placeholder =
                    this.t(key);

            }
        );

    }

};