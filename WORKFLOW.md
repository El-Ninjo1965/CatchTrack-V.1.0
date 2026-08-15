# Neutral Framework Workflow

## Projektstatus

STATUS: READY FOR FREEZE REVIEW

Das Repository bleibt ein neutrales, wiederverwendbares Framework. Der Core ist stabil, und die User/Admin Master-Core-Fassaden wurden in der bereits genehmigten Architektur implementiert, ohne den neutralen Core unnötig umzubauen. Der aktuelle Stand wurde gegen die freigegebene Architektur, den Laufzeitcode und die Sicherheits-/Async-Checks geprüft. Ein Freeze wird hier nicht durchgeführt.

## Aktuelle Architekturübersicht

- Core/
  - Bootstrap, Runtime, Lifecycle, Context, State, Storage
  - Config-, Database-, Service- und Event-Management
  - Module Interface, Registry, Manager
  - Security, Error Handling und I18n
- Modules/
  - bewusst leer
  - keine Fachmodule im Core
- User und Admin bleiben Core-Bestandteile, keine optionalen Fachmodule
- Fachmodule sind optional und sollten untereinander unabhängig bleiben
- CatchTrack Master UI
  - `index.html` – normale CatchTrack User-App
  - `admin.html` – eigenständige CatchTrack Admin-App
  - `dev.html` – eigenständige Developer-/Diagnose-App
  - alle drei Oberflächen konsumieren denselben Core und teilen sich `style.css` sowie `master-ui.js`
  - nutzt `ModuleRegistry`, `ModuleManager`, `CoreAccess`, `CoreAuth`, `CoreAudit` und den aktuellen User-State
  - rendert Menüs und Views dynamisch nur mit gültiger Berechtigung
  - Systemstatus und Console erscheinen ausschließlich in der Developer-App
  - Navigation liegt standardmäßig oben; die Linkleiste ist nicht mehr als Side-Nav implementiert und bleibt responsive

## Verbindliche Arbeitsregeln

- WORKFLOW.md ist die Master-Übersicht und Steuerdatei.
- Detaillierte Reviews und technische Analysen gehören in separate WORKFLOW_*.md-Dateien.
- Keine Implementierung im Rahmen dieser Dokumentationsstruktur.
- Keine Core-Änderung ohne ausdrückliche Architekturentscheidung.
- Details, die länger als die Master-Übersicht lesbar bleiben, werden ausgelagert.
- Die Masterdatei darf klein, lesbar und vollständig einlesbar bleiben.

## Dokumentations- und Git-Regel für WORKFLOW_*.md

Für jede neue oder geänderte Workflow-Datei gelten die folgenden verbindlichen Regeln:

1. Datei vollständig erstellen bzw. aktualisieren.
2. Prüfen, dass die Datei tatsächlich im Repository vorhanden ist.
3. Pfad und Zweck der Datei in WORKFLOW.md dokumentieren.
4. Nach dem Commit die Commit-SHA in WORKFLOW.md vermerken.
5. Änderungen committen.
6. Auf origin/main pushen.
7. Danach den Remote-Stand verifizieren.
8. Sicherstellen, dass die referenzierte Datei über den Commit und den Repository-Tree eindeutig auffindbar ist.
9. Keine WORKFLOW-Datei darf in WORKFLOW.md referenziert werden, wenn sie nicht tatsächlich im Repository vorhanden und auf origin/main synchronisiert ist.

WORKFLOW.md bleibt die zentrale Index-/Masterdatei.

Wiederauffindbarkeitsregel:
WORKFLOW.md → Dateipfad → Commit-SHA → Git Tree → Datei

Jede Detaildatei muss einen eindeutigen Repository-Pfad verwenden, z. B.:
WORKFLOW_USER_ADMIN_REVIEW.md

Diese Regel ist verbindlich für alle zukünftigen Workflow-Dokumentationen.

## Aktuelle Master-Entscheidungen

