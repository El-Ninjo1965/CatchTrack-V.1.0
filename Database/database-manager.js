/*
 * Core Database Layer
 * Version: 1.0
 *
 * Datenbankzugriff und -verwaltung mit IndexedDB als Standard.
 * Abstrahiert den Datenzugriff für verschiedene Datenbanktypen.
 */

(() => {
    'use strict';

    const DatabaseManager = {
        initialized: false,
        db: null,
        stores: [],

        /**
         * Initialisiert die Datenbankverbindung
         */
        init() {
            if (this.initialized) {
                return;
            }

            return this.openDatabase().then(() => {
                this.initialized = true;

                if (window.Core) {
                    window.Core.emit('database:initialized', {
                        timestamp: new Date().toISOString()
                    });
                }
            });
        },

        /**
         * Öffnet die IndexedDB-Datenbank
         * @returns {Promise}
         */
        openDatabase() {
            return new Promise((resolve, reject) => {
                if (!('indexedDB' in window)) {
                    reject(new Error('IndexedDB not available'));
                    return;
                }

                const dbName = 'CoreDB';
                const dbVersion = 1;

                const request = indexedDB.open(dbName, dbVersion);

                request.onerror = () => {
                    reject(new Error(`Failed to open database: ${request.error}`));
                };

                request.onsuccess = () => {
                    this.db = request.result;
                    // Store-Liste aus tatsächlich vorhandenen Stores befüllen
                    this.stores = Array.from(this.db.objectStoreNames);
                    resolve();
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    this.createStores(db);
                };
            });
        },

        /**
         * Erstellt alle erforderlichen Stores
         * @param {IDBDatabase} db - Datenbankinstanz
         */
        createStores(db) {
            const storeConfigs = [
                { name: 'users', keyPath: 'id', indexes: ['email', 'role', 'active'] },
                { name: 'modules', keyPath: 'id', indexes: ['name', 'version', 'status'] },
                { name: 'logs', keyPath: 'id', indexes: ['timestamp', 'level', 'source'] },
                { name: 'sessions', keyPath: 'id', indexes: ['userId', 'createdAt', 'expiresAt'] },
                { name: 'settings', keyPath: 'key', indexes: ['category'] },
                { name: 'cache', keyPath: 'key', indexes: ['createdAt', 'ttl'] },
                { name: 'sync', keyPath: 'id', indexes: ['timestamp', 'status'] }
            ];

            storeConfigs.forEach(config => {
                if (!db.objectStoreNames.contains(config.name)) {
                    const store = db.createObjectStore(config.name, { keyPath: config.keyPath });

                    if (config.indexes) {
                        config.indexes.forEach(indexName => {
                            store.createIndex(indexName, indexName, { unique: false });
                        });
                    }

                    this.stores.push(config.name);
                }
            });
        },

        /**
         * Speichert ein Objekt in einem Store
         * @param {string} storeName - Name des Stores
         * @param {object} data - Zu speichernde Daten
         * @returns {Promise}
         */
        save(storeName, data) {
            return this.transaction(storeName, 'readwrite', (store) => {
                return store.put(data);
            });
        },

        /**
         * Lädt ein Objekt aus einem Store
         * @param {string} storeName - Name des Stores
         * @param {*} key - Objektschlüssel
         * @returns {Promise}
         */
        get(storeName, key) {
            return this.transaction(storeName, 'readonly', (store) => {
                return store.get(key);
            });
        },

        /**
         * Fügt ein Objekt ein
         * @param {string} storeName - Name des Stores
         * @param {object} data - Zu speichernde Daten
         * @returns {Promise}
         */
        insert(storeName, data) {
            return this.transaction(storeName, 'readwrite', (store) => {
                return store.add(data);
            });
        },

        /**
         * Aktualisiert ein Objekt
         * @param {string} storeName - Name des Stores
         * @param {object} data - Aktualisierte Daten
         * @returns {Promise}
         */
        update(storeName, data) {
            return this.transaction(storeName, 'readwrite', (store) => {
                return store.put(data);
            });
        },

        /**
         * Löscht ein Objekt
         * @param {string} storeName - Name des Stores
         * @param {*} key - Objektschlüssel
         * @returns {Promise}
         */
        delete(storeName, key) {
            return this.transaction(storeName, 'readwrite', (store) => {
                return store.delete(key);
            });
        },

        /**
         * Löscht alle Objekte aus einem Store
         * @param {string} storeName - Name des Stores
         * @returns {Promise}
         */
        clear(storeName) {
            return this.transaction(storeName, 'readwrite', (store) => {
                return store.clear();
            });
        },

        /**
         * Sucht nach Objekten in einem Store
         * @param {string} storeName - Name des Stores
         * @param {string} indexName - Name des Index
         * @param {*} value - Suchvalue
         * @returns {Promise}
         */
        findByIndex(storeName, indexName, value) {
            return this.transaction(storeName, 'readonly', (store) => {
                const index = store.index(indexName);
                return index.getAll(value);
            });
        },

        /**
         * Gibt alle Objekte aus einem Store zurück
         * @param {string} storeName - Name des Stores
         * @returns {Promise}
         */
        getAll(storeName) {
            return this.transaction(storeName, 'readonly', (store) => {
                return store.getAll();
            });
        },

        /**
         * Führt eine Transaktion durch
         * @param {string} storeName - Name des Stores
         * @param {string} mode - 'readonly' oder 'readwrite'
         * @param {function} callback - Callback mit dem Store
         * @returns {Promise}
         */
        transaction(storeName, mode, callback) {
            return new Promise((resolve, reject) => {
                if (!this.db) {
                    reject(new Error('Database not initialized'));
                    return;
                }

                try {
                    const tx = this.db.transaction([storeName], mode);
                    const store = tx.objectStore(storeName);

                    const request = callback(store);

                    request.onsuccess = () => {
                        resolve(request.result);
                    };

                    request.onerror = () => {
                        reject(new Error(`Database error: ${request.error}`));
                    };

                    tx.onerror = () => {
                        reject(new Error(`Transaction error: ${tx.error}`));
                    };
                } catch (error) {
                    reject(error);
                }
            });
        },

        /**
         * Gibt Datenbankstatistiken zurück
         * @returns {Promise}
         */
        async getStats() {
            const stats = {
                storeStats: {}
            };

            for (const storeName of this.stores) {
                try {
                    const count = await this.transaction(storeName, 'readonly', (store) => {
                        return store.count();
                    });

                    stats.storeStats[storeName] = {
                        count: count
                    };
                } catch (error) {
                    stats.storeStats[storeName] = { error: error.message };
                }
            }

            return stats;
        },

        /**
         * Löscht die gesamte Datenbank
         * @returns {Promise}
         */
        deleteDatabase() {
            return new Promise((resolve, reject) => {
                if (!this.db) {
                    reject(new Error('Database not initialized'));
                    return;
                }

                const dbName = this.db.name;
                this.db.close();

                const request = indexedDB.deleteDatabase(dbName);

                request.onsuccess = () => {
                    this.db = null;
                    this.initialized = false;
                    resolve();
                };

                request.onerror = () => {
                    reject(new Error(`Failed to delete database: ${request.error}`));
                };
            });
        }
    };

    if (!window.DatabaseManager) {
        window.DatabaseManager = Object.freeze(DatabaseManager);
    }
})();
