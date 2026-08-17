# Neutral Platform Workflow

## Actual repository structure

- platform/
  - shared infrastructure for runtime lifecycle, configuration, sessions, state, storage, events, auth, access, audit, security, modules, services, and diagnostics
- server/
  - bootstrap, routing, API, middleware, services, and configuration layering for HTTP delivery
- app/
  - neutral application shell that can host any future concrete frontend or process
- webroot/
  - public assets, browser shell pages, static CSS/JS, and public entry points
- tests/
  - neutral framework validation and platform contracts
- config/
  - environment and deployment defaults

## Operating model

- Keep business logic outside the shared platform layer.
- Keep all public-facing browser assets in webroot.
- Reserve app/ for neutral application integration only.
- Keep server logic limited to HTTP boundary concerns; the server consumes the platform rather than reimplementing it.
- No project-specific business logic or stale workflow labels may remain in the neutral platform.
- The platform remains independent from any later concrete application.
- Deployment to a standard server or cPanel ZIP package must remain possible without Codespace-only runtime assumptions.

## Required delivery rules

- The workflow file must describe the actual repository state and stay below 10,000 characters.
- Any change must be implemented and verified with the real project checks before it is considered complete.
- A "done" state without fresh verification is not valid.
- Every assignment ends with the required sequence: COMMIT → PUSH → FETCH → LOCAL/REMOTE-VERGLEICH → GITHUB-TREE-VERIFIKATION.
- Push success is only valid after the remote result is checked successfully.
- After a push, the repository must be fetched and compared again to confirm local and remote state match.
- The final repository tree must be checked on GitHub to confirm the required folders exist and no accidental root-level artifacts remain.

## Validation

Run from repository root:

1. npm test
2. node server/server.js
3. curl http://127.0.0.1:3000/health
4. curl http://127.0.0.1:3000/api/health

## Notes

- The current output is framework-oriented and intentionally app-agnostic.
- The structure is designed to be portable to a standard cPanel-style deployment environment.

## 2026-08-17 — Neutral external module discovery and GPS browser loading

- Aufgabe: Das neutrale Framework so erweitern, dass externe Anwendungsmodule dynamisch im Browser geladen werden, ohne den Core an GPS oder andere konkrete Module zu koppeln.
- Ziel: `app/modules/` als kanonischen Modulpfad nutzen, `/api/modules` als reale Modulkatalog-Quelle verwenden und das GPS-Modul als eigenständige Referenzimplementierung laden.
- Ausgangszustand: GPS war serverseitig sichtbar, aber im Browser nicht registriert; der Loader nutzte im Browser keine echte Modulkatalog-Quelle.
- Tatsächlich durchgeführt:
  - `platform/core-loader.js` erweitert: Browser-Discovery liest jetzt `/api/modules`, lädt Module per Manifest und resolved Implementierungen robuster.
  - `platform/module-manager.js` und `platform/module-registry.js` nutzen den neutralen Standardpfad des Loaders.
  - `app/modules/gps/index.js` von projektspezifischem Text bereinigt.
  - `tests/framework-neutral.test.js` um `/api/modules` und die statische Modulroute erweitert.
  - `tests/smoke.spec.js` prüft jetzt, dass `GpsModule` und die Registry im Browser tatsächlich geladen sind.
- Wichtige Architekturentscheidung: Browser-Discovery ist jetzt kataloggetrieben über `/api/modules` und bleibt damit unabhängig von fest verdrahteten Modulnamen.
- Branch: `copilot/neutral-module-loader-browser-api`
- Commit: `c09ffe9` — `feat: load external modules from api`
- Pull Request: neu für diesen Arbeitsstand noch nicht erstellt
- Merge: keiner
- Testergebnisse:
  - `npm test`: 6/6 bestanden
  - `npx playwright test --reporter=list`: 1/1 bestanden
- Fehler: keine
- Architektur-Vorschläge:
  - Optional könnte der Browser-Loader bei fehlender `/api/modules`-Antwort zusätzlich eine explizite Fehlermeldung im Diagnostics-Log hinterlassen, ohne den Start abzubrechen.
- Aktueller Projektstand: neutrales Framework bleibt funktionsfähig ohne GPS; GPS ist nun im Browser als Referenzmodul registrierbar.
- Nächster sinnvoller Schritt: Änderungen pushen und bei Bedarf einen PR öffnen.

### Follow-up

- Branch wurde auf `origin/copilot/neutral-module-loader-browser-api` gepusht.
- Pull Request `#3` ist geöffnet: `feat: load external modules from api`.
- PR-Body wurde auf die neutralen Lade- und Testschritte korrigiert.


## 2026-08-17 - PR #3 Sicherheitsfix und Squash-Merge

