# VERSION

## Version 1.1.7 - app-scoped feature governance and role matrix

Status:
- Framework core remains stable and module-driven.
- User shell continues to support profile settings, feature visibility and privacy preferences.
- GPS remains hardened against inactive module state and stays usable from real user interactions.
- Catch Log and Fishing Spots remain the first real product domain modules in the active app.
- The admin shell now supports a storage/connection configuration model for file-based and SQL-based backends.
- The framework can now be configured without hardcoding a single backend type.
- Admin user creation and role-based permission checks are fixed so developer/admin accounts can manage users without false `Access denied` results.
- Existing users can now be edited in the admin workspace, including username, display name, email, role, permissions, and status.
- Modules can now be edited directly in the admin workspace through a metadata-driven governance form covering app ID, name, type, description, permissions, capabilities, and enable/disable status.
- The framework now supports app-scoped module access control by role. Each app can block or allow individual modules by role, and the visible module navigation reacts to that matrix without requiring core rewrites.
- App feature groups now also support a role-based access matrix so dashboard, profile, module workspaces and future feature groups can be enabled or disabled by role without touching the framework core.

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

### Current focus
- continue the first real app rollout with additional business modules
- standardize module creation patterns for future app variants
- keep the framework generic enough to support multiple apps without structural rewrites
- validate that admin-defined storage choices remain stable and future-proof
- prepare the production layer for plain shared hosting with JSON/text files and optional SQL upgrade paths
- extend module-to-role and app-to-module mappings for feature-level governance
- bind app-scoped module access to real navigation and user visibility in the shell
- extend feature-level governance to app-specific feature templates and role-based coverage in the admin matrix

### Planned next steps
- add the next real domain module after the current core feature set
- enrich role-based module access by app and feature area
- allow admin-managed content modules and app-specific workflows without core changes
- keep module templates and permission mapping in sync with future module development
- implement the actual file- and SQL-backed adapters behind the admin-chosen connection type
- keep the admin connection matrix aligned with the deployment target (shared hosting vs dedicated server)
- add deeper audit trails and app-level permission templates for multi-app deployments
