# VERSION

## Version 1.1.10 - independent app architecture and approval gate

Status:
- Framework core remains stable and module-driven.
- User shell continues to support profile settings, feature visibility and privacy preferences.
- GPS remains hardened against inactive module state and stays usable from real user interactions.
- Catch Log and Fishing Spots remain the first real product domain modules in the active app.
- The admin shell supports a storage/connection model for file-based and SQL-ready backends.
- The framework remains configurable without hardcoding a single backend type.
- Admin user creation and role-based permission checks remain fixed so developer/admin accounts can manage users without false `Access denied` results.
- Existing users can be edited directly in the admin workspace, including username, display name, email, role, permissions and status.
- Modules can be edited directly through metadata-driven governance forms covering app ID, name, type, description, permissions, capabilities and enable/disable state.
- The framework supports app-scoped module access control by role, with UI-level visibility updates without rewrites of the core system.
- Feature groups support a role-based access matrix for dashboard, profile, modules and other app areas without changing the framework core.
- Audit logging is persisted in browser storage and accepts the real event signatures used by the platform, preventing audit entries from being lost or malformed.
- App template registration and creation are available in the framework and admin UI so new app variants can be generated from reusable blueprints rather than custom one-off code paths.
- Admin audit includes filterable timeline views so administrators can review actions by actor, action, resource, result and searchable metadata.
- App runtime isolation is now managed explicitly: each application has its own runtime context, storage namespace, admin scope and active selection without relying on a shared global app state.
- Admin app configuration is now available in the CMS-like admin area: the active app can be selected, app branding can be changed, and the default storage mode can be set from the admin without code rewrites.
- Architectural gate: each app, including admin and server context, must be independent and not rely on another app’s runtime state or modules.
- Freeze gate: no additional app-dependent modules will be installed until the full base system is completed, stable and explicitly reviewed and approved by the user.

### Included milestones
- neutral framework shell
- module registry and lifecycle
- admin governance (users, roles, permissions, module settings)
- GPS module with working geolocation flow
- first app scaffolding and starter dashboard module
- first real business module: Catch Log
- second business module: Fishing Spots
- user profile settings for visible functions and privacy choices
- module template scaffolding for future app modules
- expanded module and permission matrix in the admin workspace
- GPS reliability hardening for active user-triggered actions
- admin-managed storage connections with file and SQL-ready storage choices
- connection normalization for shared hosting, local JSON workflows and future SQL backends
- admin-side module metadata editing for future-ready CMS-style module governance
- durable audit events and reusable app blueprint creation for multi-app growth
- filterable audit timeline in the admin workspace for operational transparency
- architecture alignment for independent app, admin and server instances

### Current focus
- finalize the independent app architecture so each app owns its own admin, runtime, roles, modules and connections
- validate the operating model for app-level independence without cross-app coupling
- finish the framework hardening pass for setup, storage, permissions, admin flows and runtime consistency
- keep the system generic enough for future app variants without global structural rewrites
- validate that admin-defined storage choices remain stable and future-proof
- prepare the production layer for plain shared hosting with JSON/text files and optional SQL upgrade paths
- keep the app freeze active until the framework, roles, permissions, connection layer and admin/runtime model are fully stable and reviewed
- only re-open new app-dependent module installations after explicit approval and system completion
- current pass: app runtime isolation is implemented and validated at the framework core; the remaining step is a final regression check on multi-app bootstrap behavior and storage scoping

### Planned next steps
- complete the final framework validation for independent app/admin/server execution
- confirm the shared-hosting deployment model and the optional SQL upgrade path
- add only the next required core functionality if the system is not yet stable enough for final review
- after approval, continue with the next real domain module only if it is genuinely required by the app design and not just a new feature branch
- keep module templates, role matrices and feature access aligned with the final approved architecture
- add deeper audit filters, export options and operational review views only after the platform stability gate is cleared
- expand app blueprint definitions only when the independent app model has been approved as complete and final
