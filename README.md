# Technical Web-App Platform v1

Neutrale, wiederverwendbare PHP/Apache-Plattform als Grundlage für zukünftige Web-Anwendungen.

## Voraussetzungen

- PHP 8.1+
- Apache mit `mod_rewrite`
- MySQL/MariaDB
- cPanel-kompatibles Shared Hosting

## Struktur

- `app/` – Platzhalter für spätere anwendungsspezifische Erweiterungen
- `server/` – deploybarer Plattformbereich
  - `server/public/` – öffentliches Webroot
  - `server/public/api/` – API-Einstiegspunkt
  - `server/public/admin/` – Admin-Login, Logout, Dashboard
  - `server/config/` – Konfigurationsvorlagen
  - `server/database/` – neutrales Datenbankschema
  - `server/modules/` – Modulbereich
  - `server/uploads/` – Upload-Speicherbereich
  - `server/src/` – Bootstrap, Routing, Auth, DB, Services

## Installation

1. `server/config/.env.example` nach `.env` übernehmen (oder cPanel-Umgebungsvariablen setzen).
2. Datenbank anlegen.
3. `server/database/schema.sql` importieren.
4. Bootstrap-Admin-Zugang über Umgebungsvariablen setzen:
   - `BOOTSTRAP_ADMIN_USERNAME`
   - `BOOTSTRAP_ADMIN_PASSWORD`
5. Apache DocumentRoot auf `server/public` setzen.

## cPanel Deployment

1. Repository herunterladen.
2. Nur den Ordner `server/` als ZIP in cPanel hochladen.
3. Entpacken, DocumentRoot auf `server/public` zeigen lassen.
4. Dateirechte setzen:
   - `server/storage/` und `server/uploads/` schreibbar
   - keine Schreibrechte für Quellcode-Dateien im Betrieb
5. `.htaccess`-Regeln aktiv lassen (kein Directory Listing, Schutz sensibler Dateien, Upload-Schutz).

## Datenbank

Neutrales Schema enthält:

- `users`
- `roles`
- `user_roles`
- `modules`
- `module_status`
- `audit_logs`

## Health-Check

- `GET /api/health`

## Administration

- `GET /admin/` – Login
- `POST /admin/index.php` – Login Submit
- `GET /admin/logout.php` – Logout

## Erweiterung

Neue Anwendungen werden als Module aufgebaut und greifen auf die neutralen Plattformdienste (Auth, Rollen, API, DB, Sessions, Uploads) zu.
