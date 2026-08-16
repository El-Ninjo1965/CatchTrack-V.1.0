# Neutral Platform Workflow

## Purpose

This repository is a reusable, neutral web platform framework. It keeps the runtime core, module system, access model, admin shell, developer shell, and server boundary separated from any single product or business domain.

## Architecture

- Core/
  - runtime lifecycle, configuration, state, storage, events, and error handling
  - auth, access, audit, and user management contracts
  - module registry and discovery lifecycle
- server/
  - HTTP server bootstrapping and health checking
  - static asset serving for the webroot layer
- webroot/
  - neutral user dashboard, admin shell, and developer diagnostics shell
  - shared app shell and styling
- tests/
  - framework-neutral validation and core contract checks

## Working rules

- Keep business logic outside the shared framework core.
- Preserve neutral labels and generic shell behavior.
- Keep security and access policy logic in the core rather than in product-specific modules.
- Validate the repo using the real test suite before considering the workspace ready.

## Validation

Run these checks from the repository root:

1. npm test
2. node tests/framework-neutral.test.js
3. Optional browser validation for the UI shell when Playwright browsers are installed

## Notes

- This project is intentionally framework-oriented and app-agnostic.
- No product-specific workflow documents or stale app names should remain in the repository.
