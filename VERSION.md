# VERSION

## Version 1.1.1 - user profile settings, privacy controls, and GPS reliability

Status:
- Framework core remains stable and module-driven.
- User shell now includes dedicated profile settings for feature visibility and privacy preferences.
- GPS is hardened against inactive module state and remains usable from real user interactions.
- Catch Log and Fishing Spots remain the first real product domain modules in the active app.
- The admin shell continues to support templates and dynamic module/permission visibility.

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

### Current focus
- continue the first real app rollout with additional business modules
- standardize module creation patterns for future app variants
- keep the framework generic enough to support multiple apps without structural rewrites
- validate that user feature preferences and privacy toggles remain stable in the local workflow

### Planned next steps
- add the next real domain module after the current core feature set
- enrich role-based module access by app and feature area
- allow admin-managed content modules and app-specific workflows without core changes
- keep module templates and permission mapping in sync with future module development
