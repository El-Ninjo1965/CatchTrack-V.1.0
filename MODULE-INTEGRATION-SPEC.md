# MODULE-INTEGRATION-SPEC

## English

### 1. Purpose, scope, and technical truth

This file is the binding master specification for creating, integrating, changing, validating, and removing future modules in the current neutral framework.

It is derived only from the current codebase, especially:

- [platform/](/workspaces/CatchTrack-V.1.0/platform)
- [app/](/workspaces/CatchTrack-V.1.0/app)
- [app/modules/gps/](/workspaces/CatchTrack-V.1.0/app/modules/gps)
- [server/](/workspaces/CatchTrack-V.1.0/server)
- [config/](/workspaces/CatchTrack-V.1.0/config)
- [webroot/](/workspaces/CatchTrack-V.1.0/webroot)
- [package.json](/workspaces/CatchTrack-V.1.0/package.json)
- [package-lock.json](/workspaces/CatchTrack-V.1.0/package-lock.json)

This specification does **not** describe a hypothetical framework. It documents only the framework that exists now.

If a capability is not implemented in the current code, it is marked as **not supported** or **not technically enforced**.

Important exclusions:

- Backup ZIP content is not part of the project.
- Demo2 and Legacy-Demo are not part of the project and must not be restored.
- The current technical module reference inside the repository is the GPS module in [app/modules/gps/](/workspaces/CatchTrack-V.1.0/app/modules/gps).

#### 1.0 Neutral framework additions in the current repository

The current repository now includes a neutral app and connection abstraction implemented in [platform/master-framework.js](/workspaces/CatchTrack-V.1.0/platform/master-framework.js):

- `MasterFramework` provides `registerApp()`, `activateApp()`, `registerConnection()`, `testConnection()`, `setFeatureFlag()`, `registerMigration()`, and `getDiagnostics()`.
- `AppRegistry`, `ConnectionManager`, and `FeatureFlags` are also exposed as global aliases for neutral multi-app use.
- Module manifests may declare `appId`, `apiVersion`, `mountPath`, and `requirements` when app-aware modules are needed.
- This neutral layer is intentionally domain-neutral and does not import CatchTrack-specific logic.

#### 1.1 What a module is in the current framework

In the current codebase, a module is a browser-loaded runtime unit that is:

- discovered from [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)
- described by `module.json` or `manifest.json`
- loaded by [platform/core-loader.js](/workspaces/CatchTrack-V.1.0/platform/core-loader.js)
- registered in [platform/module-registry.js](/workspaces/CatchTrack-V.1.0/platform/module-registry.js)
- lifecycle-managed by [platform/module-manager.js](/workspaces/CatchTrack-V.1.0/platform/module-manager.js)
- optionally rendered into the user shell through `renderUserInterface(container)` from [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)

A module is responsible only for its own:

- manifest
- runtime object
- lifecycle methods
- private state
- events
- storage/database records
- optional user UI fragment
- cleanup

A module is **not** the owner of:

- core startup
- server routing
- root HTML shells
- framework-wide auth/session truth
- framework-wide storage/database schemas
- framework-wide styling infrastructure

#### 1.2 Technical separation of responsibilities

| Layer | Current technical owner | Responsibility | What a standalone module must not do |
| --- | --- | --- | --- |
| Core | [platform/](/workspaces/CatchTrack-V.1.0/platform) | runtime, lifecycle, auth, access, storage, database, eventing | replace or fork core subsystems |
| Server | [server/](/workspaces/CatchTrack-V.1.0/server) | HTTP server, static serving, `/api/modules`, health/status endpoints | inject own routes without framework changes |
| Framework shell | [webroot/](/workspaces/CatchTrack-V.1.0/webroot) | root HTML, user/admin/developer shells, shared CSS | assume automatic module page or CSS mounting |
| App context | [app/](/workspaces/CatchTrack-V.1.0/app) plus `ApplicationCore` values in [platform/core-config.js](/workspaces/CatchTrack-V.1.0/platform/core-config.js) and [platform/core-context.js](/workspaces/CatchTrack-V.1.0/platform/core-context.js) | single current application shell | assume multi-app abstractions such as `appId` or per-app routing context |
| Module | `app/modules/<module-id>/` | isolated feature unit inside shared runtime | edit framework-owned files as part of plain module work |
| UI | root shells plus `renderUserInterface(container)` | visible user interaction | bypass shell and mount arbitrary standalone pages |
| Domain logic | module code only | feature-specific behavior | move app/domain logic into core/framework without explicit framework work |

#### 1.3 Standalone-module abstractions that are not enforced by the current contract

The following abstractions are **not enforced** by the current standalone module contract (i.e., the module manifest and loader do not consume them for routing, mounting, or discovery):

- no application router abstraction — URL routing is not scoped per module or per app
- no module backend contract — modules cannot register server-side routes through a manifest field
- no module stylesheet registration contract — CSS is not automatically loaded per module

Important distinction: `AppRegistry` and `ConnectionManager` **are** part of the implemented framework runtime (see section 1.0). `appId` and `mountPath` **are** normalized by `ModuleInterface.validateManifest` and stored in the manifest. However, no server-side routing or browser-side URL mounting is driven by these fields in the current codebase. Module code that uses `window.ConnectionManager` or `window.AppRegistry` is operating on an implemented API. Module code that assumes HTTP routing based on `mountPath` is assuming something not implemented.

---

### 2. Module ground structure

#### 2.1 Actual module location

The current framework discovers external application modules from:

- [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)

Each module is expected to live in its own direct child directory:

- `app/modules/<module-folder>/`

The server also exposes files from that folder tree under the HTTP path:

- `/app/modules/<module-folder>/...`

This static serving exists in [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js), but there is no dedicated module webroot contract beyond that.

#### 2.2 Required files

A loadable module directory requires:

1. a manifest file named either:
   - `module.json`, or
   - `manifest.json`
2. an entry script file referenced by the manifest:
   - `entry`, or
   - `main`, or
   - fallback `index.js`

In the current repository, the existing module uses:

- [app/modules/gps/module.json](/workspaces/CatchTrack-V.1.0/app/modules/gps/module.json)
- [app/modules/gps/index.js](/workspaces/CatchTrack-V.1.0/app/modules/gps/index.js)

#### 2.3 Optional files

Optional files that a module may technically own:

- extra JavaScript files inside its own folder, if manually loaded by the module
- static assets inside its own folder, if manually referenced through `/app/modules/<module-folder>/...`
- additional documentation files inside its own folder

What is **not** available:

- no module-local HTML auto-mount
- no module-local CSS auto-load
- no module-local server route auto-registration
- no module-local lifecycle manifest file beyond `module.json` / `manifest.json`

#### 2.4 Files that belong to the core, not to a module

The following paths are core/framework owned and are not part of a standalone module:

- [platform/](/workspaces/CatchTrack-V.1.0/platform)
- [server/](/workspaces/CatchTrack-V.1.0/server)
- [config/](/workspaces/CatchTrack-V.1.0/config)
- [webroot/](/workspaces/CatchTrack-V.1.0/webroot)
- [package.json](/workspaces/CatchTrack-V.1.0/package.json)
- [package-lock.json](/workspaces/CatchTrack-V.1.0/package-lock.json)
- [app/index.js](/workspaces/CatchTrack-V.1.0/app/index.js)
- [platform/app.js](/workspaces/CatchTrack-V.1.0/platform/app.js)

#### 2.5 Files that must not be changed by plain module work

For a normal future module, do **not** change:

- any file in [platform/](/workspaces/CatchTrack-V.1.0/platform)
- any file in [server/](/workspaces/CatchTrack-V.1.0/server)
- any file in [config/](/workspaces/CatchTrack-V.1.0/config)
- any file in [webroot/](/workspaces/CatchTrack-V.1.0/webroot)
- [package.json](/workspaces/CatchTrack-V.1.0/package.json)
- [package-lock.json](/workspaces/CatchTrack-V.1.0/package-lock.json)

Reason: the current framework has no module-only extension points for backend routing, CSS registration, HTML mounting, or dependency installation. If a requirement needs changes there, that work is a **framework change**, not a standalone module change.

#### 2.6 Binding target structure for a future module

Minimum target structure:

```text
app/modules/<module-id>/
├── module.json
└── index.js
```

Optional only when actually referenced by `index.js`:

```text
app/modules/<module-id>/
├── module.json
├── index.js
├── assets/
│   └── ...
└── docs/
    └── ...
```

There is no supported reason to create module-owned files in [platform/](/workspaces/CatchTrack-V.1.0/platform), [server/](/workspaces/CatchTrack-V.1.0/server), or [webroot/](/workspaces/CatchTrack-V.1.0/webroot) for a standalone module.

---

### 3. `module.json` contract

#### 3.1 Actual supported manifest fields

The current framework reads and/or normalizes the following manifest fields:

| Field | Type in current code | Required | Actual behavior |
| --- | --- | --- | --- |
| `id` | string | yes | Required by loader and validator |
| `name` | string | no | Defaults to `id` |
| `version` | string | no | Defaults to `"1.0.0"` |
| `type` | any truthy JSON value, practically string | no | Defaults to `"framework"` in `ModuleInterface.validateManifest` |
| `description` | string | no | Defaults to empty string |
| `entry` | string | no | Preferred entry script path |
| `main` | string | no | Secondary entry script path |
| `globalName` | string | no | Used by loader/registry/manager global lookup when present on raw manifest/catalog entry |
| `dependencies` | array | no | Truthy entries converted to strings |
| `permissions` | array | no | Truthy entries converted to strings |
| `capabilities` | array | no | Truthy entries converted to strings |
| `autoload` | boolean | no | Normalized, defaults to `true`, but not consumed anywhere else |
| `lifecycle` | object | no | Normalized, but not consumed anywhere else |
| `source` | string | no | Used by framework module catalog entries; not needed for app module folders |
| `modulePath` | string | runtime/internal | Added during discovery; not author-required |
| `manifestPath` | string | runtime/internal | Added during discovery; not author-required |

#### 3.2 Manifest fields that are normalized but not enforced for routing

The following fields are recognized and normalized by `ModuleInterface.validateManifest` and stored in the manifest object, but their intended routing or scoping behavior is **not enforced** by the current framework:

- `appId` — normalized and stored; `ModuleRegistry.getByApp(appId)` is implemented; however, app-scoped routing or isolation is not enforced
- `apiVersion` — normalized and stored; no version enforcement or negotiation is performed
- `mountPath` — normalized and stored; no HTTP routing is driven by it

The following fields are **not consumed** at all in the current code:

- `moduleId` as a separate field distinct from `id`
- `webRoot` / `webroot`
- `services` declaration blocks
- API route declaration blocks
- UI route declaration blocks
- theme declaration blocks
- design declaration blocks
- CSS registration blocks
- migration declaration blocks

Unknown extra fields may exist in JSON, but the current framework does not consume them for module loading.

#### 3.3 Field-by-field rules

##### `id`

- Type: non-empty string
- Required: yes
- Validation: `ModuleInterface.validateManifest` returns `null` when `id` is missing or blank
- Dependency use: `ModuleManager.validateDependencies` checks dependency names against registered module ids
- Error behavior:
  - invalid or missing `id` -> module is ignored during discovery
  - duplicate `id` at registry level -> registration throws

##### `name`

- Type: string
- Required: no
- Default: `id`
- Use:
  - display label in UI
  - fallback for global name resolution when `globalName` is absent

##### `version`

- Type: string
- Required: no
- Default: `"1.0.0"`
- Validation: only non-empty string check in normalization
- No semantic version parser exists

##### `type`

- Type: not strictly validated
- Required: no
- Default: `"framework"`
- Current examples:
  - `"framework"`
  - `"app"`
- Important: current code does not enforce an allowed set

##### `description`

- Type: string
- Required: no
- Default: `""`

##### `entry`

- Type: string
- Required: no
- Purpose: primary script path, relative to module root
- Fallback order:
  1. explicit loader override
  2. `entry`
  3. `main`
  4. `index.js`
- If the resolved file does not exist or cannot be read, the module is not loaded

##### `main`

- Type: string
- Required: no
- Purpose: secondary entry path
- Used only when `entry` is absent

##### `globalName`

- Type: string
- Required: no
- Purpose: tells the loader which `window` property should contain the module object
- Current usage:
  - present in [app/modules/gps/module.json](/workspaces/CatchTrack-V.1.0/app/modules/gps/module.json)
  - resolved in [platform/core-loader.js](/workspaces/CatchTrack-V.1.0/platform/core-loader.js), [platform/module-registry.js](/workspaces/CatchTrack-V.1.0/platform/module-registry.js), and [platform/module-manager.js](/workspaces/CatchTrack-V.1.0/platform/module-manager.js)
- Important: `ModuleInterface.validateManifest` does not copy `globalName` into its normalized return object, but raw manifest lookup still uses it

##### `dependencies`

- Type: array
- Required: no
- Default: `[]`
- Validation:
  - only truthy entries survive
  - entries are converted to strings
- Enforcement:
  - `ModuleManager.validateDependencies` requires that each dependency id is already in `ModuleRegistry`
- Error behavior:
  - missing dependency -> lifecycle step throws

##### `permissions`

- Type: array
- Required: no
- Default: `[]`
- Validation: truthy entries converted to strings
- Actual use in current framework:
  - UI visibility filtering in [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)
  - summary/menu visibility in [webroot/master-ui.js](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js)
- Important: permissions are **not** enforced by `ModuleManager` during registration or activation

##### `capabilities`

- Type: array
- Required: no
- Default: `[]`
- Validation: truthy entries converted to strings
- Actual use: informational only in current code

##### `autoload`

- Type: boolean
- Required: no
- Default: `true`
- Actual use: normalized only; no loader branch currently checks it
- Rule: do not rely on it

##### `lifecycle`

- Type: object
- Required: no
- Default: `{}`
- Actual use: normalized only; no loader/manager code reads its contents
- Rule: do not rely on manifest-based lifecycle configuration

##### `modulePath` and `manifestPath`

- Type: string
- Required in source file: no
- Current origin:
  - injected by loader/server
  - may appear in `/api/modules` responses
- Rule: do not hand-maintain these fields in a normal on-disk module manifest

#### 3.4 Manifest error behavior

Current behavior:

- invalid JSON in `module.json` / `manifest.json`
  - `/api/modules` silently skips the module
  - loader manifest read returns `null`
- valid manifest but missing entry script
  - loader returns `null`
- entry script loads but no discoverable global implementation exists
  - loader returns `null`
- valid module object but duplicate registry id
  - registry throws `Module already registered: <id>`

---

### 4. `index.js` / module code contract

#### 4.1 Execution model

The current framework loads module code by:

1. reading the script file as text
2. executing it through `new Function(scriptText)`
3. resolving a module object from `window`

This means:

- the entry file must be plain browser-side JavaScript
- the entry file must create a global object on `window`, directly or indirectly
- CommonJS exports (`module.exports`) are **not** used for application modules
- ESM exports (`export`, `export default`) are **not** used by the loader

#### 4.2 Required exported/global structure

A module must provide a global object discoverable by one of these names:

1. `manifest.globalName`
2. `manifest.name`
3. `manifest.id`
4. a fuzzy `window` key match that normalizes to the module id

The safest pattern is:

- set `globalName` in `module.json`
- assign the module object to exactly `window[globalName]`

#### 4.3 Expected module object shape

The framework works with a plain object. Useful properties and methods are:

- `id`
- `name`
- `version`
- `description`
- `dependencies`
- `permissions`
- `capabilities`
- `status`
- `active`
- `install()`
- `initialize()`
- `enable()`
- `disable()`
- `uninstall()`
- optional `update()`
- optional `activate()` / `deactivate()`
- optional `renderUserInterface(container)`

#### 4.4 Public methods actually consumed by the framework

- `install()` -> called by `ModuleManager.install`
- `initialize()` -> called by `ModuleManager.initialize`
- `enable()` or fallback `activate()` -> called by `ModuleManager.enable`
- `disable()` or fallback `deactivate()` -> called by `ModuleManager.disable`
- `uninstall()` -> called by `ModuleManager.uninstall`
- `update()` -> called only if someone explicitly calls `ModuleManager.update`
- `renderUserInterface(container)` -> not part of `ModuleManager`, but called by [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js) when present

#### 4.5 `ModuleInterface.create`

[platform/module-interface.js](/workspaces/CatchTrack-V.1.0/platform/module-interface.js) provides `ModuleInterface.create(definition)`.

This helper:

- validates a manifest
- creates a module object
- manages `status` and `active`
- maps hook functions:
  - `onInstall`
  - `onInitialize`
  - `onEnable`
  - `onActivate`
  - `onDisable`
  - `onDeactivate`
  - `onUpdate`
  - `onUninstall`

But this helper is optional. The GPS module does **not** use it.

#### 4.6 Status management

If a module is implemented as a plain object, it must manage its own:

- `status`
- `active`
- timers
- listeners
- watchers
- browser APIs such as `navigator.geolocation.watchPosition`

If `ModuleInterface.create` is used, `status` and `active` are updated by the helper.

#### 4.7 Return values

Important current rule:

- `ModuleManager` does **not** inspect lifecycle return values
- it only calls methods
- it does **not** `await` lifecycle methods

Consequences:

- returning `{ ok: false }` from `initialize()` does **not** stop `enable()`
- asynchronous lifecycle methods are not sequenced by the framework
- to abort discovery or activation, a lifecycle method must **throw**

This is visible in the current GPS module:

- [app/modules/gps/index.js](/workspaces/CatchTrack-V.1.0/app/modules/gps/index.js) returns `{ ok: false, code: 'GEOLOCATION_UNAVAILABLE' }` from `initialize()`
- `ModuleManager.discoverModules()` still proceeds to `enable()`

Therefore:

- lifecycle prerequisites that must block activation must throw an error
- lifecycle methods that only return status objects are informational for direct callers, not for the framework

#### 4.8 Asynchronous functions

Allowed technically:

- modules may define async methods
- modules may return Promises from non-lifecycle methods

Not supported for required lifecycle sequencing:

- `install`
- `initialize`
- `enable`
- `disable`
- `uninstall`

because `ModuleManager` does not `await` them.

#### 4.9 Allowed globals

In the current browser pages, modules can access:

- browser globals such as `window`, `document`, `navigator`, `localStorage`, `fetch`, `crypto`
- framework globals loaded by HTML script tags, including:
  - `Core`
  - `CoreEventBus`
  - `CoreErrorHandler`
  - `ErrorLog`
  - `CoreConfig`
  - `CoreContext`
  - `CoreLifecycle`
  - `CoreState`
  - `CoreStorage`
  - `ModuleInterface`
  - `ModuleRegistry`
  - `ModuleManager`
  - `CoreLoader`
  - `ConfigManager`
  - `DatabaseManager`
  - `CoreSecurity`
  - `CoreAuth`
  - `CoreAccess`
  - `CoreAudit`
  - `CoreEventRing`
  - `UserModule`
  - `AdminModule`
  - `ServiceManager`
  - `CoreStartup`
  - `CoreRuntime`
  - `CoreEntry`
  - `App`

#### 4.10 Forbidden or unsafe global behavior

Do not do the following in a standalone module:

- do not modify `window.FrameworkModuleCatalog`
- do not call `CoreLifecycle.setPhase(...)`
- do not call `CoreShutdown.stop()`
- do not call `CoreStartup.reset()`
- do not call `CoreLoader.loadModuleFromManifest(...)`
- do not call `CoreStorage.clear()`
- do not call `DatabaseManager.deleteDatabase()`
- do not call `DatabaseManager.clear(...)` on shared stores unless the store is dedicated and fully owned by the module, which is not true for current built-in stores
- do not call `CoreEventBus.clear()` globally
- do not call `CoreEventRing.clear()` globally
- do not call `CoreAudit.clear()` globally

#### 4.11 Internal state rule

The correct current pattern is:

- keep module-private state in closure variables inside `index.js`
- expose only the intended public module object on `window`

The GPS module follows this pattern for:

- `watchId`
- `tracking`
- `status`
- `lastPosition`

---

### 5. Actual module lifecycle

#### 5.1 Discovery and startup order

Current startup flow:

1. [platform/core.js](/workspaces/CatchTrack-V.1.0/platform/core.js) initializes `Core`
2. [platform/app.js](/workspaces/CatchTrack-V.1.0/platform/app.js) starts `App`
3. `App.start()` calls `CoreEntry.start()`
4. `CoreEntry.start()` calls `CoreRuntime.start()`
5. `CoreRuntime.start()` calls `CoreStartup.start()`
6. `CoreStartup.start()` initializes core services
7. `CoreStartup.start()` calls `ModuleManager.discoverModules()`
8. `ModuleManager.discoverModules()` discovers external modules
9. for each new module:
   - `register`
   - `install`
   - `initialize`
   - `enable`

#### 5.2 How external modules are discovered

In the current browser path, discovery uses:

- `/api/modules` from [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js)
- optional `window.ExternalModuleCatalog`
- optional `app/modules/modules.json`, `index.json`, or `manifest.json` if fetchable

The current server endpoint `/api/modules` returns parsed manifests from direct subdirectories of [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules).

#### 5.3 Lifecycle phases and rules

