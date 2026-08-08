const CatchTrackPermissionManager = {

    version: "1.0",

    permissions: {},


    init() {

        console.log(
            "CatchTrack Permission Manager bereit."
        );

    },


    setPermission(name, value) {

        this.permissions[name] = value;


        console.log(
            "Berechtigung gesetzt:",
            name,
            value
        );


        return true;

    },


    getPermission(name) {

        return this.permissions[name] ?? false;

    },


    check(name) {

        return this.getPermission(name);

    },


    getAll() {

        return this.permissions;

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackPermissionManager.init();

    }
);