- Das Framework bleibt neutral und wiederverwendbar.
- User und Admin bleiben Core-Bestandteile.
- Fachmodule sind optional und technisch entkoppelt.
- Rollen und Berechtigungen werden getrennt modelliert.
- Benutzername und User-ID sind getrennt.
- Admin soll orchestrieren, nicht duplizieren.
- Audit, Authentifizierung und Zugriffskontrolle müssen als eigene fachliche Verantwortung modelliert werden.
- UI bleibt außerhalb des Core und darf niemals alleinige Zugriffskontrolle sein.
- Der erste Developer-Bootstrap-User wird über den normalen User/Auth/Access-Pfad erzeugt und bleibt ein normaler `developer`-Rollenbenutzer, kein Superuser.
- Die 11 Architekturentscheidungen wurden fachlich bewertet und genehmigt.

## Status der 11 Entscheidungen

STATUS: BESCHLOSSEN

1. User-ID: genehmigt – technische UUID + Anzeige-ID `USR-000001`
2. Architektur: genehmigt – Identity / Auth / Access / Audit / Fassade sauber getrennt
3. Owner: genehmigt – kein generisches `owner`, stattdessen `protected`
4. Username: genehmigt – Mindestlänge 3
5. Mehrfachrollen: genehmigt – `roles[]` vorbereitet, komplexe Logik verzögert
6. Events: genehmigt – `user:*`, `auth:*`, `admin:*`, `module:*`
7. User/Admin: genehmigt – feste Core-Bestandteile, keine Feature-Flags als Sicherheitsmodell
8. Event-Historie: genehmigt – Ringpuffer, keine unkontrollierte Persistenz
9. ModuleManager: genehmigt – `update()` als Lifecycle-Schnittstelle
10. Fehlerbehandlung: genehmigt – einheitliches Fehler-/Ergebnismodell
11. Auth: genehmigt – zentrale `core-auth`, zweiter Pfad deprecated

## Genehmigte Architektur-Spezifikation

WORKFLOW_USER_ADMIN_APPROVED.md
Pfad:
/workspaces/CatchTrack-V.1.0/WORKFLOW_USER_ADMIN_APPROVED.md
Commit-SHA:
546ebc0a78a60156e9900a687e86c65a3edab796
Status:
VORHANDEN UND SYNCHRONISIERT MIT origin/main – genehmigte Architekturdefinition

## Architektur-Reviews

### User & Admin Master Core
Detailanalyse:
WORKFLOW_USER_ADMIN_REVIEW.md
Pfad:
/workspaces/CatchTrack-V.1.0/WORKFLOW_USER_ADMIN_REVIEW.md
Commit-SHA:
5baee91ed88dc788769f047073566af4d9007072
Status:
BESCHLOSSEN – 11 Punkte genehmigt, Bewertung dokumentiert.

Referenz- und Auffindbarkeitsregel:
WORKFLOW.md → WORKFLOW_USER_ADMIN_APPROVED.md → 546ebc0a78a60156e9900a687e86c65a3edab796 → Git Tree → Datei
WORKFLOW.md → WORKFLOW_USER_ADMIN_REVIEW.md → 5baee91ed88dc788769f047073566af4d9007072 → Git Tree → Datei

## Arbeitsphase

PHASE: User/Admin Master Core Implementierung

## Freeze- und Release-Status

- Framework-Core: stabil
- User/Admin Master-Architektur: genehmigt und umgesetzt
- Initialer Developer-Bootstrap: konfiguriert, idempotent, geschützt und ohne Hardcoded-Credentials
- Developer-Login: lokal konfigurierbarer Bootstrap-Password-Mechanismus ergänzt, ohne echte Secrets im Repository
- UI-/Preview-Test: realer Browser-Login, User-App, Admin-App, Developer-App und Logout im lokalen Preview validiert
- Master UI: `index.html`, `admin.html` und `dev.html` sind tatsächlich getrennte Oberflächen
- Navigation: Top-Navigation verifiziert, statt linke Seitenleiste; aktive Menüeinträge und responsive Verhalten wurden im Browser getestet
- Implementierung des Master-Cores: geprüft und bereit für Freeze Review
- Freeze: nicht durchgeführt
- GitHub-Synchronisierung: aktueller Codespace-Stand wurde auf origin/main veröffentlicht

