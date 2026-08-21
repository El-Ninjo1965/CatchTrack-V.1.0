const path = require('node:path');

const rootDir = path.resolve(__dirname, '../..');

// AUTH_SESSION_STORE selects the SessionStore adapter used by AuthService:
//   local  -> file-backed store under config/sessions.json (default, survives restarts)
//   memory -> process-RAM store (development/test only, lost on restart)
//   shared -> reserved for a future centralized store (e.g. Redis); currently
//             falls back to the local file store with a warning so behaviour
//             stays predictable until a real shared adapter is implemented.
const authSessionStore = String(process.env.AUTH_SESSION_STORE || 'local').trim().toLowerCase();

// SERVER_MODE documents the intended deployment topology. It does not change
// runtime behaviour yet; it exists so the connection manager / server adapter
// layer and future orchestration can branch on it without guessing.
//   single  -> one Node process handles all requests (current default)
//   cluster -> reserved for future multi-process/multi-instance operation
const serverMode = String(process.env.SERVER_MODE || 'single').trim().toLowerCase();

module.exports = {
  port: Number(process.env.PORT || 3000),
  host: process.env.HOST || '127.0.0.1',
  rootDir,
  platformPath: path.join(rootDir, 'platform'),
  appPath: path.join(rootDir, 'app'),
  webRootDir: path.join(rootDir, 'webroot'),
  testsPath: path.join(rootDir, 'tests'),
  apiBase: '/api',
  auth: {
    sessionStore: authSessionStore,
    sessionTtlMs: Number(process.env.AUTH_SESSION_TTL_MS || 1000 * 60 * 60 * 12), // 12h default
    sessionRenewThresholdMs: Number(process.env.AUTH_SESSION_RENEW_THRESHOLD_MS || 1000 * 60 * 30), // renew when <30min left
    cookieName: process.env.AUTH_SESSION_COOKIE_NAME || 'neutral_session',
    csrfCookieName: process.env.AUTH_CSRF_COOKIE_NAME || 'neutral_csrf',
    csrfHeaderName: 'x-csrf-token',
    secureCookies: process.env.NODE_ENV === 'production',
    sameSite: process.env.AUTH_COOKIE_SAMESITE || 'Lax',
    loginRateLimit: {
      maxAttempts: Number(process.env.AUTH_LOGIN_MAX_ATTEMPTS || 5),
      windowMs: Number(process.env.AUTH_LOGIN_WINDOW_MS || 1000 * 60 * 15), // 15 min window
      lockoutMs: Number(process.env.AUTH_LOGIN_LOCKOUT_MS || 1000 * 60 * 15) // 15 min lockout
    }
  },
  server: {
    mode: serverMode
  },
  database: {
    type: String(process.env.DB_TYPE || process.env.DATABASE_TYPE || process.env.MYSQL_TYPE || 'mysql').trim().toLowerCase() || 'mysql',
    host: process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
    name: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'neutral',
    username: process.env.MYSQL_USER || process.env.DB_USER || process.env.MYSQL_USERNAME || '',
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
    charset: process.env.MYSQL_CHARSET || 'utf8mb4',
    connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
    queueLimit: Number(process.env.MYSQL_QUEUE_LIMIT || 0),
    ssl: String(process.env.MYSQL_SSL || 'false').trim().toLowerCase() === 'true',
    allowLocalFallback: String(process.env.DB_ALLOW_LOCAL_FALLBACK || 'true').trim().toLowerCase() !== 'false'
  },
  provider: {
    defaultType: String(process.env.PROVIDER_TYPE || 'local').trim().toLowerCase() || 'local',
    activeProviderId: process.env.ACTIVE_PROVIDER_ID || 'local-provider'
  }
};