| Phase | Trigger | Purpose | Required return | Failure behavior |
| --- | --- | --- | --- | --- |
| `install` | `ModuleManager.install` and discovery | initial setup | ignored by manager | only thrown errors stop flow |
| `initialize` | `ModuleManager.initialize` and discovery | verify readiness and prepare runtime state | ignored by manager | only thrown errors stop flow |
| `enable` | `ModuleManager.enable` and discovery | activate module | ignored by manager | only thrown errors stop flow |
| `disable` | `ModuleManager.disable`, `CoreShutdown.stop` | stop listeners/watchers and deactivate | ignored by manager | thrown errors are caught by shutdown handler only during runtime stop |
| `uninstall` | `ModuleManager.uninstall` only | explicit teardown before unregister | ignored by manager | thrown errors bubble to caller |
| `activate` / `deactivate` | alias fallback only | used only if `enable` / `disable` missing | ignored by manager | same as above |
| shutdown hook | not available | none | not supported | not supported |

#### 5.4 `install`

Current meaning:

- mark module as installed
- allocate initial in-memory structures if needed
- optional audit/event emission

Current framework behavior:

- dependencies are checked before `install`
- result is ignored

#### 5.5 `initialize`

Current meaning:

- verify prerequisites
- initialize module-owned state
- optionally read storage/database

Current framework behavior:

- dependencies are checked before `initialize`
- result is ignored
- no await

Blocking rule:

- if initialization failure must prevent enable, throw

#### 5.6 `enable`

Current meaning:

- activate listeners
- start timers/watchers
- mark module active
- emit activation events

Current framework behavior:

- dependencies are checked before `enable`
- if `enable` is absent but `activate` exists, `activate` is called instead
- after call, `Core.state.activeModule` is set to the module id
- `Core` emits `module:activated`

#### 5.7 `disable`

Current meaning:

- stop timers/watchers
- unsubscribe listeners
- release volatile resources
- mark module inactive

Current framework behavior:

- if `disable` is absent but `deactivate` exists, `deactivate` is called instead
- if the module was the active module, `Core.state.activeModule` is cleared
- `Core` emits `module:deactivated`

#### 5.8 `uninstall`

Current meaning:

- explicit final cleanup
- remove module-owned storage/database data if the module is designed to do so
- leave no runtime registrations behind

Current framework behavior:

- `uninstall()` is called if present
- then `ModuleManager.unregister(moduleId)` is executed
- registry removal is in-memory only

#### 5.9 Shutdown and cleanup

There is no module-level `shutdown()` hook.

During `CoreShutdown.stop()`:

- all currently enabled/active modules are iterated
- `ModuleManager.disable(module.id)` is called
- modules are **not** uninstalled automatically

Therefore:

- transient cleanup must happen in `disable()`
- permanent removal must happen in `uninstall()`

#### 5.10 What happens on lifecycle failure

Current behavior:

- `discoverModules()` wraps `install -> initialize -> enable` in one `try/catch`
- if any of those methods throw, `CoreErrorHandler.handle(...)` is called
- the module may remain registered, depending on where the throw happened
- there is no rollback manager

Therefore a module must clean up its own partial state if it can fail after allocating resources.

---

### 6. Core integration APIs

This section lists the actual globally available APIs that a module may call, and the safety limits that follow from current code.

#### 6.1 `Core`

File: [platform/core.js](/workspaces/CatchTrack-V.1.0/platform/core.js)

Available methods:

- `getModuleRegistry()`
- `getModuleManager()`
- `getModules()`
- `on(eventName, callback)`
- `off(eventName, callback)`
- `once(eventName, callback)`
- `emit(eventName, data = null)`

Example:

```js
const unsubscribe = window.Core.on('auth:logout', () => {
  // reset module state
});
window.Core.emit('sample-module:ready', { moduleId: 'sample-module' });
unsubscribe();
```

Safety:

- requires `CoreEventBus`
- `emit` is just event publication, not authorization

#### 6.2 `ModuleRegistry`

File: [platform/module-registry.js](/workspaces/CatchTrack-V.1.0/platform/module-registry.js)

Available methods:

- `register(module)`
- `unregister(moduleId)`
- `get(moduleId)`
- `getAll()`
- `has(moduleId)`
- `clear()`
- `discover()`

Module-safe usage:

- read-only lookup with `get`, `getAll`, `has`

Do not use in standalone module logic:

- `register`
- `unregister`
- `clear`
- `discover`

Those are framework management operations.

#### 6.3 `ModuleManager`

File: [platform/module-manager.js](/workspaces/CatchTrack-V.1.0/platform/module-manager.js)

Available methods:

- `discoverModules()`
- `validateDependencies(moduleId)`
- `register(module)`
- `unregister(moduleId)`
- `get(moduleId)`
- `getAll()`
- `getStatus(moduleId)`
- `install(moduleId)`
- `initialize(moduleId)`
- `enable(moduleId)`
- `disable(moduleId)`
- `update(moduleId)`
- `uninstall(moduleId)`
- `activate(moduleId)`
- `deactivate(moduleId)`

Module-safe usage:

- `get`, `getAll`, `getStatus`
- optionally `disable(this.id)` or `enable(this.id)` from administrative tooling

Do not use inside a normal module to self-manage installation or discovery automatically.

#### 6.4 `CoreContext`

File: [platform/core-context.js](/workspaces/CatchTrack-V.1.0/platform/core-context.js)

Available methods:

- `get()`
- `setRuntimeValue(key, value)`
- `updateOnlineState()`

Module-safe usage:

- `get()` for read access

Unsafe for normal modules:

- `setRuntimeValue(...)` changes shared runtime state

#### 6.5 `CoreLifecycle`

File: [platform/core-lifecycle.js](/workspaces/CatchTrack-V.1.0/platform/core-lifecycle.js)

Available members:

- `phases`
- `getPhase()`
- `setPhase(phase)`
- `is(phase)`

Module-safe usage:

- `getPhase()`
- `is(phase)`

Forbidden:

- `setPhase(...)` from a standalone module

#### 6.6 `CoreState`

File: [platform/core-state.js](/workspaces/CatchTrack-V.1.0/platform/core-state.js)

Available methods:

- `set(key, value)`
- `get(key, defaultValue = null)`
- `has(key)`
- `remove(key)`
- `getAll()`
- `clear()`

Example:

```js
window.CoreState.set('sample-module:mode', 'ready');
const mode = window.CoreState.get('sample-module:mode', 'idle');
window.CoreState.remove('sample-module:mode');
```

Safety:

- shared global map
- prefix keys with the module id
- do not call `clear()`

#### 6.7 `CoreStorage`

File: [platform/core-storage.js](/workspaces/CatchTrack-V.1.0/platform/core-storage.js)

Available methods:

- `set(key, value)`
- `get(key, defaultValue = null)`
- `remove(key)`
- `has(key)`
- `clear()`

Behavior:

- persists into `localStorage`
- actual stored key format is `core:${key}`

Example:

```js
window.CoreStorage.set('sample-module:lastState', { enabled: true });
const state = window.CoreStorage.get('sample-module:lastState', null);
window.CoreStorage.remove('sample-module:lastState');
```

Safety:

- keys are shared across all modules
- do not call `clear()`

#### 6.8 `DatabaseManager`

File: [platform/database-manager.js](/workspaces/CatchTrack-V.1.0/platform/database-manager.js)

Available methods:

- `init()`
- `openDatabase()`
- `createStores(db)`
- `save(storeName, data)`
- `get(storeName, key)`
- `insert(storeName, data)`
- `update(storeName, data)`
- `delete(storeName, key)`
- `clear(storeName)`
- `findByIndex(storeName, indexName, value)`
- `getAll(storeName)`
- `transaction(storeName, mode, callback)`
- `getStats()`
- `deleteDatabase()`

Current built-in stores:

- `users`
- `modules`
- `logs`
- `sessions`
- `settings`
- `cache`
- `sync`

Module-safe usage:

- `save`, `get`, `insert`, `update`, `delete`, `findByIndex`, `getAll`, `transaction`

Unsafe/destructive usage:

- `createStores(...)`
- `clear(storeName)` on shared stores
- `deleteDatabase()`

Important framework limits:

- no module store registration API
- no migration API
- no schema versioning per module
- all stores are shared

#### 6.9 `CoreEventBus`

File: [platform/core-event-bus.js](/workspaces/CatchTrack-V.1.0/platform/core-event-bus.js)

Available methods:

- `subscribe(eventName, callback)`
- `unsubscribe(eventName, callback)`
- `publish(eventName, data = null)`
- `clear(eventName)`

Example:

```js
const off = window.CoreEventBus.subscribe('sample-module:changed', (payload) => {
  console.log(payload);
});
window.CoreEventBus.publish('sample-module:changed', { ready: true });
off();
```

Safety:

- `subscribe` returns an unsubscribe closure; keep it
- listener errors are routed through `CoreErrorHandler`
- do not call `clear()` globally

#### 6.10 `CoreEventRing`

File: [platform/core-event-ring.js](/workspaces/CatchTrack-V.1.0/platform/core-event-ring.js)

Available methods:

- `init()`
- `push(namespace, payload)`
- `get(namespace = null)`
- `clear(namespace = null)`

Behavior:

- in-memory only
- bounded to 256 entries per namespace
- diagnostic only, not persistence

Module-safe usage:

- `push('sample-module', payload)`
- `get('sample-module')`

Unsafe:

- `clear()` without namespace

#### 6.11 `CoreAudit`

File: [platform/core-audit.js](/workspaces/CatchTrack-V.1.0/platform/core-audit.js)

Available methods:

- `init()`
- `record(actor, action, resource, result, metadata = {})`
- `list()`
- `clear()`

Correct signature example:

```js
window.CoreAudit.record(
  'sample-module',
  'sample-module:enable',
  'sample-module',
  'success',
  { status: 'enabled' }
);
```

Important warning from current code:

- the GPS module currently calls `CoreAudit.record(action, detail)` with only two arguments
- that call works syntactically but shifts the meaning of parameters
- future modules must use the real signature shown above

Unsafe:

- `clear()`

#### 6.12 `CoreAuth`

File: [platform/core-auth.js](/workspaces/CatchTrack-V.1.0/platform/core-auth.js)

Available methods:

- `init()`
- `getUserModule()`
- `resolveBootstrapConfig()`
- `setDeveloperPassword(password)`
- `login(credentialsOrUserId)`
- `logout(sessionId = null)`
- `getCurrentUser()`
- `getCurrentSession()`
- `getSessionStateSnapshot()`
- `serializeSessionForTransport()`
- `isAuthenticated()`
- `requireAuth()`
- `listSessions()`

Example:

```js
const auth = await window.CoreAuth.requireAuth();
if (!auth.ok) {
  return auth;
}
const user = window.CoreAuth.getCurrentUser();
```

Safety:

- this is the single session truth in current code
- do not create parallel auth state inside a module

#### 6.13 `CoreAccess`

File: [platform/core-access.js](/workspaces/CatchTrack-V.1.0/platform/core-access.js)

Available methods:

- `init()`
- `can(subject, action, resource = null, context = {})`
- `hasRole(user, role)`
- `hasPermission(user, permission)`

Example:

```js
const user = window.CoreAuth.getCurrentUser();
const access = window.CoreAccess.can(user, 'module:read', 'sample-module');
if (!access.ok) {
  throw new Error(access.message);
}
```

Safety:

- permission checks are explicit
- there is no automatic enforcement around module methods

#### 6.14 `ConfigManager`

File: [platform/config-manager.js](/workspaces/CatchTrack-V.1.0/platform/config-manager.js)

Available methods:

- `init()`
- `loadDefaultConfigs()`
- `set(key, value)`
- `get(key, defaultValue)`
- `getPath(path, defaultValue)`
- `has(key)`
- `setPath(path, value)`
- `watch(key, callback)`
- `notifyWatchers(key, newValue, oldValue)`
- `getAll()`
- `merge(newConfigs)`
- `persist(key)`
- `load(key)`

Current default top-level configs:

- `app`
- `bootstrap`
- `database`
- `api`
- `modules`
- `security`
- `performance`
- `ui`
- `features`

Module-safe usage:

- read existing config with `get` / `getPath`
- watch existing config

Limit:

- there is no config delete API
- therefore persistent module-owned config keys cannot be fully removed cleanly
- do not invent permanent module config here unless a framework change is explicitly authorized

#### 6.15 `ServiceManager`

File: [platform/service-manager.js](/workspaces/CatchTrack-V.1.0/platform/service-manager.js)

Available methods:

- `init()`
- `register(name, service)`
- `get(name)`
- `has(name)`
- `getAll()`

Current default services:

- `user`
- `auth`
- `module`
- `logging`
- `cache`

Example:

```js
const logger = window.ServiceManager.get('logging');
logger.info('Sample module enabled', 'sample-module');
```

Critical limit:

- there is no `unregister` service API
- a module-owned service cannot be removed cleanly during uninstall

Binding rule:

- consume existing services if useful
- do not register new module-private services in a standalone module that must uninstall cleanly

#### 6.16 `CoreSecurity`

File: [platform/security.js](/workspaces/CatchTrack-V.1.0/platform/security.js)

Available methods:

- `registerAllowedOrigin(origin)`
- `isOriginAllowed(origin)`
- `sanitizeText(value, options)`
- `generateToken(length = 32)`
- `hash(value)`
- `validateInput(value, options)`

Example:

```js
const safeLabel = window.CoreSecurity.sanitizeText(input, { maxLength: 120 });
```

#### 6.17 `CoreErrorHandler` and `ErrorLog`

Files:

- [platform/core-error-handler.js](/workspaces/CatchTrack-V.1.0/platform/core-error-handler.js)
- [platform/error-log.js](/workspaces/CatchTrack-V.1.0/platform/error-log.js)

Available methods:

- `CoreErrorHandler.handle(error, context = {})`
- `ErrorLog.record(error, context = {})`
- `ErrorLog.getAll()`
- `ErrorLog.clear()`

Correct module usage:

```js
try {
  // risky code
} catch (error) {
  window.CoreErrorHandler.handle(error, {
    type: 'sample-module',
    moduleId: 'sample-module'
  });
  throw error;
}
```

#### 6.18 `UserModule` and `AdminModule`

Files:

- [platform/core-user.js](/workspaces/CatchTrack-V.1.0/platform/core-user.js)
- [platform/core-admin.js](/workspaces/CatchTrack-V.1.0/platform/core-admin.js)

These are framework modules, not generic extension interfaces, but they are available globally.

Useful `UserModule` methods:

- `listUsers()`
- `getUserById(userId)`
- `getUserByUsername(username)`
- `createUser(userData, actor = null)`
- `updateUser(userId, updates = {}, actor = null)`
- `deleteUser(userId, actor = null)`
- `setStatus(userId, status, actor = null)`
- `login(credentials)`
- `logout(sessionId = null)`
- `getCurrentUser()`
- `getCurrentSession()`
- `hasRole(role)`
- `hasPermission(permission)`
- `isAdmin()`
- `isDeveloper()`

Useful `AdminModule` methods:

- `listUsers()`
- `getUserById(userId)`
- `createUser(...)`
- `updateUser(...)`
- `deleteUser(...)`
- `getCurrentUser()`
- `getAuditLog()`
- `getEventRingBuffer()`
- `getSystemStats()`
- `canAccess(subject, action, resource = null)`
- `healthCheck()`
- `getDebugInfo()`

Rule:

- use these only when the module actually needs user/admin data
- do not treat them as stable backend APIs; they are browser globals inside the current runtime

---

### 7. Storage rules

#### 7.1 Actual storage system

The current simple storage system is [platform/core-storage.js](/workspaces/CatchTrack-V.1.0/platform/core-storage.js).

It:

- uses browser `localStorage`
- prefixes every key with `core:`
- stores JSON-serialized values

#### 7.2 Correct key structure

Because storage is shared, use:

- `<module-id>:<purpose>`

Example:

- `sample-module:lastState`
- `gps:lastPosition`

#### 7.3 Allowed operations

- `set`
- `get`
- `remove`
- `has`

#### 7.4 Forbidden operation

- `clear()`

Reason:

- it deletes all framework-local keys, not just module keys

#### 7.5 Persistence and isolation

Technical truth:

- persistence exists
- hard isolation does not exist
- isolation is only by key naming discipline

#### 7.6 Neutral example

```js
const STORAGE_KEY = 'sample-module:lastState';

window.CoreStorage.set(STORAGE_KEY, {
  enabled: true,
  updatedAt: new Date().toISOString()
});

const lastState = window.CoreStorage.get(STORAGE_KEY, null);

window.CoreStorage.remove(STORAGE_KEY);
```

---

### 8. Database rules

#### 8.1 Actual database system

The current database layer is [platform/database-manager.js](/workspaces/CatchTrack-V.1.0/platform/database-manager.js).

It:

- uses IndexedDB
- database name: `CoreDB`
- version: `1`
- creates a fixed set of object stores

#### 8.2 Allowed database access

Modules may call:

- `save`
- `get`
- `insert`
- `update`
- `delete`
- `findByIndex`
- `getAll`
- `transaction`

#### 8.3 Actual store list

Current stores:

- `users`
- `modules`
- `logs`
- `sessions`
- `settings`
- `cache`
- `sync`

#### 8.4 Isolation reality

There is no module-owned store registration API.

Therefore:

- all database usage is against shared stores
- hard database isolation does not exist
- current module-safe practice is to use module-prefixed ids and payload fields inside a shared store

The GPS module currently writes to:

- store `sync`
- record ids like `gps-<timestamp>`

#### 8.5 Schema and migration rules

Actual framework truth:

- fixed stores are created in `createStores`
- no migration API exists
- no per-module schema registry exists
- no per-module version upgrade hook exists

Therefore a standalone module must not assume:

- custom object store creation
- automatic migrations
- schema installation hooks

#### 8.6 Removal rule

For clean uninstall, write records so they can later be deleted precisely.

Preferred current pattern:

- fixed ids, or
- ids and records prefixed with the module id

Avoid patterns that require clearing an entire shared store.

---

### 9. Event rules

#### 9.1 Actual event system

The framework uses:

- [platform/core-event-bus.js](/workspaces/CatchTrack-V.1.0/platform/core-event-bus.js) for publish/subscribe
- [platform/core-event-ring.js](/workspaces/CatchTrack-V.1.0/platform/core-event-ring.js) for diagnostic ring buffers

#### 9.2 Correct event naming

Use:

- `<module-id>:<event-name>`

Examples from the current GPS module:

- `gps:installed`
- `gps:initialized`
- `gps:enabled`
- `gps:disabled`
- `gps:position`
- `gps:error`

#### 9.3 Listener cleanup

Current required pattern:

- keep the unsubscribe function returned by `subscribe`
- call it in `disable()` and `uninstall()`

There is no per-module automatic cleanup.

#### 9.4 Payloads

No formal schema exists.

Use plain JSON-serializable objects when possible.

#### 9.5 Error behavior

If an event listener throws:

- `CoreEventBus.publish` catches it
- `CoreErrorHandler.handle(...)` is called

The bus does not cancel other listeners.

#### 9.6 Neutral example

```js
let offLogout = null;

function enableListeners() {
  offLogout = window.CoreEventBus.subscribe('auth:logout', () => {
    window.CoreStorage.remove('sample-module:lastState');
  });
}

function disableListeners() {
  if (offLogout) {
    offLogout();
    offLogout = null;
  }
}

window.CoreEventBus.publish('sample-module:enabled', {
  moduleId: 'sample-module'
});
```

---

### 10. Service rules

#### 10.1 Actual service manager

The service layer is [platform/service-manager.js](/workspaces/CatchTrack-V.1.0/platform/service-manager.js).

#### 10.2 Current default services

- `user`
- `auth`
- `module`
- `logging`
- `cache`

#### 10.3 Service registration

Technically available:

- `ServiceManager.register(name, service)`

But current limitation:

- there is no `unregister`

Therefore:

- standalone modules that must uninstall cleanly should **not** register new private services
- using existing services is acceptable

#### 10.4 Service lookup

Use:

```js
const logger = window.ServiceManager.get('logging');
await logger.info('Message', 'sample-module');
```

#### 10.5 Dependency rule

If a module depends on a service, that dependency is hidden unless also documented in the module specification.

Binding rule:

- a module must not rely on an undeclared hidden service dependency

#### 10.6 Error behavior

- `get(name)` throws if the service does not exist
- `register(name, service)` throws on invalid name or invalid service object

---

### 11. API and routing

#### 11.1 Actual server routes

The current server in [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js) exposes:

- `/health`
- `/api/health`
- `/api/status`
- `/api/modules`
- static files from `/platform/...`
- static files from `/app/modules/...`
- static files from [webroot/](/workspaces/CatchTrack-V.1.0/webroot)

#### 11.2 Module APIs

Current framework truth:

- there is **no** module API registration mechanism
- there is **no** manifest field that mounts API routes
- there is **no** module backend directory contract
- there is **no** request dispatch by module id

Therefore a future standalone module cannot provide its own backend API without changing server code.

That is outside the standalone module contract.

#### 11.3 Mount paths

`mountPath` is not supported.

The only current module-related HTTP path is static file serving:

- `/app/modules/<folder>/...`

#### 11.4 Root context vs module context

Current framework reality:

- root UI context = [webroot/index.html](/workspaces/CatchTrack-V.1.0/webroot/index.html), [webroot/admin.html](/workspaces/CatchTrack-V.1.0/webroot/admin.html), [webroot/dev.html](/workspaces/CatchTrack-V.1.0/webroot/dev.html)
- module context = a module object loaded into the same browser runtime and, optionally, a DOM container passed to `renderUserInterface(container)`

There is no isolated request context per module.

#### 11.5 Unknown modules

