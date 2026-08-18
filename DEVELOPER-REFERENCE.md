# Developer Reference — Neutral Framework

This document is the implementation-based reference for developers and AI agents working with this repository.  
It describes the **Neutral Framework** as it currently exists in code.

---

## A) What this framework is

### Purpose
- Provide a reusable **Core Framework** for browser-based host applications.
- Keep technical runtime concerns (startup, lifecycle, module loading, auth/access/audit, storage, diagnostics) in the core.
- Keep business/domain logic in **Application Modules** that are loaded by the core.

### Architecture boundaries
- **Core Framework** (`platform/` + runtime wiring in `webroot/` + server primitives in `server/`):
  - Runtime, lifecycle, module system, event bus, security helpers, persistence layer abstractions, auth/access/audit/user/admin services.
- **Host Application layer** (`webroot/`, `app/`):
  - UI shells and feature modules.
- **Feature Modules** (`app/modules/*`):
  - Independent functional modules with their own manifest + entry implementation.

### Core principles
- Module-first architecture.
- Event-driven coordination.
- Centralized runtime truth for auth/session/access.
- Bounded in-memory diagnostics + local persistence.
- Keep framework neutral (no domain coupling in core).

---

## B) How the core works

### Core Runtime / Context / Startup / Loader
- `CoreEntry.start()` calls `CoreRuntime.start()`.
- `CoreRuntime.start()` delegates startup to `CoreStartup.start()`, then transitions lifecycle to `READY` and `RUNNING`.
- `CoreStartup.start()` validates required components, initializes managers/services, then discovers and activates modules.
- `CoreLoader` verifies required core components and provides external module discovery + loading from manifests/scripts.
- `CoreContext` stores shared runtime context (`application`, `runtime`, `environment`) and online/offline updates.

### Lifecycle
- `CoreLifecycle` phases: `created -> initializing -> ready -> running -> stopped`.
- Invalid transitions throw explicit errors.

### Module Registry / Module Manager
- `ModuleRegistry` stores module instances (`register/get/getAll/unregister/has/clear`), performs discovery, and normalizes manifest fallback fields.
- `ModuleManager` handles module lifecycle operations:
  - `register`, `install`, `initialize`, `enable`, `disable`, `update`, `uninstall`
  - dependency checks before lifecycle steps
  - emits core events (`module:registered`, `module:activated`, etc.)

### Configuration
- Static core config in `core-config.js` (`application` + `core` version values).
- Dynamic runtime config via `ConfigManager`:
  - config groups (`app`, `bootstrap`, `database`, `api`, `modules`, `security`, `performance`, `ui`, `features`)
  - watch/notify, merge, local persistence hooks.

### Server and API
- Node HTTP server in `server/bootstrap/server.js`.
- API endpoints:
  - `/health`, `/api/health`
  - `/api/status`
  - `/api/modules` (manifest-based module listing from `app/modules/*`)
- Static serving:
  - `webroot/` assets
  - `platform/` files
  - `app/modules/` files
- Admin/dev page request guard uses `ADMIN_ACCESS_TOKEN` request header check (`x-admin-access-token`) before serving `admin.html` and `dev.html`.

### Webroot and admin/developer interfaces
- `index.html`: host shell for user application context.
- `admin.html`: administration shell.
- `dev.html`: developer diagnostics shell.
- `master-ui.js` + `user-app.js` render context-dependent UI and bind to runtime/module/auth services.

---

## C) App / module architecture

### Required module structure
Each **Application Module** should include:
1. module folder under `app/modules/<module-id>/`
2. manifest file (`module.json` or `manifest.json`)
3. entry script (default `index.js`, or `entry`/`main` from manifest)
4. exported global module object (resolvable from manifest/global name)

### Manifest expectations
- Required: `id`
- Typical fields:
  - `name`, `version`, `type`, `description`
  - `entry` or `main`
  - `dependencies`, `permissions`, `capabilities`
  - optional `globalName`, `autoload`, `lifecycle`

### Registration and loading
- Modules can be discovered from:
  - `window.FrameworkModuleCatalog`
  - server/catalog sources (`/api/modules`, optional manifest index files)
  - filesystem folder scan (`app/modules/*`) in Node-capable runtime.
- `ModuleInterface.validateManifest()` normalizes metadata.
- `ModuleManager.discoverModules()` registers modules and attempts install/initialize/enable.

### Module lifecycle
- Available -> Installed -> Enabled -> Disabled (and back to Available on uninstall).
- Supported lifecycle operations:
  - installation
  - initialization
  - activation/enabling
  - deactivation/disabling
  - update
  - removal/uninstall

