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

## 2026-08-18 - Neutral multi-app hardening and legacy demo cleanup

- Repository state aligned with the GitHub workflow: PR #8 on branch `copilot/neutral-connection-management` was reviewed against the local repository state before work began.
- The legacy demo shell files `app/app-demo.js` and `app/index.js` were removed because they were unused demo-only scaffolding and no active user-app, admin, developer, or GPS flow depended on them.
- The `app/modules/gps` module remains in place as the active module implementation and was not converted into a CatchTrack-specific app.
- `apps/demo2/` remains as a temporary neutral architecture test app. It is intentionally isolated with its own `appId`, mount path, webroot, connection scope, and app-scoped API context; it does not become a CatchTrack-branded application.
- The app registry (`server/services/app-registry.js`) was hardened to fail fast on invalid registry payloads, missing app IDs, missing mount paths, duplicate app IDs, duplicate mount paths, and invalid `webRootDir` values. It no longer silently falls back to defaults when the registry is malformed.
- The connection service (`server/services/connection-service.js`) now isolates app-scoped connections, rejects unknown apps, prevents cross-app reads or writes, and enforces valid app context boundaries while preserving the neutral architecture.
- Additional test coverage was added in `tests/framework-neutral.test.js` for duplicate IDs, duplicate mounts, invalid registry entries, root-vs-app context resolution, `/demo2` isolation, and parallel mounts such as `/catchtrack/` and `/zukunft/`.
- Validation executed successfully:
  - `node --check` for all edited JavaScript files
  - `npm test` -> 13/13 passed
  - `npx playwright test --reporter=list` -> 4/4 passed
  - `git diff --check` -> clean
- Runtime/test artifact review did not reveal active app servers or hanging test processes; the repository remains in a clean validation state aside from the intentional code changes.
- Final branch state at completion: working branch `copilot/neutral-connection-management` with the changes for PR #8 and the local repo aligned to the GitHub workflow state.


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

## 2026-08-17 - Neutrale Multi-App-Serverstruktur

- Aufgabe: Die Plattform so vorbereiten, dass mehrere voneinander getrennte Apps auf derselben Serverbasis laufen können, ohne den Core app-spezifisch zu machen.
- Architekturentscheidung:
  - Eine App wird jetzt über einen neutralen Registry-Eintrag identifiziert (`appId`, `appName`, `mountPath`, `webRootDir`, `dataRootDir`, `apiBasePath`, `connectionScope`).
  - Der Server löst Requests gegen die App-Registry auf und trennt globale Root-Zugriffe von app-gebundenen Pfaden.
  - App-spezifische Connection-Zugriffe sind an die jeweilige App-ID gebunden; globaler Admin-Zugriff bleibt davon getrennt.
  - Die primäre Web-App bleibt auf `/`, spätere Apps können unter eigenen Mount-Paths wie `/catchtrack/` oder `/zukunft/` ergänzt werden.
  - Gemeinsame Plattform-Bausteine bleiben unter `platform/` und werden nicht in app-spezifische Bereiche verschoben.
- Neue Struktur:
  - `server/state/apps.json` enthält die neutrale App-Registry.
  - `server/services/app-registry.js` löst App-Kontexte und Mount-Paths auf.
  - `server/services/connection-service.js` unterstützt app-gebundene Listen, Lese- und Schreibzugriffe.
  - Der Server kann app-gebundene APIs unter dem jeweiligen Mount-Path bereitstellen, ohne die bestehende User-App zu verändern.
- Wie eine App identifiziert wird:
  - Über `appId` in der Registry und im Connection-Record.
  - Über den Mount-Path der Request-URL, der auf den passenden Registry-Eintrag aufgelöst wird.
  - Über `api/app-context`, das den aktuellen App-Kontext zurückgibt.
- Wie Isolation funktioniert:
  - App-gebundene Connection-Zugriffe werden serverseitig auf die aktuelle App-ID begrenzt.
  - Der globale Admin-Bereich bleibt neutral und kann weiterhin appübergreifend verwalten.
  - Daten-/Konfigurationspfade sind pro App getrennt vorgesehen.
- Wie später `/catchtrack/` daraus entstehen kann:
  - Durch einen weiteren Registry-Eintrag mit eigenem Mount-Path und eigenen Daten-/Webroot-Pfaden.
  - Ohne Änderung an der neutralen Core-, Connection- oder Admin-Logik.
- Bewusst offen:
  - Keine konkrete zweite App implementiert.
  - Kein Deployment auf `/catchtrack/`.
  - Keine Benutzerverwaltung, Backups oder Update-Verwaltung.
  - Kein App-spezifisches Frontend-Routing jenseits der Registry-Grundlage.
- Tests:
  - `npm test`: 10/10 bestanden
  - `npx playwright test --reporter=list`: 3/3 bestanden
  - `git diff --check`: keine Fehler

## 2026-08-17 - Neutrale Demo-App für die Multi-App-Validierung

- Aufgabe: Eine zweite, vollständig neutrale Demo-App neben der Root-App bereitstellen, um die Multi-App-Struktur praktisch zu prüfen.
- Umsetzung:
  - `demo2` wurde als eigene App-Instanz mit Mount-Path `/demo2/` registriert.
  - Die App bekommt einen eigenen Webroot unter `apps/demo2/webroot/`.
  - Der Server erkennt den App-Kontext anhand des Mount-Paths und trennt Root- und Demo-Connections serverseitig.
  - Ungeregelte App-Pfade liefern sauber `404`.
- Tests:
  - Root-App lädt weiter.
  - `/demo2/` liefert die Demo-App.
  - Root- und Demo2-Connections bleiben getrennt.
  - Nicht registrierte App-Pfade werden sauber behandelt.
