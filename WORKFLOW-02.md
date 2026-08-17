# Neutral Platform Workflow - Continuation

Fortsetzung von WORKFLOW.md

## 2026-08-17 - Completion of user application and GPS work

- PR #5 was squash-merged after GitHub reported OPEN, non-draft, CLEAN, and MERGEABLE.
- Merge commit: 1007d61027918d423a96e5195bc98a316a491b8f.
- Final verification on origin/main: npm test 8/8 passed; npx playwright test --reporter=list 2/2 passed.
- User application opens directly, lists the active GPS module through the generic registry contract, and the GPS interface exercises browser geolocation controls.
- Unauthenticated requests to admin.html and dev.html return 403; deployments may authorize technical pages through ADMIN_ACCESS_TOKEN and x-admin-access-token.
- Result: user and technical surfaces are separated without making the core depend on GPS.
- Next step: configure an ADMIN_ACCESS_TOKEN in the deployment environment before granting administrative browser access.


## 2026-08-17 - User app visual refinement

- Task: Refine the user application presentation without changing the generic module architecture, GPS discovery, server protection, or user functionality.
- Starting point: main at 0154840 with the direct user app and GPS controls already merged.
- UI changes: the user route now uses a quieter application shell, clearer navigation states, responsive spacing, refined module cards, and a focused empty settings view.
- Module boundary: user-app.js still renders any active module from the registry. It provides a generic card and delegates detailed UI to the module-owned renderUserInterface hook.
- GPS presentation: the GPS module owns its structured location view, status badge, position card, and existing position/tracking controls. No GPS reference was added to platform or server code.
- Security: administrative routes and module-route protections were not changed; browser and Node checks continue to cover them.
- Tests: npm test 8/8 passed; npx playwright test --reporter=list 2/2 passed.
- Branch: copilot/refine-user-app-ui.
- Next planned step, not implemented here: prepare server deployment, the public server address, reverse-proxy/port operation, and a dedicated authenticated admin entry point.


### Completion

- PR #6 was squash-merged after GitHub reported OPEN, non-draft, CLEAN, and MERGEABLE.
- Merge commit: 2c70a410ab5a3a5792762e4c32384c73c3367e8c.
- Final verification on origin/main: npm test 8/8 passed; npx playwright test --reporter=list 2/2 passed.
- Result: the user route has a refined responsive app presentation while module discovery, GPS functionality, and administrative route protection are unchanged.
- Next planned phase: server deployment and authenticated administrative entry; no additional modules or user features were implemented in this UI phase.


## 2026-08-17 - Serverseitige Produktionsgrundlage und technischer Admin-Einstieg

- Aufgabe: Die echte Serverbasis so schärfen, dass die User-App separat bleibt, technische Bereiche serverseitig abgesichert sind und der Betrieb auf einem echten Server bzw. hinter einem Reverse Proxy vorbereitet ist.
- Ausgangszustand: Der Node-Server lief bereits, `/api/modules` und die GPS-Referenz waren vorhanden, aber der Serverstart war noch an localhost orientiert und der technische Browser-Einstieg war nicht sauber als kanonische Route abgesetzt.
- Architekturentscheidung:
  - `server/server.js` nutzt jetzt die zentrale Konfiguration für Port und Host.
  - `server/config/index.js` bindet standardmäßig an `0.0.0.0`, damit Reverse-Proxy- und Serverbetrieb möglich sind.
  - `server/bootstrap/server.js` behandelt `/admin` und `/developer` als kanonische technische Einstiege und schützt sie serverseitig über `ADMIN_ACCESS_TOKEN` + `x-admin-access-token`.
  - Die Browseroberfläche für den User-Bereich bleibt getrennt; die User-App zeigt keine Admin- oder Developer-Navigation.
  - Admin/Developer bleiben technische Oberflächen mit nachgelagertem Login innerhalb der jeweiligen Seite.
- Tatsächlich durchgeführt:
  - Canonische technische Routen `/admin` und `/developer` ergänzt, inklusive Schutz auf dem HTTP-Server.
  - Serverfehlercodes für fehlende bzw. falsche technische Zugriffe sauber getrennt (401/403).
  - `webroot/master-ui.js` so angepasst, dass die User-App keine technischen Navigationspunkte anzeigt.
  - Playwright auf einen serverseitig gesetzten Admin-Token vorbereitet.
  - Tests erweitert, damit User-App, technische Routes, API, GPS-Discovery und sichere Admin-Zugriffe abgesichert sind.