### Allowed core service usage
Modules may use framework services through stable global interfaces, e.g.:
- `CoreEventBus` / `Core.emit`
- `CoreStorage`
- `DatabaseManager`
- `CoreAuth`, `CoreAccess`, `CoreAudit`
- `ConfigManager`
- `ModuleManager`, `ModuleRegistry` (when needed)

### Dependency policy
Allowed:
- explicit manifest dependencies between modules
- technical dependencies on stable core interfaces

Avoid:
- implicit cross-module coupling
- hidden global assumptions not declared in manifest
- moving host/business logic into neutral core
- direct mutation of unrelated core internals

---

## D) Isolation model

### App context
- User app (`index.html` + `user-app.js`) remains separated from admin/developer surfaces.
- Admin/developer pages have their own entry contexts and access checks.

### Connection and service scope
- Runtime services are centralized but accessed via explicit service APIs.
- Auth/access/audit are single sources of truth, reducing parallel “shadow” state.

### Data/storage separation
- Persistent technical data:
  - IndexedDB via `DatabaseManager` stores (`users`, `modules`, `logs`, `sessions`, `settings`, `cache`, `sync`)
  - `CoreStorage` for namespaced localStorage values (`core:*`)
- Module data should remain module-scoped and non-invasive.

### API and security boundaries
- Server blocks traversal with safe path resolution.
- Admin/dev static pages require server-side token check before delivery.
- Core security helper (`CoreSecurity`) handles input sanitization, origin checks, token/hash helpers.

### Cross-app dependency rules
- No uncontrolled cross-app dependencies.
- Any inter-module dependency must be explicit and validated through manifest + manager.

---

## E) GPS module in the framework

### Role
- `app/modules/gps` is a standalone **Feature Module** used as a neutral functional module.

### Interface and behavior
- Manifest-defined module (`module.json`) with `id: gps`, capabilities, and entry.
- Exposes module lifecycle methods (`install`, `initialize`, `enable`, `disable`, `uninstall`).
- Implements:
  - one-shot geolocation reads
  - watch-based tracking start/stop
  - status reporting
  - user UI rendering (`renderUserInterface`)

### Core services used
- `CoreStorage` for last known position
- `DatabaseManager` (`sync` store) for persisted position records
- `CoreAudit` for audit records
- `CoreEventBus` for GPS events

### Independence requirement
- GPS module must stay neutral and reusable.
- Do not hard-wire it to a specific business project workflow.

---

## F) Design and theme system

### Neutral standard theme
- Base visual system is in `webroot/style.css`.
- Provides generic admin/developer/user styling primitives and layout tokens.

### Core vs app design separation
- Core runtime logic is in `platform/`.
- App presentation is in `webroot/` scripts/styles.
- Feature module UI (e.g., GPS) renders into designated user app containers.

### Integrating future app-specific design
- Keep neutral framework defaults intact.
- Add app-specific themes as additive layers (new CSS or scoped overrides).
- Do not replace core runtime or module infrastructure for visual changes.

---

## G) Binding workflow for new modules

Use this sequence before integrating into any host application domain:

1. Define requirements.
2. Define module boundaries (technical scope, data scope, UI scope).
3. Verify reusable core interfaces first.
4. Create module folder, manifest, and entry implementation.
5. Integrate into registry/discovery flow.
6. Validate dependency declarations and absence of hidden dependencies.
7. Validate isolation (storage, API use, cross-module behavior).
8. Validate runtime lifecycle behavior end-to-end.
9. Validate host integration (user/admin/dev surfaces as needed).
10. Only then connect to host-domain application logic.

---

## H) AI / agent operating rules

Any AI agent working in this repository should follow these rules:

- Read the existing architecture before changing code.
- Prefer current implementation over old documents.
- Do not replace existing core structures unless objectively required.
- Do not push business/domain logic into the neutral core.
- Do not introduce new global dependencies without explicit technical justification.
- Respect existing isolation boundaries (context, storage, module, API, security).
- Build modules as self-contained and clearly bounded units.
- Reuse existing interfaces before creating new ones.
- Keep changes small, reviewable, and traceable.
- Preserve runtime lifecycle and module loading behavior.

---

## I) Handover guidance for external developers

To continue development safely:

1. Start from this reference and verify details in code.
2. Treat `platform/` as technical core; keep domain logic outside it.
3. Implement features as application modules with explicit manifests.
4. Use module lifecycle + core services rather than bypassing them.
5. Maintain security and isolation guarantees while extending functionality.

This reference is intentionally neutral so it can be reused by multiple host applications without architectural renaming or rework.