Current handling:

- invalid or unreadable manifests are skipped
- manifests with no matching global implementation are skipped
- duplicate ids are not re-registered

#### 11.6 Routing error behavior

Actual current server behavior in [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js):

- unknown or missing static file -> JSON `404` with `NOT_FOUND`
- directory traversal attempt -> JSON `403` with `FORBIDDEN`
- direct request to `/admin.html` or `/dev.html` without matching `x-admin-access-token` header and `ADMIN_ACCESS_TOKEN` environment variable -> JSON `403` with `FORBIDDEN`

There is no module-specific 404 handler or module routing fallback.

---

### 12. UI / webroot rules

#### 12.1 Actual UI entry point for modules

The current user-facing module UI entry is:

- `renderUserInterface(container)`

This is called from [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js) when the user selects an active module.

#### 12.2 How a module becomes visible in the user UI

In [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js), a module is listed when:

- it exists in `ModuleRegistry`
- it is active or `status === 'enabled'`

In [webroot/master-ui.js](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js), visibility is further filtered by permissions against the current user.

#### 12.3 Module HTML

Not supported as a standalone mounted page.

Current rule:

- build UI DOM inside `renderUserInterface(container)`
- use the provided container only

#### 12.4 Module webroot

`webRoot` / `webroot` fields are not supported in module manifests.

There is no automatic module UI asset mounting beyond static file exposure under `/app/modules/<folder>/...`.

#### 12.5 Communication with core

Actual available communication mechanisms:

- direct calls to global framework APIs
- `CoreEventBus` / `Core.emit`
- storage/database access

There is no module bridge or dedicated IPC layer.

#### 12.6 Communication with module API

Not supported, because module backend APIs are not supported.

#### 12.7 Root UI vs module UI

Current split:

- root shells live in [webroot/index.html](/workspaces/CatchTrack-V.1.0/webroot/index.html), [webroot/admin.html](/workspaces/CatchTrack-V.1.0/webroot/admin.html), and [webroot/dev.html](/workspaces/CatchTrack-V.1.0/webroot/dev.html)
- module UI is a fragment rendered inside the user shell

There is no module router.

---

### 13. Design and CSS rules

#### 13.1 Actual styling system

All current styles are in:

- [webroot/style.css](/workspaces/CatchTrack-V.1.0/webroot/style.css)

This file contains:

- core shell styles
- admin/developer styles
- user-app styles
- GPS-specific selectors

#### 13.2 Theme configuration

`ConfigManager` contains a `ui` config with:

- `theme`
- `language`
- `responsive`
- `animationsEnabled`
- `updateInterval`

But in the current code:

- no theme engine consumes those values
- no module theme registration exists

Therefore theme configuration exists only as general config data, not as an applied module theming system.

#### 13.3 Module CSS

Current framework truth:

- there is no module-local CSS registration API
- there is no manifest CSS field
- there is no automatic stylesheet injection per module

Therefore a standalone future module should:

- reuse existing neutral classes where possible
- otherwise render functional UI without assuming new stylesheet support

#### 13.4 CSS isolation

Hard CSS isolation does not exist.

If a framework change explicitly adds styles, they must be prefixed with the module id, for example:

- `.sample-module-*`

But adding such CSS requires editing [webroot/style.css](/workspaces/CatchTrack-V.1.0/webroot/style.css), which is a framework change, not normal module-only work.

#### 13.5 Core styles that must not be overridden by a standalone module

Do not modify:

- root shell selectors in [webroot/style.css](/workspaces/CatchTrack-V.1.0/webroot/style.css)
- admin shell selectors
- developer shell selectors
- user shell selectors

The GPS module should be treated as evidence that such changes happened in the current repository, not as proof that standalone module-local CSS loading exists.

---

### 14. Auth, access, and security rules

#### 14.1 Authentication

Current authentication truth:

- `CoreAuth` is the single session truth
- `UserModule.login/logout` delegate to `CoreAuth`

Binding rule:

- a module must not create its own parallel user session system

#### 14.2 Authorization

Current authorization truth:

- `CoreAccess.can(...)`
- `CoreAccess.hasPermission(...)`
- `CoreAccess.hasRole(...)`

Binding rule:

- if a module performs a protected action, it must check access explicitly

#### 14.3 Permissions in `module.json`

Current effect:

- module `permissions` influence UI visibility
- they do not automatically block method calls or activation

So permissions are not a complete security barrier by themselves.

#### 14.4 Security helpers

Use `CoreSecurity` for:

- text sanitization
- token generation
- hashing
- input validation

#### 14.5 Module isolation reality

Hard technical sandboxing does not exist.

A loaded module shares:

- the same browser global space
- the same event bus
- the same storage namespace
- the same database stores

Therefore the current framework cannot guarantee strong module isolation.

That is an architectural limitation of the current codebase.

#### 14.6 Forbidden bypasses

Do not:

- bypass `CoreAuth` with private session storage
- bypass `CoreAccess` for protected actions
- write to other modules' storage keys
- clear shared stores/buffers/logs
- directly manipulate another module's private closure state
- add cross-app rules; the current framework has no multi-app contract

---

### 15. Error handling, audit, and logging

#### 15.1 Error handling

Use:

- `CoreErrorHandler.handle(error, context)`

for runtime errors that should be recorded centrally.

#### 15.2 Error objects

Current code accepts:

- real `Error` instances
- non-Error values, which are normalized to `Error`

#### 15.3 Audit

Use:

- `CoreAudit.record(actor, action, resource, result, metadata)`

for module lifecycle and protected data actions.

#### 15.4 Logging

Available options:

- `ErrorLog.record(...)`
- `ServiceManager.get('logging')`
- `console.*` exists, but central framework logging is limited

#### 15.5 Expected direct return shapes

The current codebase uses simple result objects such as:

```js
{ ok: true, code: 'USER_CREATED', data: ... }
{ ok: false, code: 'USER_NOT_FOUND', message: '...' }
```

This shape is a repository pattern, not an enforced interface.

#### 15.6 Cleanup on error

Because there is no rollback manager:

- remove listeners
- stop timers/watchers
- revert partial module-owned state yourself

If failure must abort lifecycle, throw after cleanup.

---

### 16. Internationalization

#### 16.1 Actual i18n system

The i18n system is [platform/core-i18n.js](/workspaces/CatchTrack-V.1.0/platform/core-i18n.js).

Available methods:

- `init()`
- `t(key, params)`
- `setLocale(locale)`
- `getLocale()`
- `getStoredPreference()`
- `getSupportedLocales()`
- `getDeviceLocale()`

#### 16.2 Current locales

Supported:

- `de`
- `en`

#### 16.3 Fallback behavior

Current lookup order:

1. current locale
2. German (`de`)
3. raw key

#### 16.4 Module-specific translations

Not supported as separate module files.

There is:

- no translation registration API
- no module translation manifest field
- no dynamic merge API into `TRANSLATIONS`

Therefore standalone module-specific translation bundles are not part of the current contract.

#### 16.5 Current UI usage

The current webroot UIs mostly use hard-coded strings.

So i18n infrastructure exists, but is not yet the universal UI string source.

---

### 17. Dependencies

#### 17.1 Package dependencies

Current truth from [package.json](/workspaces/CatchTrack-V.1.0/package.json) and [package-lock.json](/workspaces/CatchTrack-V.1.0/package-lock.json):

- no runtime npm dependencies are declared
- no dev dependencies are declared
- only script: `npm start`

Binding rule:

- a standalone future module must not assume any external library is available

#### 17.2 Module dependencies

The only current formal module dependency mechanism is:

- `dependencies` array in the manifest
- checked by `ModuleManager.validateDependencies`

Dependency names must match registered module ids.

#### 17.3 Hidden dependencies

Forbidden:

- depending on undeclared globals created by another app module
- depending on manual CSS additions not documented as framework changes
- depending on extra server routes not declared in framework work

#### 17.4 External libraries

Adding an external library requires changes to:

- [package.json](/workspaces/CatchTrack-V.1.0/package.json)
- [package-lock.json](/workspaces/CatchTrack-V.1.0/package-lock.json)

That is a framework-level change, not standalone module work.

---

### 18. Naming conventions

The current framework does not enforce many naming formats in code. The table below distinguishes actual enforcement from repository convention derived from current files.

| Item | Actual code enforcement | Current repository convention |
| --- | --- | --- |
| `id` | non-empty string | lower-case kebab-case, same as folder when possible |
| folder name | direct child of `app/modules` | same as module id |
| `globalName` | optional string if used | PascalCase ending in `Module` |
| events | any string | `<module-id>:<event>` |
| storage keys | any non-empty string | `<module-id>:<purpose>` |
| database ids | store-specific | prefix with module id |
| CSS classes | no framework rule | prefix with module id |
| DOM ids | no framework rule | prefix with module id |
| functions | no framework rule | existing JS style used in surrounding file |

Important: only the left column is enforced by runtime code. The right column is the repository-safe convention.

---

### 19. Versioning and compatibility

#### 19.1 Module version

`module.json.version` is stored and displayed, but:

- no semantic version parser exists
- no compatibility gate exists

#### 19.2 Framework version

Current visible version sources:

- [package.json](/workspaces/CatchTrack-V.1.0/package.json): `1.0.0`
- [platform/core.js](/workspaces/CatchTrack-V.1.0/platform/core.js): `1.0.0`
- [platform/core-config.js](/workspaces/CatchTrack-V.1.0/platform/core-config.js): `1.0.0`

#### 19.3 API compatibility

There is no automatic compatibility matrix.

Compatibility is manual and source-based.

#### 19.4 Breaking changes

A change is breaking if it changes any of these without coordinated framework work:

- global module object name resolution
- lifecycle method names
- manifest field names used by loader/manager
- UI hook `renderUserInterface(container)`
- shared store usage assumptions

---

### 20. Module isolation

#### 20.1 What a module can technically see

A loaded module can technically access:

- all globally loaded framework objects on `window`
- the shared event bus
- shared storage
- shared IndexedDB stores
- the DOM of the loaded page

#### 20.2 What a module can technically modify

A loaded module can technically modify:

- its own global object
- shared event/state/storage/database content if it calls the APIs
- page DOM

#### 20.3 What the framework does not technically prevent

The current framework does **not** technically prevent:

- reading another module through `window`
- writing shared storage keys
- writing shared database stores
- publishing arbitrary events

Therefore hard module isolation is **not implemented**.

#### 20.4 Binding operating rule

Because hard isolation is absent, future modules must operate as if the following were mandatory:

- only touch own keys, own ids, own DOM subtree, own listeners
- only call other modules through documented, intentional globals
- never mutate other modules without explicit task scope

This is a repository operating rule, not a sandbox guarantee.

---

### 21. Module removal

To remove a module cleanly in the current framework:

1. disable it if loaded
2. uninstall it if loaded
3. stop timers/watchers/browser handles
4. unsubscribe all event listeners
5. remove all `CoreStorage` keys owned by the module
6. delete all known database records owned by the module
7. remove the module folder from [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)
8. reload the runtime

Current cleanup realities:

- module registry entries are in-memory only
- `/api/modules` stops listing the module once the folder is gone
- no service unregister API exists
- no module route registry exists
- no module CSS registry exists

Binding consequence:

- a removable standalone module must not register anything that cannot later be explicitly removed

This is why module-private `ServiceManager.register(...)` usage is disallowed for clean standalone modules.

---

### 22. Full reference module

This reference module is intentionally neutral and matches the current framework contract.

It demonstrates:

- manifest
- global module object
- synchronous lifecycle
- event usage
- storage usage
- database usage
- UI rendering
- error handling
- cleanup
- absence of unsupported API/CSS mounting

#### 22.1 Reference structure

```text
app/modules/sample-module/
├── module.json
└── index.js
```

#### 22.2 Reference `module.json`

```json
{
  "id": "sample-module",
  "name": "Sample Module",
  "version": "1.0.0",
  "type": "app",
  "description": "Neutral reference module for the current framework.",
  "entry": "index.js",
  "globalName": "SampleModule",
  "permissions": [],
  "capabilities": ["sample"],
  "dependencies": []
}
```

#### 22.3 Reference `index.js`

```js
(() => {
  'use strict';

  const MODULE_ID = 'sample-module';
  const STORAGE_KEY = `${MODULE_ID}:state`;
  const DB_STORE = 'sync';
  const DB_KEY = `${MODULE_ID}:snapshot`;

  let status = 'available';
  let active = false;
  let offLogout = null;

  const emit = (eventName, payload) => {
    if (window.CoreEventBus && typeof window.CoreEventBus.publish === 'function') {
      window.CoreEventBus.publish(eventName, payload);
    }
  };

  const audit = (action, result = 'success', metadata = {}) => {
    if (window.CoreAudit && typeof window.CoreAudit.record === 'function') {
      window.CoreAudit.record(MODULE_ID, action, MODULE_ID, result, metadata);
    }
  };

  const persistSnapshot = (snapshot) => {
    if (window.CoreStorage && typeof window.CoreStorage.set === 'function') {
      window.CoreStorage.set(STORAGE_KEY, snapshot);
    }

    if (window.DatabaseManager && typeof window.DatabaseManager.save === 'function') {
      window.DatabaseManager.save(DB_STORE, {
        id: DB_KEY,
        moduleId: MODULE_ID,
        ...snapshot
      }).catch((error) => {
        if (window.CoreErrorHandler && typeof window.CoreErrorHandler.handle === 'function') {
          window.CoreErrorHandler.handle(error, {
            type: 'sample-module:persist',
            moduleId: MODULE_ID
          });
        }
      });
    }
  };

  const removeSnapshot = () => {
    if (window.CoreStorage && typeof window.CoreStorage.remove === 'function') {
      window.CoreStorage.remove(STORAGE_KEY);
    }

    if (window.DatabaseManager && typeof window.DatabaseManager.delete === 'function') {
      window.DatabaseManager.delete(DB_STORE, DB_KEY).catch((error) => {
        if (window.CoreErrorHandler && typeof window.CoreErrorHandler.handle === 'function') {
          window.CoreErrorHandler.handle(error, {
            type: 'sample-module:cleanup',
            moduleId: MODULE_ID
          });
        }
      });
    }
  };

  const getSnapshot = () => {
    if (window.CoreStorage && typeof window.CoreStorage.get === 'function') {
      return window.CoreStorage.get(STORAGE_KEY, null);
    }
    return null;
  };

  const SampleModule = {
    id: MODULE_ID,
    name: 'Sample Module',
    version: '1.0.0',
    description: 'Neutral reference module for the current framework.',
    permissions: [],
    capabilities: ['sample'],
    dependencies: [],
    status: 'available',
    active: false,

    install() {
      status = 'installed';
      this.status = status;
      this.active = false;
      audit('sample-module:install');
      emit('sample-module:installed', { moduleId: MODULE_ID });
      return { ok: true, status };
    },

    initialize() {
      if (!window.CoreStorage) {
        throw new Error('CoreStorage is required.');
      }

      audit('sample-module:initialize');
      emit('sample-module:initialized', { moduleId: MODULE_ID });
      return { ok: true, status };
    },

    enable() {
      status = 'enabled';
      active = true;
      this.status = status;
      this.active = active;

      if (!offLogout && window.CoreEventBus && typeof window.CoreEventBus.subscribe === 'function') {
        offLogout = window.CoreEventBus.subscribe('auth:logout', () => {
          removeSnapshot();
        });
      }

      persistSnapshot({
        status,
        active,
        updatedAt: new Date().toISOString()
      });

      audit('sample-module:enable');
      emit('sample-module:enabled', { moduleId: MODULE_ID });
      return { ok: true, status };
    },

    disable() {
      if (offLogout) {
        offLogout();
        offLogout = null;
      }

      status = 'disabled';
      active = false;
      this.status = status;
      this.active = active;

      audit('sample-module:disable');
      emit('sample-module:disabled', { moduleId: MODULE_ID });
      return { ok: true, status };
    },

    uninstall() {
      this.disable();
      removeSnapshot();

      status = 'available';
      active = false;
      this.status = status;
      this.active = active;

      audit('sample-module:uninstall');
      emit('sample-module:uninstalled', { moduleId: MODULE_ID });
      return { ok: true, status };
    },

    renderUserInterface(container) {
      if (!container) {
        return;
      }

      const render = (message = '') => {
        const snapshot = getSnapshot();
        container.innerHTML = `
          <section class="user-app-panel">
            <span class="user-app-eyebrow">Module</span>
            <h1>Sample Module</h1>
            <p>This module uses only the current framework contract.</p>
            <pre>${JSON.stringify(snapshot, null, 2)}</pre>
            <p>${message}</p>
            <button type="button" class="user-app-back" data-sample-action="save">Save snapshot</button>
            <button type="button" class="user-app-back" data-sample-action="clear">Clear snapshot</button>
          </section>
        `;

        container.querySelector('[data-sample-action="save"]').addEventListener('click', () => {
          persistSnapshot({
            status,
            active,
            updatedAt: new Date().toISOString()
          });
          render('Snapshot saved.');
        });

        container.querySelector('[data-sample-action="clear"]').addEventListener('click', () => {
          removeSnapshot();
          render('Snapshot removed.');
        });
      };

      render();
    }
  };

  window.SampleModule = SampleModule;
})();
```

#### 22.4 Reference lifecycle behavior

- `install` sets in-memory status
- `initialize` throws if a required core API is missing
- `enable` subscribes listeners and persists a snapshot
- `disable` unsubscribes listeners
- `uninstall` removes storage/database artifacts

#### 22.5 Reference API section

No module-specific backend API is included, because the current framework does not support module backend route registration.

#### 22.6 Reference CSS section

No module-specific CSS file is included, because the current framework does not support module-local stylesheet registration.

The reference UI intentionally reuses existing classes from [webroot/style.css](/workspaces/CatchTrack-V.1.0/webroot/style.css).

---

### 23. Rules for AI Agents

#### 23.1 Mandatory reading before building a module

An AI agent must read:

1. this specification
2. [app/modules/gps/module.json](/workspaces/CatchTrack-V.1.0/app/modules/gps/module.json)
3. [app/modules/gps/index.js](/workspaces/CatchTrack-V.1.0/app/modules/gps/index.js)
4. [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)
5. [platform/module-manager.js](/workspaces/CatchTrack-V.1.0/platform/module-manager.js)
6. [platform/core-loader.js](/workspaces/CatchTrack-V.1.0/platform/core-loader.js)

Additionally, if the requested module touches a specific area, the AI agent must read that core file too before coding:

- storage -> [platform/core-storage.js](/workspaces/CatchTrack-V.1.0/platform/core-storage.js)
- database -> [platform/database-manager.js](/workspaces/CatchTrack-V.1.0/platform/database-manager.js)
- auth/access -> [platform/core-auth.js](/workspaces/CatchTrack-V.1.0/platform/core-auth.js), [platform/core-access.js](/workspaces/CatchTrack-V.1.0/platform/core-access.js)
- events -> [platform/core-event-bus.js](/workspaces/CatchTrack-V.1.0/platform/core-event-bus.js)
- UI shell behavior -> [webroot/style.css](/workspaces/CatchTrack-V.1.0/webroot/style.css) and [webroot/master-ui.js](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js)

#### 23.2 Information the AI agent must obtain from the requester

The AI agent needs at minimum:

- module purpose
- desired module id and human name
- whether the module needs user UI
- whether the module needs persistence
- whether the module requires auth/access checks
- whether the module requires interaction with existing core/user/admin APIs

The AI agent must explicitly ask if the request requires any of these unsupported standalone capabilities:

- dedicated backend API
- dedicated server route
- dedicated mounted HTML page
- dedicated module stylesheet registration
- npm dependency installation
- new database store or migration

If any of those are required, the task is not a plain standalone module task.

#### 23.3 Decisions the AI agent may make on its own

The AI agent may choose:

- whether to use a plain object or `ModuleInterface.create`
- internal helper function names
- storage key suffixes
- event names within the module id namespace
- whether to persist to `CoreStorage`, `DatabaseManager`, or both

#### 23.4 When the AI agent must ask follow-up questions

The AI agent must ask when:

- permission requirements are unclear
- data retention rules are unclear
- unsupported framework capabilities are required
- removal/cleanup expectations are unclear for shared data

#### 23.5 Framework rules an AI agent must never change on its own

Never change without explicit framework-scope instruction:

- module discovery mechanism
- server routing
- auth source of truth
- access model
- shared store structure
- HTML shell loading order
- CSS registration model

#### 23.6 How the AI agent should plan a module

1. confirm the request fits the standalone module contract
2. choose the module id/folder/globalName
3. define manifest
4. define lifecycle
5. define storage and database ownership
6. define UI fragment, if any
7. define cleanup paths before writing code

#### 23.7 How the AI agent should structure code and UI

- one global module object
- private state in closure variables
- synchronous lifecycle methods
- prefixed storage/event/database keys
- UI inside `renderUserInterface(container)`
- no hidden external dependencies

#### 23.8 How the AI agent should verify isolation

Check that the module:

- only uses its own keys and ids
- unsubscribes every listener
- stops every timer/watcher
- removes every removable artifact it created
- does not require edits in core-owned files unless explicitly doing framework work

#### 23.9 How the AI agent should verify framework compliance

Check:

- manifest fields are actually supported
- entry file creates the expected global object
- lifecycle does not rely on awaited calls
- no unsupported module API/CSS/webroot assumptions are present

---

### 24. Module creation workflow

Binding workflow:

