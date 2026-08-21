'use strict';

/**
 * Session Store Adapter
 *
 * SessionStore is the abstraction between AuthService and wherever session
 * state actually lives. It intentionally exposes a small, storage-agnostic
 * interface (create/get/touch/destroy/count) so the concrete backend can be
 * swapped through configuration only, without changing AuthService.
 *
 *   AuthService -> SessionStore interface -> MemoryStore | FileStore | (future) SharedStore
 *
 * Two adapters are implemented today:
 *  - MemoryStore: process-local Map. Fast, but sessions do not survive a
 *    restart and are not visible to other processes. Development/test only.
 *  - FileStore: persists sessions as JSON under config/sessions.json. This is
 *    the current production-usable default for a single-server deployment: a
 *    restart keeps sessions alive because state lives on disk rather than in
 *    process RAM.
 *
 * Neither adapter is a true multi-instance shared store (a FileStore backed
 * by local disk does not help once instances run on different machines).
 * The interface is deliberately storage-agnostic so a later "shared" adapter
 * (e.g. Redis, a database table) can be dropped in behind the same contract
 * (create/get/touch/destroy) with only a configuration change
 * (AUTH_SESSION_STORE=shared) and no AuthService rewrite.
 */

const fs = require('node:fs');
const path = require('node:path');

const SESSION_FILE = 'sessions.json';

class MemorySessionStore {
  constructor() {
    this.kind = 'memory';
    this.sessions = new Map();
  }

  async create(session) {
    this.sessions.set(session.sessionId, { ...session });
    return { ...session };
  }

  async get(sessionId) {
    const session = this.sessions.get(sessionId);
    return session ? { ...session } : null;
  }

  async touch(sessionId, updates) {
    const existing = this.sessions.get(sessionId);
    if (!existing) {
      return null;
    }
    const next = { ...existing, ...updates };
    this.sessions.set(sessionId, next);
    return { ...next };
  }

  async destroy(sessionId) {
    return this.sessions.delete(sessionId);
  }

  async count() {
    return this.sessions.size;
  }

  async clear() {
    this.sessions.clear();
  }
}

class FileSessionStore {
  constructor({ configDir } = {}) {
    this.kind = 'file';
    this.configDir = configDir || path.join(__dirname, '../../config');
  }

  _filePath() {
    return path.join(this.configDir, SESSION_FILE);
  }

  _ensureDir() {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  _readAll() {
    try {
      this._ensureDir();
      const filePath = this._filePath();
      if (!fs.existsSync(filePath)) {
        return {};
      }
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      console.warn('[session-store] Failed to read sessions file:', error.message);
      return {};
    }
  }

  _writeAll(data) {
    try {
      this._ensureDir();
      fs.writeFileSync(this._filePath(), JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('[session-store] Failed to write sessions file:', error.message);
      return false;
    }
  }

  async create(session) {
    const all = this._readAll();
    all[session.sessionId] = { ...session };
    this._writeAll(all);
    return { ...session };
  }

  async get(sessionId) {
    const all = this._readAll();
    const session = all[sessionId];
    return session ? { ...session } : null;
  }

  async touch(sessionId, updates) {
    const all = this._readAll();
    const existing = all[sessionId];
    if (!existing) {
      return null;
    }
    const next = { ...existing, ...updates };
    all[sessionId] = next;
    this._writeAll(all);
    return { ...next };
  }

  async destroy(sessionId) {
    const all = this._readAll();
    if (!(sessionId in all)) {
      return false;
    }
    delete all[sessionId];
    this._writeAll(all);
    return true;
  }

  async count() {
    return Object.keys(this._readAll()).length;
  }

  async clear() {
    this._writeAll({});
  }
}

const instances = new Map();

/**
 * Resolve a session store instance for the given adapter kind.
 * Kinds are cached by kind+configDir so repeated calls (e.g. per request)
 * reuse the same underlying store instead of re-reading files needlessly.
 */
const resolveSessionStore = (kind = 'local', options = {}) => {
  const normalizedKind = String(kind || 'local').trim().toLowerCase();
  const cacheKey = `${normalizedKind}:${options.configDir || ''}`;

  if (instances.has(cacheKey)) {
    return instances.get(cacheKey);
  }

  let store;
  if (normalizedKind === 'memory') {
    store = new MemorySessionStore();
  } else if (normalizedKind === 'local' || normalizedKind === 'file') {
    store = new FileSessionStore(options);
  } else {
    // Unknown/unconfigured "shared" adapters fall back to the file store so
    // the application keeps working; a real shared adapter (e.g. Redis)
    // should be registered here in the future via AUTH_SESSION_STORE.
    console.warn(`[session-store] Unknown AUTH_SESSION_STORE "${kind}", falling back to local file store.`);
    store = new FileSessionStore(options);
  }

  instances.set(cacheKey, store);
  return store;
};

module.exports = {
  MemorySessionStore,
  FileSessionStore,
  resolveSessionStore,
  // Exposed for tests that need a fully isolated store without the module cache.
  _resetCache: () => instances.clear()
};