- Aufgabe: PR #3 abschliessend pruefen, die Modulroute absichern und nach erfolgreicher Verifikation per Squash nach main mergen.
- Ausgangs-HEAD: 689bbf1; PR-Head vor dem Fix: 689bbf190e80d1d1f69d06828f4f528dff9e1211.
- Sicherheitsbefund: /app/modules/* loeste anfangs relativ zum Repository-Root auf. Traversal konnte damit zwar nicht das Repository verlassen, aber den Modulordner verlassen.
- Fix: Die Modulroute loest jetzt ausschliesslich relativ zu app/modules auf.
- Regressionstest: Ein kodierter Traversal-Versuch auf platform/core.js liefert 404; gueltige GPS-Assets bleiben erreichbar.
- Fix-Commit: e524680314df9d42c55c579a373c15cfc4bce019 - fix: restrict module asset route to app modules.
- Pull Request: #3 per Squash gemergt.
- Merge-Commit und finaler origin/main-HEAD: 0b33db9d9f048d37a3f509801a51303907c9cc2a.
- Testergebnisse auf origin/main: npm test 6/6 bestanden; npx playwright test --reporter=list 1/1 bestanden.
- Ergebnis: Die Browser-Discovery bleibt kataloggetrieben und neutral; die statische Modulroute ist auf ihren kanonischen Basisordner beschraenkt.
- Naechster sinnvoller Schritt: keiner.


## 2026-08-17 - Framework acceptance, module isolation, and browser preview

- Task: Verify that the neutral framework operates without the optional GPS reference module, stabilize the testable module contract, and provide a first browser preview.
- Starting point: main at e653c78; PR #2 and PR #3 were already merged.
- Isolation verification: server module discovery now accepts an injected modulesDir for tests. A temporary empty directory proves that CoreLoader discovers zero external modules, /api/modules returns an empty list, and a missing module asset returns 404 without modifying app/modules/gps.
- Contract and lifecycle: ARCHITECTURE.md now records required id, globalName, permissions, and capabilities fields, plus optional lifecycle/API ownership. A generic sample module test covers install, initialize, enable, disable, uninstall, missing module handling, duplicate registration, and invalid manifests.
- Browser preview: webroot/index.html and master-ui.js render a login-independent framework preview. It reports framework status, discovery status, dynamically discovered modules, and optional GPS status. The UI still works when GPS is absent and displays not installed.
- Branding boundary: The browser preview contains the requested product label only in the presentation layer. The neutral source scan remains limited to platform, server, app, and config components.
- Security: the app/modules route remains constrained to the app/modules base directory; its traversal regression test remains green.
- Start mechanism: npm start uses node server/server.js on 127.0.0.1:3000 by default. Playwright starts the same server on 127.0.0.1:8000 through playwright.config.js.
- Tests: npm test 8/8 passed; npx playwright test --reporter=list 1/1 passed.
- Branch: copilot/framework-acceptance-module-isolation.
- Next step: commit, push, create PR, and squash-merge after GitHub reports a clean merge state.

### Completion

- PR #4 was squash-merged after GitHub reported OPEN, non-draft, CLEAN, and MERGEABLE.
- Merge commit and final framework change on main: 9733e443c2c4e3e1dee224888f89b3836eadcf6c.
- Verification on origin/main: npm test 8/8 passed; npx playwright test --reporter=list 1/1 passed.
- Current preview endpoint: http://127.0.0.1:3000/.
- Result: framework acceptance completed; no external module is required for core startup, discovery, or the preview.


## 2026-08-17 - User application, GPS activation, and admin separation

- Task: Replace the technical landing page with a direct user application, expose the optional GPS reference module through the generic module UI contract, and separate technical pages from the user route.
- Starting point: main at f6c8bf6 with the optional-module acceptance suite already merged.
- User app: index.html is now a minimal application shell with only Modules and Settings. It has no framework, server, developer, diagnostics, or admin information.
- GPS activation: the module remains discovered from app/modules through /api/modules and the generic loader. Its lifecycle now mirrors status and active on the module contract, so generic user interfaces can list it without core-specific logic.
- GPS UI: GPS owns renderUserInterface and provides current-position, start-tracking, and stop-tracking actions with human-readable permission and location failure messages.
- Optional modules: user-app.js renders only generic active modules and calls a module-provided renderUserInterface hook when available. Without GPS, the app remains functional and shows no GPS entry.
- Admin separation: admin.html and dev.html require ADMIN_ACCESS_TOKEN through the x-admin-access-token request header. Requests without a configured matching server token return 403.
- Security: module-asset traversal protection remains covered; direct technical-page access is now additionally covered by Node and browser tests.
- Tests: npm test 8/8 passed; npx playwright test --reporter=list 2/2 passed.
- Branch: copilot/user-app-gps-admin-separation.
- Next step: commit, push, create PR, and squash-merge after a clean GitHub check.


Fortsetzung: WORKFLOW-02.md