## GitHub- und Synchronisationsstatus

Status: SYNCHRONISIERT MIT GITHUB

- Repository: CatchTrack-V.1.0
- Branch: main
- Relevanter Commit der aktuellen verifizierten Änderung: wird nach dem finalen Commit und Push in dieser Datei ergänzt
- Remote-Status: `git rev-parse HEAD` und `git rev-parse origin/main` sind identisch
- Verifiziert am 2026-08-15
- Workflow-Dokumentation: in dieser Datei aktualisiert und mit dem aktuellen Commit synchronisiert

## CatchTrack Master UI (drei getrennte Oberflächen)

STATUS: IMPLEMENTIERT UND VERIFIZIERT

Der frühere Ansatz „bestehende Developer-HTML als sichtbare App-Shell“ ist aufgehoben und entfernt.
Es gelten ausschließlich drei getrennte Oberflächen:

- `index.html` – normale User-App
  - CatchTrack Header, Benutzeranzeige, Profil-Button, Logout
  - Sidebar-Menü: Dashboard, Profil, Module sowie dynamisch freigegebene Module
  - Administration- und Developer-Link nur bei entsprechender Berechtigung
  - zentraler Content-Bereich `#mainContent`
  - keine Diagnose-/Console-Oberfläche
- `admin.html` – Admin-App
  - Admin Header und Admin-Navigation: Admin Dashboard, Benutzer, Rollen, Permissions, Module, Audit, System
  - eigener zentraler Content-Bereich `#mainContent`
  - Zugriffsschutz beim direkten Aufruf: authentifiziert **und** Admin-Berechtigung
  - ohne Berechtigung: `#accessDenied`-Ansicht, App-Shell bleibt verborgen, Rückweg in die User-App
- `dev.html` – Developer-/Diagnose-App
  - Navigation: Core Status, Auth Status, Access Status, Database/Storage, Module Status, Diagnostics, Console, Audit, Technische Tests
  - Zugriffsschutz beim direkten Aufruf: authentifiziert **und** Developer-Berechtigung
  - ohne Berechtigung: `#accessDenied`-Ansicht, App-Shell bleibt verborgen

Weitere Eigenschaften:

- Der sichtbare Admin-/Developer-Link im User-Menü ist reine Navigation und ersetzt keine Berechtigungsprüfung.
- Menüs werden aus aktuellem User, Rollen, Permissions, `CoreAccess`, `ModuleRegistry` und `ModuleManager` aufgebaut.
- Module erscheinen nur, wenn sie registriert, aktiv und permission-basiert freigegeben sind.
- Der Core wurde für die UI nicht umgebaut; die Oberflächen sind Consumer der vorhandenen APIs.
- Die zentrale CatchTrack-Session wird local-preview-persistiert, ohne das Passwort selbst im Klartext zu speichern. Seitenwechsel zwischen `index.html`, `admin.html` und `dev.html` bleiben mit derselben Session verbunden.
- Die Berechtigung für Admin/Developer wird beim direkten Aufruf erneut aus dem aktuellen Auth- und User-State geprüft; ein zweiter Login wird nicht ausgelöst.
- Designgrundlage bleibt `style.css`: helle, professionelle, responsive Web-App mit Top-Navigation und zentralem Content-Bereich.
- Das User-Menü wird dynamisch aus Rollen, Permissions und registrierten Modulen erzeugt; die Navigation bleibt ohne duplicate login und ohne eigene Berechtigungsquelle.

## Master UI View-/Content-Architektur

STATUS: IMPLEMENTIERT

