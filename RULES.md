# CatchTrack V1.0 Rules

## 1. Scope
This repository uses a reduced project-control structure:
- RULES.md
- WORKFLOW.md
- PROJECT.md
- STATE.md

These four files are the only root-level project-control documents.

## 2. Authority
- RULES.md defines binding collaboration and development rules.
- WORKFLOW.md defines the required work process.
- PROJECT.md defines the product goal and architecture.
- STATE.md defines the actual current project state.
- STATE.md is the only file allowed to define the current work step and next work step.

## 3. Binding rules
- Use the current repository state on origin/main as the reference baseline.
- Do not create duplicate project-control files.
- Do not recreate deleted historical files.
- Do not define parallel continuation keys outside STATE.md.
- Do not keep contradictory instructions across the four root documents.
- Do not add project history to RULES.md, WORKFLOW.md, or PROJECT.md.
- Do not add operational status text to RULES.md, WORKFLOW.md, or PROJECT.md.

## 4. Architecture rules
- Core functionality remains generic and infrastructure-focused.
- Domain logic belongs in modules.
- Modules must use stable core interfaces.
- The core must not become module-specific.
- New features must be implemented in the correct layer: infrastructure in Core, business logic in modules.

## 5. Change rules
- Prefer the smallest valid change.
- Prefer existing files over creating new ones.
- Do not modify unrelated files.
- Do not keep stale, duplicated, or contradictory project instructions.
- Keep the root documentation concise and explicit.

## 6. Quality rules
- Changes must be consistent with the current architecture and repository state.
- Validation must be performed before completion.
- Documentation must remain short, accurate, and machine-readable.
- Final repository state must be clean and synchronized with origin/main.

- betroffene Dateipfade
- Arbeitsschritt
- Ergebnis

Die Dateipfade sind ausdrücklich Bestandteil der Commit-Dokumentation.

—

## 14. Projektchronik

`PROJECT_CHRONICLE_001.md` dokumentiert abgeschlossene Projektfortschritte und Meilensteine.

Weitere Chroniken werden bei Bedarf erstellt.

Historische Einträge werden nicht unnötig verändert.

Die Chronik ersetzt nicht den DEV_LOG.

—

## 15. DEV_LOG

`DEV_LOG.md` dokumentiert technische Vorgänge.

Dazu gehören insbesondere:

- Prüfungen
- technische Arbeitsschritte
- relevante Befehle
- relevante Ergebnisse
- Commit-IDs
- Commit-Nachrichten
- betroffene Dateipfade
- technische Entscheidungen

Die Chronik dokumentiert Projektfortschritt.

Der DEV_LOG dokumentiert technische Vorgänge.

—

## 16. Dokumentationsdateien

Aktuelle Dokumentations- und Steuerungsdateien:

- `RULES.md`
- `WORKFLOW.md`
- `VISION.md`
- `PROJECT_MASTERLIST.md`
- `PROJECT_STATUS.md`
- `PROJECT_CHRONICLE_001.md`
- `DEV_LOG.md`
- `WORK_STATE.md`
- `REPOSITORY_INVENTORY.md`

Alle sind derzeit **NICHT eingefroren**.

Sie werden einmalig auf Konsistenz gebracht.

Danach erfolgt der gemeinsame Freeze der relevanten Master-/Steuerungsdateien.

—

## 17. Core

Der Core ist die technische Plattform.

Der Core enthält ausschließlich generische Infrastruktur.

Der Core darf keine konkrete Fachlogik einzelner Module enthalten.

Der Core darf nicht für einzelne Module angepasst werden.

Fachmodule dürfen keine Änderungen an bestehenden Core-Dateien erzwingen.

—

## 18. Core Freeze

Der Core ist derzeit:

**NICHT EINGEFROREN**

Vor dem Freeze:

1. Repository-Inventur
2. funktionale Core-Analyse
3. Bereinigung
4. Implementierung
5. Validierung
6. Tests
7. Abnahme
8. ausdrückliche Freeze-Entscheidung

Nach dem Freeze:

```text
/Core/*
```

ist grundsätzlich Read-Only.

Installation, Deinstallation, Aktualisierung oder Erweiterung eines Moduls darf danach keine Core-Änderung benötigen.

—

## 19. Neue Funktionalität

Vor jeder neuen Funktion:

```text
INFRASTRUKTUR?
→ CORE

FACHFUNKTION?
→ MODUL
```

Beispiele für Module:

- User
- Admin
- GPS
- Weather
- Catchbook
- Fish Database
- Tides
- Maps
- Statistics

—

## 20. Modulprinzip

Module verwenden ausschließlich definierte Core-Schnittstellen.

Grundsätzlich falsch:

```text
Neues Modul
→ Core-Datei ändern
→ Modul integrieren
```

Richtig:

