(() => {
  'use strict';

  const STORAGE_KEYS = {
    developerPassword: 'platform.local.auth.developerPassword',
    developerUsername: 'platform.local.auth.developerUsername',
    setupComplete: 'platform.local.auth.setupComplete'
  };

  const normalizeUsername = (value) => String(value || '').trim().toLowerCase();

  const getBootstrapSnapshot = () => {
    const config = window.ConfigManager && typeof window.ConfigManager.get === 'function'
      ? (window.ConfigManager.get('bootstrap', {}) || {})
      : {};

    const username = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEYS.developerUsername)
      ? localStorage.getItem(STORAGE_KEYS.developerUsername)
      : (typeof config.developerUsername === 'string' && config.developerUsername.trim() ? config.developerUsername.trim() : 'developer');

    const password = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEYS.developerPassword)
      ? localStorage.getItem(STORAGE_KEYS.developerPassword)
      : (typeof config.developerPassword === 'string' ? config.developerPassword : '');

    return {
      username: String(username || 'developer').trim() || 'developer',
      password: String(password || '').trim(),
      displayId: typeof config.developerDisplayId === 'string' && config.developerDisplayId.trim()
        ? config.developerDisplayId.trim()
        : 'USR-000001',
      enabled: config.enabled !== false,
      passwordRequired: config.passwordRequired !== false
    };
  };

  const syncBootstrapConfig = (password, username = 'developer') => {
    const normalizedUsername = String(username || 'developer').trim() || 'developer';
    const normalizedPassword = String(password || '').trim();
    const nextState = {
      enabled: true,
      developerUsername: normalizedUsername,
      developerDisplayId: 'USR-000001',
      developerPassword: normalizedPassword,
      passwordRequired: true,
      passwordSource: 'local-auth'
    };

    if (window.ConfigManager && typeof window.ConfigManager.get === 'function') {
      const current = window.ConfigManager.get('bootstrap', {}) || {};
      window.ConfigManager.set('bootstrap', {
        ...current,
        ...nextState
      });
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('core.bootstrap.developerPassword', normalizedPassword);
      localStorage.setItem('core.bootstrap.developerUsername', normalizedUsername);
      localStorage.setItem(STORAGE_KEYS.developerPassword, normalizedPassword);
      localStorage.setItem(STORAGE_KEYS.developerUsername, normalizedUsername);
    }

    return nextState;
  };

  const LocalAuth = {
    STORAGE_KEYS,

    isSetupComplete() {
      if (typeof localStorage === 'undefined') {
        return false;
      }
      return localStorage.getItem(STORAGE_KEYS.setupComplete) === 'true';
    },

    markSetupComplete(value = true) {
      if (typeof localStorage === 'undefined') {
        return false;
      }
      localStorage.setItem(STORAGE_KEYS.setupComplete, String(!!value));
      return true;
    },

    getStoredPassword() {
      if (typeof localStorage === 'undefined') {
        return '';
      }
      return localStorage.getItem(STORAGE_KEYS.developerPassword) || '';
    },

    setDeveloperPassword(password, username = 'developer') {
      const normalizedPassword = String(password || '').trim();
      if (!normalizedPassword) {
        return { ok: false, code: 'INVALID_PASSWORD', message: 'A developer password is required.' };
      }

      syncBootstrapConfig(normalizedPassword, username);

      if (window.CoreAuth && typeof window.CoreAuth.setDeveloperPassword === 'function') {
        return window.CoreAuth.setDeveloperPassword(normalizedPassword);
      }

      return { ok: true, code: 'DEVELOPER_PASSWORD_SET', message: 'Developer password saved locally.' };
    },

    async ensureDeveloperUser() {
      if (!window.UserModule || typeof window.UserModule.bootstrapDeveloperUser !== 'function') {
        return { ok: false, code: 'USER_MODULE_MISSING', message: 'User module is not available.' };
      }

      const result = window.UserModule.bootstrapDeveloperUser();
      if (result && result.ok) {
        return result;
      }

      return { ok: false, code: 'DEVELOPER_ACCOUNT_UNAVAILABLE', message: 'Developer user could not be prepared.' };
    },

    async login(credentials = {}) {
      const username = String(credentials.username || 'developer').trim();
      const password = String(credentials.password || '').trim();

      if (!username || !password) {
        return { ok: false, code: 'INVALID_CREDENTIALS', message: 'Username and password are required.' };
      }

      if (!window.UserModule || typeof window.UserModule.login !== 'function') {
        return { ok: false, code: 'USER_MODULE_MISSING', message: 'User module is not available.' };
      }

      const existingUser = await window.UserModule.getUserByUsername(username);
      if (!existingUser || !existingUser.ok) {
        const bootstrapResult = await this.ensureDeveloperUser();
        if (!bootstrapResult.ok) {
          return bootstrapResult;
        }
      }

      const bootstrapState = getBootstrapSnapshot();
      const effectiveUsername = normalizeUsername(username) === normalizeUsername(bootstrapState.username)
        ? bootstrapState.username
        : username;
      const effectivePassword = bootstrapState.password || password;

      const loginResult = await window.UserModule.login({
        username: effectiveUsername,
        password: effectivePassword
      });

      if (!loginResult || !loginResult.ok && bootstrapState.password && bootstrapState.password !== password) {
        return await window.UserModule.login({ username: effectiveUsername, password: password });
      }

      return loginResult;
    },

    async setupDeveloper({ password, username = 'developer' } = {}) {
      const normalizedUser = String(username || 'developer').trim() || 'developer';
      const normalizedPassword = String(password || '').trim();

      if (!normalizedPassword) {
        return { ok: false, code: 'INVALID_PASSWORD', message: 'A developer password is required.' };
      }

      this.setDeveloperPassword(normalizedPassword, normalizedUser);
      const bootstrapResult = await this.ensureDeveloperUser();
      if (!bootstrapResult.ok && bootstrapResult.code !== 'DEVELOPER_BOOTSTRAP_PRESENT') {
        return bootstrapResult;
      }

      const loginResult = await this.login({ username: normalizedUser, password: normalizedPassword });
      if (loginResult && loginResult.ok) {
        this.markSetupComplete(true);
      }

      return loginResult || { ok: true, code: 'DEVELOPER_SETUP_COMPLETE', message: 'Developer account is ready.' };
    }
  };

  if (!window.LocalAuth) {
    window.LocalAuth = LocalAuth;
  }
})();