- Hauptbereich: `#mainContent` als zentraler Render-Container je Oberfläche
- Standard-View: `index.html` → Dashboard, `admin.html` → Admin Dashboard, `dev.html` → Core Status
- Profil-View: Benutzerprofil mit Rolle, Status, Display-ID und Protected-State
- Modul-Views: Übersicht „Module“ plus je Modul ein View-Einstieg; fehlt eine eigene UI, erscheint eine saubere Platzhalteransicht
- Admin-Views (nur `admin.html`): Benutzer, Rollen, Permissions, Module, Audit, Systemstatus
- Developer-Views (nur `dev.html`): Core Status, Auth Status, Access Status, Database/Storage, Module Status, Diagnostics, Console, Audit, Technische Tests
- Die User-App rendert keine Admin- oder Developer-Views mehr im eigenen Content-Bereich
- Navigation wechselt den sichtbaren View; Berechtigungen bleiben an `CoreAccess` orientiert

## Praktischer Browser-/Preview-Teststatus

Verifiziert am 2026-08-15 in der lokalen Preview-Umgebung auf http://127.0.0.1:8000 (Chromium, Playwright):

- Anwendung startet erfolgreich im Browser, Login funktioniert
- `index.html` ist die normale User-App: Dashboard, Profil, Module, Logout
- Developer sieht zusätzlich die Menüeinträge Administration und Developer
- `admin.html` ist eine eigenständige Admin-App; alle Bereiche (Admin Dashboard, Benutzer, Rollen, Permissions, Module, Audit, System) rendern
- `dev.html` ist eine eigenständige Developer-App; alle Bereiche (Core, Auth, Access, Database/Storage, Module, Diagnostics, Console, Audit, Technische Tests) rendern
- Bootstrap-Developer `USR-000001` wird als geschützter `developer`-Benutzer bereitgestellt
- normaler Test-User: kein Admin-Menü, kein Developer-Menü
- direkter Aufruf von `admin.html` und `dev.html` ohne Berechtigung wird mit `#accessDenied` verweigert; die App-Shell bleibt verborgen
- Logout schaltet den Zustand zurück auf die Login-Ansicht

### Testausführung

- Testdateien: `tests/master-ui.spec.js` (Playwright, Master-UI-Vertrag), `tests/user-admin-core.test.js` (node:test, Core-Contracts)
- Der frühere `tests/catchtrack-shell.spec.js` wurde entfernt; seine Selektoren und Shell-Erwartungen entsprachen nicht mehr dem Master-UI-Vertrag.
- Kommandos: `npm run test:core`, `npm run test:ui`, `npm test`
- Voraussetzung: `npx playwright install chromium` und `npx playwright install-deps chromium` (im frischen Codespace fehlten Browser und Systembibliotheken; der frühere „grün“-Status war ohne diese Installation nicht reproduzierbar)

Ergebnis des letzten vollständigen Laufs am 2026-08-15:

- `node tests/user-admin-core.test.js`: 2 Tests, 2 pass, 0 fail
- `npx playwright test tests/master-ui.spec.js --reporter=list`: 6 Tests, 6 passed, 0 failed
- Layout-Verifikation: Top-Navigation wurde im echten Browser-Run erneut geprüft, ohne Functional Regression

Status: Master-UI-Vertrag und Browser-Tests stimmen überein; beide Testsuiten sind tatsächlich grün. Die Green-Claim basiert auf dem erfolgreichen realen Browser-Run und nicht auf einer vorab dokumentierten Vermutung.

## Master-Status

STATUS: READY FOR FREEZE REVIEW

Verweis:
WORKFLOW_USER_ADMIN_APPROVED.md — vollständige, genehmigte Architektur inkl. Vorimplementierungsentscheidungen
WORKFLOW_USER_ADMIN_IMPLEMENTATION.md — tatsächliche Implementierungsdokumentation der Master-Fassaden und zentralen Delegationen

## Kurze Historie der wichtigsten Architekturentscheidungen

- Neutraler Framework-Ansatz als Grundprinzip bestätigt
- User und Admin als Core-Bestandteile bestätigt
- Trennung von Rollen und Berechtigungen bestätigt
- User-ID und Username als getrennte Konzepte bestätigt
- Audit- und Sicherheitsmodell als klare Architekturbedarfe bestätigt
- Detail-Review und Entscheidungslogik in eigene Workflow-Datei ausgelagert

## Empfohlene nächste Erweiterungen und Qualitätsmaßnahmen

