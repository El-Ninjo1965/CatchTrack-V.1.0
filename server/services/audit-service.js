'use strict';

const persistenceService = require('./persistence-service');

const log = (action, resource, resourceId, actor, details = {}, result = 'success') => {
  try {
    const auditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      resource,
      resourceId,
      actor: actor || 'system',
      details,
      result
    };

    const auditLog = persistenceService.readJsonFile('audit-log.json', { entries: [] });
    if (!Array.isArray(auditLog.entries)) {
      auditLog.entries = [];
    }

    auditLog.entries.push(auditEntry);

    // Keep only last 1000 entries to avoid huge files
    if (auditLog.entries.length > 1000) {
      auditLog.entries = auditLog.entries.slice(-1000);
    }

    persistenceService.writeJsonFile('audit-log.json', auditLog);
    return auditEntry;
  } catch (error) {
    console.error('[audit-service] Failed to log audit entry:', error.message);
    return null;
  }
};

const getLog = (filters = {}) => {
  try {
    const auditLog = persistenceService.readJsonFile('audit-log.json', { entries: [] });
    let entries = Array.isArray(auditLog.entries) ? auditLog.entries : [];

    if (filters.action) {
      entries = entries.filter((e) => e.action === filters.action);
    }
    if (filters.resource) {
      entries = entries.filter((e) => e.resource === filters.resource);
    }
    if (filters.actor) {
      entries = entries.filter((e) => e.actor === filters.actor);
    }
    if (filters.result) {
      entries = entries.filter((e) => e.result === filters.result);
    }
    if (filters.since) {
      entries = entries.filter((e) => new Date(e.timestamp) >= new Date(filters.since));
    }

    return entries;
  } catch (error) {
    console.error('[audit-service] Failed to read audit log:', error.message);
    return [];
  }
};

module.exports = {
  log,
  getLog,
  actions: {
    USER_CREATED: 'user.created',
    USER_UPDATED: 'user.updated',
    USER_DELETED: 'user.deleted',
    ROLE_CREATED: 'role.created',
    ROLE_UPDATED: 'role.updated',
    ROLE_DELETED: 'role.deleted',
    SETTINGS_UPDATED: 'settings.updated',
    SETUP_CHANGED: 'setup.changed',
    LOGIN_SUCCESS: 'auth.login.success',
    LOGIN_FAILURE: 'auth.login.failure',
    LOGOUT: 'auth.logout',
    SESSION_EXPIRED: 'auth.session.expired',
    RATE_LIMITED: 'auth.rate_limited'
  }
};
