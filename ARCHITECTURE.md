# Neutral Platform Architecture Baseline

This document is the technical baseline for the currently verified neutral platform. It reflects the live code structure and the interfaces that are actually present. It does not describe future domain features, product behavior, or new application logic.

## 1. Repository structure

- platform/: technical core infrastructure and reusable runtime services.
- server/: HTTP server, routing, bootstrap, and API-facing runtime behavior.
- app/: reserved for future application-level logic; not part of the current neutral runtime baseline.
- webroot/: browser-facing front-end assets and page shells.
- config/: configuration defaults and environment-driven runtime values.
- tests/: verification of neutral architecture and server health behavior.

## 2. Responsibilities by area

### platform/

Responsibility:
- Provide the neutral runtime foundation: event bus, lifecycle, configuration manager, module registry, module manager, auth, access, user, admin, storage, and startup/shutdown coordination.
- Own technical runtime state and shared framework contracts.
- Expose framework-level objects on window.

Dependencies:
- Uses browser runtime APIs and global objects.
- Depends on the module interface and eventing model.
- May use shared configuration and storage abstractions.

Public interfaces:
- Core
- CoreEventBus
- CoreErrorHandler
- CoreConfig
- ModuleInterface
- ModuleRegistry
- ModuleManager
- CoreLoader
- ConfigManager
- CoreAuth
- CoreAccess
- CoreAudit
- CoreEventRing
- UserModule
- AdminModule
- ServiceManager
- DatabaseManager
- CoreStartup
- CoreShutdown

Allowed access:
- platform -> platform only
- platform may be consumed by server and app layers at runtime
- platform must not depend on app-specific business logic

Disallowed dependencies:
- platform -> app: not allowed
- platform -> concrete domain logic: not allowed

### server/

Responsibility:
- Operate the Node HTTP server, static file serving, and HTTP API endpoints.
- Expose neutral health/status responses.
- Serve browser assets from webroot without exposing internal server logic.

Dependencies:
- server/config/index.js
- server/bootstrap/server.js
- server/api/health.js
- server/services/health-service.js

Public interfaces:
- HTTP routes on localhost port 3000 by default
- Static asset routing
- JSON API response contract

Allowed access:
- server may rely on platform configuration and runtime values when explicitly exposed to browser runtime
- server may serve webroot output and neutral health responses

Disallowed dependencies:
- server should not embed application-specific logic
- server should not own domain workflow logic

### app/

Responsibility:
- Placeholder for future application logic.
- Current code is a demo shell and UI harness, not the platform baseline itself.

Dependencies:
- app may use platform services and module APIs
- app is not part of the neutral runtime core

Public interfaces:
- browser-level UI actions and bootstrap flows in app/app-demo.js

Disallowed dependencies:
- app may not be a dependency of platform

### webroot/

Responsibility:
- Browser shell and UI pages.
- Load the neutral platform assets and interact with the server API.

Dependencies:
- Loads platform scripts before app shell logic.
- Calls server endpoints via HTTP.

Public interfaces:
- UI pages: index.html, admin.html, dev.html
- Shared browser logic: master-ui.js

Allowed access:
- webroot -> API endpoints: allowed
- webroot -> platform objects: allowed when loaded in browser

Disallowed dependencies:
- webroot -> internal server files: not allowed
- webroot -> direct internal platform source files outside the browser load path: not allowed in architecture terms

### config/

Responsibility:
- Runtime configuration defaults for the neutral platform.

Dependencies:
- Used by server/bootstrap and platform runtime components.

Public interfaces:
- config/index.js exports environment, port, host, and directory paths.

### tests/

Responsibility:
- Validate neutral baseline, static assets, health endpoints, and absence of stale architecture terms.

Dependencies:
- Node test runner and HTTP client
- server bootstrap and platform runtime

## 3. Architectural rules

The neutral platform baseline is defined as follows:

- platform/ is the technical core infrastructure.
- server/ is the HTTP and API runtime boundary.
- app/ is the future application layer and not the current baseline.
- webroot/ is browser UI only.
- config/ contains runtime configuration.
- tests/ verifies architecture, neutrality, and server behavior.

Additional rules:

- The platform must not know a concrete application domain.
- The server layer must not contain application-only logic for a future application.
- The app layer may use platform capabilities, but platform may not depend on app.
- Webroot communicates with server/API, not internal server files or framework source internals.
- The module system is framework-oriented and neutral by default.

