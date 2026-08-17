'use strict';

const fs = require('node:fs');
const path = require('node:path');

const allowedStatuses = new Set(['unconfigured', 'configured', 'connected', 'offline', 'error']);

const normalizeText = (value) => String(value ?? '').trim();

const slugify = (value) => normalizeText(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const normalizePath = (value) => {
  const text = normalizeText(value);
  if (!text) {
    return '/';
  }

  const prefixed = text.startsWith('/') ? text : `/${text}`;
  return prefixed.replace(/\/+$/, '') || '/';
};

const cloneObject = (value) => value && typeof value === 'object' && !Array.isArray(value)
  ? { ...value }
  : {};

const readJsonFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return { schemaVersion: 1, connections: [] };
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  if (!raw.trim()) {
    return { schemaVersion: 1, connections: [] };
  }

  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    return { schemaVersion: 1, connections: parsed };
  }

  if (parsed && typeof parsed === 'object' && Array.isArray(parsed.connections)) {
    return {
      schemaVersion: Number(parsed.schemaVersion || 1),
      connections: parsed.connections
    };
  }

  return { schemaVersion: 1, connections: [] };
};

const normalizeConnection = (input, existing = null) => {
  if (!input || typeof input !== 'object') {
    return {
      ok: false,
      code: 'INVALID_CONNECTION',
      message: 'Connection data must be an object.'
    };
  }

  const appId = normalizeText(input.appId || existing && existing.appId);
  if (!appId) {
    return {
      ok: false,
      code: 'INVALID_CONNECTION',
      message: 'App ID is required.'
    };
  }

  const id = slugify(input.id || existing && existing.id || appId);
  const appName = normalizeText(input.appName || existing && existing.appName || appId);
  const now = new Date().toISOString();
  const connectionStatus = allowedStatuses.has(normalizeText(input.connectionStatus))
    ? normalizeText(input.connectionStatus)
    : (existing && allowedStatuses.has(existing.connectionStatus) ? existing.connectionStatus : 'unconfigured');

  const normalized = {
    id,
    appId,
    appName,
    serverUrl: normalizeText(input.serverUrl || existing && existing.serverUrl),
    apiBasePath: normalizePath(input.apiBasePath || existing && existing.apiBasePath || '/api'),
    connectionStatus,
    parameters: cloneObject(input.parameters || existing && existing.parameters),
    metadata: cloneObject(input.metadata || existing && existing.metadata),
    createdAt: existing && existing.createdAt ? existing.createdAt : now,
    updatedAt: now
  };

  return { ok: true, data: normalized };
};

const createConnectionService = (storePath) => {
  if (!storePath || typeof storePath !== 'string') {
    throw new Error('Connection store path is required.');
  }

  const ensureDirectory = () => {
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
  };

  const readStore = () => {
    try {
      const payload = readJsonFile(storePath);
      const connections = Array.isArray(payload.connections) ? payload.connections : [];
      return {
        schemaVersion: Number(payload.schemaVersion || 1),
        connections: connections
          .filter((entry) => entry && typeof entry === 'object')
          .map((entry) => normalizeConnection(entry).data)
          .filter(Boolean)
      };
    } catch {
      return { schemaVersion: 1, connections: [] };
    }
  };

  const writeStore = (data) => {
    ensureDirectory();
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2) + '\n');
  };

  const upsertConnection = (input) => {
    const currentStore = readStore();
    const existing = currentStore.connections.find((entry) => entry.id === slugify(input && (input.id || input.appId)));
    const normalized = normalizeConnection(input, existing);

    if (!normalized.ok) {
      return normalized;
    }

    const nextConnections = currentStore.connections.filter((entry) => entry.id !== normalized.data.id);
    nextConnections.push(normalized.data);
    nextConnections.sort((a, b) => a.appName.localeCompare(b.appName));

    writeStore({
      schemaVersion: 1,
      connections: nextConnections
    });

    return {
      ok: true,
      code: existing ? 'CONNECTION_UPDATED' : 'CONNECTION_CREATED',
      data: normalized.data
    };
  };

  const removeConnection = (connectionId) => {
    const id = slugify(connectionId);
    if (!id) {
      return {
        ok: false,
        code: 'INVALID_CONNECTION',
        message: 'Connection ID is required.'
      };
    }

    const currentStore = readStore();
    const nextConnections = currentStore.connections.filter((entry) => entry.id !== id);

    if (nextConnections.length === currentStore.connections.length) {
      return {
        ok: false,
        code: 'NOT_FOUND',
        message: 'Connection not found.'
      };
    }

    writeStore({
      schemaVersion: 1,
      connections: nextConnections
    });

    return {
      ok: true,
      code: 'CONNECTION_REMOVED',
      data: { id }
    };
  };

  return {
    listConnections() {
      return readStore().connections;
    },

    getConnection(connectionId) {
      const id = slugify(connectionId);
      if (!id) {
        return null;
      }

      return readStore().connections.find((entry) => entry.id === id) || null;
    },

    upsertConnection,

    removeConnection
  };
};

module.exports = {
  createConnectionService,
  normalizeConnection
};
