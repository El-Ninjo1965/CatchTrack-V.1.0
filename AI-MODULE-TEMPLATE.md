# AI-MODULE-TEMPLATE

Use this file as the standard input template for future AI agents and especially ChatGPT when a new module shall be created for the current neutral framework.

Before implementation, the AI agent must read:

- [MODULE-INTEGRATION-SPEC.md](/workspaces/CatchTrack-V.1.0/MODULE-INTEGRATION-SPEC.md)
- [AI-FRAMEWORK-SPEC.md](/workspaces/CatchTrack-V.1.0/AI-FRAMEWORK-SPEC.md)
- [DEVELOPER-GUIDE.md](/workspaces/CatchTrack-V.1.0/DEVELOPER-GUIDE.md)
- [SERVER-APPLICATION-GUIDE.md](/workspaces/CatchTrack-V.1.0/SERVER-APPLICATION-GUIDE.md)

Important framework truth:

- standalone modules live under [app/modules/](/workspaces/CatchTrack-V.1.0/app/modules)
- the real module contract is `module.json` + `index.js`
- the real lifecycle is managed by [platform/module-manager.js](/workspaces/CatchTrack-V.1.0/platform/module-manager.js)
- the neutral framework now supports `appId`, `apiVersion`, `mountPath`, and connection-aware runtime metadata when they are part of the app/module contract
- module-local backend routing, CSS auto-registration, and implicit multi-app routing are still not part of the default standalone module contract without explicit framework changes

If a section below is not needed, fill it with one of:

- `Not needed`
- `Not supported by current framework`
- `Requires explicit framework change`

---

## 1. MODULE IDENTITY

- Module name:
- Technical module ID:
- Version:
- Short description:
- Purpose:
- Category:
- User-facing name:
- Global module object name (if explicitly desired, otherwise let AI derive from framework conventions):

Notes for AI:

- module ID must align with the current framework rules from [MODULE-INTEGRATION-SPEC.md](/workspaces/CatchTrack-V.1.0/MODULE-INTEGRATION-SPEC.md)
- the default standalone target path is `app/modules/<module-id>/`

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Main functions

-

### 2.2 Secondary functions

-

### 2.3 User actions

-

### 2.4 Automatic processes

-

### 2.5 Inputs

-

### 2.6 Outputs

-

### 2.7 Expected results

-

---

## 3. DATA MODEL

### 3.1 Required data

-

### 3.2 Data structures

-

### 3.3 Persistent data

-

### 3.4 Temporary runtime data

-

### 3.5 Relationships

-

### 3.6 Storage requirements

- Use [platform/core-storage.js](/workspaces/CatchTrack-V.1.0/platform/core-storage.js)?
- Required keys:
- Retention/cleanup requirements:

### 3.7 Database requirements

- Use [platform/database-manager.js](/workspaces/CatchTrack-V.1.0/platform/database-manager.js)?
- Needed current shared store(s): `users`, `modules`, `logs`, `sessions`, `settings`, `cache`, `sync`, or `Not supported`
- Required record IDs / prefixes:
- Cleanup requirements:

Notes for AI:

- the current framework has no module-owned store registration or migration API
- all database usage must fit the existing shared-store model

---

## 4. CORE INTEGRATIONS

For each actually needed integration, fill one block.

### Integration block

- Core component:
- Purpose:
- Needed methods/functions:
- Data flow:
- Required permissions:
- Constraints:
- Runtime phase(s) where used:

Use only actual current components such as:

