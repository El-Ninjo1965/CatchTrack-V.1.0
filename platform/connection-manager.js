/*
 * Connection Manager
 * Version: 1.0.0
 *
 * Neutral registry for app-to-server connection profiles.
 * It stores only non-secret routing metadata and status information.
 */

(() => {
    'use strict';

    const normalizeText = (value) => String(value ?? '').trim();

    const slugify = (value) => normalizeText(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const normalizePath = (value) => {
        const text = normalizeText(value);
        if (!text) {
            return '/api';
        }

        const prefixed = text.startsWith('/') ? text : `/${text}`;
        return prefixed.replace(/\/+$/, '') || '/api';
    };

    const cloneObject = (value) => value && typeof value === 'object' && !Array.isArray(value)
        ? { ...value }
        : {};

    const readCache = (storageKey) => {
        if (typeof localStorage === 'undefined') {
            return [];
        }

        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) {
                return [];
            }

            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.filter((entry) => entry && typeof entry === 'object') : [];
        } catch {
            return [];
        }
    };

    const writeCache = (storageKey, connections) => {
        if (typeof localStorage === 'undefined') {
            return;
        }

        try {
            localStorage.setItem(storageKey, JSON.stringify(connections));
        } catch {
            // Cache is best-effort only.
        }
    };

    const normalizeConnection = (connection) => {
        if (!connection || typeof connection !== 'object') {
            return null;
        }

        const appId = normalizeText(connection.appId);
        if (!appId) {
            return null;
        }

        const now = new Date().toISOString();
        return {
            id: slugify(connection.id || appId),
            appId,
            appName: normalizeText(connection.appName || appId),
            serverUrl: normalizeText(connection.serverUrl),
            apiBasePath: normalizePath(connection.apiBasePath || '/api'),
            connectionStatus: normalizeText(connection.connectionStatus || 'unconfigured'),
            parameters: cloneObject(connection.parameters),
            metadata: cloneObject(connection.metadata),
            createdAt: normalizeText(connection.createdAt) || now,
            updatedAt: now
        };
    };

    const ConnectionManager = {
        initialized: false,
        loadingPromise: null,
        connections: [],

        getConfig() {
            const defaultConfig = {
                endpoint: '/api/connections',
                storageKey: 'platform.connections.registry',
                defaultStatus: 'unconfigured'
            };

            if (window.ConfigManager && typeof window.ConfigManager.get === 'function') {
                const config = window.ConfigManager.get('connections', defaultConfig);
                return config && typeof config === 'object' ? { ...defaultConfig, ...config } : defaultConfig;
            }

            return defaultConfig;
        },

        getEndpoint() {
            return this.getConfig().endpoint || '/api/connections';
        },

        getStorageKey() {
            return this.getConfig().storageKey || 'platform.connections.registry';
        },

        async fetchConnections() {
            if (typeof fetch !== 'function') {
                return [];
            }

            try {
                const response = await fetch(this.getEndpoint(), { cache: 'no-store' });
                if (!response.ok) {
                    return [];
                }

                const payload = await response.json();
                const connections = Array.isArray(payload.connections) ? payload.connections : [];
                return connections.map(normalizeConnection).filter(Boolean);
            } catch {
                return [];
            }
        },

        async init() {
            if (this.initialized) {
                return this;
            }

            if (this.loadingPromise) {
                return await this.loadingPromise;
            }

            this.loadingPromise = (async () => {
                if (window.CoreConfig && !this.initialized) {
                    // Ensure the config subsystem has already run.
                }

                const remoteConnections = await this.fetchConnections();
                if (remoteConnections.length > 0) {
                    this.connections = remoteConnections;
                    writeCache(this.getStorageKey(), this.connections);
                } else {
                    this.connections = readCache(this.getStorageKey()).map(normalizeConnection).filter(Boolean);
                }

                this.initialized = true;

                if (window.Core) {
                    window.Core.emit('connection-manager:initialized', {
                        connectionCount: this.connections.length,
                        timestamp: new Date().toISOString()
                    });
                }

                return this;
            })();

            try {
                return await this.loadingPromise;
            } finally {
                this.loadingPromise = null;
            }
        },

        getConnections() {
            return this.connections.map((connection) => ({ ...connection, parameters: cloneObject(connection.parameters), metadata: cloneObject(connection.metadata) }));
        },

        getConnection(connectionId) {
            const id = slugify(connectionId);
            if (!id) {
                return null;
            }

            const connection = this.connections.find((entry) => entry.id === id);
            return connection ? { ...connection, parameters: cloneObject(connection.parameters), metadata: cloneObject(connection.metadata) } : null;
        },

        getConnectionForApp(appId) {
            const id = slugify(appId);
            if (!id) {
                return null;
            }

            return this.getConnection(id) || this.connections.find((entry) => entry.appId === normalizeText(appId)) || null;
        },

        getPrimaryConnection() {
            return this.connections.find((entry) => entry.connectionStatus === 'connected')
                || this.connections.find((entry) => entry.connectionStatus === 'configured')
                || this.connections[0]
                || null;
        },

        async saveConnection(connection) {
            const normalized = normalizeConnection(connection);
            if (!normalized) {
                return {
                    ok: false,
                    code: 'INVALID_CONNECTION',
                    message: 'Connection data is incomplete.'
                };
            }

            const existing = this.connections.find((entry) => entry.id === normalized.id);
            const method = existing ? 'PUT' : 'POST';
            const endpoint = existing ? `${this.getEndpoint()}/${encodeURIComponent(existing.id)}` : this.getEndpoint();

            if (typeof fetch === 'function') {
                const response = await fetch(endpoint, {
                    method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(normalized)
                });

                if (!response.ok) {
                    const errorPayload = await response.json().catch(() => null);
                    return errorPayload || {
                        ok: false,
                        code: 'SAVE_FAILED',
                        message: 'Failed to save connection.'
                    };
                }

                const payload = await response.json();
                const saved = payload.connection || payload.data || normalized;
                const nextConnection = normalizeConnection(saved) || normalized;
                this.connections = this.connections.filter((entry) => entry.id !== nextConnection.id).concat(nextConnection);
                this.connections.sort((a, b) => a.appName.localeCompare(b.appName));
                writeCache(this.getStorageKey(), this.connections);
                return {
                    ok: true,
                    code: existing ? 'CONNECTION_UPDATED' : 'CONNECTION_CREATED',
                    connection: nextConnection
                };
            }

            this.connections = this.connections.filter((entry) => entry.id !== normalized.id).concat(normalized);
            this.connections.sort((a, b) => a.appName.localeCompare(b.appName));
            writeCache(this.getStorageKey(), this.connections);

            return {
                ok: true,
                code: existing ? 'CONNECTION_UPDATED' : 'CONNECTION_CREATED',
                connection: normalized
            };
        },

        async deleteConnection(connectionId) {
            const id = slugify(connectionId);
            if (!id) {
                return {
                    ok: false,
                    code: 'INVALID_CONNECTION',
                    message: 'Connection ID is required.'
                };
            }

            if (typeof fetch === 'function') {
                const response = await fetch(`${this.getEndpoint()}/${encodeURIComponent(id)}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorPayload = await response.json().catch(() => null);
                    return errorPayload || {
                        ok: false,
                        code: 'DELETE_FAILED',
                        message: 'Failed to delete connection.'
                    };
                }
            }

            this.connections = this.connections.filter((entry) => entry.id !== id);
            writeCache(this.getStorageKey(), this.connections);

            return {
                ok: true,
                code: 'CONNECTION_REMOVED',
                connectionId: id
            };
        },

        async refresh() {
            this.initialized = false;
            this.loadingPromise = null;
            return await this.init();
        }
    };

    window.ConnectionManager = ConnectionManager;
})();
