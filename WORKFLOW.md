# CatchTrack Development Workflow

Binding workflow for repository `El-Ninjo1965/CatchTrack-V.1.0`.

## 1. Repository rules

- Repository: `El-Ninjo1965/CatchTrack-V.1.0`
- Branch: `main`
- Remote: `origin/main`
- Do not work in other repositories.
- Do not create parallel auth, setup, module, database, user, role, permission, or config systems.

## 2. Required start checks

Before changes:

- `git status`
- `git branch`
- `git log -1 --oneline`
- `git remote -v`

If branch/remote/worktree is unexpected, stop and review first.

## 3. Required document order

Read in this order when implementing or reviewing framework changes:

1. `AI-FRAMEWORK-SPEC.md`
2. `MODULE-INTEGRATION-SPEC.md`
3. `AI-MODULE-TEMPLATE.md`
4. `DEVELOPER-GUIDE.md`
5. `SERVER-APPLICATION-GUIDE.md`

Then inspect the matching code paths.

## 4. Actual architecture

### Layers

- `platform/` - neutral core/runtime
- `server/` - Node HTTP server and API layer
- `webroot/` - browser shells and shared UI runtime
- `app/` - application shell and feature modules

### Master files

- [platform/master-framework.js](/workspaces/CatchTrack-V.1.0/platform/master-framework.js)
  - neutral app, connection, setup, admin runtime, diagnostics, and feature flags
- [platform/core-auth.js](/workspaces/CatchTrack-V.1.0/platform/core-auth.js)
  - central session and auth truth
- [platform/core-user.js](/workspaces/CatchTrack-V.1.0/platform/core-user.js)
  - user identity facade on top of CoreAuth
- [platform/core-access.js](/workspaces/CatchTrack-V.1.0/platform/core-access.js)
  - role and permission evaluation
- [platform/core-admin.js](/workspaces/CatchTrack-V.1.0/platform/core-admin.js)
  - admin governance facade over the core modules
- [platform/module-registry.js](/workspaces/CatchTrack-V.1.0/platform/module-registry.js)
  - canonical module registry
- [platform/module-manager.js](/workspaces/CatchTrack-V.1.0/platform/module-manager.js)
  - module lifecycle and activation orchestration
- [platform/core-loader.js](/workspaces/CatchTrack-V.1.0/platform/core-loader.js)
  - module discovery/bootstrap loader
- [platform/database-manager.js](/workspaces/CatchTrack-V.1.0/platform/database-manager.js)
  - local IndexedDB abstraction
- [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js)
  - HTTP API, static routing, setup gating, admin shell protection
- [webroot/master-ui.js](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js)
  - shared admin/developer/setup UI logic
- [app/index.js](/workspaces/CatchTrack-V.1.0/app/index.js)
  - neutral app shell bootstrap

## 5. Data flow

### Setup

- Central setup state lives in `MasterFramework`.
- `/` serves `setup.html` while setup is not active/ready.
- `/api/setup/status` reflects the central setup snapshot.
- `/api/setup`, `/api/server/test`, `/api/database/test`, and `/api/setup/activate` update the same setup runtime.
- Setup state tracks server, database, framework, bootstrap, and installation progress in one canonical record.
- `server/runtime/` is transient runtime state only and must not be committed.

### Auth / session

- `CoreAuth` is the only auth/session source.
- `UserModule` delegates to `CoreAuth`.
- Developer/Admin/User redirect decisions are made from the current user roles.
- Logout clears the active session.

### Modules

- Discovery starts in `CoreLoader` and `ModuleRegistry`.
- `ModuleManager` owns install/initialize/enable/disable/update/uninstall flow.
- GPS in `app/modules/gps/` is the reference module and must remain discoverable through the normal path.

### Admin

- Admin UI reads live data from server APIs and runtime modules.
- Devices, Licenses, Updates, and Marketplace are backed by neutral runtime state in `MasterFramework`.
- Users, Roles, Permissions, Connections, Server, and Database use the existing core/runtime and server APIs.

### Database / connections

- `DatabaseManager` is the local browser-side store abstraction with configuration/status helpers.
- `MasterFramework` owns neutral app/connection state.
- No second database abstraction or connection registry should be added.

## 6. Forbidden duplication

Do not create parallel systems for:

- auth/session
- setup state
- module discovery or lifecycle
- user/role/permission logic
- connection management
- database management
- config loading

If a central implementation already exists, extend or correct that one.

## 7. Runtime and secrets

- Do not commit `.env` or secrets.
- Keep `server/runtime/` out of Git.
- Remove temporary runtime files after tests.
- Keep production credentials and host-specific values outside the repository.

## 8. Security rules

- Protect administrative write operations with the existing admin/runtime role flow.
- Do not add a second login/token/session mechanism.
- Do not expose secrets in UI or repository files.

## 9. Testing rules

After code changes:

- `node --check` for changed JS files
- `npm test`
- `git diff --check`

For server changes, also verify:

- `/health`
- `/api/status`
- `/api/setup/status`
- `/api/modules`
- any new or changed admin API endpoints

Do not claim browser validation unless an actual browser was used.

## 10. Open / prepared areas

These are currently prepared or local-only, not external services:

- offline sync and conflict handling
- external marketplace
- automatic internet-based update installation
- production database integration beyond the local abstractions

Do not fake these as complete backend features.

## 11. Completion rules

After a larger task, report:

- IMPLEMENTIERT
- GEÄNDERT
- GETESTET
- BEWUSST OFFEN
- GIT

Only list what was actually implemented and verified.

## 12. Commit rules

Before commit:

- review `git diff`
- run `git diff --check`
- confirm intended files only

After commit:

- push to `origin main`
- confirm `git status` is clean
- confirm the latest commit is the expected one