## 4. Verified interface inventory

The following interfaces are present in the codebase and are considered the actual baseline.

### AUTH

Name: CoreAuth
Purpose: central authentication and session truth
Input: credentials object or user id; session lifecycle operations
Output: structured result objects with ok, code, data, message
Caller: UserModule, webroot UI, admin service calls
Provider: platform/core-auth.js
Notes: stores active session in memory; persists session in localStorage when available

### USER

Name: UserModule
Purpose: user management, bootstrap, current user, session delegation
Input: user object, actor, username, password, userId
Output: result objects and serialized user/session data
Caller: webroot, AdminModule, CoreAuth, app demo layer
Provider: platform/core-user.js
Notes: delegates login/logout to CoreAuth and uses CoreAccess for write checks

### ACCESS / PERMISSIONS

Name: CoreAccess
Purpose: evaluate permission checks for roles and explicit permissions
Input: subject user object, action, resource, optional context
Output: { ok, code, message, ... }
Caller: UserModule, AdminModule, UI permission checks
Provider: platform/core-access.js
Notes: permission expansion uses role-to-permission mapping with protected-resource enforcement

### CONFIG

Name: ConfigManager
Purpose: runtime configuration storage, watchers, get/set/getPath/setPath
Input: config key and value, nested path access
Output: arbitrary config values; watcher notifications
Caller: CoreStartup, CoreAuth, UserModule, webroot bootstrap flow
Provider: platform/config-manager.js
Notes: default settings are loaded at initialization time; no secrets are stored in the file-based config defaults

### MODULES

Name: ModuleRegistry
Purpose: track registered framework modules
Input: module object
Output: module object or list of module objects
Caller: ModuleManager, CoreStartup, UI module inspection
Provider: platform/module-registry.js

Name: ModuleManager
Purpose: normalize, register, validate, install, initialize, enable, disable modules
Input: module id or module object
Output: module metadata and lifecycle results
Caller: CoreStartup and browser runtime
Provider: platform/module-manager.js

Name: ModuleInterface
Purpose: manifest validation and lifecycle contract for modules
Input: module manifest definition
Output: normalized manifest and lifecycle object
Caller: ModuleRegistry and ModuleManager
Provider: platform/module-interface.js

### STORAGE

Name: DatabaseManager
Purpose: IndexedDB storage abstraction for users, modules, logs, sessions, settings, cache, sync
Input: store name, key, record, transaction mode
Output: promise-based storage operations
Caller: UserModule, ServiceManager, platform runtime components
Provider: platform/database-manager.js
Notes: browser-only IndexedDB implementation; fallback is localStorage in user module persistence

### EVENTS

Name: CoreEventBus
Purpose: publish/subscribe event-based communication between platform components
Input: event name and callback; publish payload
Output: listener callback invocation
Caller: Core, modules, admin, lifecycle
Provider: platform/core-event-bus.js

Name: CoreEventRing
Purpose: runtime event ring buffer for event tracking
Caller: framework startup and admin diagnostics
Provider: platform/core-event-ring.js

Name: CoreAudit
Purpose: audit recording for operations and diagnostics
Caller: CoreAuth, UserModule, AdminModule
Provider: platform/core-audit.js

### SERVER

Name: server bootstrap
Purpose: Node HTTP server startup and route handling
Input: incoming HTTP request
Output: static file or JSON payload
Caller: Node runtime on process startup
Provider: server/bootstrap/server.js

### API

Name: HTTP JSON endpoints
Purpose: health and runtime status exposure
Input: request path
Output: JSON response
Caller: server runtime and external clients
Provider: server/bootstrap/server.js and server/api/health.js

### WEBROOT

Name: HTML pages and UI bootstrap
Purpose: browser shell for platform interaction
Input: browser DOM events, forms, login, navigation
Output: rendered UI state and API calls
Caller: browser runtime
Provider: webroot/index.html, webroot/admin.html, webroot/dev.html, webroot/master-ui.js

## 5. Current API endpoints

The runtime server currently exposes these endpoints in the actual server bootstrap:

- GET /health
  - Returns ok, service, status, timestamp, version

- GET /api/health
  - Returns ok, service, status, timestamp, version

- GET /api/status
  - Returns environment, server, runtime metadata

