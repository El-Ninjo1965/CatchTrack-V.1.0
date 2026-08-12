# CatchTrack V1.0 Workflow

## 1. Purpose
This workflow defines the required execution flow for work on CatchTrack V1.0.

## 2. Required sequence
1. Check repository state.
2. Read RULES.md and STATE.md.
3. Compare the current workspace against origin/main.
4. Inspect affected files and dependencies.
5. Decide on the minimal valid implementation.
6. Apply the change.
7. Validate the result with the smallest relevant checks.
8. Update STATE.md to reflect the actual status.
9. Review the final diff.
10. Commit the change.
11. Synchronize with origin/main.

## 3. Preconditions
- Use the current state on origin/main as the reference.
- Ignore historical duplicates and superseded instructions.
- Never define a work cursor in RULES.md, WORKFLOW.md, or PROJECT.md.
- Keep all project-control decisions consistent with STATE.md.

## 4. Implementation standard
- Change only the files required for the task.
- Prefer targeted, reversible edits.
- Do not create extra documentation files.
- Do not restore deleted historical files.
- Do not mix unrelated tasks into one change.

## 5. Validation standard
- Confirm the relevant files are correct.
- Confirm no unrelated files changed.
- Confirm the repository is consistent with the intended architecture.
- Confirm the change is ready for commit and sync.

## 6. Completion rule
A task is complete only when the work is committed, the repository remains clean, and the current branch matches the remote reference for the target state.

Alle relevanten Dokumentationsdateien sind weiterhin offen.

Nach Abschluss:

```text
DOCUMENTATION-SYNC
→ DOCUMENTATION-FREEZE
→ CORE-INVENTORY-DEEP-DIVE
```

Es werden dabei keine unnötigen neuen Dokumentationsdateien erstellt.

—

## 12. Core

Der Core stellt ausschließlich generische Infrastruktur bereit.

Mindestens:

- Startup
- Runtime
- Lifecycle
- Event System
- State
- Storage
- Database
- Error Handling
- Logging
- Module Interface
- Module Registry
- Module Manager
- Permissions
- Package / Entitlements
- System Configuration

Fachliche Funktionen gehören nicht in den Core.

Der Core darf keine konkreten Fachmodule kennen oder benötigen.

—

## 13. Core Freeze

Der Core ist derzeit nicht eingefroren.

Vor dem Freeze:

```text
REPOSITORY-INVENTUR
→ CORE-INVENTUR
→ BEREINIGUNG
→ IMPLEMENTIERUNG
→ VALIDIERUNG
→ TESTS
→ ABNAHME
→ FREEZE-ENTSCHEIDUNG
```

Nach dem Freeze gilt:

```text
/Core/*
```

grundsätzlich als Read-Only.

Neue Fachfunktionen dürfen danach keine Core-Änderung benötigen.

—

## 14. Änderungsprinzip

Vor jeder Änderung:

```text
INFRASTRUKTUR?
→ CORE

FACHFUNKTION?
→ MODUL
```

Fachfunktionen dürfen den Core nicht verändern.

Vorhandene Dateien werden im Rahmen der Inventur klassifiziert:

- A – NEU
- B – LÖSCHEN
- C – VOLLSTÄNDIG ERSETZEN
- D – UNVERÄNDERT ÜBERNEHMEN

—

## 15. Module

Module werden unabhängig vom Core entwickelt und getestet.

Der Module Manager unterstützt konzeptionell:

- install
- uninstall
- enable
- disable
- update
- status
- registry
- dependencies

Ein Modul darf keine direkte Änderung bestehender Core-Dateien benötigen.

Wenn ein Modul eine Core-Änderung benötigt, wird zuerst die Architektur geprüft.

—

## 16. Modulunabhängigkeit

Module dürfen nicht unnötig voneinander abhängig sein.

Direkte Abhängigkeiten werden ausdrücklich definiert.

Ein Modul darf keine privaten Implementierungsdetails eines anderen Moduls verwenden.

—

## 17. Datenbank

Module dürfen eigene Datenstrukturen besitzen.

Die generische Datenbankinfrastruktur enthält keine unnötige Fachlogik einzelner Module.

—

## 18. User und Admin

User und Admin sind Module.

Sie gehören nicht zur fachlichen Core-Logik.

—

## 19. Rollen und Berechtigungen

Berechtigungen werden zentral und konsistent behandelt.

Berechtigungen ergeben sich aus Rollen und/oder Paket-/Entitlement-Regeln.

Nicht zugängliche Funktionen werden nicht als verfügbar dargestellt.

—

## 20. Keine Fake-Funktionen

Nicht implementierte oder nicht getestete Funktionen werden nicht als fertig dargestellt.

Eine Funktion darf nur als:

- fertig
- implementiert
- getestet
- abgenommen
- stabil
- eingefroren

bezeichnet werden, wenn dies tatsächlich festgestellt wurde.

—

## 21. Startup

CatchTrack besitzt keinen unnötigen Parallelbetrieb mehrerer konkurrierender Startup-/Runtime-Systeme.

Der endgültige Startablauf muss eindeutig definiert sein.

Der Core darf keine konkrete Fachmodulliste für seinen Start benötigen.

—

## 22. Testprinzip