1. capture requirements
2. check whether the request fits standalone module scope
3. define module concept
4. determine dependencies
5. create module folder in [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)
6. create `module.json`
7. create `index.js`
8. implement lifecycle
9. implement storage/database usage if needed
10. implement UI in `renderUserInterface(container)` if needed
11. verify isolation
12. verify cleanup
13. validate against this specification
14. finalize only the actual master files

---

### 25. Master files for a new module

In the current framework, the master files of a standalone module are:

- `app/modules/<module-id>/module.json`
- `app/modules/<module-id>/index.js`

Optional master files only if they are truly used:

- module-owned assets referenced by `index.js`
- module-owned docs

Files that are **not** master files of a standalone module:

- edits in [platform/](/workspaces/CatchTrack-V.1.0/platform)
- edits in [server/](/workspaces/CatchTrack-V.1.0/server)
- edits in [webroot/](/workspaces/CatchTrack-V.1.0/webroot)

unless the task is explicitly a framework change.

---

### 26. Test and validation rules

Current repository truth:

- no automated test suite exists
- no lint script exists
- no type check script exists
- no dedicated UI test tool exists

#### 26.1 Static validation

Realistic current checks:

- `module.json` parses as JSON
- required manifest fields exist
- referenced entry file exists
- entry file creates the expected global module object

#### 26.2 Structure validation

Check:

- folder is under [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)
- manifest filename is correct
- entry path matches actual file

#### 26.3 Syntax validation

Realistically executable:

- `node --check app/modules/<module-id>/index.js`

#### 26.4 Integration validation

Realistically executable:

1. start the server with `npm start`
2. call `/api/modules`
3. verify the module manifest is listed
4. load [webroot/index.html](/workspaces/CatchTrack-V.1.0/webroot/index.html) in the browser
5. verify the module appears when enabled

#### 26.5 Runtime validation

Check:

- install/initialize/enable run without throw
- UI renders if provided
- listeners and browser handles are cleaned on disable

#### 26.6 API validation

Current standalone limit:

- only `/api/modules` registration visibility can be validated for a plain module
- module-specific backend API validation is not applicable because the framework does not support it

#### 26.7 UI validation

Current realistic approach:

- manual browser validation
- verify the UI renders inside the existing container
- verify no new shell assumptions were introduced

---

### 27. Framework boundaries

This specification does **not** allow a standalone module to:

- redesign the core on its own
- bypass security boundaries
- introduce new global state systems
- move domain logic into the neutral core
- modify other modules without explicit scope
- break existing loader/manifest/lifecycle conventions
- create hidden framework dependencies
- hard-wire new core design assumptions into module code

If a requested feature needs those changes, it is a framework task, not a plain standalone module task.

---

### 28. Module registry and manager truth

#### 28.1 Actual registry behavior

Current module registration truth:

- `CoreLoader` discovers manifests and scripts
- `ModuleManager.discoverModules()` normalizes and registers candidates
- `ModuleRegistry.register(module)` stores them in an in-memory `Map`

#### 28.2 Validation reality

Actual validation that exists:

- manifest must parse as JSON
- manifest `id` must be a non-empty string
- entry file must exist and be readable
- entry script must evaluate without fatal exception
- a global implementation must be discoverable on `window`
- duplicate ids are rejected by `ModuleRegistry.register`

What does **not** exist:

- no `appId` routing or isolation enforcement (the field is normalized and stored but not verified against the AppRegistry)
- no `mountPath` routing enforcement (the field is normalized and stored but no HTTP route is driven by it)
- no schema validation beyond manual field normalization
- no structured diagnostics channel for manifest authoring errors

#### 28.3 Silent fallback reality

The current framework still contains silent skips/fallbacks:

- invalid manifest JSON is skipped
- unreadable manifests are skipped
- missing entry files are skipped
- unmatched global implementations are skipped
- `/api/modules` skips manifest parse failures

Therefore the authoring rule is:

- future module work must not rely on these silent skips
- module deliverables must be manually validated so that discovery succeeds without fallback behavior

#### 28.4 Module manager responsibilities

Current `ModuleManager` responsibilities are:

- normalize module objects
- validate dependencies
- register/unregister modules
- call lifecycle methods
- expose read methods such as `get`, `getAll`, `getStatus`
- set `Core.state.activeModule`
- emit `module:registered`, `module:activated`, `module:deactivated`, `module:unregistered`

`ModuleManager` does **not**:

- await lifecycle promises
- rollback failed lifecycle sequences
- enforce permissions automatically
- mount APIs
- mount HTML routes
- mount CSS

---

### 29. App context, `appId`, `mountPath`, and connection-system truth

#### 29.1 Core context

The actual shared context is [platform/core-context.js](/workspaces/CatchTrack-V.1.0/platform/core-context.js). It exposes:

- `application.name`
- `application.version`
- `runtime`
- `environment`

#### 29.2 App context reality

The current application is effectively a single app shell:

- `ApplicationCore` in [platform/core-config.js](/workspaces/CatchTrack-V.1.0/platform/core-config.js)
- `ApplicationCore` in [platform/core-context.js](/workspaces/CatchTrack-V.1.0/platform/core-context.js)
- [app/index.js](/workspaces/CatchTrack-V.1.0/app/index.js) exports a small `appShell`

There is no richer standalone "App Context" API for modules.

#### 29.3 `appId`

`appId` is not implemented anywhere in the current framework as a module contract field, routing key, storage namespace, or registry key.

#### 29.4 `mountPath`

`mountPath` is not implemented anywhere in the current framework as a manifest field, router rule, or UI mount contract.

The only current HTTP exposure for module files is:

- `/app/modules/<folder>/...`

#### 29.5 Connection system

`ConnectionManager` is implemented in [platform/master-framework.js](/workspaces/CatchTrack-V.1.0/platform/master-framework.js) and exposed globally as `window.ConnectionManager`.

Implemented:

- `ConnectionManager.register(definition)` — register a connection with `connectionId`, `appId`, `serverUrl`, `apiBase`, `authType`, `credentialsRef`
- `ConnectionManager.get(connectionId)` — retrieve a connection
- `ConnectionManager.list(appId)` — list all or per-app connections
- `ConnectionManager.update(connectionId, updates)` — update a connection
- `ConnectionManager.setStatus(connectionId, status)` — set connection status
- `ConnectionManager.test(connectionId, handler)` — run a health test

Not implemented (APP-SPEZIFISCH / SERVER-SEITIG):

- no connection ownership enforcement per module
- no server-side connection proxying
- no connection security enforcement layer beyond what the application layer provides
- no automatic module-owned connection routing

Therefore a standalone module must not invent a parallel connection ownership model. If a module needs to register a server-side proxy or dedicated backend route, that is a framework extension task.

---

### 30. GPS module as a real reference

The GPS module in [app/modules/gps/](/workspaces/CatchTrack-V.1.0/app/modules/gps) is a **reference example**, not a mandatory template.

It demonstrates current-framework facts:

- folder-based discovery
- `module.json` + `index.js`
- global module object via `window.GpsModule`
- manual lifecycle methods
- event emission
- storage/database usage
- `renderUserInterface(container)`

It does **not** prove that every module must:

- use geolocation
- persist into the `sync` store
- add GPS-specific CSS
- follow its exact audit helper pattern

Use it as evidence of what the current runtime can load, not as a one-size-fits-all design.

---

### 31. Anti-patterns

Forbidden or incorrect patterns for this framework:

- moving domain logic into [platform/](/workspaces/CatchTrack-V.1.0/platform)
- creating parallel auth/session systems
- creating a private lifecycle system disconnected from `ModuleManager`
- using unprefixed global storage keys
- using unprefixed shared database ids
- clearing shared storage/database/event/audit state
- bypassing registry discovery by mutating framework internals
- assuming `appId` or `mountPath` exists
- inventing a connection framework that the codebase does not have
- adding hidden fallback behavior inside module integration docs
- hardcoding branding into neutral core files
- depending on demo assets, demo architecture, or backup archives
- adding unnecessary external dependencies

---

### 32. Completion checklist for a finished module

Before a module is considered finished, verify all of the following:

- module folder exists under [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)
- exactly one valid manifest exists (`module.json` or `manifest.json`)
- manifest uses only actually supported fields
- entry file exists and exposes the expected global object
- lifecycle methods match current framework behavior
- dependency ids match real registered module ids
- storage keys are module-prefixed
- database records are removable without clearing shared stores
- event listeners are unsubscribed on disable/uninstall
- browser handles/timers/watchers are stopped on disable/uninstall
- `renderUserInterface(container)` stays inside the provided container
- no unsupported API routing or CSS mounting assumptions were introduced
- no core/framework files were changed unless the task explicitly required framework work

---

### 33. Backup rule

Backup ZIPs are not part of:

- the framework
- a module
- the runtime contract
- module discovery
- server startup

Backups must be created only outside the Git repository and may be deleted completely after download or external retention.

---

## Deutsch

### 1. Zweck, Umfang und technische Wahrheit

Diese Datei ist die verbindliche Master-Spezifikation fuer die Erstellung, Integration, Aenderung, Validierung und Entfernung zukuenftiger Module im aktuellen neutralen Framework.

Sie ist ausschliesslich aus dem aktuellen Codebestand abgeleitet, insbesondere aus:

- [platform/](/workspaces/CatchTrack-V.1.0/platform)
- [app/](/workspaces/CatchTrack-V.1.0/app)
- [app/modules/gps/](/workspaces/CatchTrack-V.1.0/app/modules/gps)
- [server/](/workspaces/CatchTrack-V.1.0/server)
- [config/](/workspaces/CatchTrack-V.1.0/config)
- [webroot/](/workspaces/CatchTrack-V.1.0/webroot)
- [package.json](/workspaces/CatchTrack-V.1.0/package.json)
- [package-lock.json](/workspaces/CatchTrack-V.1.0/package-lock.json)

Diese Spezifikation beschreibt **kein** hypothetisches Framework. Sie dokumentiert nur das Framework, das aktuell vorhanden ist.

Wenn eine Faehigkeit im aktuellen Code nicht implementiert ist, wird sie als **not supported** oder **not technically enforced** gekennzeichnet.

Wichtige Ausschluesse:

- Backup-ZIP-Inhalte sind kein Projektbestandteil.
- Demo2 und Legacy-Demo sind kein Projektbestandteil und duerfen nicht wiederhergestellt werden.
- Das aktuelle technische Modul-Referenzbeispiel im Repository ist das GPS-Modul in [app/modules/gps/](/workspaces/CatchTrack-V.1.0/app/modules/gps).

#### 1.1 Was ein Modul im aktuellen Framework ist

Im aktuellen Codebestand ist ein Modul eine browsergeladene Runtime-Einheit, die:

- unter [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules) entdeckt wird
- durch `module.json` oder `manifest.json` beschrieben wird
- von [platform/core-loader.js](/workspaces/CatchTrack-V.1.0/platform/core-loader.js) geladen wird
- in [platform/module-registry.js](/workspaces/CatchTrack-V.1.0/platform/module-registry.js) registriert wird
- in [platform/module-manager.js](/workspaces/CatchTrack-V.1.0/platform/module-manager.js) lifecycle-seitig gesteuert wird
- optional ueber `renderUserInterface(container)` aus [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js) in die User-Shell gerendert wird

Ein Modul ist nur fuer Folgendes selbst verantwortlich:

- eigenes Manifest
- eigenes Runtime-Objekt
- eigene Lifecycle-Methoden
- eigenen privaten Zustand
- eigene Events
- eigene Storage-/Database-Records
- optionales User-UI-Fragment
- eigenes Cleanup

Ein Modul ist **nicht** der Eigentuemer von:

- Core-Startup
- Server-Routing
- Root-HTML-Shells
- frameworkweiter Auth-/Session-Truth
- frameworkweiten Storage-/Database-Schemata
- frameworkweiter Styling-Infrastruktur

#### 1.2 Technische Trennung der Verantwortungen

| Ebene | Aktueller technischer Owner | Verantwortung | Was ein eigenstaendiges Modul nicht tun darf |
| --- | --- | --- | --- |
| Core | [platform/](/workspaces/CatchTrack-V.1.0/platform) | Runtime, Lifecycle, Auth, Access, Storage, Database, Eventing | Core-Subsysteme ersetzen oder parallel nachbauen |
| Server | [server/](/workspaces/CatchTrack-V.1.0/server) | HTTP-Server, statisches Serving, `/api/modules`, Health-/Status-Endpunkte | eigene Routen ohne Framework-Aenderung einschleusen |
| Framework-Shell | [webroot/](/workspaces/CatchTrack-V.1.0/webroot) | Root-HTML, User-/Admin-/Developer-Shells, Shared CSS | automatisches Mounten eigener Seiten oder CSS voraussetzen |
| App-Kontext | [app/](/workspaces/CatchTrack-V.1.0/app) plus `ApplicationCore`-Werte in [platform/core-config.js](/workspaces/CatchTrack-V.1.0/platform/core-config.js) und [platform/core-context.js](/workspaces/CatchTrack-V.1.0/platform/core-context.js) | aktuelle einzelne Anwendungsshell | Multi-App-Abstraktionen wie `appId` oder per-App-Routing-Kontext annehmen |
| Modul | `app/modules/<module-id>/` | gekapselte Feature-Einheit in geteilter Runtime | frameworkeigene Dateien als Teil normaler Modul-Arbeit aendern |
| UI | Root-Shells plus `renderUserInterface(container)` | sichtbare Interaktion fuer Benutzer | die Shell umgehen und beliebige Standalone-Seiten mounten |
| Fachlogik | nur Modulcode | featurespezifisches Verhalten | App-/Fachlogik ohne explizite Framework-Arbeit in den Core verschieben |

#### 1.3 Standalone-Abstraktionen, die nicht durch den aktuellen Vertrag erzwungen werden

Die folgenden Abstraktionen werden durch den aktuellen eigenstaendigen Modul-Vertrag **nicht erzwungen** (d. h. Manifest und Loader nutzen sie nicht fuer Routing, Mounting oder Discovery):

- keine App-Router-Abstraktion — URL-Routing wird nicht pro Modul oder App aufgeteilt
- keinen Modul-Backend-Vertrag — Module koennen ueber Manifest-Felder keine Server-seitigen Routen registrieren
- keinen Vertrag fuer die Registrierung modul-lokaler Stylesheets

Wichtige Unterscheidung: `AppRegistry` und `ConnectionManager` **sind** Teil der implementierten Framework-Runtime (siehe Abschnitt 1.0). `appId` und `mountPath` **werden** von `ModuleInterface.validateManifest` normalisiert und im Manifest gespeichert. Weder serverseitiges Routing noch browserseitiges URL-Mounting wird durch diese Felder im aktuellen Code gesteuert. Modulcode, der `window.ConnectionManager` oder `window.AppRegistry` nutzt, verwendet eine implementierte API. Modulcode, der HTTP-Routing auf Basis von `mountPath` voraussetzt, setzt etwas voraus, das nicht implementiert ist.

---

### 2. Modul-Grundstruktur

#### 2.1 Tatsaechlicher Modul-Ablageort

Das aktuelle Framework entdeckt externe Anwendungs-Module unter:

- [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)

Jedes Modul wird als eigenes direktes Unterverzeichnis erwartet:

- `app/modules/<module-folder>/`

Der Server stellt Dateien aus diesem Verzeichnisbaum ausserdem unter folgendem HTTP-Pfad statisch bereit:

- `/app/modules/<module-folder>/...`

Dieses statische Serving existiert in [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js), es gibt jedoch darueber hinaus keinen dedizierten Modul-Webroot-Vertrag.

#### 2.2 Pflichtdateien

Ein ladbares Modulverzeichnis benoetigt:

1. eine Manifest-Datei mit einem dieser Namen:
   - `module.json`, oder
   - `manifest.json`
2. eine Entry-Skriptdatei, auf die das Manifest verweist:
   - `entry`, oder
   - `main`, oder
   - Fallback `index.js`

Im aktuellen Repository nutzt das vorhandene Modul:

- [app/modules/gps/module.json](/workspaces/CatchTrack-V.1.0/app/modules/gps/module.json)
- [app/modules/gps/index.js](/workspaces/CatchTrack-V.1.0/app/modules/gps/index.js)

#### 2.3 Optionale Dateien

Optionale Dateien, die ein Modul technisch besitzen darf:

- weitere JavaScript-Dateien innerhalb des eigenen Verzeichnisses, wenn sie vom Modul manuell geladen werden
- statische Assets innerhalb des eigenen Verzeichnisses, wenn sie manuell ueber `/app/modules/<module-folder>/...` referenziert werden
- weitere Dokumentationsdateien innerhalb des eigenen Verzeichnisses

Was **nicht** vorhanden ist:

- kein automatisches Mounten von modul-lokalem HTML
- kein automatisches Laden von modul-lokalem CSS
- keine automatische Registrierung modul-lokaler Server-Routen
- keine separate modul-lokale Lifecycle-Datei neben `module.json` / `manifest.json`

#### 2.4 Dateien, die zum Core gehoeren und nicht zum Modul

Die folgenden Pfade sind Core-/Framework-Bestandteil und kein Teil eines eigenstaendigen Moduls:

- [platform/](/workspaces/CatchTrack-V.1.0/platform)
- [server/](/workspaces/CatchTrack-V.1.0/server)
- [config/](/workspaces/CatchTrack-V.1.0/config)
- [webroot/](/workspaces/CatchTrack-V.1.0/webroot)
- [package.json](/workspaces/CatchTrack-V.1.0/package.json)
- [package-lock.json](/workspaces/CatchTrack-V.1.0/package-lock.json)
- [app/index.js](/workspaces/CatchTrack-V.1.0/app/index.js)
- [platform/app.js](/workspaces/CatchTrack-V.1.0/platform/app.js)

#### 2.5 Dateien, die bei normaler Modulerstellung nicht veraendert werden duerfen

Fuer ein normales zukuenftiges Modul duerfen **nicht** veraendert werden:

- irgendeine Datei in [platform/](/workspaces/CatchTrack-V.1.0/platform)
- irgendeine Datei in [server/](/workspaces/CatchTrack-V.1.0/server)
- irgendeine Datei in [config/](/workspaces/CatchTrack-V.1.0/config)
- irgendeine Datei in [webroot/](/workspaces/CatchTrack-V.1.0/webroot)
- [package.json](/workspaces/CatchTrack-V.1.0/package.json)
- [package-lock.json](/workspaces/CatchTrack-V.1.0/package-lock.json)

Begruendung: Das aktuelle Framework besitzt keine reinen Modul-Extension-Points fuer Backend-Routing, CSS-Registrierung, HTML-Mounting oder Dependency-Installation. Wenn eine Anforderung dort Aenderungen benoetigt, ist diese Arbeit eine **Framework-Aenderung** und keine eigenstaendige Modul-Aenderung.

#### 2.6 Verbindliche Zielstruktur fuer ein zukuenftiges Modul

Minimale Zielstruktur:

```text
app/modules/<module-id>/
├── module.json
└── index.js
```

Optional nur dann, wenn sie wirklich von `index.js` referenziert werden:

```text
app/modules/<module-id>/
├── module.json
├── index.js
├── assets/
│   └── ...
└── docs/
    └── ...
```

Es gibt keinen unterstuetzten Grund, modul-eigene Dateien in [platform/](/workspaces/CatchTrack-V.1.0/platform), [server/](/workspaces/CatchTrack-V.1.0/server) oder [webroot/](/workspaces/CatchTrack-V.1.0/webroot) anzulegen, wenn es sich um ein eigenstaendiges Modul handelt.

---

### 3. `module.json`-Vertrag

#### 3.1 Tatsaechlich unterstuetzte Manifest-Felder

Das aktuelle Framework liest und/oder normalisiert die folgenden Manifest-Felder:

| Feld | Typ im aktuellen Code | Pflicht | Tatsaechliches Verhalten |
| --- | --- | --- | --- |
| `id` | string | ja | Vom Loader und Validator zwingend benoetigt |
| `name` | string | nein | Fallback auf `id` |
| `version` | string | nein | Fallback auf `"1.0.0"` |
| `type` | beliebiger truthy JSON-Wert, praktisch string | nein | Fallback auf `"framework"` in `ModuleInterface.validateManifest` |
| `description` | string | nein | Fallback auf leerer String |
| `entry` | string | nein | Bevorzugter Entry-Skriptpfad |
| `main` | string | nein | Sekundaerer Entry-Skriptpfad |
| `globalName` | string | nein | Wird bei rohem Manifest-/Katalogeintrag fuer die globale Aufloesung verwendet |
| `dependencies` | array | nein | Truthy Eintraege werden in Strings umgewandelt |
| `permissions` | array | nein | Truthy Eintraege werden in Strings umgewandelt |
| `capabilities` | array | nein | Truthy Eintraege werden in Strings umgewandelt |
| `autoload` | boolean | nein | Wird normalisiert, Default `true`, wird aber sonst nirgends verwendet |
| `lifecycle` | object | nein | Wird normalisiert, wird aber sonst nirgends verwendet |
| `source` | string | nein | Wird bei Framework-Katalogeintraegen verwendet; fuer App-Modulordner nicht noetig |
| `modulePath` | string | runtime/intern | Wird waehrend der Discovery hinzugefuegt; nicht manuell erforderlich |
| `manifestPath` | string | runtime/intern | Wird waehrend der Discovery hinzugefuegt; nicht manuell erforderlich |

#### 3.2 Manifest-Felder, die normalisiert, aber nicht fuer Routing erzwungen werden

