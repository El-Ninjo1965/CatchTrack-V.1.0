/*
 * Core Auth
 * Version: 1.0.0
 *
 * Central authentication and session truth for the framework.
 * This is the only auth source for user session state.
 */

(() => {
    'use strict';

    const randomUuid = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        if (typeof require === 'function' && typeof process !== 'undefined') {
            return require('crypto').randomUUID();
        }

        return `auth-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const normalizeUserRecord = (user) => {
        if (!user || typeof user !== 'object') {
            return null;
        }

        const roles = Array.isArray(user.roles)
            ? user.roles.filter(Boolean).map(String)
            : (typeof user.role === 'string' && user.role.trim()
                ? [user.role.trim()]
                : ['member']);

        const permissions = Array.isArray(user.permissions)
            ? user.permissions.filter(Boolean).map(String)
            : [];

        const safeUser = {
            id: String(user.id || ''),
            displayId: user.displayId || user.id || '',
            username: String(user.username || '').trim(),
            displayName: user.displayName || user.username || '',
            email: user.email || '',
            status: user.status || 'active',
            roles,
            permissions,
            protected: !!user.protected,
            createdAt: user.createdAt || new Date().toISOString(),
            updatedAt: user.updatedAt || new Date().toISOString(),
            schemaVersion: user.schemaVersion || 1
        };

        return safeUser;
    };

    const SESSION_STORAGE_KEY = 'catchtrack.auth.session';

    const readStoredSession = () => {
        if (typeof localStorage === 'undefined') {
            return null;
        }

        try {
            const raw = localStorage.getItem(SESSION_STORAGE_KEY);
            if (!raw) {
                return null;
            }

            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') {
                return null;
            }

            if (parsed.session && typeof parsed.session === 'object') {
                return parsed;
            }
        } catch (error) {
            // Ignore invalid persisted session payloads.
        }

        return null;
    };

    const persistStoredSession = (session, user) => {
        if (typeof localStorage === 'undefined') {
            return;
        }

        if (!session || !user) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            return;
        }

        const safeUser = normalizeUserRecord(user);
        if (!safeUser) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            return;
        }

        const payload = {
            session: {
                sessionId: session.sessionId,
                userId: session.userId,
                issuedAt: session.issuedAt,
                expiresAt: session.expiresAt,
                status: session.status || 'active'
            },
            user: safeUser
        };

        try {
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
        } catch (error) {
            // Storage is intentionally best-effort for preview mode.
        }
    };

    const restoreStoredSession = () => {
        const payload = readStoredSession();
        if (!payload || !payload.session || !payload.user) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            return false;
        }

        const session = payload.session;
        const expiresAt = session.expiresAt ? new Date(session.expiresAt).getTime() : 0;
        if (session.status !== 'active' || !session.sessionId || !session.userId || (expiresAt && expiresAt <= Date.now())) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            return false;
        }

        const user = normalizeUserRecord(payload.user);
        if (!user) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            return false;
        }

        CoreAuth.sessions.set(session.sessionId, session);
        CoreAuth.currentSession = session;
        CoreAuth.currentUser = user;

        if (window.UserModule) {
            window.UserModule.currentUser = user;
            window.UserModule.currentSession = session;
        }

        return true;
    };

    const CoreAuth = {
        initialized: false,
        sessions: new Map(),
        currentSession: null,
        currentUser: null,

        init() {
            if (this.initialized) {
                return this;
            }

            this.initialized = true;

            if (typeof localStorage !== 'undefined') {
                restoreStoredSession();
            }

            if (window.Core) {
                window.Core.emit('auth:initialized', {
                    timestamp: new Date().toISOString()
                });
            }

            return this;
        },

        getUserModule() {
            return window.UserModule || null;
        },

        resolveBootstrapConfig() {
            const configManager = window.ConfigManager && typeof window.ConfigManager.get === 'function'
                ? window.ConfigManager.get('bootstrap', {})
                : {};

            const bootstrapConfig = configManager && typeof configManager === 'object' ? configManager : {};
            const username = typeof bootstrapConfig.developerUsername === 'string' && bootstrapConfig.developerUsername.trim()
                ? bootstrapConfig.developerUsername.trim()
                : 'developer';

            const envPassword = (typeof process !== 'undefined' && process && process.env && typeof process.env.CORE_BOOTSTRAP_PASSWORD === 'string')
                ? process.env.CORE_BOOTSTRAP_PASSWORD
                : '';

            const password = typeof bootstrapConfig.developerPassword === 'string' && bootstrapConfig.developerPassword.trim()
                ? bootstrapConfig.developerPassword
                : (envPassword || (typeof localStorage !== 'undefined' ? localStorage.getItem('core.bootstrap.developerPassword') || '' : ''));

            return {
                username,
                password,
                passwordRequired: bootstrapConfig.passwordRequired !== false,
                enabled: bootstrapConfig.enabled !== false
            };
        },

        setDeveloperPassword(password) {
            const normalized = String(password || '').trim();
            if (!normalized) {
                return {
                    ok: false,
                    code: 'INVALID_PASSWORD',
                    message: 'Developer password must not be empty.'
                };
            }

            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('core.bootstrap.developerPassword', normalized);
            }

            if (window.ConfigManager && typeof window.ConfigManager.get === 'function') {
                const current = window.ConfigManager.get('bootstrap', {}) || {};
                window.ConfigManager.set('bootstrap', {
                    ...current,
                    developerPassword: normalized,
                    passwordRequired: true,
                    passwordSource: 'local-storage'
                });
            }

            return {
                ok: true,
                code: 'DEVELOPER_PASSWORD_SET',
                data: { password: normalized }
            };
        },

        async login(credentialsOrUserId) {
            const input = credentialsOrUserId && typeof credentialsOrUserId === 'object'
                ? credentialsOrUserId
                : { userId: credentialsOrUserId };

            const userModule = this.getUserModule();
            if (!userModule) {
                return {
                    ok: false,
                    code: 'USER_MODULE_MISSING',
                    message: 'User module is not available.'
                };
            }

            let userResult = null;
            if (typeof input.userId === 'string' && input.userId.trim()) {
                userResult = await userModule.getUserById(input.userId);
            } else if (typeof input.username === 'string' && input.username.trim()) {
                userResult = await userModule.getUserByUsername(input.username);
            }

            const user = userResult && userResult.ok ? userResult.data : null;

            if (!user || user.status !== 'active') {
                if (window.Core) {
                    window.Core.emit('auth:login-failed', {
                        reason: 'INVALID_USER',
                        supplied: input
                    });
                }

                return {
                    ok: false,
                    code: 'INVALID_USER',
                    message: 'User is not valid or not active.'
                };
            }

            const bootstrapConfig = this.resolveBootstrapConfig();
            if (bootstrapConfig.enabled && user.username === bootstrapConfig.username && bootstrapConfig.passwordRequired) {
                const expectedPassword = bootstrapConfig.password;
                const givenPassword = typeof input.password === 'string' ? input.password : '';
                if (!expectedPassword) {
                    return {
                        ok: false,
                        code: 'PASSWORD_REQUIRED',
                        message: 'Set a local bootstrap password before testing the developer login.'
                    };
                }
                if (givenPassword !== expectedPassword) {
                    return {
                        ok: false,
                        code: 'INVALID_PASSWORD',
                        message: 'Developer password is invalid.'
                    };
                }
            }

            const sessionId = randomUuid();
            const session = {
                sessionId,
                userId: user.id,
                issuedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + (60 * 60 * 1000)).toISOString(),
                status: 'active',
                authContext: {
                    source: 'core-auth',
                    method: 'id'
                }
            };

            this.sessions.set(sessionId, session);
            this.currentSession = session;
            this.currentUser = normalizeUserRecord(user);
            persistStoredSession(session, this.currentUser);

            if (window.UserModule) {
                window.UserModule.currentUser = this.currentUser;
                window.UserModule.currentSession = session;
            }

            if (window.Core) {
                window.Core.emit('auth:authenticated', {
                    userId: user.id,
                    sessionId,
                    timestamp: new Date().toISOString()
                });
            }

            return {
                ok: true,
                code: 'AUTHENTICATED',
                data: {
                    user: this.currentUser,
                    session
                }
            };
        },

        async logout(sessionId = null) {
            const activeSession = sessionId
                ? this.sessions.get(sessionId) || this.currentSession
                : this.currentSession;

            if (activeSession && this.sessions.has(activeSession.sessionId)) {
                this.sessions.delete(activeSession.sessionId);
            }

            const previousUser = this.currentUser;
            this.currentSession = null;
            this.currentUser = null;

            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(SESSION_STORAGE_KEY);
            }

            if (window.UserModule) {
                window.UserModule.currentUser = null;
                window.UserModule.currentSession = null;
            }

            if (window.Core) {
                window.Core.emit('auth:logout', {
                    userId: previousUser ? previousUser.id : null,
                    sessionId: activeSession ? activeSession.sessionId : null,
                    timestamp: new Date().toISOString()
                });
            }

            return {
                ok: true,
                code: 'LOGGED_OUT',
                data: {
                    userId: previousUser ? previousUser.id : null,
                    sessionId: activeSession ? activeSession.sessionId : null
                }
            };
        },

        getCurrentUser() {
            if (!this.currentUser) {
                return null;
            }

            return {
                ...this.currentUser,
                roles: [...this.currentUser.roles],
                permissions: [...this.currentUser.permissions]
            };
        },

        getCurrentSession() {
            return this.currentSession ? { ...this.currentSession } : null;
        },

        isAuthenticated() {
            return !!this.currentSession && this.currentSession.status === 'active';
        },

        async requireAuth() {
            if (!this.isAuthenticated()) {
                return {
                    ok: false,
                    code: 'NOT_AUTHENTICATED',
                    message: 'User is not authenticated.'
                };
            }

            return {
                ok: true,
                code: 'AUTHENTICATED',
                data: this.getCurrentUser()
            };
        },

        listSessions() {
            return Array.from(this.sessions.values()).map((session) => ({ ...session }));
        }
    };

    const moduleManifest = Object.freeze({
        id: 'core-auth',
        name: 'Core Auth',
        version: '1.0.0',
        type: 'framework',
        description: 'Central authentication and session truth for the framework.',
        dependencies: ['core-user'],
        permissions: ['framework:read', 'auth:read', 'auth:write'],
        capabilities: ['authentication', 'session'],
        source: 'Core/core-auth.js'
    });

    if (!Array.isArray(window.FrameworkModuleCatalog)) {
        window.FrameworkModuleCatalog = [];
    }

    if (!window.FrameworkModuleCatalog.some((entry) => entry && entry.id === moduleManifest.id)) {
        window.FrameworkModuleCatalog.push(moduleManifest);
    }

    if (!window.CoreAuth) {
        window.CoreAuth = CoreAuth;
    }

    if (!window.AuthModule) {
        window.AuthModule = CoreAuth;
    }
})();
