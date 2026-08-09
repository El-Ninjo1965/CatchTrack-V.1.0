"use strict";


window.CatchTrackRouter = {

    version: "2.0.0",

    routes: new Map(),

    currentRoute: null,

    initialized: false,


    init() {

        if (
            this.initialized
        ) {

            return;

        }


        this.initialized =
            true;


        window.addEventListener(
            "hashchange",
            () => {

                this.handleHash();

            }
        );


        this.handleHash();

    },


    normalize(route) {

        let value =
            String(route || "")
                .trim();


        if (
            !value
        ) {

            return "/";

        }


        if (
            !value.startsWith("/")
        ) {

            value =
                "/" + value;

        }


        return value;

    },


    register(
        route,
        handler,
        options = {}
    ) {

        const normalized =
            this.normalize(route);


        if (
            typeof handler !==
            "function"
        ) {

            return false;

        }


        this.routes.set(
            normalized,
            {
                handler,

                title:
                    options.title ||
                    null
            }
        );


        return true;

    },


    unregister(route) {

        return this.routes.delete(
            this.normalize(route)
        );

    },


    navigate(
        route,
        options = {}
    ) {

        const normalized =
            this.normalize(route);


        if (
            options.replace
        ) {

            history.replaceState(
                {},
                "",
                `#${normalized}`
            );

        }

        else {

            window.location.hash =
                normalized;

        }


        return this.dispatch(
            normalized
        );

    },


    handleHash() {

        const hash =
            window.location.hash
                .replace(
                    /^#/,
                    ""
                );


        const route =
            this.normalize(
                hash || "/"
            );


        this.dispatch(
            route
        );

    },


    dispatch(route) {

        const target =
            this.routes.get(
                route
            );


        if (!target) {

            this.currentRoute =
                route;

            return false;

        }


        this.currentRoute =
            route;


        try {

            target.handler(
                route
            );


            return true;

        }

        catch (error) {

            if (
                window.CatchTrackErrorHandler
            ) {

                CatchTrackErrorHandler.handle(
                    error,
                    `router:${route}`
                );

            }


            return false;

        }

    },


    getCurrentRoute() {

        return this.currentRoute;

    },


    getRoutes() {

        return Array.from(
            this.routes.keys()
        );

    }

};