Die folgenden Felder werden von `ModuleInterface.validateManifest` erkannt und normalisiert sowie im Manifest gespeichert, jedoch wird ihr beabsichtigtes Routing- oder Scoping-Verhalten durch das aktuelle Framework **nicht erzwungen**:

- `appId` — normalisiert und gespeichert; `ModuleRegistry.getByApp(appId)` ist implementiert; App-spezifisches Routing oder Isolation wird jedoch nicht erzwungen
- `apiVersion` — normalisiert und gespeichert; keine Versions-Erzwingung oder -Verhandlung findet statt
- `mountPath` — normalisiert und gespeichert; kein HTTP-Routing wird dadurch gesteuert

Die folgenden Felder werden im aktuellen Code **gar nicht ausgewertet**:

- `moduleId` als separates Feld neben `id`
- `webRoot` / `webroot`
- `services`-Deklarationsblock
- API-Route-Deklarationen
- UI-Route-Deklarationen
- Theme-Deklarationen
- Design-Deklarationen
- CSS-Registrierungs-Deklarationen
- Migrations-Deklarationen

Unbekannte Zusatzfelder koennen zwar im JSON vorhanden sein, das aktuelle Framework nutzt sie aber nicht fuer das Laden von Modulen.

#### 3.3 Feldregeln im Detail

##### `id`

- Typ: nicht-leerer String
- Pflicht: ja
- Validierung: `ModuleInterface.validateManifest` liefert `null`, wenn `id` fehlt oder leer ist
- Dependency-Nutzung: `ModuleManager.validateDependencies` prueft Dependency-Namen gegen registrierte Modul-IDs
- Fehlerverhalten:
  - ungueltige oder fehlende `id` -> Modul wird bei der Discovery ignoriert
  - doppelte `id` auf Registry-Ebene -> Registrierung wirft Fehler

##### `name`

- Typ: string
- Pflicht: nein
- Default: `id`
- Nutzung:
  - Anzeigename in der UI
  - Fallback fuer globale Namensauflosung, wenn `globalName` fehlt

##### `version`

- Typ: string
- Pflicht: nein
- Default: `"1.0.0"`
- Validierung: nur nicht-leerer String in der Normalisierung
- Es existiert kein SemVer-Parser

##### `type`

- Typ: nicht streng validiert
- Pflicht: nein
- Default: `"framework"`
- Aktuelle Beispiele:
  - `"framework"`
  - `"app"`
- Wichtig: Der aktuelle Code erzwingt keine feste Wertemenge

##### `description`

- Typ: string
- Pflicht: nein
- Default: `""`

##### `entry`

- Typ: string
- Pflicht: nein
- Zweck: primaerer Skriptpfad relativ zum Modulwurzelverzeichnis
- Fallback-Reihenfolge:
  1. explizites Loader-Override
  2. `entry`
  3. `main`
  4. `index.js`
- Wenn die aufgeloeste Datei nicht existiert oder nicht gelesen werden kann, wird das Modul nicht geladen

##### `main`

- Typ: string
- Pflicht: nein
- Zweck: sekundaerer Entry-Pfad
- Wird nur benutzt, wenn `entry` fehlt

##### `globalName`

- Typ: string
- Pflicht: nein
- Zweck: legt fest, welche `window`-Property das Modulobjekt enthalten soll
- Aktuelle Nutzung:
  - vorhanden in [app/modules/gps/module.json](/workspaces/CatchTrack-V.1.0/app/modules/gps/module.json)
  - aufgeloest in [platform/core-loader.js](/workspaces/CatchTrack-V.1.0/platform/core-loader.js), [platform/module-registry.js](/workspaces/CatchTrack-V.1.0/platform/module-registry.js) und [platform/module-manager.js](/workspaces/CatchTrack-V.1.0/platform/module-manager.js)
- Wichtig: `ModuleInterface.validateManifest` uebernimmt `globalName` nicht in sein normalisiertes Rueckgabeobjekt, die rohe Manifest-Aufloesung nutzt es aber trotzdem

##### `dependencies`

- Typ: array
- Pflicht: nein
- Default: `[]`
- Validierung:
  - nur truthy Eintraege bleiben erhalten
  - Eintraege werden in Strings umgewandelt
- Erzwingung:
  - `ModuleManager.validateDependencies` verlangt, dass jede Dependency-ID bereits in `ModuleRegistry` vorhanden ist
- Fehlerverhalten:
  - fehlende Dependency -> Lifecycle-Schritt wirft Fehler

##### `permissions`

- Typ: array
- Pflicht: nein
- Default: `[]`
- Validierung: truthy Eintraege werden in Strings umgewandelt
- Tatsaechliche Nutzung im aktuellen Framework:
  - UI-Sichtbarkeitsfilter in [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)
  - Sichtbarkeit in Summary/Menu in [webroot/master-ui.js](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js)
- Wichtig: Permissions werden von `ModuleManager` bei Registrierung oder Aktivierung **nicht** erzwungen

##### `capabilities`

- Typ: array
- Pflicht: nein
- Default: `[]`
- Validierung: truthy Eintraege werden in Strings umgewandelt
- Tatsaechliche Nutzung: im aktuellen Code nur informativ

##### `autoload`

- Typ: boolean
- Pflicht: nein
- Default: `true`
- Tatsaechliche Nutzung: nur normalisiert; kein Loader-Zweig prueft es aktuell
- Regel: Nicht darauf verlassen

##### `lifecycle`

- Typ: object
- Pflicht: nein
- Default: `{}`
- Tatsaechliche Nutzung: nur normalisiert; kein Loader-/Manager-Code liest den Inhalt aus
- Regel: Nicht auf manifestbasierte Lifecycle-Konfiguration verlassen

##### `modulePath` und `manifestPath`

- Typ: string
- Pflicht in der Quelldatei: nein
- Aktueller Ursprung:
  - werden vom Loader/Server injiziert
  - koennen in `/api/modules`-Antworten auftauchen
- Regel: Diese Felder in einem normalen On-Disk-Manifest nicht manuell pflegen

#### 3.4 Manifest-Fehlerverhalten

Aktuelles Verhalten:

- ungueltiges JSON in `module.json` / `manifest.json`
  - `/api/modules` ueberspringt das Modul stillschweigend
  - Loader-Manifest-Lesen liefert `null`
- gueltiges Manifest, aber fehlendes Entry-Skript
  - Loader liefert `null`
- Entry-Skript laedt, aber es existiert kein auffindbares globales Modulobjekt
  - Loader liefert `null`
- gueltiges Modulobjekt, aber doppelte Registry-ID
  - Registry wirft `Module already registered: <id>`

---

### 4. `index.js` / Modulcode-Vertrag

#### 4.1 Ausfuehrungsmodell

Das aktuelle Framework laedt Modulcode, indem es:

1. die Skriptdatei als Text liest
2. sie per `new Function(scriptText)` ausfuehrt
3. ein Modulobjekt aus `window` aufloest

Das bedeutet:

- die Entry-Datei muss pures browserseitiges JavaScript sein
- die Entry-Datei muss direkt oder indirekt ein globales Objekt auf `window` anlegen
- CommonJS-Exports (`module.exports`) werden fuer App-Module **nicht** verwendet
- ESM-Exports (`export`, `export default`) werden vom Loader **nicht** verwendet

#### 4.2 Erforderliche globale/exportierte Struktur

Ein Modul muss ein globales Objekt bereitstellen, das unter einem dieser Namen auffindbar ist:

1. `manifest.globalName`
2. `manifest.name`
3. `manifest.id`
4. ein unscharfer `window`-Key-Match, dessen Normalisierung zur Modul-ID passt

Das sicherste Muster ist:

- `globalName` in `module.json` setzen
- das Modulobjekt exakt an `window[globalName]` haengen

#### 4.3 Erwartete Form des Modulobjekts

Das Framework arbeitet mit einem Plain Object. Nuezliche Properties und Methoden sind:

- `id`
- `name`
- `version`
- `description`
- `dependencies`
- `permissions`
- `capabilities`
- `status`
- `active`
- `install()`
- `initialize()`
- `enable()`
- `disable()`
- `uninstall()`
- optional `update()`
- optional `activate()` / `deactivate()`
- optional `renderUserInterface(container)`

#### 4.4 Oeffentliche Methoden, die das Framework tatsaechlich nutzt

- `install()` -> aufgerufen von `ModuleManager.install`
- `initialize()` -> aufgerufen von `ModuleManager.initialize`
- `enable()` oder Fallback `activate()` -> aufgerufen von `ModuleManager.enable`
- `disable()` oder Fallback `deactivate()` -> aufgerufen von `ModuleManager.disable`
- `uninstall()` -> aufgerufen von `ModuleManager.uninstall`
- `update()` -> nur aufgerufen, wenn jemand explizit `ModuleManager.update` verwendet
- `renderUserInterface(container)` -> nicht Teil von `ModuleManager`, wird aber von [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js) aufgerufen, wenn vorhanden

#### 4.5 `ModuleInterface.create`

[platform/module-interface.js](/workspaces/CatchTrack-V.1.0/platform/module-interface.js) stellt `ModuleInterface.create(definition)` bereit.

Dieser Helfer:

- validiert ein Manifest
- erzeugt ein Modulobjekt
- verwaltet `status` und `active`
- mappt Hook-Funktionen:
  - `onInstall`
  - `onInitialize`
  - `onEnable`
  - `onActivate`
  - `onDisable`
  - `onDeactivate`
  - `onUpdate`
  - `onUninstall`

Der Helfer ist aber optional. Das GPS-Modul verwendet ihn **nicht**.

#### 4.6 Statusverwaltung

Wenn ein Modul als Plain Object implementiert ist, muss es selbst verwalten:

- `status`
- `active`
- Timer
- Listener
- Watcher
- Browser-APIs wie `navigator.geolocation.watchPosition`

Wenn `ModuleInterface.create` verwendet wird, aktualisiert der Helfer `status` und `active`.

#### 4.7 Rueckgabewerte

Wichtige aktuelle Regel:

- `ModuleManager` wertet Lifecycle-Rueckgabewerte **nicht** aus
- er ruft die Methoden nur auf
- er `await`-et Lifecycle-Methoden **nicht**

Folgen:

- ein `{ ok: false }` aus `initialize()` stoppt `enable()` nicht
- asynchrone Lifecycle-Methoden werden vom Framework nicht sequentiell verarbeitet
- um Discovery oder Aktivierung abzubrechen, muss eine Lifecycle-Methode **werfen**

Das ist im aktuellen GPS-Modul sichtbar:

- [app/modules/gps/index.js](/workspaces/CatchTrack-V.1.0/app/modules/gps/index.js) liefert aus `initialize()` `{ ok: false, code: 'GEOLOCATION_UNAVAILABLE' }`
- `ModuleManager.discoverModules()` geht trotzdem mit `enable()` weiter

Deshalb gilt:

- Lifecycle-Voraussetzungen, die Aktivierung verhindern muessen, muessen einen Fehler werfen
- Lifecycle-Methoden, die nur Statusobjekte zurueckgeben, sind fuer direkte Aufrufer informativ, nicht fuer das Framework

#### 4.8 Asynchrone Funktionen

Technisch erlaubt:

- Module duerfen async-Methoden definieren
- Module duerfen Promises aus Nicht-Lifecycle-Methoden zurueckgeben

Fuer die erforderliche Lifecycle-Sequenzierung nicht unterstuetzt:

- `install`
- `initialize`
- `enable`
- `disable`
- `uninstall`

weil `ModuleManager` sie nicht `await`-et.

#### 4.9 Erlaubte globale Objekte

In den aktuellen Browser-Seiten koennen Module auf Folgendes zugreifen:

- Browser-Globals wie `window`, `document`, `navigator`, `localStorage`, `fetch`, `crypto`
- Framework-Globals, die per HTML-Script-Tags geladen werden, darunter:
  - `Core`
  - `CoreEventBus`
  - `CoreErrorHandler`
  - `ErrorLog`
  - `CoreConfig`
  - `CoreContext`
  - `CoreLifecycle`
  - `CoreState`
  - `CoreStorage`
  - `ModuleInterface`
  - `ModuleRegistry`
  - `ModuleManager`
  - `CoreLoader`
  - `ConfigManager`
  - `DatabaseManager`
  - `CoreSecurity`
  - `CoreAuth`
  - `CoreAccess`
  - `CoreAudit`
  - `CoreEventRing`
  - `UserModule`
  - `AdminModule`
  - `ServiceManager`
  - `CoreStartup`
  - `CoreRuntime`
  - `CoreEntry`
  - `App`

#### 4.10 Verbotenes oder unsicheres Global-Verhalten

In einem eigenstaendigen Modul darf Folgendes nicht passieren:

- `window.FrameworkModuleCatalog` nicht manipulieren
- `CoreLifecycle.setPhase(...)` nicht aufrufen
- `CoreShutdown.stop()` nicht aufrufen
- `CoreStartup.reset()` nicht aufrufen
- `CoreLoader.loadModuleFromManifest(...)` nicht aufrufen
- `CoreStorage.clear()` nicht aufrufen
- `DatabaseManager.deleteDatabase()` nicht aufrufen
- `DatabaseManager.clear(...)` nicht auf gemeinsam genutzten Stores aufrufen, solange der Store nicht exklusiv dem Modul gehoert, was fuer die aktuellen Built-in-Stores nicht zutrifft
- `CoreEventBus.clear()` nicht global aufrufen
- `CoreEventRing.clear()` nicht global aufrufen
- `CoreAudit.clear()` nicht global aufrufen

#### 4.11 Regel fuer internen Zustand

Das korrekte aktuelle Muster ist:

- modul-internen Zustand in Closure-Variablen innerhalb von `index.js` halten
- nur das beabsichtigte oeffentliche Modulobjekt auf `window` exponieren

Das GPS-Modul folgt diesem Muster fuer:

- `watchId`
- `tracking`
- `status`
- `lastPosition`

---

### 5. Tatsaechlicher Modul-Lifecycle

#### 5.1 Discovery- und Start-Reihenfolge

Aktueller Startablauf:

1. [platform/core.js](/workspaces/CatchTrack-V.1.0/platform/core.js) initialisiert `Core`
2. [platform/app.js](/workspaces/CatchTrack-V.1.0/platform/app.js) startet `App`
3. `App.start()` ruft `CoreEntry.start()` auf
4. `CoreEntry.start()` ruft `CoreRuntime.start()` auf
5. `CoreRuntime.start()` ruft `CoreStartup.start()` auf
6. `CoreStartup.start()` initialisiert Core-Services
7. `CoreStartup.start()` ruft `ModuleManager.discoverModules()` auf
8. `ModuleManager.discoverModules()` entdeckt externe Module
9. fuer jedes neue Modul:
   - `register`
   - `install`
   - `initialize`
   - `enable`

#### 5.2 Wie externe Module entdeckt werden

Im aktuellen Browser-Pfad nutzt die Discovery:

- `/api/modules` aus [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js)
- optional `window.ExternalModuleCatalog`
- optional `app/modules/modules.json`, `index.json` oder `manifest.json`, sofern per Fetch erreichbar

Der aktuelle Server-Endpunkt `/api/modules` liefert geparste Manifeste aus direkten Unterverzeichnissen von [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules).

#### 5.3 Lifecycle-Phasen und Regeln

| Phase | Trigger | Zweck | Erforderliche Rueckgabe | Fehlerverhalten |
| --- | --- | --- | --- | --- |
| `install` | `ModuleManager.install` und Discovery | Erstaufbau | wird vom Manager ignoriert | nur geworfene Fehler stoppen den Ablauf |
| `initialize` | `ModuleManager.initialize` und Discovery | Readiness pruefen und Runtime-State vorbereiten | wird vom Manager ignoriert | nur geworfene Fehler stoppen den Ablauf |
| `enable` | `ModuleManager.enable` und Discovery | Modul aktivieren | wird vom Manager ignoriert | nur geworfene Fehler stoppen den Ablauf |
| `disable` | `ModuleManager.disable`, `CoreShutdown.stop` | Listener/Watcher stoppen und deaktivieren | wird vom Manager ignoriert | geworfene Fehler werden beim Runtime-Stop nur vom Shutdown-Handler abgefangen |
| `uninstall` | nur `ModuleManager.uninstall` | expliziter End-Abbau vor dem Unregister | wird vom Manager ignoriert | geworfene Fehler gehen an den Aufrufer hoch |
| `activate` / `deactivate` | nur Alias-Fallback | wird nur genutzt, wenn `enable` / `disable` fehlen | wird vom Manager ignoriert | wie oben |
| Shutdown-Hook | nicht vorhanden | keiner | nicht unterstuetzt | nicht unterstuetzt |

#### 5.4 `install`

Aktuelle Bedeutung:

- Modul als installiert markieren
- initiale In-Memory-Strukturen anlegen, falls benoetigt
- optional Audit-/Event-Emission

Aktuelles Framework-Verhalten:

- Dependencies werden vor `install` geprueft
- das Ergebnis wird ignoriert

#### 5.5 `initialize`

Aktuelle Bedeutung:

- Voraussetzungen pruefen
- modul-eigenen Zustand initialisieren
- optional Storage/Database lesen

Aktuelles Framework-Verhalten:

- Dependencies werden vor `initialize` geprueft
- das Ergebnis wird ignoriert
- kein `await`

Blockier-Regel:

- wenn ein Initialisierungsfehler `enable` verhindern muss, muss die Methode werfen

#### 5.6 `enable`

Aktuelle Bedeutung:

- Listener aktivieren
- Timer/Watcher starten
- Modul als aktiv markieren
- Aktivierungs-Events emittieren

Aktuelles Framework-Verhalten:

- Dependencies werden vor `enable` geprueft
- wenn `enable` fehlt, aber `activate` existiert, wird stattdessen `activate` aufgerufen
- danach wird `Core.state.activeModule` auf die Modul-ID gesetzt
- `Core` emittiert `module:activated`

#### 5.7 `disable`

Aktuelle Bedeutung:

- Timer/Watcher stoppen
- Listener abmelden
- flüchtigen Zustand abbauen
- Modul als inaktiv markieren

Aktuelles Framework-Verhalten:

- wenn `disable` fehlt, aber `deactivate` existiert, wird stattdessen `deactivate` aufgerufen
- wenn das Modul das aktive Modul war, wird `Core.state.activeModule` geleert
- `Core` emittiert `module:deactivated`

#### 5.8 `uninstall`

Aktuelle Bedeutung:

- expliziter finaler Cleanup
- modul-eigene Storage-/Database-Daten entfernen, wenn das Modul dafuer ausgelegt ist
- keine Runtime-Registrierungen zurücklassen

Aktuelles Framework-Verhalten:

- `uninstall()` wird aufgerufen, falls vorhanden
- danach wird `ModuleManager.unregister(moduleId)` ausgefuehrt
- die Registry-Entfernung ist nur in-memory

#### 5.9 Shutdown und Cleanup

Es gibt keinen Modul-Level-`shutdown()`-Hook.

Waehrend `CoreShutdown.stop()`:

- werden alle aktuell aktivierten/aktiven Module iteriert
- `ModuleManager.disable(module.id)` wird aufgerufen
- Module werden **nicht** automatisch deinstalliert

Deshalb gilt:

- transienter Cleanup muss in `disable()` passieren
- permanente Entfernung muss in `uninstall()` passieren

#### 5.10 Was bei Lifecycle-Fehlern passiert

Aktuelles Verhalten:

- `discoverModules()` kapselt `install -> initialize -> enable` in ein gemeinsames `try/catch`
- wenn eine dieser Methoden wirft, wird `CoreErrorHandler.handle(...)` aufgerufen
- das Modul kann, je nach Fehlerzeitpunkt, bereits registriert sein
- es gibt keinen Rollback-Manager

Deshalb muss ein Modul partiell angelegten Zustand selbst wieder bereinigen, wenn es nach Ressourcenallokation fehlschlagen kann.

---

### 6. Core-Anbindung

Dieser Abschnitt listet die tatsaechlich global verfuegbaren APIs auf, die ein Modul aufrufen kann, sowie die Sicherheitsgrenzen, die sich aus dem aktuellen Code ergeben.

#### 6.1 `Core`

Datei: [platform/core.js](/workspaces/CatchTrack-V.1.0/platform/core.js)

Verfuegbare Methoden:

- `getModuleRegistry()`
- `getModuleManager()`
- `getModules()`
- `on(eventName, callback)`
- `off(eventName, callback)`
- `once(eventName, callback)`
- `emit(eventName, data = null)`

Beispiel:

```js
const unsubscribe = window.Core.on('auth:logout', () => {
  // Modulzustand zuruecksetzen
});
window.Core.emit('sample-module:ready', { moduleId: 'sample-module' });
unsubscribe();
```

Sicherheit:

- benoetigt `CoreEventBus`
- `emit` ist nur Event-Publishing, keine Autorisierung

#### 6.2 `ModuleRegistry`

Datei: [platform/module-registry.js](/workspaces/CatchTrack-V.1.0/platform/module-registry.js)

Verfuegbare Methoden:

- `register(module)`
- `unregister(moduleId)`
- `get(moduleId)`
- `getAll()`
- `has(moduleId)`
- `clear()`
- `discover()`

Modul-sichere Nutzung:

- read-only Lookup mit `get`, `getAll`, `has`

Nicht in eigenstaendiger Modul-Logik verwenden:

- `register`
- `unregister`
- `clear`
- `discover`