```text
Neues Modul
→ Core-Schnittstelle verwenden
→ registrieren
→ installieren
→ aktivieren
```

Benötigt ein Modul eine Core-Änderung, wird zuerst die Architektur geprüft.

—

## 21. Modulunabhängigkeit

Module bleiben grundsätzlich unabhängig.

Direkte Abhängigkeiten müssen ausdrücklich definiert werden.

Ein Modul darf keine privaten Implementierungsdetails eines anderen Moduls verwenden.

—

## 22. Modul-Lifecycle

Das Modul-System muss konzeptionell unterstützen:

```text
available
installed
enabled
disabled
updated
uninstalled
```

Der Module Manager kontrolliert den Lifecycle.

—

## 23. Datenbank

Module dürfen eigene Datenstrukturen besitzen.

Die generische Datenbankinfrastruktur enthält keine unnötige Fachlogik einzelner Module.

—

## 24. User und Admin

User und Admin sind Module.

Sie sind keine Bestandteile der fachlichen Core-Logik.

Der Core stellt ausschließlich benötigte Infrastruktur bereit.

—

## 25. Rollen und Berechtigungen

Berechtigungen werden zentral und konsistent behandelt.

Berechtigungen ergeben sich aus Rollen und/oder Paket-/Entitlement-Regeln.

Nicht verfügbare Funktionen werden nicht als verfügbar dargestellt.

—

## 26. Keine Fake-Funktionen

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

## 27. Startup

CatchTrack besitzt keinen unnötigen Parallelbetrieb mehrerer konkurrierender Startup-/Runtime-Systeme.

Der endgültige Startablauf muss eindeutig definiert sein.

—

## 28. Teststrategie

Entwicklungsblöcke werden in sinnvolle Abschnitte geteilt.

Wenn eine technisch sinnvolle Zwischenstufe erreicht ist:

```text
IMPLEMENTIEREN
→ TESTEN
→ ERGEBNIS DOKUMENTIEREN
→ FEHLER KORRIGIEREN
→ ERNEUT TESTEN
→ WEITER
```

Der Benutzer soll bereits während der Entwicklung testen können.

Es wird nicht unnötig bis zum Ende eines kompletten Entwicklungsblocks gewartet.

—

## 29. Dokumentations- und Arbeitsablauf

Der verbindliche Gesamtworkflow:

```text
RULES LESEN
→ AKTUELLEN ARBEITSSTAND BESTIMMEN
→ GITHUB MAIN PRÜFEN
→ NÄCHSTEN OFFENEN ARBEITSSCHRITT BESTIMMEN
→ DATEI SUCHEN
→ VORHANDENE DATEI VOLLSTÄNDIG LESEN
→ ZIEL UND ARCHITEKTUR VERGLEICHEN
→ ENTSCHEIDEN
→ VOLLSTÄNDIGE DATEI ERSTELLEN/ÄNDERN
→ TESTEN
→ KORRIGIEREN
→ DOKUMENTIEREN
→ COMMIT PRÜFEN
→ NÄCHSTEN SCHRITT BESTIMMEN
```

Prüfungen und Einlesungen erfolgen selbstständig.

—

## 30. Keine unnötigen Wiederholungen

Bereits erledigte Dateien werden nicht erneut ausgegeben.

Bereits geprüfte Informationen werden nicht unnötig erneut abgefragt.

Bereits beantwortete Entscheidungen werden nicht erneut zur Bestätigung vorgelegt.

Bei `OK` wird immer der nächste offene Arbeitsschritt bestimmt.

—

## 31. Fortsetzungsschlüssel

Der aktuelle Fortsetzungsschlüssel wird in den relevanten Steuerungsdateien konsistent geführt.

Aktueller Schlüssel:

`DOCUMENTATION-SYNC`

Nach Abschluss der Dokumentations-Synchronisation:

`DOCUMENTATION-FREEZE`

Danach:

`CORE-INVENTORY-DEEP-DIVE`

—

## 32. Priorität

Bei Entscheidungen gilt:

1. Datenintegrität und Sicherheit
2. aktuelle GitHub-Version
3. aktuelle Projektregeln
4. dokumentierte Architektur
5. bestehende Projektstruktur
6. technische Einfachheit
7. minimale unnötige Änderungen
8. Geschwindigkeit

Bei Konflikten hat eine höhere Priorität Vorrang.

—

## 33. Ziel

CatchTrack soll:

- einen stabilen und generischen Core besitzen
- ein unabhängiges Modulsystem besitzen
- klare Modulgrenzen besitzen
- reproduzierbar weiterentwickelbar sein
- keine unnötigen Core-Abhängigkeiten besitzen
- keine doppelten Strukturen besitzen
- einen nachvollziehbaren Entwicklungsstand besitzen
- ohne unnötige Rückfragen effizient entwickelt werden können