- Geänderte Dateien:
  - `server/bootstrap/server.js`
  - `server/config/index.js`
  - `server/server.js`
  - `webroot/master-ui.js`
  - `tests/framework-neutral.test.js`
  - `tests/smoke.spec.js`
  - `playwright.config.js`
- Branch: `copilot/server-production-admin-entry`
- Commit: `dda169e` - `feat: add server admin entry routes`
- Testergebnisse:
  - `npm test`: 9/9 bestanden
  - `npx playwright test --reporter=list`: 3/3 bestanden
  - `git diff --check`: keine Fehler
  - Produktionsnaher Start: `PORT=3100 HOST=127.0.0.1 ADMIN_ACCESS_TOKEN=prod-admin node server/server.js`
  - HTTP-Prüfungen: `/` ok, `/api/modules` ok, `/admin` ohne Token 403, `/admin` mit Token erreichbar
- Produktivserver-Kopierumfang:
  - `server/`
  - `platform/`
  - `webroot/`
  - `app/modules/`
  - `package.json`
  - `package-lock.json`
  - optional: `.env` bzw. die Laufzeit-Umgebungsvariablen für Port, Host und Admin-Token
- Verbleibende Punkte:
  - Langfristig sollte die technische Admin-Authentifizierung in ein echtes Rollen-/Session-Modell überführt werden.
  - Reverse-Proxy-Header für den Admin-Token müssen im Deployment sauber gesetzt werden.
  - Weitere Verwaltungsfunktionen wie Benutzerverwaltung, Updates und Backups bleiben bewusst offen.
- Aktueller Stand: Die Plattform kann als separater User- und Admin-Bereich auf einem echten Server betrieben werden, ohne GPS oder andere Module fest in den Core zu verdrahten.

## 2026-08-17 - Neutrale Connection-Verwaltung als App-Grundlage

- Aufgabe: Eine app-neutrale Connection-Struktur schaffen, damit mehrere unabhängige Apps später auf demselben Server mit eigenen API-Basispfaden betrieben werden können.
- Architekturentscheidung:
  - Connection-Profile sind bewusst neutral modelliert: `appId`, `appName`, `serverUrl`, `apiBasePath`, `connectionStatus`, `parameters` und `metadata`.
  - Die Serverquelle für Connections liegt in `server/state/connections.json`; es werden keine Zugangsdaten im Frontend gespeichert.
  - Der Admin-Bereich erhält eine neutrale Verwaltungskarte mit Liste, Formular, Bearbeiten-, Löschen- und Aktualisieren-Aktionen.
  - Der Server schützt die Connection-API serverseitig und erlaubt Browserzugriff über ein HttpOnly-Cookie, das aus dem bereits geprüften Admin-Token abgeleitet wird.
  - Die User-App bleibt technisch vorbereitet, lädt den Connection-Manager aber ohne eigene CatchTrack-Verbindung oder fachliche Kopplung.
- Tatsächlich durchgeführt:
  - Neue neutrale Connection-Registry im Browser ergänzt.
  - `server/bootstrap/server.js` um `/api/connections` erweitert und auf cookie-basierte Folgezugriffe vorbereitet.
  - Admin-/User-/Developer-Seiten laden den Connection-Manager, ohne technische Navigation in der User-App sichtbar zu machen.
  - Tests ergänzt, damit Connection-API, Cookie-geschützte Admin-Zugriffe und die adminseitige Oberfläche verifiziert werden.
- Geänderte Dateien:
  - `platform/connection-manager.js`
  - `platform/config-manager.js`
  - `server/bootstrap/server.js`
  - `server/config/index.js`
  - `server/services/connection-service.js`
  - `webroot/admin.html`
  - `webroot/index.html`
  - `webroot/dev.html`
  - `webroot/master-ui.js`
  - `tests/framework-neutral.test.js`
  - `tests/smoke.spec.js`
- Verbleibende Punkte:
  - Die Connection-Verwaltung ist bewusst app-neutral; konkrete App-Instanzen oder CatchTrack-spezifische Verbindungen werden noch nicht fest verdrahtet.
  - Weitere Lifecycle-Themen wie Deployments, Backups oder Benutzerverwaltung bleiben separat.
