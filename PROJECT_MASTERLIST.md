CatchTrack – Project Masterlist

Zweck

Diese Masterliste definiert die verbindliche Reihenfolge und den Umfang der Projektentwicklung.

Sie dient als zentrale Referenz für die Erstellung von Dateien, Ordnern und Modulen.

Grundregel

Dateien werden nicht beliebig erstellt.

Die Projektstruktur wird schrittweise aufgebaut.

Eine Datei wird erst erstellt, wenn sie gemäß Projektplanung benötigt wird.

⸻

AI- und Projektsteuerung

| Nr. | Datei | Status |
|—:|—|—|
| 01 | VISION.md | ✓ Abgeschlossen |
| 02 | RULES.md | ✓ Abgeschlossen |
| 03 | WORKFLOW.md | ✓ Abgeschlossen |
| 04 | PROJECT_STATUS.md | ✓ Abgeschlossen |
| 05 | PROJECT_CHRONICLE_001.md | ✓ Abgeschlossen |
| 06 | PROJECT_MASTERLIST.md | ✓ Abgeschlossen |

⸻

Hauptstruktur

| Bereich | Status | Commit |
|—|—|—|
| Root | ✓ Abgeschlossen | - |
| Core | ✓ Abgeschlossen | b70c514 |
| Config | ✓ Abgeschlossen | d33a27d |
| Database | ✓ Abgeschlossen | d33a27d |
| Services | ✓ Abgeschlossen | d33a27d |
| Tests | ✓ Abgeschlossen | d33a27d |
| Modules | ✓ Abgeschlossen | 1074202 |
| UI | ✓ Abgeschlossen | 1074202 |

Der Bereich Modules enthält die eigenständigen CatchTrack-Module.

⸻

Erster Entwicklungsblock

Der erste funktionsfähige Entwicklungsstand besteht aus:

1. Core-Grundgerüst
2. Modul-System / Modulschnittstelle
3. User-Modul
4. Admin-Modul
5. Testbenutzer für die Entwicklungs- und Testphase

Diese Bestandteile werden gemeinsam so weit umgesetzt, dass CatchTrack erstmals als testfähige Anwendung gestartet und die grundlegende Modulstruktur geprüft werden kann.

User-Modul

Das User-Modul wird als eigenständiges Modul unter Modules aufgebaut.

Es dient zunächst ausschließlich der Entwicklungs- und Testfähigkeit des Systems.

Für die Entwicklungsphase wird mindestens ein definierter Testbenutzer bereitgestellt.

Der Testbenutzer dient unter anderem dazu, Module bereits während der Entwicklung unter einer real vorhandenen User-ID testen zu können.

Die endgültige Benutzerverwaltung, Accountstruktur, Rollen, Berechtigungen und weitere Benutzerfunktionen werden zu einem späteren Zeitpunkt festgelegt und können innerhalb des User-Moduls erweitert oder geändert werden.

Admin-Modul

Das Admin-Modul wird ebenfalls als eigenständiges Modul unter Modules aufgebaut.

Es dient zunächst als Entwicklungs- und Testwerkzeug für die System- und Modulverwaltung.

Die endgültigen Funktionen und Abläufe des Admin-Bereichs werden zu einem späteren Zeitpunkt festgelegt und können innerhalb des Admin-Moduls erweitert oder geändert werden.

Trennung vom Core

User- und Admin-Funktionen werden nicht fest in den Core integriert.

Der Core stellt lediglich die erforderlichen technischen Grundlagen und Schnittstellen bereit.

Änderungen und Erweiterungen an User und Admin sollen grundsätzlich innerhalb der jeweiligen Module erfolgen.

Der Core soll dadurch nach Fertigstellung des Grundgerüsts möglichst stabil bleiben.

⸻

Modulprinzip

Module werden eigenständig geplant und anschließend vollständig umgesetzt.

Ein Modul soll möglichst:

* unabhängig funktionieren
* klar definierte Schnittstellen besitzen
* keine unnötigen Abhängigkeiten zum Core erzeugen
* aktiviert und deaktiviert werden können
* später erweitert oder ersetzt werden können

User und Admin bilden die ersten beiden Entwicklungs-/Testmodule.

Weitere funktionale Module werden erst nach Fertigstellung und erfolgreichem Test dieses ersten Entwicklungsblocks integriert.

⸻

Entwicklungsreihenfolge

Phase 1 – Grundsystem

* Core-Grundgerüst
* grundlegende Modulschnittstelle
* Modulstruktur
* technische Voraussetzungen für den Start und Test der Anwendung

Phase 2 – Entwicklungs-/Testmodule

* User-Modul
* Testbenutzer
* Admin-Modul
* grundlegende Modulverwaltung und Testmöglichkeiten

Phase 3 – Weitere Module

Weitere CatchTrack-Funktionen werden anschließend als eigenständige Module entwickelt und integriert.

Der Core wird dabei nicht für einzelne Module unnötig verändert.

⸻

Serverseitiger Admin-Bereich

Ein serverseitiger Admin-Bereich gehört nicht zum ersten Entwicklungsblock.

Er wird zu einem späteren Zeitpunkt entwickelt, sobald die lokale bzw. app-interne Modul- und Benutzerstruktur stabil und ausreichend getestet ist.

⸻

Statuskennzeichnungen

* OFFEN – noch nicht begonnen
* IN ARBEIT – aktuell in Bearbeitung
* TEST – Implementierung abgeschlossen, Prüfung läuft
* ✓ ABGESCHLOSSEN – vollständig geprüft und auf GitHub vorhanden
* BLOCKIERT – Bearbeitung kann wegen einer offenen Voraussetzung nicht fortgesetzt werden

⸻

Status: Erster Entwicklungsblock ✓ ABGESCHLOSSEN

**Phase 1 – Grundsystem:** ✓ Abgeschlossen  
**Phase 2 – Entwicklungs-/Testmodule:** ✓ Abgeschlossen  
**Phase 3 – Infrastruktur:** ✓ Abgeschlossen

Alle geplanten Komponenten des ersten Entwicklungsblocks sind implementiert und funktionsfähig.

CatchTrack ist nun testfähig und kann als Basis für weitere Module verwendet werden.

**Letzte Aktualisierung:** 2026-08-11

⸻

Änderungsregel

Die Masterliste wird nur geändert, wenn sich die verbindliche Projektstruktur oder Entwicklungsreihenfolge tatsächlich ändert.

Keine Änderungen aus kosmetischen Gründen.

Die Masterliste ist keine technische Detaildokumentation einzelner Module.

⸻

Chronik

Die Entwicklung wird zusätzlich in fortlaufenden Chronikdateien dokumentiert:

* PROJECT_CHRONICLE_001.md
* PROJECT_CHRONICLE_002.md
* PROJECT_CHRONICLE_003.md
* usw.

Eine Chronikdatei wird nicht unbegrenzt erweitert.

⸻

Projektabschluss

Ein Projektbestandteil wird erst als abgeschlossen betrachtet, wenn:

* der tatsächliche Code vorhanden ist
* die erforderlichen Dateien vollständig erstellt sind
* der Code erfolgreich getestet wurde
* die Dateien committed sind
* der Stand auf GitHub vorhanden und überprüfbar ist
* die vorgesehenen Funktionen erfolgreich geprüft wurden
* der Abschluss dokumentiert wurde