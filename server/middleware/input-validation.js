'use strict';

/**
 * Input Validation Middleware
 * Validates JSON payloads against schema definitions
 */

const validateSetupPayload = (payload) => {
  const errors = [];

  if (payload.appName && typeof payload.appName !== 'string') {
    errors.push('appName must be a string');
  }

  if (payload.configuration) {
    if (typeof payload.configuration !== 'object') {
      errors.push('configuration must be an object');
    }
    if (payload.configuration.serverUrl && typeof payload.configuration.serverUrl !== 'string') {
      errors.push('configuration.serverUrl must be a string');
    }
    if (payload.configuration.apiBase && typeof payload.configuration.apiBase !== 'string') {
      errors.push('configuration.apiBase must be a string');
    }
  }

  if (payload.currentStep && typeof payload.currentStep !== 'string') {
    errors.push('currentStep must be a string');
  }

  return errors;
};

const validateDatabasePayload = (payload) => {
  const errors = [];

  const validTypes = ['mysql', 'postgresql', 'sqlite', 'indexeddb', 'mongodb'];
  if (payload.type && !validTypes.includes(payload.type)) {
    errors.push(`type must be one of: ${validTypes.join(', ')}`);
  }

  if (payload.host && typeof payload.host !== 'string') {
    errors.push('host must be a string');
  }

  if (payload.name && typeof payload.name !== 'string') {
    errors.push('name must be a string');
  }

  if (payload.port && (typeof payload.port !== 'number' || payload.port < 1 || payload.port > 65535)) {
    errors.push('port must be a number between 1 and 65535');
  }

  if (payload.username && typeof payload.username !== 'string') {
    errors.push('username must be a string');
  }

  if (payload.password && typeof payload.password !== 'string') {
    errors.push('password must be a string');
  }

  return errors;
};

const validateUserPayload = (payload) => {
  const errors = [];

  if (!payload.username || typeof payload.username !== 'string' || payload.username.trim().length < 3) {
    errors.push('username must be a non-empty string with at least 3 characters');
  }

  if (!payload.email || typeof payload.email !== 'string' || !isValidEmail(payload.email)) {
    errors.push('email must be a valid email address');
  }

  const validRoles = ['admin', 'developer', 'user', 'viewer'];
  if (!payload.role || !validRoles.includes(payload.role)) {
    errors.push(`role must be one of: ${validRoles.join(', ')}`);
  }

  if (payload.displayName && typeof payload.displayName !== 'string') {
    errors.push('displayName must be a string');
  }

  if (payload.status && !['active', 'inactive', 'pending', 'archived'].includes(payload.status)) {
    errors.push('status must be one of: active, inactive, pending, archived');
  }

  if (payload.permissions && !Array.isArray(payload.permissions)) {
    errors.push('permissions must be an array');
  }

  return errors;
};

const validateRolePayload = (payload) => {
  const errors = [];

  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 3) {
    errors.push('name must be a non-empty string with at least 3 characters');
  }

  if (payload.description && typeof payload.description !== 'string') {
    errors.push('description must be a string');
  }

  if (!Array.isArray(payload.permissions)) {
    errors.push('permissions must be an array');
  }

  return errors;
};

const validateSettingsPayload = (payload) => {
  const errors = [];

  if (payload.appName && typeof payload.appName !== 'string') {
    errors.push('appName must be a string');
  }

  if (payload.settings && typeof payload.settings !== 'object') {
    errors.push('settings must be an object');
  }

  return errors;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateSetupPayload,
  validateDatabasePayload,
  validateUserPayload,
  validateRolePayload,
  validateSettingsPayload,
  isValidEmail
};