Das sind Framework-Management-Operationen.

#### 6.3 `ModuleManager`

Datei: [platform/module-manager.js](/workspaces/CatchTrack-V.1.0/platform/module-manager.js)

Verfuegbare Methoden:

- `discoverModules()`
- `validateDependencies(moduleId)`
- `register(module)`
- `unregister(moduleId)`
- `get(moduleId)`
- `getAll()`
- `getStatus(moduleId)`
- `install(moduleId)`
- `initialize(moduleId)`
- `enable(moduleId)`
- `disable(moduleId)`
- `update(moduleId)`
- `uninstall(moduleId)`
- `activate(moduleId)`
- `deactivate(moduleId)`

Modul-sichere Nutzung:

- `get`, `getAll`, `getStatus`
- optional `disable(this.id)` oder `enable(this.id)` aus administrativen Werkzeugen

In einem normalen Modul nicht verwenden, um eigene Installation oder Discovery automatisch zu steuern.

#### 6.4 `CoreContext`

Datei: [platform/core-context.js](/workspaces/CatchTrack-V.1.0/platform/core-context.js)

Verfuegbare Methoden:

- `get()`
- `setRuntimeValue(key, value)`
- `updateOnlineState()`

Modul-sichere Nutzung:

- `get()` fuer Lesezugriff

Fuer normale Module unsicher:

- `setRuntimeValue(...)` veraendert gemeinsam genutzten Runtime-State

#### 6.5 `CoreLifecycle`

Datei: [platform/core-lifecycle.js](/workspaces/CatchTrack-V.1.0/platform/core-lifecycle.js)

Verfuegbare Member:

- `phases`
- `getPhase()`
- `setPhase(phase)`
- `is(phase)`

Modul-sichere Nutzung:

- `getPhase()`
- `is(phase)`

Verboten:

- `setPhase(...)` aus einem eigenstaendigen Modul

#### 6.6 `CoreState`

Datei: [platform/core-state.js](/workspaces/CatchTrack-V.1.0/platform/core-state.js)

Verfuegbare Methoden:

- `set(key, value)`
- `get(key, defaultValue = null)`
- `has(key)`
- `remove(key)`
- `getAll()`
- `clear()`

Beispiel:

```js
window.CoreState.set('sample-module:mode', 'ready');
const mode = window.CoreState.get('sample-module:mode', 'idle');
window.CoreState.remove('sample-module:mode');
```

Sicherheit:

- gemeinsam genutzte globale Map
- Keys mit Modul-ID praefixen
- `clear()` nicht aufrufen

#### 6.7 `CoreStorage`

Datei: [platform/core-storage.js](/workspaces/CatchTrack-V.1.0/platform/core-storage.js)

Verfuegbare Methoden:

- `set(key, value)`
- `get(key, defaultValue = null)`
- `remove(key)`
- `has(key)`
- `clear()`

Verhalten:

- persistiert in `localStorage`
- tatsaechliches gespeichertes Key-Format ist `core:${key}`

Beispiel:

```js
window.CoreStorage.set('sample-module:lastState', { enabled: true });
const state = window.CoreStorage.get('sample-module:lastState', null);
window.CoreStorage.remove('sample-module:lastState');
```

Sicherheit:

- Keys werden ueber alle Module hinweg geteilt
- `clear()` nicht aufrufen

#### 6.8 `DatabaseManager`

Datei: [platform/database-manager.js](/workspaces/CatchTrack-V.1.0/platform/database-manager.js)

Verfuegbare Methoden:

- `init()`
- `openDatabase()`
- `createStores(db)`
- `save(storeName, data)`
- `get(storeName, key)`
- `insert(storeName, data)`
- `update(storeName, data)`
- `delete(storeName, key)`
- `clear(storeName)`
- `findByIndex(storeName, indexName, value)`
- `getAll(storeName)`
- `transaction(storeName, mode, callback)`
- `getStats()`
- `deleteDatabase()`

Aktuelle Built-in-Stores:

- `users`
- `modules`
- `logs`
- `sessions`
- `settings`
- `cache`
- `sync`

Modul-sichere Nutzung:

- `save`, `get`, `insert`, `update`, `delete`, `findByIndex`, `getAll`, `transaction`

Unsichere/destruktive Nutzung:

- `createStores(...)`
- `clear(storeName)` auf gemeinsam genutzten Stores
- `deleteDatabase()`

Wichtige Framework-Grenzen:

- keine API zur Modul-Store-Registrierung
- keine Migrations-API
- keine Schema-Versionierung pro Modul
- alle Stores sind gemeinsam genutzt

#### 6.9 `CoreEventBus`

Datei: [platform/core-event-bus.js](/workspaces/CatchTrack-V.1.0/platform/core-event-bus.js)

Verfuegbare Methoden:

- `subscribe(eventName, callback)`
- `unsubscribe(eventName, callback)`
- `publish(eventName, data = null)`
- `clear(eventName)`

Beispiel:

```js
const off = window.CoreEventBus.subscribe('sample-module:changed', (payload) => {
  console.log(payload);
});
window.CoreEventBus.publish('sample-module:changed', { ready: true });
off();
```

Sicherheit:

- `subscribe` liefert eine Unsubscribe-Closure; diese aufbewahren
- Listener-Fehler werden an `CoreErrorHandler` geleitet
- `clear()` nicht global aufrufen

#### 6.10 `CoreEventRing`

Datei: [platform/core-event-ring.js](/workspaces/CatchTrack-V.1.0/platform/core-event-ring.js)

Verfuegbare Methoden:

- `init()`
- `push(namespace, payload)`
- `get(namespace = null)`
- `clear(namespace = null)`

Verhalten:

- nur In-Memory
- auf 256 Eintraege pro Namespace begrenzt
- rein diagnostisch, keine Persistenz

Modul-sichere Nutzung:

- `push('sample-module', payload)`
- `get('sample-module')`

Unsicher:

- `clear()` ohne Namespace

#### 6.11 `CoreAudit`

Datei: [platform/core-audit.js](/workspaces/CatchTrack-V.1.0/platform/core-audit.js)

Verfuegbare Methoden:

- `init()`
- `record(actor, action, resource, result, metadata = {})`
- `list()`
- `clear()`

Korrektes Signatur-Beispiel:

```js
window.CoreAudit.record(
  'sample-module',
  'sample-module:enable',
  'sample-module',
  'success',
  { status: 'enabled' }
);
```

Wichtiger Warnhinweis aus dem aktuellen Code:

- das GPS-Modul ruft aktuell `CoreAudit.record(action, detail)` nur mit zwei Argumenten auf
- dieser Aufruf funktioniert syntaktisch, verschiebt aber die inhaltliche Bedeutung der Parameter
- zukuenftige Module muessen die reale Signatur wie oben gezeigt verwenden

Unsicher:

- `clear()`

#### 6.12 `CoreAuth`

Datei: [platform/core-auth.js](/workspaces/CatchTrack-V.1.0/platform/core-auth.js)

Verfuegbare Methoden:

- `init()`
- `getUserModule()`
- `resolveBootstrapConfig()`
- `setDeveloperPassword(password)`
- `login(credentialsOrUserId)`
- `logout(sessionId = null)`
- `getCurrentUser()`
- `getCurrentSession()`
- `getSessionStateSnapshot()`
- `serializeSessionForTransport()`
- `isAuthenticated()`
- `requireAuth()`
- `listSessions()`

Beispiel:

```js
const auth = await window.CoreAuth.requireAuth();
if (!auth.ok) {
  return auth;
}
const user = window.CoreAuth.getCurrentUser();
```

Sicherheit:

- dies ist die einzige Session-Truth im aktuellen Code
- kein paralleles Auth-System im Modul anlegen

#### 6.13 `CoreAccess`

Datei: [platform/core-access.js](/workspaces/CatchTrack-V.1.0/platform/core-access.js)

Verfuegbare Methoden:

- `init()`
- `can(subject, action, resource = null, context = {})`
- `hasRole(user, role)`
- `hasPermission(user, permission)`

Beispiel:

```js
const user = window.CoreAuth.getCurrentUser();
const access = window.CoreAccess.can(user, 'module:read', 'sample-module');
if (!access.ok) {
  throw new Error(access.message);
}
```

Sicherheit:

- Permission-Checks sind explizit
- es gibt keine automatische Enforcement-Huelle um Modulmethoden

#### 6.14 `ConfigManager`

Datei: [platform/config-manager.js](/workspaces/CatchTrack-V.1.0/platform/config-manager.js)

Verfuegbare Methoden:

- `init()`
- `loadDefaultConfigs()`
- `set(key, value)`
- `get(key, defaultValue)`
- `getPath(path, defaultValue)`
- `has(key)`
- `setPath(path, value)`
- `watch(key, callback)`
- `notifyWatchers(key, newValue, oldValue)`
- `getAll()`
- `merge(newConfigs)`
- `persist(key)`
- `load(key)`

Aktuelle Standard-Top-Level-Konfigurationen:

- `app`
- `bootstrap`
- `database`
- `api`
- `modules`
- `security`
- `performance`
- `ui`
- `features`

Modul-sichere Nutzung:

- vorhandene Config mit `get` / `getPath` lesen
- vorhandene Config beobachten

Grenze:

- es gibt keine Config-Delete-API
- dauerhaft modul-eigene Config-Keys koennen daher nicht vollstaendig sauber entfernt werden
- keine permanenten Modul-Config-Keys hier erfinden, ausser eine Framework-Aenderung ist explizit freigegeben

#### 6.15 `ServiceManager`

Datei: [platform/service-manager.js](/workspaces/CatchTrack-V.1.0/platform/service-manager.js)

Verfuegbare Methoden:

- `init()`
- `register(name, service)`
- `get(name)`
- `has(name)`
- `getAll()`

Aktuelle Standard-Services:

- `user`
- `auth`
- `module`
- `logging`
- `cache`

Beispiel:

```js
const logger = window.ServiceManager.get('logging');
logger.info('Sample module enabled', 'sample-module');
```

Kritische Grenze:

- es gibt keine `unregister`-Service-API
- ein modul-eigener Service kann bei `uninstall` nicht sauber entfernt werden

Verbindliche Regel:

- vorhandene Services koennen genutzt werden
- neue modul-private Services duerfen in einem sauber entfernbaren eigenstaendigen Modul nicht registriert werden

#### 6.16 `CoreSecurity`

Datei: [platform/security.js](/workspaces/CatchTrack-V.1.0/platform/security.js)

Verfuegbare Methoden:

- `registerAllowedOrigin(origin)`
- `isOriginAllowed(origin)`
- `sanitizeText(value, options)`
- `generateToken(length = 32)`
- `hash(value)`
- `validateInput(value, options)`

Beispiel:

```js
const safeLabel = window.CoreSecurity.sanitizeText(input, { maxLength: 120 });
```

#### 6.17 `CoreErrorHandler` und `ErrorLog`

Dateien:

- [platform/core-error-handler.js](/workspaces/CatchTrack-V.1.0/platform/core-error-handler.js)
- [platform/error-log.js](/workspaces/CatchTrack-V.1.0/platform/error-log.js)

Verfuegbare Methoden:

- `CoreErrorHandler.handle(error, context = {})`
- `ErrorLog.record(error, context = {})`
- `ErrorLog.getAll()`
- `ErrorLog.clear()`

Korrekte Modul-Nutzung:

```js
try {
  // riskanter Code
} catch (error) {
  window.CoreErrorHandler.handle(error, {
    type: 'sample-module',
    moduleId: 'sample-module'
  });
  throw error;
}
```

#### 6.18 `UserModule` und `AdminModule`

Dateien:

- [platform/core-user.js](/workspaces/CatchTrack-V.1.0/platform/core-user.js)
- [platform/core-admin.js](/workspaces/CatchTrack-V.1.0/platform/core-admin.js)

Dies sind Framework-Module, keine generischen Extension-Interfaces, sie sind aber global verfuegbar.

Nutzbare `UserModule`-Methoden:

- `listUsers()`
- `getUserById(userId)`
- `getUserByUsername(username)`
- `createUser(userData, actor = null)`
- `updateUser(userId, updates = {}, actor = null)`
- `deleteUser(userId, actor = null)`
- `setStatus(userId, status, actor = null)`
- `login(credentials)`
- `logout(sessionId = null)`
- `getCurrentUser()`
- `getCurrentSession()`
- `hasRole(role)`
- `hasPermission(permission)`
- `isAdmin()`
- `isDeveloper()`

Nutzbare `AdminModule`-Methoden:

- `listUsers()`
- `getUserById(userId)`
- `createUser(...)`
- `updateUser(...)`
- `deleteUser(...)`
- `getCurrentUser()`
- `getAuditLog()`
- `getEventRingBuffer()`
- `getSystemStats()`
- `canAccess(subject, action, resource = null)`
- `healthCheck()`
- `getDebugInfo()`

Regel:

- nur verwenden, wenn das Modul wirklich User-/Admin-Daten braucht
- nicht als stabile Backend-API missverstehen; es sind Browser-Globals der aktuellen Runtime

---

### 7. Storage-Regeln

#### 7.1 Tatsaechliches Storage-System

Das aktuelle einfache Storage-System ist [platform/core-storage.js](/workspaces/CatchTrack-V.1.0/platform/core-storage.js).

Es:

- nutzt Browser-`localStorage`
- praefixt jeden Key mit `core:`
- speichert JSON-serialisierte Werte

#### 7.2 Korrekte Key-Struktur

Da Storage geteilt ist, verwende:

- `<module-id>:<purpose>`

Beispiel:

- `sample-module:lastState`
- `gps:lastPosition`

#### 7.3 Erlaubte Operationen

- `set`
- `get`
- `remove`
- `has`

#### 7.4 Verbotene Operation

- `clear()`

Grund:

- dadurch werden alle Framework-lokalen Keys geloescht, nicht nur Modul-Keys

#### 7.5 Persistenz und Isolation

Technische Wahrheit:

- Persistenz existiert
- harte Isolation existiert nicht
- Isolation existiert nur durch disziplinierte Key-Benennung

#### 7.6 Neutrales Beispiel

```js
const STORAGE_KEY = 'sample-module:lastState';

window.CoreStorage.set(STORAGE_KEY, {
  enabled: true,
  updatedAt: new Date().toISOString()
});

const lastState = window.CoreStorage.get(STORAGE_KEY, null);

window.CoreStorage.remove(STORAGE_KEY);
```

---

### 8. Datenbank-Regeln

#### 8.1 Tatsaechliches Datenbanksystem

Die aktuelle Datenbank-Schicht ist [platform/database-manager.js](/workspaces/CatchTrack-V.1.0/platform/database-manager.js).

Sie:

- nutzt IndexedDB
- Datenbankname: `CoreDB`
- Version: `1`
- erzeugt einen festen Satz an Object Stores

#### 8.2 Erlaubter Datenbankzugriff

Module duerfen aufrufen:

- `save`
- `get`
- `insert`
- `update`
- `delete`
- `findByIndex`
- `getAll`
- `transaction`

#### 8.3 Tatsaechliche Store-Liste

Aktuelle Stores:

- `users`
- `modules`
- `logs`
- `sessions`
- `settings`
- `cache`
- `sync`

#### 8.4 Isolationsrealitaet

Es gibt keine API zur Registrierung modul-eigener Stores.

Deshalb gilt:

- jede Datenbanknutzung erfolgt gegen gemeinsam genutzte Stores
- harte Datenbank-Isolation existiert nicht
- die aktuell modul-sichere Praxis ist die Nutzung modul-praefixter IDs und Payload-Felder innerhalb eines Shared Stores

Das GPS-Modul schreibt aktuell in:

- Store `sync`
- Record-IDs wie `gps-<timestamp>`

#### 8.5 Schema- und Migrationsregeln

Aktuelle Framework-Wahrheit:

- feste Stores werden in `createStores` angelegt
- es existiert keine Migrations-API
- es existiert keine modulweise Schema-Registry
- es existiert kein modulweiser Versions-Upgrade-Hook

Deshalb darf ein eigenstaendiges Modul nicht annehmen:

- eigene Object-Store-Erzeugung
- automatische Migrationen
- Schema-Installations-Hooks

#### 8.6 Entfernungsregel

Fuer sauberes `uninstall` muessen Records so geschrieben werden, dass sie spaeter gezielt geloescht werden koennen.

Bevorzugtes aktuelles Muster:

- feste IDs, oder
- IDs und Records mit Modul-ID-Praefix

Muster vermeiden, die das Leeren eines gesamten Shared Stores erfordern.

---

### 9. Event-Regeln

#### 9.1 Tatsaechliches Event-System

Das Framework verwendet:

- [platform/core-event-bus.js](/workspaces/CatchTrack-V.1.0/platform/core-event-bus.js) fuer Publish/Subscribe
- [platform/core-event-ring.js](/workspaces/CatchTrack-V.1.0/platform/core-event-ring.js) fuer diagnostische Ring-Buffer

#### 9.2 Korrekte Event-Benennung

Verwende:

- `<module-id>:<event-name>`

Beispiele aus dem aktuellen GPS-Modul:

- `gps:installed`
- `gps:initialized`
- `gps:enabled`
- `gps:disabled`
- `gps:position`
- `gps:error`

#### 9.3 Listener-Cleanup

Aktuell erforderliches Muster:

- die von `subscribe` zurueckgegebene Unsubscribe-Funktion aufbewahren
- sie in `disable()` und `uninstall()` aufrufen

Es gibt kein automatisches Cleanup pro Modul.

#### 9.4 Payloads

Es gibt kein formales Schema.

Wenn moeglich, plain JSON-serialisierbare Objekte verwenden.

#### 9.5 Fehlerverhalten

Wenn ein Event-Listener wirft:

- faengt `CoreEventBus.publish` den Fehler ab
- `CoreErrorHandler.handle(...)` wird aufgerufen

Der Bus bricht andere Listener dadurch nicht ab.

#### 9.6 Neutrales Beispiel

```js
let offLogout = null;

function enableListeners() {
  offLogout = window.CoreEventBus.subscribe('auth:logout', () => {
    window.CoreStorage.remove('sample-module:lastState');
  });
}

function disableListeners() {
  if (offLogout) {
    offLogout();
    offLogout = null;
  }
}

window.CoreEventBus.publish('sample-module:enabled', {
  moduleId: 'sample-module'
});
```

---

### 10. Service-Regeln

#### 10.1 Tatsaechlicher Service-Manager

Die Service-Schicht ist [platform/service-manager.js](/workspaces/CatchTrack-V.1.0/platform/service-manager.js).

#### 10.2 Aktuelle Standard-Services

- `user`
- `auth`
- `module`
- `logging`
- `cache`

#### 10.3 Service-Registrierung

Technisch verfuegbar:

- `ServiceManager.register(name, service)`

Aktuelle Grenze:

- es gibt kein `unregister`

Deshalb gilt:

- eigenstaendige Module, die sauber entfernbar sein muessen, duerfen keine neuen privaten Services registrieren
- vorhandene Services zu konsumieren ist zulaessig

#### 10.4 Service-Lookup

Verwende:

```js
const logger = window.ServiceManager.get('logging');
await logger.info('Message', 'sample-module');
```

#### 10.5 Dependency-Regel

Wenn ein Modul von einem Service abhaengt, ist diese Abhaengigkeit versteckt, solange sie nicht auch in der Modul-Spezifikation dokumentiert wird.

Verbindliche Regel:

- ein Modul darf sich nicht auf eine undokumentierte versteckte Service-Dependency verlassen

#### 10.6 Fehlerverhalten

- `get(name)` wirft, wenn der Service nicht existiert
- `register(name, service)` wirft bei ungueltigem Namen oder ungueltigem Service-Objekt

---

### 11. API und Routing

#### 11.1 Tatsaechliche Server-Routen

Der aktuelle Server in [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js) stellt bereit:

- `/health`
- `/api/health`
- `/api/status`
- `/api/modules`
- statische Dateien aus `/platform/...`
- statische Dateien aus `/app/modules/...`
- statische Dateien aus [webroot/](/workspaces/CatchTrack-V.1.0/webroot)

#### 11.2 Modul-APIs

Aktuelle Framework-Wahrheit:

- es gibt **keinen** Registrierungsmechanismus fuer Modul-APIs
- es gibt **kein** Manifest-Feld, das API-Routen mountet
- es gibt **keinen** Backend-Verzeichnisvertrag fuer Module
- es gibt **kein** Request-Dispatching nach Modul-ID

Deshalb kann ein zukuenftiges eigenstaendiges Modul ohne Server-Code-Aenderungen keine eigene Backend-API bereitstellen.

Das liegt ausserhalb des eigenstaendigen Modul-Vertrags.

#### 11.3 Mount Paths

`mountPath` wird nicht unterstuetzt.

Der einzige aktuelle modulbezogene HTTP-Pfad ist statisches Serving:

- `/app/modules/<folder>/...`

#### 11.4 Root-Kontext versus Modul-Kontext

Aktuelle Framework-Realitaet:

- Root-UI-Kontext = [webroot/index.html](/workspaces/CatchTrack-V.1.0/webroot/index.html), [webroot/admin.html](/workspaces/CatchTrack-V.1.0/webroot/admin.html), [webroot/dev.html](/workspaces/CatchTrack-V.1.0/webroot/dev.html)
- Modul-Kontext = ein Modulobjekt, das in dieselbe Browser-Runtime geladen wird, und optional ein DOM-Container, der an `renderUserInterface(container)` uebergeben wird

