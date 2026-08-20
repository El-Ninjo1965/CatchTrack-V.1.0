# VERSION

## Version 1.1.4 - admin user editing and permission-safe user management

Status:
- Framework core remains stable and module-driven.
- User shell continues to support profile settings, feature visibility and privacy preferences.
- GPS remains hardened against inactive module state and stays usable from real user interactions.
- Catch Log and Fishing Spots remain the first real product domain modules in the active app.
- The admin shell now supports a storage/connection configuration model for file-based and SQL-based backends.
- The framework can now be configured without hardcoding a single backend type.
- Admin user creation and role-based permission checks are fixed so developer/admin accounts can manage users without false `Access denied` results.
- Existing users can now be edited in the admin workspace, including username, display name, email, role, permissions, and status.

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

### Current focus
- continue the first real app rollout with additional business modules
- standardize module creation patterns for future app variants
- keep the framework generic enough to support multiple apps without structural rewrites
- validate that admin-defined storage choices remain stable and future-proof
- prepare the production layer for plain shared hosting with JSON/text files and optional SQL upgrade paths

### Planned next steps
- add the next real domain module after the current core feature set
- enrich role-based module access by app and feature area
- allow admin-managed content modules and app-specific workflows without core changes
- keep module templates and permission mapping in sync with future module development
- implement the actual file- and SQL-backed adapters behind the admin-chosen connection type
- keep the admin connection matrix aligned with the deployment target (shared hosting vs dedicated server)
