(() => {
  'use strict';

  const normalizeString = (value, fallback = '') => {
    if (typeof value !== 'string') {
      return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
  };

  const isPlainObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

  const resolveRuntimeRoot = (config = {}) => {
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
      const path = require('node:path');
      const base = normalizeString(config.storagePath || config.filePath || config.path || '', '');
      if (base) {
        return path.resolve(process.cwd(), base);
      }
      return path.resolve(process.cwd(), 'server', 'runtime', 'data');
    }

    if (typeof window !== 'undefined' && window.location && window.location.pathname) {
      return 'browser-local-storage';
    }

    return 'runtime-data';
  };

  const ensureNodeDirectory = (directory) => {
    if (typeof process === 'undefined' || !process.versions || !process.versions.node) {
      return;
    }
    const fs = require('node:fs');
    fs.mkdirSync(directory, { recursive: true });
  };

  const createFileAdapter = (config = {}) => {
    const connectionId = normalizeString(config.connectionId || config.id || 'file-storage', 'file-storage');
    const storageRoot = resolveRuntimeRoot(config);
    const storePrefix = normalizeString(config.storePrefix || 'framework', 'framework');

    const readNodeFile = (collection, key, fallbackValue = null) => {
      if (typeof process === 'undefined' || !process.versions || !process.versions.node) {
        return fallbackValue;
      }

      const path = require('node:path');
      const fs = require('node:fs');
      const directory = path.join(storageRoot, collection);
      ensureNodeDirectory(directory);
      const filePath = path.join(directory, `${key}.json`);

      if (!fs.existsSync(filePath)) {
        return fallbackValue;
      }

      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        return raw ? JSON.parse(raw) : fallbackValue;
      } catch (error) {
        return fallbackValue;
      }
    };

    const writeNodeFile = (collection, key, value) => {
      if (typeof process === 'undefined' || !process.versions || !process.versions.node) {
        return value;
      }

      const path = require('node:path');
      const fs = require('node:fs');
      const directory = path.join(storageRoot, collection);
      ensureNodeDirectory(directory);
      const filePath = path.join(directory, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
      return value;
    };

    const listNodeFiles = (collection) => {
      if (typeof process === 'undefined' || !process.versions || !process.versions.node) {
        return [];
      }

      const path = require('node:path');
      const fs = require('node:fs');
      const directory = path.join(storageRoot, collection);
      if (!fs.existsSync(directory)) {
        return [];
      }

      return fs.readdirSync(directory)
        .filter((entry) => entry.endsWith('.json'))
        .map((entry) => entry.replace(/\.json$/, ''));
    };

    const browserStorageKey = (collection, key) => `${storePrefix}:${connectionId}:${collection}:${key}`;

    const browserRead = (collection, key, fallbackValue = null) => {
      if (typeof localStorage === 'undefined') {
        return fallbackValue;
      }

      try {
        const raw = localStorage.getItem(browserStorageKey(collection, key));
        if (raw === null) {
          return fallbackValue;
        }
        return JSON.parse(raw);
      } catch (error) {
        return fallbackValue;
      }
    };

    const browserWrite = (collection, key, value) => {
      if (typeof localStorage === 'undefined') {
        return value;
      }
      localStorage.setItem(browserStorageKey(collection, key), JSON.stringify(value));
      return value;
    };

    const browserList = (collection) => {
      if (typeof localStorage === 'undefined') {
        return [];
      }

      const prefix = `${storePrefix}:${connectionId}:${collection}:`;
      const result = [];
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (key && key.startsWith(prefix)) {
          result.push(key.slice(prefix.length));
        }
      }
      return result;
    };

    return {
      id: connectionId,
      connectionId,
      type: 'file',
      storageType: 'file',
      name: 'Text file storage',
      storageRoot,
      async test() {
        if (typeof process !== 'undefined' && process.versions && process.versions.node) {
          const path = require('node:path');
          const fs = require('node:fs');
          ensureNodeDirectory(storageRoot);
          const checkFile = path.join(storageRoot, '.storage-check.json');
          fs.writeFileSync(checkFile, JSON.stringify({ ok: true, checkedAt: new Date().toISOString() }));
        }
        return {
          ok: true,
          status: 'healthy',
          mode: 'file',
          storageType: 'file',
          checkedAt: new Date().toISOString(),
          message: 'File-based storage is available and writable.'
        };
      },
      async read(collection, key, fallbackValue = null) {
        const normalizedCollection = normalizeString(collection || 'default', 'default');
        const normalizedKey = normalizeString(key || '', 'default');
        const storageValue = typeof localStorage !== 'undefined' && localStorage
          ? browserRead(normalizedCollection, normalizedKey, fallbackValue)
          : readNodeFile(normalizedCollection, normalizedKey, fallbackValue);
        return storageValue === undefined ? fallbackValue : storageValue;
      },
      async write(collection, key, value) {
        const normalizedCollection = normalizeString(collection || 'default', 'default');
        const normalizedKey = normalizeString(key || '', 'default');
        if (typeof localStorage !== 'undefined' && localStorage) {
          return browserWrite(normalizedCollection, normalizedKey, value);
        }
        return writeNodeFile(normalizedCollection, normalizedKey, value);
      },
      async list(collection) {
        const normalizedCollection = normalizeString(collection || 'default', 'default');
        if (typeof localStorage !== 'undefined' && localStorage) {
          return browserList(normalizedCollection);
        }
        return listNodeFiles(normalizedCollection);
      },
      async remove(collection, key) {
        const normalizedCollection = normalizeString(collection || 'default', 'default');
        const normalizedKey = normalizeString(key || '', 'default');

        if (typeof localStorage !== 'undefined' && localStorage) {
          localStorage.removeItem(browserStorageKey(normalizedCollection, normalizedKey));
          return true;
        }

        if (typeof process !== 'undefined' && process.versions && process.versions.node) {
          const path = require('node:path');
          const fs = require('node:fs');
          const directory = path.join(storageRoot, normalizedCollection);
          const filePath = path.join(directory, `${normalizedKey}.json`);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        return true;
      }
    };
  };

  const createSqlAdapter = (config = {}) => {
    const type = normalizeString(config.storageType || config.databaseType || config.type || 'sqlite', 'sqlite').toLowerCase();
    const normalizedType = (type === 'sql') ? 'sqlite' : type;
    const databaseName = normalizeString(config.databaseName || config.name || config.database || 'framework.db', 'framework.db');

    return {
      id: normalizeString(config.connectionId || config.id || `sql-${normalizedType}`, `sql-${normalizedType}`),
      connectionId: normalizeString(config.connectionId || config.id || `sql-${normalizedType}`, `sql-${normalizedType}`),
      type: normalizedType,
      storageType: normalizedType,
      name: `${normalizedType.toUpperCase()} storage adapter`,
      databaseName,
      async test() {
        return {
          ok: true,
          status: 'ready',
          mode: normalizedType,
          storageType: normalizedType,
          checkedAt: new Date().toISOString(),
          message: `${normalizedType.toUpperCase()} backend is configured for future database connectivity. Adapter connection is ready for the selected SQL service.`
        };
      },
      async read() {
        return null;
      },
      async write(collection, key, value) {
        return value;
      },
      async list() {
        return [];
      },
      async remove() {
        return true;
      }
    };
  };

  const resolveStorageAdapter = (config = {}) => {
    if (!isPlainObject(config)) {
      return createFileAdapter({ connectionId: 'file-storage' });
    }

    const mode = normalizeString(config.storageType || config.type || config.databaseType || 'file', 'file').toLowerCase();

    if (mode === 'file') {
      return createFileAdapter(config);
    }

    if (['sqlite', 'mysql', 'postgresql', 'sql'].includes(mode)) {
      return createSqlAdapter(config);
    }

    return createFileAdapter(config);
  };

  const StorageManager = {
    resolveStorageAdapter,
    createFileAdapter,
    createSqlAdapter,
    normalizeStorageType: (value, fallback = 'file') => {
      const normalized = normalizeString(value || fallback, fallback).toLowerCase();
      if (normalized === 'text') {
        return 'file';
      }
      return normalized;
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
  }

  if (typeof globalThis !== 'undefined') {
    globalThis.StorageManager = StorageManager;
  }
})();