Es gibt keinen isolierten Request-Kontext pro Modul.

#### 11.5 Unbekannte Module

Aktuelle Behandlung:

- ungueltige oder nicht lesbare Manifeste werden uebersprungen
- Manifeste ohne passendes globales Modulobjekt werden uebersprungen
- doppelte IDs werden nicht erneut registriert

#### 11.6 Routing-Fehlerverhalten

Tatsaechliches aktuelles Server-Verhalten in [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js):

- unbekannte oder fehlende statische Datei -> JSON-`404` mit `NOT_FOUND`
- Directory-Traversal-Versuch -> JSON-`403` mit `FORBIDDEN`
- direkte Anfrage an `/admin.html` oder `/dev.html` ohne passenden `x-admin-access-token`-Header und ohne `ADMIN_ACCESS_TOKEN`-Umgebungsvariable -> JSON-`403` mit `FORBIDDEN`

Es gibt keinen modulspezifischen 404-Handler und keinen Modul-Routing-Fallback.

---

### 12. UI- / Webroot-Regeln

#### 12.1 Tatsaechlicher UI-Einstiegspunkt fuer Module

Der aktuelle nutzerseitige UI-Einstiegspunkt ist:

- `renderUserInterface(container)`

Dies wird von [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js) aufgerufen, wenn der Benutzer ein aktives Modul auswaehlt.

#### 12.2 Wie ein Modul in der User-UI sichtbar wird

In [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js) wird ein Modul gelistet, wenn:

- es in `ModuleRegistry` existiert
- es aktiv ist oder `status === 'enabled'`

In [webroot/master-ui.js](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js) wird Sichtbarkeit zusaetzlich ueber Permissions des aktuellen Benutzers gefiltert.

#### 12.3 Modul-HTML

Als eigenstaendig gemountete Seite nicht unterstuetzt.

Aktuelle Regel:

- UI-DOM innerhalb von `renderUserInterface(container)` aufbauen
- nur den uebergebenen Container verwenden

#### 12.4 Modul-Webroot

`webRoot` / `webroot`-Felder werden in Modul-Manifesten nicht unterstuetzt.

Es gibt kein automatisches Mounten von Modul-UI-Assets ausser der statischen Dateifreigabe unter `/app/modules/<folder>/...`.

#### 12.5 Kommunikation mit dem Core

Tatsaechlich verfuegbare Kommunikationsmechanismen:

- direkte Aufrufe globaler Framework-APIs
- `CoreEventBus` / `Core.emit`
- Storage-/Database-Zugriffe

Es existiert keine Modul-Bridge und keine dedizierte IPC-Schicht.

#### 12.6 Kommunikation mit einer Modul-API

Nicht unterstuetzt, weil Modul-Backend-APIs nicht unterstuetzt werden.

#### 12.7 Root-UI versus Modul-UI

Aktuelle Trennung:

- Root-Shells leben in [webroot/index.html](/workspaces/CatchTrack-V.1.0/webroot/index.html), [webroot/admin.html](/workspaces/CatchTrack-V.1.0/webroot/admin.html) und [webroot/dev.html](/workspaces/CatchTrack-V.1.0/webroot/dev.html)
- Modul-UI ist ein Fragment innerhalb der User-Shell

Es gibt keinen Modul-Router.

---

### 13. Design- und CSS-Regeln

#### 13.1 Tatsaechliches Styling-System

Alle aktuellen Styles liegen in:

- [webroot/style.css](/workspaces/CatchTrack-V.1.0/webroot/style.css)

Diese Datei enthaelt:

- Core-Shell-Styles
- Admin-/Developer-Styles
- User-App-Styles
- GPS-spezifische Selektoren

#### 13.2 Theme-Konfiguration

`ConfigManager` enthaelt eine `ui`-Konfiguration mit:

- `theme`
- `language`
- `responsive`
- `animationsEnabled`
- `updateInterval`

Im aktuellen Code gilt aber:

- keine Theme-Engine konsumiert diese Werte
- keine Modul-Theme-Registrierung existiert

Deshalb existiert Theme-Konfiguration aktuell nur als allgemeine Config-Daten, nicht als angewendetes Modul-Theming-System.

#### 13.3 Modul-CSS

Aktuelle Framework-Wahrheit:

- es gibt keine API fuer modul-lokale CSS-Registrierung
- es gibt kein Manifest-CSS-Feld
- es gibt keine automatische Stylesheet-Injektion pro Modul

Deshalb sollte ein eigenstaendiges zukuenftiges Modul:

- bestehende neutrale Klassen wiederverwenden, wo immer moeglich
- ansonsten funktionale UI rendern, ohne neue Stylesheet-Unterstuetzung vorauszusetzen

#### 13.4 CSS-Isolation

Harte CSS-Isolation existiert nicht.

Wenn eine Framework-Aenderung explizit Styles hinzufuegt, muessen diese mit der Modul-ID gepraefixt werden, zum Beispiel:

- `.sample-module-*`

Aber das Hinzufuegen solcher Styles erfordert Aenderungen in [webroot/style.css](/workspaces/CatchTrack-V.1.0/webroot/style.css) und ist damit eine Framework-Aenderung, keine normale Modul-Aenderung.

#### 13.5 Core-Styles, die ein eigenstaendiges Modul nicht ueberschreiben darf

Nicht veraendern:

- Root-Shell-Selektoren in [webroot/style.css](/workspaces/CatchTrack-V.1.0/webroot/style.css)
- Admin-Shell-Selektoren
- Developer-Shell-Selektoren
- User-Shell-Selektoren

Das GPS-Modul ist nur ein Beleg dafuer, dass solche Styles im aktuellen Repository bereits existieren, nicht der Beweis fuer ein eigenstaendiges modul-lokales CSS-Ladesystem.

---

### 14. Auth-, Access- und Security-Regeln

#### 14.1 Authentifizierung

Aktuelle Authentifizierungs-Wahrheit:

- `CoreAuth` ist die einzige Session-Truth
- `UserModule.login/logout` delegiert an `CoreAuth`

Verbindliche Regel:

- ein Modul darf kein eigenes paralleles User-Session-System anlegen

#### 14.2 Autorisierung

Aktuelle Autorisierungs-Wahrheit:

- `CoreAccess.can(...)`
- `CoreAccess.hasPermission(...)`
- `CoreAccess.hasRole(...)`

Verbindliche Regel:

- wenn ein Modul eine geschuetzte Aktion ausfuehrt, muss es den Zugriff explizit pruefen

#### 14.3 Permissions in `module.json`

Aktuelle Wirkung:

- Modul-`permissions` beeinflussen die UI-Sichtbarkeit
- sie blockieren weder Methodenaufrufe noch Aktivierung automatisch

Permissions sind daher fuer sich allein keine vollstaendige Sicherheitsbarriere.

#### 14.4 Security-Helper

`CoreSecurity` verwenden fuer:

- Text-Sanitizing
- Token-Erzeugung
- Hashing
- Input-Validierung

#### 14.5 Modul-Isolationsrealitaet

Harte technische Sandbox-Isolation existiert nicht.

Ein geladenes Modul teilt:

- denselben Browser-Global-Space
- denselben Event-Bus
- denselben Storage-Namensraum
- dieselben IndexedDB-Stores

Das aktuelle Framework kann also keine starke Modul-Isolation garantieren.

Das ist eine architektonische Grenze des aktuellen Codes.

#### 14.6 Verbotene Umgehungen

Nicht:

- `CoreAuth` durch privaten Session-Storage umgehen
- `CoreAccess` bei geschuetzten Aktionen umgehen
- in Storage-Keys anderer Module schreiben
- Shared Stores/Buffers/Logs komplett leeren
- den privaten Closure-State anderer Module direkt manipulieren
- Cross-App-Regeln einfuehren; der aktuelle Framework-Vertrag ist nicht multi-app-faehig

---

### 15. Fehlerbehandlung, Audit und Logging

#### 15.1 Fehlerbehandlung

Verwende:

- `CoreErrorHandler.handle(error, context)`

fuer Runtime-Fehler, die zentral protokolliert werden sollen.

#### 15.2 Fehlerobjekte

Der aktuelle Code akzeptiert:

- echte `Error`-Instanzen
- Nicht-Error-Werte, die zu `Error` normalisiert werden

#### 15.3 Audit

Verwende:

- `CoreAudit.record(actor, action, resource, result, metadata)`

fuer Modul-Lifecycle und geschuetzte Datenaktionen.

#### 15.4 Logging

Verfuegbare Optionen:

- `ErrorLog.record(...)`
- `ServiceManager.get('logging')`
- `console.*` existiert zwar, aber zentrales Framework-Logging ist begrenzt

#### 15.5 Erwartete direkte Rueckgabeformen

Der aktuelle Codebestand verwendet einfache Ergebnisobjekte wie:

```js
{ ok: true, code: 'USER_CREATED', data: ... }
{ ok: false, code: 'USER_NOT_FOUND', message: '...' }
```

Diese Form ist ein Repository-Muster, aber kein erzwungenes Interface.

#### 15.6 Cleanup bei Fehlern

Da es keinen Rollback-Manager gibt:

- Listener entfernen
- Timer/Watcher stoppen
- partiell angelegten modul-eigenen Zustand selbst zuruecknehmen

Wenn der Fehler den Lifecycle abbrechen muss, nach dem Cleanup werfen.

---

### 16. Internationalisierung

#### 16.1 Tatsaechliches i18n-System

Das i18n-System ist [platform/core-i18n.js](/workspaces/CatchTrack-V.1.0/platform/core-i18n.js).

Verfuegbare Methoden:

- `init()`
- `t(key, params)`
- `setLocale(locale)`
- `getLocale()`
- `getStoredPreference()`
- `getSupportedLocales()`
- `getDeviceLocale()`

#### 16.2 Aktuelle Sprachen

Unterstuetzt:

- `de`
- `en`

#### 16.3 Fallback-Verhalten

Aktuelle Lookup-Reihenfolge:

1. aktuelle Sprache
2. Deutsch (`de`)
3. roher Key

#### 16.4 Modul-spezifische Uebersetzungen

Nicht als separate Modul-Dateien unterstuetzt.

Es gibt:

- keine API zur Registrierungs von Translations
- kein Modul-Translations-Manifest-Feld
- keine dynamische Merge-API in `TRANSLATIONS`

Deshalb sind eigenstaendige modul-spezifische Translation-Bundles kein Teil des aktuellen Vertrags.

#### 16.5 Aktuelle UI-Nutzung

Die aktuellen Webroot-UIs verwenden ueberwiegend hart kodierte Strings.

Die i18n-Infrastruktur existiert also, ist aber noch nicht die universelle UI-String-Quelle.

---

### 17. Abhaengigkeiten

#### 17.1 Package-Abhaengigkeiten

Aktuelle Wahrheit aus [package.json](/workspaces/CatchTrack-V.1.0/package.json) und [package-lock.json](/workspaces/CatchTrack-V.1.0/package-lock.json):

- keine Runtime-NPM-Dependencies deklariert
- keine Dev-Dependencies deklariert
- nur Script: `npm start`

Verbindliche Regel:

- ein eigenstaendiges zukuenftiges Modul darf nicht voraussetzen, dass irgendeine externe Library verfuegbar ist

#### 17.2 Modul-Abhaengigkeiten

Der einzige aktuelle formale Modul-Dependency-Mechanismus ist:

- `dependencies`-Array im Manifest
- geprueft durch `ModuleManager.validateDependencies`

Dependency-Namen muessen registrierten Modul-IDs entsprechen.

#### 17.3 Versteckte Abhaengigkeiten

Verboten:

- Abhaengigkeit von undeklarierten Globals, die ein anderes App-Modul erzeugt
- Abhaengigkeit von manuellen CSS-Ergaenzungen, die nicht als Framework-Aenderung dokumentiert sind
- Abhaengigkeit von zusaetzlichen Server-Routen, die nicht Teil der Framework-Arbeit sind

#### 17.4 Externe Libraries

Das Hinzufuegen externer Libraries erfordert Aenderungen an:

- [package.json](/workspaces/CatchTrack-V.1.0/package.json)
- [package-lock.json](/workspaces/CatchTrack-V.1.0/package-lock.json)

Das ist eine Framework-Aenderung und keine eigenstaendige Modul-Arbeit.

---

### 18. Naming-Conventions

Das aktuelle Framework erzwingt viele Benennungsformate im Code nicht. Die folgende Tabelle trennt tatsaechliche Enforcement-Regeln von Repository-Konventionen, die aus den aktuellen Dateien abgeleitet sind.

| Element | Tatsaechliche Code-Enforcement | Aktuelle Repository-Konvention |
| --- | --- | --- |
| `id` | nicht-leerer String | lower-case kebab-case, moeglichst identisch zum Ordner |
| Ordnername | direktes Child von `app/modules` | identisch zur Modul-ID |
| `globalName` | optionaler String, falls genutzt | PascalCase mit Suffix `Module` |
| Events | beliebiger String | `<module-id>:<event>` |
| Storage-Keys | beliebiger nicht-leerer String | `<module-id>:<purpose>` |
| Database-IDs | store-spezifisch | mit Modul-ID praefixen |
| CSS-Klassen | keine Framework-Regel | mit Modul-ID praefixen |
| DOM-IDs | keine Framework-Regel | mit Modul-ID praefixen |
| Funktionen | keine Framework-Regel | umgebenden JS-Stil der Datei verwenden |

Wichtig: Nur die linke Spalte ist technisch erzwungen. Die rechte Spalte ist die repository-sichere Konvention.

---

### 19. Versionierung und Kompatibilitaet

#### 19.1 Modulversion

`module.json.version` wird gespeichert und angezeigt, aber:

- es gibt keinen SemVer-Parser
- es gibt kein Kompatibilitaets-Gate

#### 19.2 Framework-Version

Aktuelle sichtbare Versionsquellen:

- [package.json](/workspaces/CatchTrack-V.1.0/package.json): `1.0.0`
- [platform/core.js](/workspaces/CatchTrack-V.1.0/platform/core.js): `1.0.0`
- [platform/core-config.js](/workspaces/CatchTrack-V.1.0/platform/core-config.js): `1.0.0`

#### 19.3 API-Kompatibilitaet

Es gibt keine automatische Kompatibilitaetsmatrix.

Kompatibilitaet ist manuell und quellenbasiert.

#### 19.4 Breaking Changes

Eine Aenderung ist breaking, wenn sie eines der folgenden Dinge ohne koordinierte Framework-Arbeit veraendert:

- globale Modulobjekt-Aufloesung
- Lifecycle-Methodennamen
- Manifest-Feldnamen, die vom Loader/Manager verwendet werden
- UI-Hook `renderUserInterface(container)`
- Annahmen ueber Shared-Store-Nutzung

---

### 20. Modul-Isolation

#### 20.1 Was ein Modul technisch sehen kann

Ein geladenes Modul kann technisch zugreifen auf:

- alle global geladenen Framework-Objekte auf `window`
- den gemeinsamen Event-Bus
- gemeinsamen Storage
- gemeinsame IndexedDB-Stores
- den DOM der geladenen Seite

#### 20.2 Was ein Modul technisch veraendern kann

Ein geladenes Modul kann technisch veraendern:

- das eigene globale Objekt
- gemeinsamen Event-/State-/Storage-/Database-Inhalt, wenn es die APIs aufruft
- den Seiten-DOM

#### 20.3 Was das Framework technisch nicht verhindert

Das aktuelle Framework verhindert **nicht** technisch:

- das Lesen eines anderen Moduls ueber `window`
- das Schreiben in gemeinsame Storage-Keys
- das Schreiben in gemeinsame Database-Stores
- das Senden beliebiger Events

Harte Modul-Isolation ist daher **nicht implementiert**.

#### 20.4 Verbindliche Betriebsregel

Da harte Isolation fehlt, muessen zukuenftige Module so arbeiten, als waeren die folgenden Regeln verpflichtend:

- nur eigene Keys, IDs, DOM-Subtrees und Listener anfassen
- andere Module nur ueber dokumentierte, absichtliche Globals aufrufen
- andere Module niemals ohne expliziten Task-Umfang veraendern

Das ist eine Repository-Betriebsregel und keine Sandbox-Garantie.

---

### 21. Modul-Entfernung

Um ein Modul im aktuellen Framework sauber zu entfernen:

1. es deaktivieren, wenn geladen
2. es deinstallieren, wenn geladen
3. Timer/Watcher/Browser-Handles stoppen
4. alle Event-Listener abmelden
5. alle vom Modul besessenen `CoreStorage`-Keys entfernen
6. alle bekannten vom Modul besessenen Database-Records loeschen
7. den Modulordner aus [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules) entfernen
8. die Runtime neu laden

Aktuelle Cleanup-Realitaeten:

- Module-Registry-Eintraege sind nur in-memory
- `/api/modules` listet das Modul nicht mehr, sobald der Ordner weg ist
- es gibt keine Service-Unregister-API
- es gibt keine Modul-Route-Registry
- es gibt keine Modul-CSS-Registry

Verbindliche Konsequenz:

- ein sauber entfernbares eigenstaendiges Modul darf nichts registrieren, was spaeter nicht explizit wieder entfernt werden kann

Deshalb ist modul-private `ServiceManager.register(...)`-Nutzung fuer saubere eigenstaendige Module nicht zulaessig.

---

### 22. Vollstaendiges Referenzmodul

Dieses Referenzmodul ist absichtlich neutral und passt exakt zum aktuellen Framework-Vertrag.

Es zeigt:

- Manifest
- globales Modulobjekt
- synchronen Lifecycle
- Event-Nutzung
- Storage-Nutzung
- Database-Nutzung
- UI-Rendering
- Fehlerbehandlung
- Cleanup
- die Abwesenheit nicht unterstuetzter API-/CSS-Mounting-Mechanismen

#### 22.1 Referenzstruktur

```text
app/modules/sample-module/
├── module.json
└── index.js
```

#### 22.2 Referenz-`module.json`

```json
{
  "id": "sample-module",
  "name": "Sample Module",
  "version": "1.0.0",
  "type": "app",
  "description": "Neutral reference module for the current framework.",
  "entry": "index.js",
  "globalName": "SampleModule",
  "permissions": [],
  "capabilities": ["sample"],
  "dependencies": []
}
```

#### 22.3 Referenz-`index.js`

```js
(() => {
  'use strict';

  const MODULE_ID = 'sample-module';
  const STORAGE_KEY = `${MODULE_ID}:state`;
  const DB_STORE = 'sync';
  const DB_KEY = `${MODULE_ID}:snapshot`;

  let status = 'available';
  let active = false;
  let offLogout = null;

  const emit = (eventName, payload) => {
    if (window.CoreEventBus && typeof window.CoreEventBus.publish === 'function') {
      window.CoreEventBus.publish(eventName, payload);
    }
  };

  const audit = (action, result = 'success', metadata = {}) => {
    if (window.CoreAudit && typeof window.CoreAudit.record === 'function') {
      window.CoreAudit.record(MODULE_ID, action, MODULE_ID, result, metadata);
    }
  };

  const persistSnapshot = (snapshot) => {
    if (window.CoreStorage && typeof window.CoreStorage.set === 'function') {
      window.CoreStorage.set(STORAGE_KEY, snapshot);
    }

    if (window.DatabaseManager && typeof window.DatabaseManager.save === 'function') {
      window.DatabaseManager.save(DB_STORE, {
        id: DB_KEY,
        moduleId: MODULE_ID,
        ...snapshot
      }).catch((error) => {
        if (window.CoreErrorHandler && typeof window.CoreErrorHandler.handle === 'function') {
          window.CoreErrorHandler.handle(error, {
            type: 'sample-module:persist',
            moduleId: MODULE_ID
          });
        }
      });
    }
  };

  const removeSnapshot = () => {
    if (window.CoreStorage && typeof window.CoreStorage.remove === 'function') {
      window.CoreStorage.remove(STORAGE_KEY);
    }

    if (window.DatabaseManager && typeof window.DatabaseManager.delete === 'function') {
      window.DatabaseManager.delete(DB_STORE, DB_KEY).catch((error) => {
        if (window.CoreErrorHandler && typeof window.CoreErrorHandler.handle === 'function') {
          window.CoreErrorHandler.handle(error, {
            type: 'sample-module:cleanup',
            moduleId: MODULE_ID
          });
        }
      });
    }
  };

  const getSnapshot = () => {
    if (window.CoreStorage && typeof window.CoreStorage.get === 'function') {
      return window.CoreStorage.get(STORAGE_KEY, null);
    }
    return null;
  };

  const SampleModule = {
    id: MODULE_ID,
    name: 'Sample Module',
    version: '1.0.0',
    description: 'Neutral reference module for the current framework.',
    permissions: [],
    capabilities: ['sample'],
    dependencies: [],
    status: 'available',
    active: false,

    install() {
      status = 'installed';
      this.status = status;
      this.active = false;
      audit('sample-module:install');
      emit('sample-module:installed', { moduleId: MODULE_ID });
      return { ok: true, status };
    },

    initialize() {
      if (!window.CoreStorage) {
        throw new Error('CoreStorage is required.');
      }

      audit('sample-module:initialize');
      emit('sample-module:initialized', { moduleId: MODULE_ID });
      return { ok: true, status };
    },

    enable() {
      status = 'enabled';
      active = true;
      this.status = status;
      this.active = active;

      if (!offLogout && window.CoreEventBus && typeof window.CoreEventBus.subscribe === 'function') {
        offLogout = window.CoreEventBus.subscribe('auth:logout', () => {
          removeSnapshot();
        });
      }

      persistSnapshot({
        status,
        active,
        updatedAt: new Date().toISOString()
      });

      audit('sample-module:enable');
      emit('sample-module:enabled', { moduleId: MODULE_ID });
      return { ok: true, status };
    },

    disable() {
      if (offLogout) {
        offLogout();
        offLogout = null;
      }

      status = 'disabled';
      active = false;
      this.status = status;
      this.active = active;

      audit('sample-module:disable');
      emit('sample-module:disabled', { moduleId: MODULE_ID });
      return { ok: true, status };
    },

    uninstall() {
      this.disable();
      removeSnapshot();

      status = 'available';
      active = false;
      this.status = status;
      this.active = active;

      audit('sample-module:uninstall');
      emit('sample-module:uninstalled', { moduleId: MODULE_ID });
      return { ok: true, status };
    },

    renderUserInterface(container) {
      if (!container) {
        return;
      }

      const render = (message = '') => {
        const snapshot = getSnapshot();
        container.innerHTML = `
          <section class="user-app-panel">
            <span class="user-app-eyebrow">Module</span>
            <h1>Sample Module</h1>
            <p>This module uses only the current framework contract.</p>
            <pre>${JSON.stringify(snapshot, null, 2)}</pre>
            <p>${message}</p>
            <button type="button" class="user-app-back" data-sample-action="save">Save snapshot</button>
            <button type="button" class="user-app-back" data-sample-action="clear">Clear snapshot</button>
          </section>
        `;

        container.querySelector('[data-sample-action="save"]').addEventListener('click', () => {
          persistSnapshot({
            status,
            active,
            updatedAt: new Date().toISOString()
          });
          render('Snapshot saved.');
        });

        container.querySelector('[data-sample-action="clear"]').addEventListener('click', () => {
          removeSnapshot();
          render('Snapshot removed.');
        });
      };

      render();
    }
  };

  window.SampleModule = SampleModule;
})();
```

