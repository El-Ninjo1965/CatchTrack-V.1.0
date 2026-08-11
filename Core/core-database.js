/*
 * CatchTrack Core Database
 * Version: 1.0
 *
 * Zentrale Datenbankschnittstelle.
 * Die konkrete Datenbankimplementierung wird später eingebunden.
 *
 * Der Core stellt ausschließlich die technische Schnittstelle bereit.
 * Datenbanktabellen und fachliche Daten gehören in die jeweiligen Module.
 */

(() => {
    'use strict';

    let adapter = null;

    const CoreDatabase = {
        setAdapter(databaseAdapter) {
            if (!databaseAdapter || typeof databaseAdapter !== 'object') {
                throw new TypeError('Database adapter is required.');
            }

            adapter = databaseAdapter;

            window.CatchTrackCoreEvents?.emit(
                'database:adapter-set'
            );
        },

        getAdapter() {
            return adapter;
        },

        isAvailable() {
            return adapter !== null;
        },

        async execute(...args) {
            this.ensureAdapter();

            if (typeof adapter.execute !== 'function') {
                throw new Error(
                    'Database adapter does not support execute().'
                );
            }

            return adapter.execute(...args);
        },

        async query(...args) {
            this.ensureAdapter();

            if (typeof adapter.query !== 'function') {
                throw new Error(
                    'Database adapter does not support query().'
                );
            }

            return adapter.query(...args);
        },

        async transaction(...args) {
            this.ensureAdapter();

            if (typeof adapter.transaction !== 'function') {
                throw new Error(
                    'Database adapter does not support transaction().'
                );
            }

            return adapter.transaction(...args);
        },

        ensureAdapter() {
            if (!adapter) {
                throw new Error(
                    'No database adapter has been configured.'
                );
            }
        }
    };

    window.CatchTrackCoreDatabase =
        Object.freeze(CoreDatabase);
})();