"use strict";


window.CatchTrackStorageManager = {

    version: "2.0.0",

    prefix:
        "catchtrack:",

    initialized: false,


    init() {

        if (
            this.initialized
        ) {

            return;

        }


        this.initialized =
            true;

    },


    buildKey(key) {

        return (
            this.prefix +
            String(key)
        );

    },


    save(
        key,
        value
    ) {

        try {

            localStorage.setItem(

                this.buildKey(key),

                JSON.stringify(value)

            );


            return true;

        }

        catch (error) {

            if (
                window.CatchTrackErrorHandler
            ) {

                CatchTrackErrorHandler.handle(
                    error,
                    "storage:save"
                );

            }

            return false;

        }

    },


    load(
        key,
        fallback = null
    ) {

        try {

            const value =
                localStorage.getItem(
                    this.buildKey(key)
                );


            if (
                value === null
            ) {

                return fallback;

            }


            return JSON.parse(
                value
            );

        }

        catch (error) {

            if (
                window.CatchTrackErrorHandler
            ) {

                CatchTrackErrorHandler.handle(
                    error,
                    "storage:load"
                );

            }

            return fallback;

        }

    },


    remove(key) {

        try {

            localStorage.removeItem(
                this.buildKey(key)
            );

            return true;

        }

        catch (error) {

            return false;

        }

    },


    has(key) {

        try {

            return (
                localStorage.getItem(
                    this.buildKey(key)
                ) !== null
            );

        }

        catch (error) {

            return false;

        }

    },


    clearNamespace() {

        const keys = [];

        for (
            let index = 0;
            index < localStorage.length;
            index++
        ) {

            const key =
                localStorage.key(index);

            if (
                key &&
                key.startsWith(
                    this.prefix
                )
            ) {

                keys.push(key);

            }

        }


        keys.forEach(
            key =>
                localStorage.removeItem(
                    key
                )
        );


        return true;

    }

};