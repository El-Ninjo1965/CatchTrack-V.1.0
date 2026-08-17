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
