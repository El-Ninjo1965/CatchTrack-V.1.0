    navigateTo(latitude, longitude) {
        const lat = Number(latitude);
        const lon = Number(longitude);

        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lon) ||
            lat < -90 ||
            lat > 90 ||
            lon < -180 ||
            lon > 180
        ) {
            return Promise.reject(
                new Error("Invalid navigation coordinates.")
            );
        }

        const destination =
            `${lat.toFixed(6)},${lon.toFixed(6)}`;

        /*
         * Universal Maps URL.
         *
         * Auf iOS/iPadOS kann das System bzw. der Browser
         * eine installierte Kartenanwendung verwenden.
         * Google Maps kann die URL ebenfalls direkt übernehmen.
         */
        const url =
            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

        window.location.href = url;

        return Promise.resolve(url);
    },

    navigateToCurrentPosition() {
        const position =
            this.getPosition();

        if (!position) {
            this.setMessage(
                this.translate(
                    "gps.message.noPosition",
                    "Es ist kein aktueller Standort vorhanden."
                ),
                "error"
            );

            return Promise.reject(
                new Error(
                    "No current position available."
                )
            );
        }

        return this.navigateTo(
            position.latitude,
            position.longitude
        );
    },

    navigateToHome() {
        const home =
            this.getHomePosition();

        if (!home) {
            this.setMessage(
                this.translate(
                    "gps.message.noHome",
                    "Es ist kein Home-Standort gespeichert."
                ),
                "error"
            );

            return Promise.reject(
                new Error(
                    "No home position available."
                )
            );
        }

        return this.navigateTo(
            home.latitude,
            home.longitude
        );
    },