Entwicklung erfolgt in kurzen, überprüfbaren Abschnitten.

Nach einer sinnvollen funktionsfähigen Zwischenstufe:

```text
IMPLEMENTIEREN
→ TESTEN
→ ERGEBNIS BEWERTEN
```

Bei Fehler:

```text
FEHLER
→ ANALYSIEREN
→ KORRIGIEREN
→ ERNEUT TESTEN
```

Bei Erfolg:

```text
BESTANDEN
→ DOKUMENTIEREN
→ NÄCHSTER SCHRITT
```

Der Benutzer soll frühzeitig testen können.

—

## 23. Terminal-Arbeiten

Terminal-Prüfungen werden so durchgeführt, dass relevante vollständige Ergebnisse versionierbar bleiben.

Für umfangreiche Prüfungen kann eine technische Arbeitsdatei im Repository-Root verwendet werden.

Beispiel:

```text
{ command1; command2; command3; } > terminal.md 2>&1
```

Eine solche Arbeitsdatei ist keine Projektdokumentation.

Relevante Ergebnisse werden anschließend in DEV_LOG oder Chronik dokumentiert.

—

## 24. Git und Working Copy

Working Copy auf dem iPad ist die manuelle Git-Arbeitsumgebung des Benutzers.

Dort werden vollständige Dateien übernommen, geprüft, committed und synchronisiert.

Der Benutzer arbeitet nicht mit dem Terminal.

Der bekannte fehlende direkte GitHub-Schreibzugriff wird nicht bei jedem Arbeitsschritt erneut erwähnt.

—

## 25. Commit-Prinzip

Ein relevanter Arbeitsschritt gilt erst als abgeschlossen, wenn die betreffenden Dateien versioniert wurden.

Nach Möglichkeit werden dokumentiert:

- Commit-ID
- Commit-Nachricht
- Datum
- Uhrzeit
- betroffene Dateipfade
- Arbeitsschritt
- Ergebnis

—

## 26. DEV_LOG

`DEV_LOG.md` dokumentiert technische Entwicklungsarbeit.

Mindestens:

```text
Datum/Uhrzeit
→ Aktion
→ Arbeitsschritt / Befehl
→ Ergebnis
→ Commit
→ betroffene Pfade
```

DEV_LOG ersetzt nicht die Projektchronik.

—

## 27. Projektchronik

Die Projektchronik dokumentiert:

- relevante Entscheidungen
- abgeschlossene Meilensteine
- wichtige Fehler und Lösungen
- Statusänderungen
- aktuellen Fortsetzungspunkt

Sie wird nicht mit unnötigen technischen Details überladen.

—

## 28. Fortsetzungspunkt

Am Ende der laufenden Chronik wird ein Fortsetzungspunkt geführt.

Er enthält:

- aktuellen Arbeitsstand
- letzten abgeschlossenen Schritt
- nächsten Arbeitsschritt
- kurzen Fortsetzungsschlüssel

Dadurch kann eine spätere Sitzung ohne unnötige Wiederholung fortgesetzt werden.

—

## 29. Dateiausgabe

Bei der manuellen Ausgabe einer Datei gelten immer genau drei Copyblöcke.

### Copyblock 1

Nur der vollständige Repository-Pfad.

### Copyblock 2

Nur der exakte Dateiname.

### Copyblock 3

Der vollständige Dateiinhalt.

Der Dateiname steht nicht im dritten Copyblock.

Keine Patches.

Keine Teilstücke.

Keine Auslassungen.

Keine zusätzlichen Kommentare innerhalb des Quelltext-Copyblocks.

Der vollständige Dateiinhalt muss mit einer einzigen Kopieraktion übernommen werden können.

Enthält der Dateiinhalt selbst Markdown-Codeblöcke, muss der äußere Copyblock entsprechend höher begrenzt werden.

Der Quelltext-Copyblock darf niemals durch verschachtelte Markdown-Blöcke zerstört werden.

—

## 30. Abschlussregel

Ein Arbeitsschritt ist abgeschlossen, wenn:

1. die erforderlichen Dateien vollständig erstellt oder ersetzt wurden
2. bekannte Fehler behoben wurden
3. der vorgesehene Test erfolgreich durchgeführt wurde
4. Abhängigkeiten geprüft wurden
5. relevante Dokumentation aktualisiert wurde
6. die Änderungen versioniert wurden

—

## 31. Grundprinzip

```text
ARCHITEKTUR
↓
DOKUMENTATION
↓
REPOSITORY-INVENTUR
↓
CORE-INVENTUR
↓
CORE-BEREINIGUNG
↓
CORE-IMPLEMENTIERUNG
↓
VALIDIERUNG
↓
CORE-FREEZE
↓
MODULE
↓
ERWEITERUNG
```

Nicht:

```text
MODUL
→ CORE ÄNDERN
→ NEUES MODUL
→ CORE ERNEUT ÄNDERN
→ NEUE CORE-DATEI
```

—

## 32. Aktueller Fortsetzungsschlüssel

`DOCUMENTATION-SYNC`

Nach Abschluss der Dokumentationskonsolidierung:

`DOCUMENTATION-FREEZE`

Danach:

`CORE-INVENTORY-DEEP-DIVE`