#### 22.4 Referenz-Lifecycle-Verhalten

- `install` setzt In-Memory-Status
- `initialize` wirft, wenn eine benoetigte Core-API fehlt
- `enable` registriert Listener und persistiert einen Snapshot
- `disable` deregistriert Listener
- `uninstall` entfernt Storage-/Database-Artefakte

#### 22.5 Referenz-API-Abschnitt

Es ist keine modul-spezifische Backend-API enthalten, weil das aktuelle Framework keine Modul-Backend-Route-Registrierung unterstuetzt.

#### 22.6 Referenz-CSS-Abschnitt

Es ist keine modul-spezifische CSS-Datei enthalten, weil das aktuelle Framework keine modul-lokale Stylesheet-Registrierung unterstuetzt.

Die Referenz-UI verwendet absichtlich bestehende Klassen aus [webroot/style.css](/workspaces/CatchTrack-V.1.0/webroot/style.css) wieder.

---

### 23. Rules for AI Agents

#### 23.1 Pflichtlektuere vor der Modulerstellung

Ein AI-Agent muss lesen:

1. diese Spezifikation
2. [app/modules/gps/module.json](/workspaces/CatchTrack-V.1.0/app/modules/gps/module.json)
3. [app/modules/gps/index.js](/workspaces/CatchTrack-V.1.0/app/modules/gps/index.js)
4. [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)
5. [platform/module-manager.js](/workspaces/CatchTrack-V.1.0/platform/module-manager.js)
6. [platform/core-loader.js](/workspaces/CatchTrack-V.1.0/platform/core-loader.js)

Zusaetzlich muss der AI-Agent, wenn der angeforderte Bereich beruehrt wird, die passende Core-Datei lesen, bevor er Code schreibt:

- Storage -> [platform/core-storage.js](/workspaces/CatchTrack-V.1.0/platform/core-storage.js)
- Database -> [platform/database-manager.js](/workspaces/CatchTrack-V.1.0/platform/database-manager.js)
- Auth/Access -> [platform/core-auth.js](/workspaces/CatchTrack-V.1.0/platform/core-auth.js), [platform/core-access.js](/workspaces/CatchTrack-V.1.0/platform/core-access.js)
- Events -> [platform/core-event-bus.js](/workspaces/CatchTrack-V.1.0/platform/core-event-bus.js)
- UI-Shell-Verhalten -> [webroot/style.css](/workspaces/CatchTrack-V.1.0/webroot/style.css) und [webroot/master-ui.js](/workspaces/CatchTrack-V.1.0/webroot/master-ui.js)

#### 23.2 Informationen, die der AI-Agent vom Auftraggeber benoetigt

Der AI-Agent braucht mindestens:

- Modulzweck
- gewuenschte Modul-ID und menschenlesbaren Namen
- ob das Modul eine User-UI benoetigt
- ob das Modul Persistenz benoetigt
- ob das Modul Auth-/Access-Pruefungen benoetigt
- ob das Modul mit bestehenden Core-/User-/Admin-APIs interagieren muss

Der AI-Agent muss explizit nachfragen, wenn die Anforderung eine der folgenden nicht unterstuetzten Standalone-Faehigkeiten benoetigt:

- dedizierte Backend-API
- dedizierte Server-Route
- dedizierte gemountete HTML-Seite
- dedizierte Modul-Stylesheet-Registrierung
- NPM-Dependency-Installation
- neuer Database-Store oder Migration

Wenn eine davon benoetigt wird, ist die Aufgabe keine reine eigenstaendige Modulaufgabe.

#### 23.3 Entscheidungen, die der AI-Agent selbst treffen darf

Der AI-Agent darf festlegen:

- ob ein Plain Object oder `ModuleInterface.create` verwendet wird
- interne Helper-Funktionsnamen
- Storage-Key-Suffixe
- Event-Namen innerhalb des Modul-ID-Namensraums
- ob `CoreStorage`, `DatabaseManager` oder beides verwendet wird

#### 23.4 Wann der AI-Agent nachfragen muss

Der AI-Agent muss nachfragen, wenn:

- Permission-Anforderungen unklar sind
- Data-Retention-Regeln unklar sind
- nicht unterstuetzte Framework-Faehigkeiten benoetigt werden
- Removal-/Cleanup-Erwartungen fuer Shared Data unklar sind

#### 23.5 Framework-Regeln, die der AI-Agent niemals eigenmaechtig aendern darf

Niemals ohne explizite Framework-Scope-Anweisung veraendern:

- Modul-Discovery-Mechanismus
- Server-Routing
- Auth-Source-of-Truth
- Access-Modell
- Shared-Store-Struktur
- Lade-Reihenfolge der HTML-Shells
- CSS-Registrierungsmodell

#### 23.6 Wie der AI-Agent ein Modul planen soll

1. bestaetigen, dass die Anforderung in den Standalone-Modul-Vertrag passt
2. Modul-ID/Ordner/GlobalName festlegen
3. Manifest definieren
4. Lifecycle definieren
5. Storage- und Database-Besitz definieren
6. UI-Fragment definieren, falls benoetigt
7. Cleanup-Pfade definieren, bevor Code geschrieben wird

#### 23.7 Wie der AI-Agent Code und UI strukturieren soll

- genau ein globales Modulobjekt
- privater Zustand in Closure-Variablen
- synchrone Lifecycle-Methoden
- praefixte Storage-/Event-/Database-Keys
- UI innerhalb von `renderUserInterface(container)`
- keine versteckten externen Abhaengigkeiten

#### 23.8 Wie der AI-Agent Isolation pruefen soll

Pruefen, dass das Modul:

- nur eigene Keys und IDs verwendet
- jeden Listener wieder abmeldet
- jeden Timer/Watcher stoppt
- jedes entfernbaren Artefakt wieder entfernt
- keine Core-Owned-Dateien aendern muss, ausser explizit im Rahmen von Framework-Arbeit

#### 23.9 Wie der AI-Agent Framework-Konformitaet pruefen soll

Pruefen:

- Manifest-Felder sind tatsaechlich unterstuetzt
- Entry-Datei erzeugt das erwartete globale Modulobjekt
- Lifecycle verlaesst sich nicht auf `await`
- keine ununterstuetzten Annahmen zu Modul-API/CSS/Webroot sind enthalten

---

### 24. Modul-Erstellungsworkflow

Verbindlicher Workflow:

1. Anforderungen aufnehmen
2. pruefen, ob die Anforderung in den Standalone-Modul-Scope passt
3. Modulkonzept definieren
4. Abhaengigkeiten bestimmen
5. Modulordner unter [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules) anlegen
6. `module.json` erstellen
7. `index.js` erstellen
8. Lifecycle implementieren
9. Storage-/Database-Nutzung implementieren, falls benoetigt
10. UI in `renderUserInterface(container)` implementieren, falls benoetigt
11. Isolation pruefen
12. Cleanup pruefen
13. gegen diese Spezifikation validieren
14. nur die tatsaechlichen Masterdateien finalisieren

---

### 25. Masterdateien fuer ein neues Modul

Im aktuellen Framework sind die Masterdateien eines eigenstaendigen Moduls:

- `app/modules/<module-id>/module.json`
- `app/modules/<module-id>/index.js`

Optionale Masterdateien nur dann, wenn sie wirklich verwendet werden:

- modul-eigene Assets, die von `index.js` referenziert werden
- modul-eigene Dokumentation

Dateien, die **keine** Masterdateien eines eigenstaendigen Moduls sind:

- Aenderungen in [platform/](/workspaces/CatchTrack-V.1.0/platform)
- Aenderungen in [server/](/workspaces/CatchTrack-V.1.0/server)
- Aenderungen in [webroot/](/workspaces/CatchTrack-V.1.0/webroot)

ausser die Aufgabe ist explizit eine Framework-Aenderung.

---

### 26. Test- und Validierungsregeln

Aktuelle Repository-Wahrheit:

- es existiert keine automatisierte Test-Suite
- es existiert kein Lint-Script
- es existiert kein Type-Check-Script
- es existiert kein dediziertes UI-Test-Tool

#### 26.1 Statische Validierung

Realistische aktuelle Checks:

- `module.json` laesst sich als JSON parsen
- erforderliche Manifest-Felder existieren
- referenzierte Entry-Datei existiert
- Entry-Datei erzeugt das erwartete globale Modulobjekt

#### 26.2 Strukturvalidierung

Pruefen:

- Ordner liegt unter [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)
- Manifest-Dateiname ist korrekt
- Entry-Pfad passt zur tatsaechlichen Datei

#### 26.3 Syntaxvalidierung

Realistisch ausfuehrbar:

- `node --check app/modules/<module-id>/index.js`

#### 26.4 Integrationsvalidierung

Realistisch ausfuehrbar:

1. Server mit `npm start` starten
2. `/api/modules` aufrufen
3. pruefen, dass das Modulmanifest gelistet wird
4. [webroot/index.html](/workspaces/CatchTrack-V.1.0/webroot/index.html) im Browser laden
5. pruefen, dass das Modul sichtbar ist, wenn es aktiviert ist

#### 26.5 Laufzeitvalidierung

Pruefen:

- `install/initialize/enable` laufen ohne Throw
- UI rendert, falls vorhanden
- Listener und Browser-Handles werden bei `disable` bereinigt

#### 26.6 API-Validierung

Aktuelle Standalone-Grenze:

- bei einem Plain Module kann nur die Sichtbarkeit ueber `/api/modules` validiert werden
- modul-spezifische Backend-API-Validierung ist nicht anwendbar, weil das Framework das nicht unterstuetzt

#### 26.7 UI-Validierung

Aktuell realistischer Ansatz:

- manuelle Browser-Validierung
- pruefen, dass die UI innerhalb des bestehenden Containers rendert
- pruefen, dass keine neuen Shell-Annahmen eingefuehrt wurden

---

### 27. Framework-Grenzen

Diese Spezifikation erlaubt einem eigenstaendigen Modul **nicht**:

- den Core eigenmaechtig umzubauen
- Sicherheitsgrenzen zu umgehen
- neue globale Zustandssysteme einzufuehren
- Fachlogik in den neutralen Core zu verschieben
- andere Module ohne expliziten Scope zu veraendern
- bestehende Loader-/Manifest-/Lifecycle-Konventionen zu brechen
- versteckte Framework-Abhaengigkeiten zu erzeugen
- neue harte Core-Design-Annahmen in Modulcode zu verdrahten

Wenn eine angeforderte Funktion solche Aenderungen benoetigt, ist sie eine Framework-Aufgabe und keine reine eigenstaendige Modul-Aufgabe.

---

### 28. Wahrheit zu Module Registry und Module Manager

#### 28.1 Tatsaechliches Registry-Verhalten

Aktuelle Registrierungs-Wahrheit:

- `CoreLoader` entdeckt Manifeste und Skripte
- `ModuleManager.discoverModules()` normalisiert und registriert Kandidaten
- `ModuleRegistry.register(module)` speichert sie in einer In-Memory-`Map`

#### 28.2 Validierungsrealitaet

Tatsaechlich vorhandene Validierung:

- Manifest muss als JSON parsebar sein
- Manifest-`id` muss ein nicht-leerer String sein
- Entry-Datei muss existieren und lesbar sein
- Entry-Skript muss ohne fatalen Fehler auswertbar sein
- eine globale Implementierung muss auf `window` auffindbar sein
- doppelte IDs werden von `ModuleRegistry.register` abgewiesen

Was **nicht** existiert:

- keine `appId`-Routing-Erzwingung (das Feld wird normalisiert und gespeichert, aber nicht gegen die AppRegistry verifiziert)
- keine `mountPath`-Routing-Erzwingung (das Feld wird normalisiert und gespeichert, aber kein HTTP-Route wird dadurch gesteuert)
- keine Schema-Validierung ueber die manuelle Feld-Normalisierung hinaus
- kein strukturierter Diagnosekanal fuer Manifest-Authoring-Fehler

#### 28.3 Realitaet stiller Fallbacks

Das aktuelle Framework enthaelt weiterhin stille Skips/Fallbacks:

- ungueltiges Manifest-JSON wird uebersprungen
- nicht lesbare Manifeste werden uebersprungen
- fehlende Entry-Dateien werden uebersprungen
- nicht zuordenbare globale Implementierungen werden uebersprungen
- `/api/modules` ueberspringt Manifest-Parse-Fehler

Deshalb gilt als Authoring-Regel:

- zukuenftige Modul-Arbeit darf sich nicht auf diese stillen Skips verlassen
- Modul-Deliverables muessen manuell so validiert werden, dass Discovery ohne Fallback-Verhalten erfolgreich ist

#### 28.4 Aufgaben des Module Managers

Aktuelle Verantwortungen des `ModuleManager`:

- Modulobjekte normalisieren
- Dependencies validieren
- Module registrieren/deregistrieren
- Lifecycle-Methoden aufrufen
- Lesemethoden wie `get`, `getAll`, `getStatus` bereitstellen
- `Core.state.activeModule` setzen
- `module:registered`, `module:activated`, `module:deactivated`, `module:unregistered` emittieren

`ModuleManager` tut **nicht**:

- Lifecycle-Promises awaiten
- fehlgeschlagene Lifecycle-Sequenzen zurueckrollen
- Permissions automatisch erzwingen
- APIs mounten
- HTML-Routen mounten
- CSS mounten

---

### 29. Wahrheit zu App-Kontext, `appId`, `mountPath` und Connection-System

#### 29.1 Core Context

Der tatsaechliche gemeinsame Kontext ist [platform/core-context.js](/workspaces/CatchTrack-V.1.0/platform/core-context.js). Er stellt bereit:

- `application.name`
- `application.version`
- `runtime`
- `environment`

#### 29.2 App-Kontext-Realitaet

Die aktuelle Anwendung ist effektiv eine einzelne App-Shell:

- `ApplicationCore` in [platform/core-config.js](/workspaces/CatchTrack-V.1.0/platform/core-config.js)
- `ApplicationCore` in [platform/core-context.js](/workspaces/CatchTrack-V.1.0/platform/core-context.js)
- [app/index.js](/workspaces/CatchTrack-V.1.0/app/index.js) exportiert ein kleines `appShell`

Es gibt keine reichere eigenstaendige "App Context"-API fuer Module.

#### 29.3 `appId`

`appId` ist im aktuellen Framework nirgends als Modul-Vertragsfeld, Routing-Key, Storage-Namensraum oder Registry-Key implementiert.

#### 29.4 `mountPath`

`mountPath` ist im aktuellen Framework nirgends als Manifest-Feld, Router-Regel oder UI-Mount-Vertrag implementiert.

Die einzige aktuelle HTTP-Sichtbarkeit fuer Modul-Dateien ist:

- `/app/modules/<folder>/...`

#### 29.5 Connection-System

`ConnectionManager` ist in [platform/master-framework.js](/workspaces/CatchTrack-V.1.0/platform/master-framework.js) implementiert und global als `window.ConnectionManager` bereitgestellt.

Implementiert:

- `ConnectionManager.register(definition)` — Connection mit `connectionId`, `appId`, `serverUrl`, `apiBase`, `authType`, `credentialsRef` registrieren
- `ConnectionManager.get(connectionId)` — Connection abfragen
- `ConnectionManager.list(appId)` — alle oder per-App-Connections auflisten
- `ConnectionManager.update(connectionId, updates)` — Connection aktualisieren
- `ConnectionManager.setStatus(connectionId, status)` — Status setzen
- `ConnectionManager.test(connectionId, handler)` — Health-Test ausfuehren

Nicht implementiert (APP-SPEZIFISCH / SERVER-SEITIG):

- kein Connection-Ownership-Enforcement pro Modul
- kein Server-seitiges Connection-Proxying
- keine Connection-Security-Enforcement-Schicht ueber die Anwendungsschicht hinaus
- kein automatisches Modul-eigenes Connection-Routing

Deshalb darf ein eigenstaendiges Modul kein paralleles Connection-Ownership-Modell erfinden. Wenn ein Modul einen Server-seitigen Proxy oder eine eigene Backend-Route benoetigt, ist das zuerst eine Framework-Erweiterungsaufgabe.

---

### 30. GPS-Modul als reale Referenz

Das GPS-Modul in [app/modules/gps/](/workspaces/CatchTrack-V.1.0/app/modules/gps) ist ein **Referenzbeispiel**, keine verpflichtende Vorlage.

Es demonstriert aktuelle Framework-Fakten:

- folderbasierte Discovery
- `module.json` + `index.js`
- globales Modulobjekt ueber `window.GpsModule`
- manuelle Lifecycle-Methoden
- Event-Emission
- Storage-/Database-Nutzung
- `renderUserInterface(container)`

Es beweist **nicht**, dass jedes Modul:

- Geolocation verwenden muss
- in den `sync`-Store persistieren muss
- GPS-spezifisches CSS hinzufuegen muss
- genau demselben Audit-Helper-Muster folgen muss

Es ist als Beleg dafuer zu verwenden, was die aktuelle Runtime laden kann, nicht als One-size-fits-all-Design.

---

### 31. Anti-Patterns

Verbotene oder fehlerhafte Muster fuer dieses Framework:

- Fachlogik in [platform/](/workspaces/CatchTrack-V.1.0/platform) verschieben
- parallele Auth-/Session-Systeme aufbauen
- ein privates Lifecycle-System neben `ModuleManager` aufbauen
- nicht praefixte globale Storage-Keys verwenden
- nicht praefixte Shared-Database-IDs verwenden
- gemeinsamen Storage-/Database-/Event-/Audit-State global leeren
- Registry-Discovery durch Manipulation von Framework-Interna umgehen
- voraussetzen, dass `appId` oder `mountPath` existieren
- ein Connection-Framework erfinden, das der Codebestand nicht hat
- verstecktes Fallback-Verhalten in Integrationsdokumentation einbauen
- Branding im neutralen Core hart verdrahten
- von Demo-Assets, Demo-Architektur oder Backup-Archiven abhaengen
- unnoetige externe Dependencies einfuehren

---

### 32. Abschluss-Checkliste fuer fertige Module

Bevor ein Modul als fertig gilt, muss Folgendes geprueft sein:

- Modulordner existiert unter [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)
- genau ein gueltiges Manifest existiert (`module.json` oder `manifest.json`)
- das Manifest verwendet nur tatsaechlich unterstuetzte Felder
- die Entry-Datei existiert und exponiert das erwartete globale Objekt
- die Lifecycle-Methoden passen zum aktuellen Framework-Verhalten
- Dependency-IDs passen zu realen registrierten Modul-IDs
- Storage-Keys sind mit der Modul-ID gepraefixt
- Database-Records sind entfernbar, ohne Shared Stores zu leeren
- Event-Listener werden bei `disable/uninstall` abgemeldet
- Browser-Handles/Timer/Watcher werden bei `disable/uninstall` gestoppt
- `renderUserInterface(container)` bleibt im uebergebenen Container
- es wurden keine ununterstuetzten Annahmen ueber API-Routing oder CSS-Mounting eingefuehrt
- es wurden keine Core-/Framework-Dateien veraendert, ausser die Aufgabe verlangte explizit Framework-Arbeit

---

### 33. Backup-Regel

Backup-ZIPs sind kein Bestandteil von:

- dem Framework
- einem Modul
- dem Runtime-Vertrag
- der Modul-Discovery
- dem Server-Startup

Backups duerfen nur ausserhalb des Git-Repositories erzeugt werden und koennen nach Download oder externer Aufbewahrung vollstaendig geloescht werden.
