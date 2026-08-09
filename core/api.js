"use strict";


window.CatchTrackAPI = {

    version: "2.0.0",

    services: {},

    requests: [],

    maxRequestHistory: 100,

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


    register(
        name,
        handler
    ) {

        if (
            !name ||
            typeof handler !==
            "function"
        ) {

            return false;

        }


        this.services[
            name
        ] =
            handler;


        return true;

    },


    unregister(name) {

        delete this.services[
            name
        ];

        return true;

    },


    has(name) {

        return typeof this.services[
            name
        ] === "function";

    },


    async call(
        name,
        payload = {},
        options = {}
    ) {

        const handler =
            this.services[
                name
            ];


        if (
            typeof handler !==
            "function"
        ) {

            const error =
                new Error(
                    `API-Service nicht gefunden: ${name}`
                );


            this.recordError(
                name,
                error
            );


            throw error;

        }


        const request = {

            service: name,

            payload,

            timestamp:
                new Date().toISOString()

        };


        this.requests.push(
            request
        );


        if (
            this.requests.length >
            this.maxRequestHistory
        ) {

            this.requests =
                this.requests.slice(
                    -this.maxRequestHistory
                );

        }


        try {

            return await handler(
                payload,
                options
            );

        }

        catch (error) {

            this.recordError(
                name,
                error
            );

            throw error;

        }

    },


    send(
        action,
        data = {}
    ) {

        return this.call(
            action,
            data
        );

    },


    recordError(
        service,
        error
    ) {

        if (
            window.CatchTrackErrorHandler
        ) {

            CatchTrackErrorHandler.handle(
                error,
                `api:${service}`
            );

        }

    },


    getServices() {

        return Object.keys(
            this.services
        );

    },


    getRequests() {

        return [
            ...this.requests
        ];

    }

};