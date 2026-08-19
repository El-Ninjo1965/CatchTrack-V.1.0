(() => {
  'use strict';

  const DEFAULT_DEVELOPER_USERNAME = 'Developer';
  const STORAGE_KEY = 'catchtrack.local.auth.v1';
  const LEGACY_STORAGE_KEYS = [
    'platform.local.auth.developerPassword',
    'platform.local.auth.developerUsername',
    'platform.local.auth.setupComplete',
    'core.bootstrap.developerPassword',
    'core.bootstrap.developerUsername'
  ];

  const normalizeUsername = (value) => String(value || '').trim();

  const readLegacyState = () => {
    if (typeof localStorage === 'undefined') {
      return { username: DEFAULT_DEVELOPER_USERNAME, password: '', setupComplete: false };
    }

    const username = localStorage.getItem('platform.local.auth.developerUsername')
      || localStorage.getItem('core.bootstrap.developerUsername')
      || DEFAULT_DEVELOPER_USERNAME;
    const password = localStorage.getItem('platform.local.auth.developerPassword')
      || localStorage.getItem('core.bootstrap.developerPassword')
      || '';
    const setupComplete = localStorage.getItem('platform.local.auth.setupComplete') === 'true';

    return {
      username: normalizeUsername(username) || DEFAULT_DEVELOPER_USERNAME,
      password: String(password || '').trim(),
      setupComplete: !!setupComplete
    };
  };

  const writeState = (state) => {
    const nextState = {
      username: normalizeUsername(state && state.username) || DEFAULT_DEVELOPER_USERNAME,
      password: String(state && state.password ? state.password : '').trim(),
      setupComplete: !!(state && state.setupComplete),
      updatedAt: new Date().toISOString()
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      localStorage.setItem('platform.local.auth.developerUsername', nextState.username);
      localStorage.setItem('platform.local.auth.developerPassword', nextState.password);
      localStorage.setItem('platform.local.auth.setupComplete', String(nextState.setupComplete));
      localStorage.setItem('core.bootstrap.developerUsername', nextState.username);
      localStorage.setItem('core.bootstrap.developerPassword', nextState.password);
    }

    return nextState;
  };

  const clearLegacyState = () => {
    if (typeof localStorage === 'undefined') {
      return;
    }

    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem(STORAGE_KEY);
  };

  const syncBootstrapConfig = (password, username = DEFAULT_DEVELOPER_USERNAME) => {
    const normalizedUsername = normalizeUsername(username) || DEFAULT_DEVELOPER_USERNAME;
    const normalizedPassword = String(password || '').trim();
    const nextState = {
      enabled: true,
      developerUsername: normalizedUsername,
      developerDisplayId: 'USR-000001',
      developerPassword: normalizedPassword,
      passwordRequired: true,
      passwordSource: 'local-offline'
    };

    if (window.ConfigManager && typeof window.ConfigManager.get === 'function') {
      const current = window.ConfigManager.get('bootstrap', {}) || {};
      window.ConfigManager.set('bootstrap', {
        ...current,
        ...nextState
      });
    }

    writeState({
      username: normalizedUsername,
      password: normalizedPassword,
      setupComplete: !!normalizedPassword
    });

    return nextState;
  };

  const readLocalAuthState = () => {
    if (typeof localStorage === 'undefined') {
      return { username: DEFAULT_DEVELOPER_USERNAME, password: '', setupComplete: false, source: 'local-offline' };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const state = {
            username: normalizeUsername(parsed.username) || DEFAULT_DEVELOPER_USERNAME,
            password: String(parsed.password || '').trim(),
            setupComplete: !!parsed.setupComplete,
            source: 'local-offline'
          };
          if (state.password || state.setupComplete) {
            return state;
          }
        }
      }
    } catch (error) {
      // Ignore malformed persisted state and fall back to legacy or empty values.
    }

    return {
      ...readLegacyState(),
      source: 'local-offline'
    };
  };

  const LocalAuth = {
    STORAGE_KEY,
    LEGACY_STORAGE_KEYS,

    getState() {
      return readLocalAuthState();
    },

    isSetupComplete() {
      const state = this.getState();
      return !!state.setupComplete && !!state.password;
    },

    markSetupComplete(value = true) {
      const state = this.getState();
      const nextState = writeState({
        username: state.username,
        password: state.password,
        setupComplete: !!value
      });
      return !!nextState.setupComplete;
    },

    getStoredPassword() {
      return this.getState().password || '';
    },

    setDeveloperPassword(password, username = DEFAULT_DEVELOPER_USERNAME) {
      const normalizedPassword = String(password || '').trim();
      if (!normalizedPassword) {
        return { ok: false, code: 'INVALID_PASSWORD', message: 'A developer password is required.' };
      }

      const normalizedUsername = normalizeUsername(username) || DEFAULT_DEVELOPER_USERNAME;
      syncBootstrapConfig(normalizedPassword, normalizedUsername);

      if (window.CoreAuth && typeof window.CoreAuth.setDeveloperPassword === 'function') {
        return window.CoreAuth.setDeveloperPassword(normalizedPassword);
      }

      return { ok: true, code: 'DEVELOPER_PASSWORD_SET', message: 'Developer password saved locally.' };
    },

    resetDeveloperAccount() {
      clearLegacyState();

      if (window.ConfigManager && typeof window.ConfigManager.get === 'function') {
        const current = window.ConfigManager.get('bootstrap', {}) || {};
        window.ConfigManager.set('bootstrap', {
          ...current,
          developerUsername: DEFAULT_DEVELOPER_USERNAME,
          developerDisplayId: 'USR-000001',
          developerPassword: '',
          passwordRequired: true,
          passwordSource: 'local-offline',
          enabled: true
        });
      }

      if (window.UserModule && typeof window.UserModule.users !== 'undefined') {
        const affected = Array.from(window.UserModule.users.values()).filter((user) => {
          const username = String(user && user.username ? user.username : '').trim();
          const roles = Array.isArray(user && user.roles) ? user.roles.map((role) => String(role || '').trim().toLowerCase()) : [];
          return username.toLowerCase() === DEFAULT_DEVELOPER_USERNAME.toLowerCase() || roles.includes('developer');
        });

        affected.forEach((user) => window.UserModule.users.delete(user.id));
        if (typeof window.UserModule.persistUsers === 'function') {
          window.UserModule.persistUsers();
        }
      }

      return {
        ok: true,
        code: 'DEVELOPER_ACCOUNT_RESET',
        message: 'Local developer state has been cleared.'
      };
    },

    async ensureDeveloperUser() {
      if (!window.UserModule || typeof window.UserModule.bootstrapDeveloperUser !== 'function') {
        return { ok: false, code: 'USER_MODULE_MISSING', message: 'User module is not available.' };
      }

      const state = this.getState();
      const bootstrapResult = window.UserModule.bootstrapDeveloperUser();

      if (bootstrapResult && bootstrapResult.ok) {
        const currentUser = window.UserModule.getUserByUsername ? await window.UserModule.getUserByUsername(state.username || DEFAULT_DEVELOPER_USERNAME) : null;
        if (currentUser && currentUser.ok && currentUser.data) {
          return { ok: true, code: 'DEVELOPER_BOOTSTRAP_PRESENT', data: currentUser.data };
        }
        return bootstrapResult;
      }

      return { ok: false, code: 'DEVELOPER_ACCOUNT_UNAVAILABLE', message: 'Developer user could not be prepared.' };
    },

    async login(credentials = {}) {
      const username = normalizeUsername(credentials.username || DEFAULT_DEVELOPER_USERNAME);
      const password = String(credentials.password || '').trim();

      if (!username || !password) {
        return { ok: false, code: 'INVALID_CREDENTIALS', message: 'Username and password are required.' };
      }

      if (!window.UserModule || typeof window.UserModule.login !== 'function') {
        return { ok: false, code: 'USER_MODULE_MISSING', message: 'User module is not available.' };
      }

      const state = this.getState();
      const expectedUsername = normalizeUsername(state.username) || DEFAULT_DEVELOPER_USERNAME;
      const expectedPassword = String(state.password || '').trim();

      if (expectedPassword && password !== expectedPassword) {
        return { ok: false, code: 'INVALID_PASSWORD', message: 'The local developer password is invalid.' };
      }

      if (!expectedPassword) {
        return { ok: false, code: 'LOCAL_SETUP_REQUIRED', message: 'Set up the local developer account before logging in.' };
      }

      const userLookup = await window.UserModule.getUserByUsername(username || expectedUsername);
      if (!userLookup || !userLookup.ok) {
        const result = await this.ensureDeveloperUser();
        if (!result || !result.ok) {
          return result;
        }
      }

      return window.UserModule.login({
        username: username || expectedUsername,
        password
      });
    },

    async setupDeveloper({ password, username = DEFAULT_DEVELOPER_USERNAME } = {}) {
      const normalizedUser = normalizeUsername(username) || DEFAULT_DEVELOPER_USERNAME;
      const normalizedPassword = String(password || '').trim();

      if (!normalizedPassword) {
        return { ok: false, code: 'INVALID_PASSWORD', message: 'A developer password is required.' };
      }

      syncBootstrapConfig(normalizedPassword, normalizedUser);

      const bootstrapResult = await this.ensureDeveloperUser();
      if (!bootstrapResult || !bootstrapResult.ok) {
        return bootstrapResult || { ok: false, code: 'SETUP_FAILED', message: 'Developer setup could not be completed.' };
      }

      if (window.UserModule && typeof window.UserModule.getUserByUsername === 'function') {
        const userResult = await window.UserModule.getUserByUsername(normalizedUser);
        if (userResult && userResult.ok && userResult.data) {
          const current = userResult.data;
          if (!Array.isArray(current.roles) || !current.roles.includes('developer')) {
            await window.UserModule.updateUser(current.id, { roles: ['developer'] });
          }
        }
      }

      const loginResult = await this.login({ username: normalizedUser, password: normalizedPassword });
      if (loginResult && loginResult.ok) {
        this.markSetupComplete(true);
      }

      return loginResult || {
        ok: true,
        code: 'LOCAL_DEVELOPER_READY',
        message: 'Local developer account is ready.'
      };
    }
  };

  if (!window.LocalAuth) {
    window.LocalAuth = LocalAuth;
  }
})();
