# Web App Platform v1

Neutral, reusable technical platform for PHP/MySQL web applications.

## Requirements
- Apache with `mod_rewrite`
- PHP 8.1+
- MySQL/MariaDB
- File write permission for `server/uploads/`

## Structure
- `server/` deployable server area (API, admin, config, modules, uploads)
- `database/` SQL schema for platform initialization
- `Core/`, `tests/`, Playwright files: repository/workflow area for frontend/runtime development

## cPanel Installation (ZIP)
1. Upload the deployable package contents from `server/` and `database/`.
2. Set document root to `server/public/`.
3. Import `database/schema.sql`.
4. Copy `server/config/config.local.php.example` to `server/config/config.local.php` and set DB credentials.
5. Optionally set environment variables from `server/config/env.example`.
6. Replace default admin password hash in `users` table.

## Database Setup
- Run `database/schema.sql`.
- Ensure `roles`, `users`, and `modules` are created.
- Store only hashed passwords (`password_hash`).

## Configuration
- Baseline: `server/config/config.default.php`
- Local/server specific: `server/config/config.local.php`
- Environment template: `server/config/env.example`

## Health Check
- Endpoint: `GET /health`
- Returns JSON runtime status.

## Administration
- Login: `/admin/login.php`
- Protected dashboard: `/admin/dashboard.php`
- Session-based access control with session ID regeneration at login.

## Module Extension
- Add platform modules in `server/modules/`.
- Register module records in the `modules` table.

## Reuse
This platform is intended as a neutral base for multiple future web applications.