- [platform/core-context.js](/workspaces/CatchTrack-V.1.0/platform/core-context.js)
- [platform/core-storage.js](/workspaces/CatchTrack-V.1.0/platform/core-storage.js)
- [platform/database-manager.js](/workspaces/CatchTrack-V.1.0/platform/database-manager.js)
- [platform/core-event-bus.js](/workspaces/CatchTrack-V.1.0/platform/core-event-bus.js)
- [platform/core-event-ring.js](/workspaces/CatchTrack-V.1.0/platform/core-event-ring.js)
- [platform/service-manager.js](/workspaces/CatchTrack-V.1.0/platform/service-manager.js)
- [platform/core-auth.js](/workspaces/CatchTrack-V.1.0/platform/core-auth.js)
- [platform/core-access.js](/workspaces/CatchTrack-V.1.0/platform/core-access.js)
- [platform/security.js](/workspaces/CatchTrack-V.1.0/platform/security.js)
- [platform/core-audit.js](/workspaces/CatchTrack-V.1.0/platform/core-audit.js)
- [platform/config-manager.js](/workspaces/CatchTrack-V.1.0/platform/config-manager.js)
- [platform/core-user.js](/workspaces/CatchTrack-V.1.0/platform/core-user.js)
- [platform/core-lifecycle.js](/workspaces/CatchTrack-V.1.0/platform/core-lifecycle.js)
- [platform/module-manager.js](/workspaces/CatchTrack-V.1.0/platform/module-manager.js)
- [platform/module-registry.js](/workspaces/CatchTrack-V.1.0/platform/module-registry.js)

---

## 5. MODULE DEPENDENCIES

### 5.1 Required other modules

-

### 5.2 Optional modules

-

### 5.3 External dependencies

-

### 5.4 Version requirements

-

### 5.5 Behavior when dependencies are missing

-

Notes for AI:

- the current manifest supports `dependencies`
- the current project has no npm runtime dependencies declared in [package.json](/workspaces/CatchTrack-V.1.0/package.json)
- if an external package is needed, that is not plain standalone module work

---

## 6. EVENTS

### 6.1 Events emitted by the module

| Event name | Payload | Trigger | Expected listeners |
| --- | --- | --- | --- |
|  |  |  |  |

### 6.2 Events received by the module

| Event name | Expected payload | Source | Expected reaction |
| --- | --- | --- | --- |
|  |  |  |  |

Notes for AI:

- event names should follow the real module-prefixed pattern from [MODULE-INTEGRATION-SPEC.md](/workspaces/CatchTrack-V.1.0/MODULE-INTEGRATION-SPEC.md)
- listener cleanup must be planned explicitly

---

## 7. SERVICES

### 7.1 Required existing services

- `user` / `auth` / `module` / `logging` / `cache` / `Not needed`

### 7.2 Intended service usage

-

### 7.3 Services provided by the module

-

### 7.4 Service dependencies

-

### 7.5 Service lifecycle considerations

-

Notes for AI:

- the current framework has [platform/service-manager.js](/workspaces/CatchTrack-V.1.0/platform/service-manager.js)
- it supports `register`, `get`, `has`, `getAll`
- it has no service `unregister`; module-provided services should therefore normally be avoided for clean standalone modules

---

## 8. CONNECTIONS

### 8.1 Needed connections

-

### 8.2 Connection type

-

### 8.3 Purpose

-

### 8.4 Configuration

-

### 8.5 Storage

-

### 8.6 Access

-

### 8.7 Security

-

### 8.8 Isolation

-

Notes for AI:

- the current framework has `ConnectionManager` implemented in [platform/master-framework.js](/workspaces/CatchTrack-V.1.0/platform/master-framework.js)
- `window.ConnectionManager` is available globally in the browser runtime
- connection registration (`ConnectionManager.register`) and status management (`ConnectionManager.setStatus`, `ConnectionManager.test`) can be used by a module
- however, standalone modules have no dedicated server-side connection routing contract
- if this module requires server-side connection proxying or module-owned backend connection routes, mark as `Requires explicit framework change`

---

## 9. API / SERVER

### 9.1 Needed API endpoints

| Endpoint | HTTP method | Request | Response | Error cases |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### 9.2 Authentication requirements

-

### 9.3 Authorization requirements

-

### 9.4 Mount path

-

### 9.5 Server integration requirement

-

Notes for AI:

