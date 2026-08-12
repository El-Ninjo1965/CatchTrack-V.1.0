CatchTrack V1.0 – Development Workflow

1. Zweck

Dieses Dokument definiert den verbindlichen Entwicklungsablauf für CatchTrack V1.0.

Der Workflow verhindert insbesondere:

* unnötige Änderungen am Core
* doppelte Dateien
* parallele Implementierungen
* unkontrollierte Architekturänderungen
* Vermischung von Core und Modulen

⸻

2. Dokumentationshierarchie

Verbindlich und Frozen

VISION.md
RULES.md
WORKFLOW.md
PROJECT_MASTERLIST.md
PROJECT_STATUS.md

Diese Dateien sind nach ihrer Erstellung Read-Only.

Laufende Chronik

PROJECT_CHRONICLE_001.md
PROJECT_CHRONICLE_002.md
...

Die Chronik dokumentiert den tatsächlichen Entwicklungsverlauf.

⸻

3. Entwicklungsphasen

CatchTrack wird in klar getrennten Phasen entwickelt.

Phase 1
Dokumentations- und Architekturdefinition
Phase 2
Core-Inventur
Phase 3
Core-Bereinigung
Phase 4
Core-Implementierung
Phase 5
Core-Validierung
Phase 6
Core-Abnahme
Phase 7
Core-Freeze
Phase 8
Modul-System
Phase 9
User/Admin
Phase 10
Fachmodule

⸻

4. Phase 1 – Dokumentation

Zuerst werden die verbindlichen Architektur- und Projektdateien erstellt.

Danach gelten sie als Frozen.

Die Entwicklung darf nicht laufend die grundlegende Architektur verändern.

⸻

5. Phase 2 – Core-Inventur

Vor Änderungen am Core wird jede vorhandene Datei untersucht.

Für jede Datei wird entschieden:

A – NEU
B – LÖSCHEN
C – VOLLSTÄNDIG ERSETZEN
D – UNVERÄNDERT ÜBERNEHMEN

Es gibt keine Kategorie „nur ein bisschen ändern“.

Wenn eine Datei geändert werden muss, wird sie vollständig ersetzt.

⸻

6. Phase 3 – Core-Bereinigung

Doppelte oder überflüssige Dateien werden entfernt.

Funktionen, die fachlich in Module gehören, werden aus dem Core entfernt.

Der Core wird auf generische Infrastruktur reduziert.

⸻

7. Phase 4 – Core-Implementierung

Der Core wird vollständig aufgebaut.

Er muss mindestens die generische Infrastruktur bereitstellen für:

* Startup
* Runtime
* Lifecycle
* Event System
* State
* Storage
* Database
* Error Handling
* Module Interface
* Module Registry
* Module Manager
* Permissions
* Package/Entitlements

⸻

8. Phase 5 – Core-Validierung

Der Core wird vollständig getestet.

Dabei wird unter anderem geprüft:

* startet die Anwendung zuverlässig?
* funktionieren Core-Lifecycle und Runtime?
* funktionieren Storage und Database?
* funktioniert Error Handling?
* funktioniert das Module Interface?
* funktioniert die Module Registry?
* funktioniert der Module Manager?
* können Module registriert werden?
* können Module aktiviert/deaktiviert werden?
* funktionieren Permissions?
* bestehen keine unerlaubten Abhängigkeiten zu Fachmodulen?

⸻

9. Phase 6 – Core-Abnahme

Der Core gilt erst dann als fertig, wenn die technische Validierung abgeschlossen ist.

Der Status muss nachvollziehbar dokumentiert werden.

⸻

10. Phase 7 – Core Freeze

Nach Abnahme:

CORE V1.0 = FROZEN

Ab diesem Zeitpunkt ist:

/Core/*

für AI-Agenten Read-Only.

Neue Funktionen dürfen den Core nicht mehr verändern.

⸻

11. Phase 8 – Modul-System

Nach dem Core-Freeze wird das Modul-System verwendet.

Der Module Manager muss Module generisch verwalten können.

Grundfunktionen:

install
uninstall
enable
disable
update
status
registry
dependencies

⸻

12. Modulinstallation

Der Installationsworkflow lautet:

Modulpaket
 ↓
Manifest prüfen
 ↓
Abhängigkeiten prüfen
 ↓
Berechtigungen/Anforderungen prüfen
 ↓
Dateien installieren
 ↓
Datenbank installieren
 ↓
Registry aktualisieren
 ↓
Modul laden
 ↓
Modul aktivieren

⸻

13. Modul-Deinstallation

Der Deinstallationsworkflow lautet:

Modul deaktivieren
 ↓
Abhängigkeiten prüfen
 ↓
Moduldaten behandeln
 ↓
Datenbank entfernen oder erhalten
 ↓
Registry entfernen
 ↓
Moduldateien entfernen

⸻

14. User-Modul

Das User-Modul wird nach Fertigstellung des generischen Core- und Module-Systems umgesetzt.

Es ist ein eigenständiges Modul.

⸻

15. Admin-Modul

Das Admin-Modul wird ebenfalls als eigenständiges Modul umgesetzt.

Es erhält Zugriff auf Funktionen wie:

Users
Roles
Packages
Modules
System

nur über entsprechende Permissions.

⸻

16. Fachmodule

Erst nach Stabilisierung des Core-/Module-Systems werden Fachmodule umgesetzt.

Beispiele:

GPS
Weather
Catchbook
Fish Database
Tides
Maps
Statistics

Jedes Modul muss ohne direkte Änderungen am Core integriert werden können.

⸻

17. Neue Funktion

Bei jeder neuen Anforderung wird zuerst entschieden:

Infrastruktur?
→ Core
Fachfunktion?
→ Modul

Ist die Antwort „Modul“, darf keine Core-Datei verändert werden.

⸻

18. Testprinzip

Jedes Modul muss unabhängig getestet werden.

Tests dürfen nicht voraussetzen, dass ein anderes Fachmodul zufällig installiert ist, sofern keine explizite Abhängigkeit besteht.

⸻

19. Dokumentation des Fortschritts

Nach relevanten Arbeitsschritten wird die Chronik aktualisiert.

Die Chronik enthält:

* Datum
* Arbeitsschritt
* betroffene Komponenten
* Ergebnis
* Fehler
* Lösungen
* wichtige Entscheidungen
* Statusänderungen

Die Frozen Documents werden dadurch nicht verändert.

⸻

20. Abschlussregel

Ein Arbeitsschritt ist erst abgeschlossen, wenn:

1. die Dateien vollständig erstellt oder ersetzt wurden
2. keine bekannten Fehler verbleiben
3. die Funktion in der Vorschau vom Entwickler/User getestet wurde
4. Abhängigkeiten geprüft wurden
5. die Chronik aktualisiert wurde

⸻

21. Grundsatz

Der Workflow folgt immer diesem Prinzip:

ARCHITEKTUR
    ↓
CORE
    ↓
VALIDIERUNG
    ↓
CORE FREEZE
    ↓
MODULE
    ↓
ERWEITERUNG

Nicht:

MODUL
→ Core ändern
→ neues Modul
→ Core erneut ändern
→ neue Core-Datei