Die aktuelle Architektur ist stabil und verifiziert; nachfolgend die wichtigsten empfohlenen nächsten Schritte, damit das System aus Sicht von Produkt, Security und Betrieb weiter ausgebaut werden kann:

1. Server-/API-Transition vorbereiten
   - Der aktuelle Session-Store ist browser-local und damit preview-tauglich.
   - Nächster Schritt: Session-Token auf serverseitige API-Auswertung umstellen, ohne die Core-Interfaces zu brechen.
   - Empfehlung: zentrale Token-/Session-Schicht in `core-auth` absichern und nur noch auf serialisierte Session-Daten aufsetzen.

2. Benutzer- und Rollenverwaltung konkret ausbauen
   - Admin-Bereich um echte CRUD-Formulare erweitern: Benutzer anlegen, bearbeiten, deaktivieren, Rollen zuweisen, Status ändern.
   - Rollenverwaltung um benutzerdefinierte Rollen und eine Rollen-/Permission-Matrix erweitern.
   - Permission-Ansicht als effektive Berechnungslogik ausgeben, nicht als eigene Parallel-Engine.

3. Sicherheit und Session-Hardening
   - HTTPS/secure-cookie-Umstellung für echte Server-Session vorbereiten.
   - CSRF-, XSS- und Session-Timeout-Mechanismen für die API-Schicht definieren.
   - Keine jeden Benutzer- oder Developer-Seed-Informationen im Frontend speichern; nur Token/Session-IDs und minimal nötige User-Metadaten.

4. Mobile UX weiter optimieren
   - Navigation top-aligned beibehalten und auf kleine Geräte mit kompakten Gruppen und horizontalem Scroll-Overflow verfeinern.
   - Fokus auf sichtbare Prioritäten: Dashboard, Module, Administration, Developer.
   - Touch-Target-Größen und Lesbarkeit für Smartphone-Layout weiter verifizieren.

5. Teststrategie erweitern
   - Zusätzliche Playwright-Checks für Rollenwechsel, Session-Expiry und direkte Zugriffs-Links ergänzen.
   - Sichtbarkeits- und Empty-State-Tests für Admin-/Audit-/Permission-Ansichten ergänzen.
   - Regressionstests vor jedem größeren UI-/Permission-Release durchführen.

6. Architektur-/Code-Qualität
   - Guard-Clauses und zentrale `isAuthenticated`, `hasAdminPermission`, `hasDeveloperPermission`-Helpers weiter konsolidieren.
   - Admin-/Developer-Gate-Layer bewusst als Policy-Check auf der UI-Seite und als Core-Access-Check auf der Logikseite halten.
   - Keine UI-Logik als alleinige Sicherheitsinstanz nutzen; damit bleibt eine saubere spätere API-Umsetzung möglich.

7. Produkt-/UX-Verbesserung
   - Module-Übersicht und Audit-Ansichten mit Filter, Suche und Sortierung ausstatten.
   - Aktive Session-/Rollen-Status im Header sichtbar machen, ohne Sicherheitsinformationen zu泄men.
   - Erfolgs- und Fehlerzustände konsistent über alle Bereiche standardisieren.

## Autonomer Folgeplan für die weitere App-Finalisierung

STATUS: AUTONOMER ARBEITSPROZESS AKTIV

Die App ist im Kern bereits als getrennte User-/Admin-/Developer-Architektur verifiziert. Die weitere Arbeit wird im laufenden Projekt ohne manuelle Rückfrage fortgesetzt, sofern sie im Rahmen der vorhandenen Architektur, des Sicherheitsmodells und der Validierung bleibt.

### Aktueller Stand dieser Phase (verifiziert)

- Server-/API-Transition vorbereitet: zentrale Session-/Auth-Schicht bleibt in `CoreAuth`, Preview-Session bleibt kompatibel und ohne zweite Login-Logik.
- Admin-Benutzerverwaltung erweitert: Benutzerliste, Benutzer anlegen, Status-/Rollen-Auswahl und Filter sind in der Admin-UI umgesetzt.
- Rollen-/Permissions-Darstellung vorbereitet: Rollen und Permissions werden aus dem bestehenden CoreAccess-/User-Modell gelesen, ohne eine zweite Permission-Engine zu addieren.
- Gemeinsame Session zwischen User-, Admin- und Developer-Oberflächen verifiziert: kein zweiter Login beim Wechsel zwischen Oberflächen.
- Workflow- und Git-Protokollierung als verbindlicher Teil des laufenden Prozesses etabliert.