- the current standalone framework exposes only the existing server routes from [server/bootstrap/server.js](/workspaces/CatchTrack-V.1.0/server/bootstrap/server.js)
- module-specific backend APIs are not supported by plain standalone module integration
- module `mountPath` is not supported by the current framework
- if backend routes are required, mark as `Requires explicit framework change`

---

## 10. FRONTEND / UI

### 10.1 Needed screens or views

-

### 10.2 Needed components

-

### 10.3 User interactions

-

### 10.4 Status indicators

-

### 10.5 Error messages

-

### 10.6 Navigation requirements

-

### 10.7 Responsive requirements

-

Notes for AI:

- the current user shell renders module UI through `renderUserInterface(container)` as used by [app/modules/gps/index.js](/workspaces/CatchTrack-V.1.0/app/modules/gps/index.js) and [webroot/user-app.js](/workspaces/CatchTrack-V.1.0/webroot/user-app.js)
- there is no module page auto-mounting contract
- admin/developer shells exist in [webroot/admin.html](/workspaces/CatchTrack-V.1.0/webroot/admin.html) and [webroot/dev.html](/workspaces/CatchTrack-V.1.0/webroot/dev.html), but direct access is token-guarded by the server

---

## 11. DESIGN / STYLE

### 11.1 Desired appearance

-

### 11.2 Colors

-

### 11.3 Typography

-

### 11.4 Layout

-

### 11.5 Components

-

### 11.6 Icons

-

### 11.7 Theme

- Dark / Light / Neutral / No preference:

### 11.8 App-specific branding

-

Notes for AI:

- the framework core remains neutral
- app-specific design belongs only to the module or application layer
- the current framework has no module CSS auto-registration; if extra styling is required, the AI agent must first determine whether that would force framework-owned file changes

---

## 12. SECURITY

### 12.1 User roles

-

### 12.2 Required permissions

-

### 12.3 Access control rules

-

### 12.4 Sensitive data

-

### 12.5 Audit requirements

-

### 12.6 Allowed accesses

-

### 12.7 Forbidden accesses

-

### 12.8 App/module isolation requirements

-

Notes for AI:

- use the actual current auth/access/audit/security components
- do not introduce a parallel auth or permission system
- do not rely on hidden fallbacks

---

## 13. LIFECYCLE

Fill only the lifecycle behavior that fits the real lifecycle from [MODULE-INTEGRATION-SPEC.md](/workspaces/CatchTrack-V.1.0/MODULE-INTEGRATION-SPEC.md).

### 13.1 Discovery

-

### 13.2 Validation

-

### 13.3 Registration

-

### 13.4 Installation

-

### 13.5 Initialization

-

### 13.6 Enable

-

### 13.7 Runtime behavior

-

### 13.8 Disable

-

### 13.9 Uninstall

-

Notes for AI:

- lifecycle methods are not awaited by the current manager
- blocking conditions that must stop activation must be implemented in a framework-conform way derived from the real current lifecycle rules

---

## 14. CONFIGURATION

### 14.1 Required configuration values

-

### 14.2 Defaults

-

### 14.3 Required values

-

### 14.4 Optional values

-

### 14.5 Environment variables

-

### 14.6 User configuration

-

Notes for AI:

- use only actual current config surfaces such as [platform/config-manager.js](/workspaces/CatchTrack-V.1.0/platform/config-manager.js), [config/index.js](/workspaces/CatchTrack-V.1.0/config/index.js), and [server/config/index.js](/workspaces/CatchTrack-V.1.0/server/config/index.js)
- the current framework has no module-specific config file convention

---

## 15. ERROR HANDLING

### 15.1 Expected errors

-

### 15.2 Error messages

-

### 15.3 Recovery behavior

-

### 15.4 Fallback behavior

-

### 15.5 Behavior when data is missing

-

### 15.6 Behavior when dependencies are missing

-

### 15.7 Behavior when permissions are missing

-

Rules:

