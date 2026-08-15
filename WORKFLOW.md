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

## Aktuelle Master-Entscheidungen

- Das Framework bleibt neutral und wiederverwendbar.
- User und Admin bleiben Core-Bestandteile.
- Fachmodule sind optional und technisch entkoppelt.
- Rollen und Berechtigungen werden getrennt modelliert.
- Benutzername und User-ID sind getrennt.
- Admin soll orchestrieren, nicht duplizieren.
- Audit, Authentifizierung und Zugriffskontrolle müssen als eigene fachliche Verantwortung modelliert werden.
- UI bleibt außerhalb des Core und darf niemals alleinige Zugriffskontrolle sein.

## Offene Entscheidungen

1. User-ID-Konzept: Hybridmodell vs. rein sequenziell
2. Aufteilung der Verantwortung: volle Trennung vs. minimale Trennung
3. Rolle owner: eigene Rolle vs. protected-Flag
4. Mindestlänge Benutzername: 1 vs. 3 Zeichen
5. Mehrfachrollen: roles[] jetzt vs. später
6. Event-Namensschema: user:* vs. user-module:*
7. Feature-Flags für User/Admin: Pflichtkomponenten vs. optionale Komponenten
8. Event-Historie im EventBus: gewünscht vs. nicht gewünscht
9. Modul-Update-Mechanismus: ModuleManager.update() erforderlich?
10. Fehlerverhalten: Exceptions vs. Ergebnisobjekte
11. Zweiter Auth-Pfad in service-manager.js: behalten, bereinigen oder deprecate

## Architektur-Reviews

### User & Admin Master Core
Detailanalyse:
WORKFLOW_USER_ADMIN_REVIEW.md
Status:
OFFEN – Entscheidungen noch nicht abgeschlossen.

## Arbeitsphase

PHASE: Architekturvorbereitung / Review und Entscheidungslogik

## Freeze- und Release-Status

- Framework-Core: stabil
- User/Admin Master-Architektur: im Review- und Entscheidungsprozess
- Implementierung des Master-Cores: noch nicht beschlossen
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
