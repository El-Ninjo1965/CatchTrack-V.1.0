"use strict";


window.CatchTrackPermissionManager = {

    version: "2.0.0",

    permissions: {},

    initialized: false,


    init() {

        if (
            this.initialized
        ) {

            return;

        }


        this.initialized =
            true;


        const stored =
            window.CatchTrackStorageManager
                ?.load(
                    "permissions",
                    {}
                );


        if (
            stored &&
            typeof stored ===
            "object"
        ) {

            this.permissions =
                {
                    ...stored
                };

        }

    },


    setPermission(
        name,
        value,
        persist = true
    ) {

        if (!name) {

            return false;

        }


        this.permissions[
            name
        ] =
            value;


        if (
            persist &&
            window.CatchTrackStorageManager
        ) {

            CatchTrackStorageManager.save(
                "permissions",
                this.permissions
            );

        }


        return true;

    },


    getPermission(name) {

        return (
            this.permissions[
                name
            ] ??
            false
        );

    },


    check(name) {

        return !!this.getPermission(
            name
        );

    },


    getAll() {

        return {
            ...this.permissions
        };

    }

};