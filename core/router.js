const CatchTrackRouter = {

    version: "1.0",

    routes: [],

    currentRoute: null,


    init() {

        console.log(
            "CatchTrack Router bereit."
        );

    },


    register(route, handler) {

        this.routes.push({

            route: route,

            handler: handler

        });


        return true;

    },


    navigate(route) {

        const target =
            this.routes.find(
                item => item.route === route
            );


        if (!target) {

            console.warn(
                "Route nicht gefunden:",
                route
            );

            return false;

        }


        this.currentRoute = route;


        if (typeof target.handler === "function") {

            target.handler();

        }


        return true;

    },


    getCurrentRoute() {

        return this.currentRoute;

    }

};



document.addEventListener(
    "DOMContentLoaded",
    () => {

        CatchTrackRouter.init();

    }
);