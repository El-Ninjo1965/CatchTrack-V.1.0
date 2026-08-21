'use strict';

/**
 * Login Rate Limiter (brute-force protection)
 *
 * Tracks failed login attempts per identifier (username+ip combination) in
 * process memory. This is sufficient for a single-instance deployment today.
 *
 * FOR LATER: because state lives in process RAM, running multiple
 * application instances behind a load balancer means each instance tracks
 * attempts independently, weakening the effective limit. When horizontal
 * scaling is activated, this counter should move behind the same kind of
 * shared-store adapter used for sessions (see server/services/session-store.js)
 * so limits are enforced consistently across instances.
 */

const attempts = new Map();

const keyFor = (identifier, ip) => `${String(identifier || '').toLowerCase()}::${String(ip || 'unknown')}`;

const config = require('../config').auth.loginRateLimit;

const isLocked = (identifier, ip) => {
  const key = keyFor(identifier, ip);
  const record = attempts.get(key);
  if (!record) {
    return false;
  }
  if (record.lockedUntil && record.lockedUntil > Date.now()) {
    return true;
  }
  return false;
};

const registerFailure = (identifier, ip) => {
  const key = keyFor(identifier, ip);
  const now = Date.now();
  const record = attempts.get(key) || { count: 0, windowStart: now, lockedUntil: 0 };

  if (now - record.windowStart > config.windowMs) {
    record.count = 0;
    record.windowStart = now;
  }

  record.count += 1;

  if (record.count >= config.maxAttempts) {
    record.lockedUntil = now + config.lockoutMs;
  }

  attempts.set(key, record);
  return {
    count: record.count,
    lockedUntil: record.lockedUntil,
    locked: record.lockedUntil > now
  };
};

const registerSuccess = (identifier, ip) => {
  const key = keyFor(identifier, ip);
  attempts.delete(key);
};

const getStatus = (identifier, ip) => {
  const key = keyFor(identifier, ip);
  const record = attempts.get(key);
  if (!record) {
    return { count: 0, locked: false, lockedUntil: 0 };
  }
  return {
    count: record.count,
    locked: record.lockedUntil > Date.now(),
    lockedUntil: record.lockedUntil
  };
};

const reset = () => attempts.clear();

module.exports = {
  isLocked,
  registerFailure,
  registerSuccess,
  getStatus,
  reset
};
