# Neutral Framework Workflow

## Status

The repository is reduced to a neutral, reusable framework foundation. The implementation contains only generic runtime, lifecycle, configuration, storage, database, user, admin, i18n, security, events, state, logging, error handling, and module infrastructure.

## Framework scope

- Core runtime and lifecycle controls
- Neutral module registry and discovery
- User management without application-specific logic
- Admin diagnostics without domain logic
- i18n support with generic texts only
- Configuration and state management
- Storage and database abstraction
- Service orchestration
- Event bus and error logging
- Security helpers without feature-specific enforcement

## Structure

- Core/
  - core.js
  - core-context.js
  - core-config.js
  - core-entry.js
  - core-error-handler.js
  - core-event-bus.js
  - core-lifecycle.js
  - core-loader.js
  - core-runtime.js
  - core-shutdown.js
  - core-startup.js
  - core-state.js
  - core-storage.js
  - module-interface.js
  - module-manager.js
  - module-registry.js
  - security.js
  - core-user.js
  - core-admin.js
  - core-i18n.js
  - config-manager.js
  - database-manager.js
  - service-manager.js
  - app.js

## Decisions

- GPS and weather modules were removed as domain-specific, non-framework code.
- Historical audit and project documentation was removed to keep the repository clean.
- Framework modules are kept in the core instead of a domain-specific Modules folder.
- The repository is intentionally neutral and reusable for later applications.

## Verification

The neutral framework was validated in an isolated runtime environment. The validation confirmed the required framework core, user management, admin diagnostics, i18n, service manager, and database/storage layers all initialize without application-specific dependencies.