1. Sofortige Betriebs-/UX-Qualität
   - Top-Navigation und responsive Verteilung erneut gegen reale Browser-Ausgabe prüfen.
   - Menüzustände, aktive Button-Styles und leere States für alle Oberflächen konsolidieren.
   - Laufzeitfehler, fehlende Platzhalter und inkonsistente Labels systematisch bereinigen.

2. Produktreife der Admin-/Developer-Views
   - Admin-Ansichten mit realistischen Datenbeispielen und konsistenter, lesbarer Präsentation vervollständigen.
   - Developer-Ansichten mit technischen Status, Audit- und Health-Konsolen auf eine nutzbare Produktstufe bringen.
   - Leerzustände, Fehlerausgaben und Statuschips standardisieren.

3. Session-, Auth- und Sicherheitsreinigung
   - Auth- und Session-Handling weiterhin zentral durch die Core-Schicht steuern.
   - Keine duplicate Login- oder Parallel-Session-Pfade mehr einführen.
   - Preview-Storage weiterhin ohne Klardaten im Browser oder in Commit-Logs verwenden.

4. Test- und Regression-Absicherung
   - Browser-Tests nach jeder größeren UI-/Permission-Änderung direkt erneut laufen lassen.
   - Core-Tests fortlaufend gegen die vorhandenen Auth-/Access-/User-Contracts validieren.
   - Bei Abweichungen sofort ein minimaler, gezielter Fix mit anschließendem Neu-Lauf.

5. Workflow- und Git-Protokollierung
   - Nach jeder signifikanten Änderung das Workflow-Update unmittelbar in WORKFLOW.md dokumentieren.
   - Commit-Nachricht und Push erfolgen direkt nach der Verifikation, damit der Remote-Stand immer mit dem aktuellen Arbeitsstand übereinstimmt.
   - Keine unprotokollierten Änderungen oder „stille“ Commits im normalen Arbeitsverlauf.

6. Abgrenzung bis zur notwendigen Produktreife
   - Nur die für die funktionale App-Fertigstellung notwendigen Erweiterungen umsetzen.
   - Keine überflüssige Architektur-Umstellung mehr ohne neue fachliche Entscheidung.
   - Sobald die App als nutzbar und verifiziert gilt, die nächsten Schritte als echten Produkt- und Hardening-Plan im Workflow dokumentieren.

Grundsatz:
Autonomer Arbeitseinsatz innerhalb der bestehenden Architektur, mit sofortiger Protokollierung und sofortiger Verifikation. Es werden keine wiederholten Freigaben pro Einzeländerung mehr angefordert, solange die Änderung innerhalb der definierten App-/Security-/Workflow-Regeln bleibt.

## Zusatzvorschläge mit Bewertung

### 1. User-Profil- und Session-Status
- Titel: Profilmanagement und Session-Status
- Problem/Nutzen: Nutzer benötigen einen verständlichen Überblick über ihren eigenen Status, ihre Rolle und die aktive Session.
- Vorschlag: Im User-Bereich eine Profilansicht mit Status, Display-ID, Rolle, Session-Gültigkeit und Sicherheitshinweis ergänzen.
- Bereich: User / Core
- Status: JETZT SINNVOLL
- Begründung: Diese Funktion nutzt die vorhandene User- und Session-Architektur ohne neue eigentliche Datenquelle oder Architekturentscheidung.

### 2. User- und Admin-Suche / Filter
- Titel: Such- und Filterfunktionen in Verwaltung
- Problem/Nutzen: Bei zunehmender Anzahl von Benutzern und Modulen wird die Übersicht unübersichtlich.
- Vorschlag: Filterfelder für Username, Role, Status und Module ergänzen.
- Bereich: Admin
- Status: JETZT SINNVOLL
- Begründung: Funktionalität kann direkt im UI-Layer auf Basis vorhandener Daten implementiert werden, ohne zusätzliche Architekturentscheidung.