- no hidden or silent fallback systems
- if the current framework already skips or falls back silently, the module specification must still describe the desired explicit module behavior

---

## 16. FILE STRUCTURE

Desired module structure:

```text
app/modules/<module-id>/
├── module.json
└── index.js
```

Additional desired files, if really needed:

- Backend files:
- Frontend files:
- Service files:
- API files:
- UI files:
- CSS files:
- Assets:
- Other required files:

Notes for AI:

- the AI agent must determine from the framework whether these files are actually allowed and necessary
- in plain standalone module work, `module.json` and `index.js` are the only guaranteed master files

---

## 17. MASTER FILES

Which existing master files must be changed by this new module?

-

Reason for each required change:

-

Rules for AI:

- existing master files must be changed only if the real framework architecture requires it
- if no change is truly required, the correct answer is `No existing master file changes required`

---

## 18. USER FLOW

Describe one or more example flows:

1. User action:
2. Module reaction:
3. Core / Service / API interaction:
4. Processing:
5. Result:
6. UI update:

Repeat as needed:

- Flow 2:
- Flow 3:

---

## 19. ACCEPTANCE CRITERIA

Define measurable done criteria.

- Module is discovered correctly.
- `module.json` is valid for the current framework.
- Lifecycle works in the real current runtime.
- Needed core integrations work.
- Security and permissions work.
- Data is stored correctly.
- UI works as intended.
- Module can be disabled.
- Module can be uninstalled cleanly.
- No cross-module or cross-app isolation violation.
- No unnecessary core/framework changes.

Add module-specific criteria:

-

---

## 20. AI IMPLEMENTATION INSTRUCTION

Describe the module request here in free text.

The AI agent must then automatically:

1. analyze the request
2. apply [MODULE-INTEGRATION-SPEC.md](/workspaces/CatchTrack-V.1.0/MODULE-INTEGRATION-SPEC.md)
3. derive missing technical details from the current framework
4. create the module architecture
5. determine the actually needed files
6. create `module.json`
7. create the module code
8. create frontend/UI parts only if supported and needed
9. create styling only if supported and needed
10. integrate core bindings
11. integrate lifecycle behavior
12. integrate security
13. change existing master files only if truly required
14. generate complete module code
15. preserve the current architecture unless a real framework change is explicitly required
16. perform a technical validation afterwards

Free-text request:

>

---

## 21. MINIMAL USER INPUT

Normally the user only needs to answer:

- What should the module do?
- Which functions should it provide?
- Which data should it process or store?
- Should it have a user UI?
- Who may use it?
- Does it need special integrations with existing core components?
- Does it require unsupported capabilities such as backend APIs, extra routing, new stores, external packages, or special styling hooks?

Everything else should be derived by the AI agent from the real framework and [MODULE-INTEGRATION-SPEC.md](/workspaces/CatchTrack-V.1.0/MODULE-INTEGRATION-SPEC.md).

---

## 22. SMALL NEUTRAL EXAMPLE

This example is documentation only. It must **not** be integrated into the framework.

### Example input

- Module name: Note Pad
- Technical module ID: `note-pad`
- Purpose: Let a signed-in user keep a small personal note in the current browser
- Main functions:
  - open note view
  - edit note text
  - save note locally
  - clear note
- Data:
  - one note text
  - last update timestamp
- Storage:
  - use `CoreStorage`
- Database:
  - not needed
- UI:
  - simple user module panel
- Permissions:
  - no extra permissions
- Events emitted:
  - `note-pad:saved`
  - `note-pad:cleared`
- Existing services:
  - `logging` optional
- API / server:
  - `Not supported by current framework`
- Connections:
  - `Not needed`
- Branding:
  - neutral
- Acceptance criteria:
  - module is discovered
  - note persists in `CoreStorage`
  - note can be cleared
  - UI renders inside the provided container

### Example free-text implementation request

> Create a simple `note-pad` module that lets a signed-in user write, save, view, and clear one local note using the current framework only, with a small neutral UI and no backend API.