- GET /api/modules
  - Returns ok and a message indicating the registry is available to runtime components

Static serving:
- /platform/... is served as static browser asset access
- /webroot/... is normalized for browser asset serving
- / is redirected to /index.html

The helper file server/api/health.js exists and contains the same health/status behavior, but the actual bootstrapped server route registration is in server/bootstrap/server.js.

## 6. Module system

### Registration

- ModuleRegistry provides register(), unregister(), get(), getAll(), has(), clear(), discover().
- Registry stores module metadata in a Map keyed by module id.
- Modules are normalized before registration via validation and dependency metadata handling.

### Discovery

- ModuleManager.discoverModules() checks the framework module catalog and optional external modules.
- CoreLoader can discover external module directories under Modules.
- ModuleRegistry.discover() also validates manifest metadata before registration.

### Activation

- ModuleInterface.create() exposes install(), initialize(), enable(), disable(), update(), uninstall(), activate(), deactivate().
- ModuleManager.install(), initialize(), enable(), disable(), update(), uninstall(), activate(), deactivate() call lifecycle methods on a resolved module.

### Permission checks

- Module manifests may include permissions and capabilities.
- CoreAccess.can() decides whether a subject can act on a resource.
- Some module discovery and UI rendering checks use permission gating.

### Lifecycle

- Lifecycle is implemented as a module-level state machine through status and active booleans.
- Actual statuses: available, installed, enabled, disabled.
- The manager validates dependencies before installing or enabling modules.

## 7. Auth / access behavior

Current actual behavior based on source:

- CoreAuth is the authoritative auth source for sessions and current user state.
- UserModule wraps user identity management and delegates login/logout to CoreAuth.
- CoreAccess evaluates action rights from user roles and explicit permissions.
- Protected resources are denied when the subject lacks a matching permission.
- The default bootstrap developer user is created from config values and local bootstrap password configuration when enabled.

Important constraints:
- There is no second auth source or session source in the verified runtime.
- User write access checks are enforced in user mutation paths.
- Role and permission expansion is centralized in CoreAccess and UserModule permission normalization.

## 8. Configuration baseline

Files and sources:

- config/index.js: exported defaults for environment, host, port, and directory paths.
- platform/core-config.js: static framework config with application name and version.
- platform/config-manager.js: runtime config manager with default sections including app, bootstrap, database, api, modules, security, performance, ui, features.

Loaded configuration:
- NODE_ENV, PORT, HOST from environment variables.
- bootstrap developer credentials and password settings from ConfigManager and localStorage.
- database defaults for IndexedDB stores.
- API base URL and timeout values.
- module auto-load settings.
- security and feature flags.

Defaults:
- application name: ApplicationCore
- application version: 1.0.0
- developer username: developer
- developer display id: USR-000001
- database type: indexeddb
- API base: http://localhost:3000/api
- session timeout: 1 hour

Access pattern:
- server bootstrap reads config values from server/config/index.js.
- browser platform reads platform config and ConfigManager values during runtime startup.
- CoreStartup initializes ConfigManager before other framework services.

No secrets are defined in the repository defaults. Passwords are runtime-local and may be set through bootstrap configuration or localStorage, not committed to the project source.

## 9. Known missing interfaces

None identified as required for the current verified platform baseline.

The code does not define a separate domain application interface, and the architecture intentionally avoids inventing one.

## 10. Rules for future development

- Keep the platform neutral and reusable.
- Add business behavior only in the application layer, not in platform.
- Keep HTTP and API concerns in server.
- Keep browser UI concerns in webroot.
- Use ModuleRegistry and ModuleManager only for framework-level module management.
- Treat the interfaces above as the stable technical contract for future work.
- Do not create new product features in this baseline document.

## 11. Architecture gates for the current baseline

Allowed:
- app -> platform
- server -> platform
- webroot -> API
- webroot -> platform browser objects when loaded as front-end assets

Not allowed:
- platform -> app
- platform -> concrete domain logic
- webroot -> internal server files
- webroot -> direct internal platform files outside the expected browser runtime contract

## 12. Baseline summary

The verified architecture is a neutral, modular platform with a clear separation between:

- runtime infrastructure
- HTTP server boundary
- browser UI shell
- runtime configuration
- framework validation and lifecycle
- user/auth/access model
- storage and event infrastructure

This is the baseline that future work must respect.