### 3. Audit-Detailansicht und Empty States
- Titel: Lesbare Audit- und Empty-State-Ansichten
- Problem/Nutzen: Audit- und leere Zustände müssen für das Produktumfeld sinnvoll verständlich sein.
- Vorschlag: Audit als Tabelle mit letzten Einträgen, ohne parallele Engine; leere Zustände als klare Meldungen mit Handlungsempfehlung.
- Bereich: Admin / Developer
- Status: JETZT SINNVOLL
- Begründung: Nutzt vorhandene Audit-Daten und stärkt UX bei konsistenter, vorhandener Architektur.

### 4. Server-/API-Transition ohne Hostingannahmen
- Titel: Session- und API-Schicht vorbereiten
- Problem/Nutzen: Spätere echte Serveranbindung braucht eine klare Trennung zwischen Browser-Preview und API-Session.
- Vorschlag: `CoreAuth` bleibt der zentrale Einstieg; Session-Interface und Serialisierung werden dem späteren API-Layer kompatibel gehalten, ohne feste Hosting- oder Deployment-Entscheidungen vorzunehmen.
- Bereich: Core / Server
- Status: JETZT SINNVOLL
- Begründung: Das ist eine reine Architekturvorbereitung, keine fachliche oder technische Entscheidung, die in diesem Repo bereits festgelegt werden müsste.

### 5. Passwort-/Account-Flow als späterer Server-Dialog
- Titel: Passwortänderung und Account-Flow
- Problem/Nutzen: Ein echter Passwort-/Account-Dialog ist sinnvoll, aber nur im echten Server- oder API-Kontext tragfähig.
- Vorschlag: UI-Placeholder und vorbereitete Policy-Checks ergänzen; konkrete Umsetzung erst bei serverseitiger Auth-Umsetzung.
- Bereich: User / Core / Server
- Status: SPÄTER SINNVOLL
- Begründung: Bedarf eine echte serverseitige Auth-Implementierung und sollte nicht eigenmächtig als Frontend-Feature festgelegt werden.

### 6. Richere System-/Module-Statusseite
- Titel: Detailansichten für Module und Systemstatus
- Problem/Nutzen: Admins und Developer brauchen übersichtliche Statusdaten, aber nicht eine neue Parallel-Engine.
- Vorschlag: Konsistente Status-, Module- und Health-Ansichten im bestehenden UI auf Basis von registrierten Modulen und vorhandenen Systemdaten erweitern.
- Bereich: Admin / Developer
- Status: JETZT SINNVOLL
- Begründung: Liegt direkt auf der bestehenden Registrierungs- und Core-Architektur auf.

## Detail-Workflow-Verzeichnis

- WORKFLOW_USER_ADMIN_REVIEW.md — vollständiger Review zu User & Admin Master Core
  - Pfad: /workspaces/CatchTrack-V.1.0/WORKFLOW_USER_ADMIN_REVIEW.md
  - Commit-SHA: 5baee91ed88dc788769f047073566af4d9007072
  - Status: vorhanden und synchronisiert mit origin/main
- WORKFLOW_USER_ADMIN_APPROVED.md — genehmigte Architekturspezifikation für User & Admin Master Core
  - Pfad: /workspaces/CatchTrack-V.1.0/WORKFLOW_USER_ADMIN_APPROVED.md
  - Commit-SHA: 546ebc0a78a60156e9900a687e86c65a3edab796
  - Status: vorhanden und synchronisiert mit origin/main
- WORKFLOW_USER_ADMIN_IMPLEMENTATION.md — tatsächliche Implementierung der User/Admin Master-Fassaden
  - Pfad: /workspaces/CatchTrack-V.1.0/WORKFLOW_USER_ADMIN_IMPLEMENTATION.md
  - Status: im Repository angelegt und aktuell für die Implementierung relevant
