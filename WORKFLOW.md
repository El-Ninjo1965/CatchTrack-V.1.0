# Neutral Framework Workflow

## Projektstatus

STATUS: STABLE / FREEZE READY

Das Repository bleibt ein neutrales, wiederverwendbares Framework. Der Core ist stabil und die Module-Struktur bleibt bewusst leer und reserviert.

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

PHASE: Architekturbestätigung / genehmigte Master-Spezifikation

## Freeze- und Release-Status

- Framework-Core: stabil
- User/Admin Master-Architektur: genehmigt, noch nicht implementiert
- Implementierung des Master-Cores: noch nicht gestartet
- Freeze: noch nicht finalisiert

## Kurze Historie der wichtigsten Architekturentscheidungen

- Neutraler Framework-Ansatz als Grundprinzip bestätigt
- User und Admin als Core-Bestandteile bestätigt
- Trennung von Rollen und Berechtigungen bestätigt
- User-ID und Username als getrennte Konzepte bestätigt
- Audit- und Sicherheitsmodell als klare Architekturbedarfe bestätigt
- Detail-Review und Entscheidungslogik in eigene Workflow-Datei ausgelagert

## Detail-Workflow-Verzeichnis

- WORKFLOW_USER_ADMIN_REVIEW.md — vollständiger Review zu User & Admin Master Core
  - Pfad: /workspaces/CatchTrack-V.1.0/WORKFLOW_USER_ADMIN_REVIEW.md
  - Commit-SHA: 5baee91ed88dc788769f047073566af4d9007072
  - Status: vorhanden und synchronisiert mit origin/main
- WORKFLOW_USER_ADMIN_APPROVED.md — genehmigte Architekturspezifikation für User & Admin Master Core
  - Pfad: /workspaces/CatchTrack-V.1.0/WORKFLOW_USER_ADMIN_APPROVED.md
  - Commit-SHA: 546ebc0a78a60156e9900a687e86c65a3edab796
  - Status: vorhanden und synchronisiert mit origin/main
