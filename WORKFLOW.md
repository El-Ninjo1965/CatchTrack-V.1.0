# CatchTrack V1.0 – Development Workflow

## 1. Zweck

Dieses Dokument definiert den verbindlichen Entwicklungsablauf für CatchTrack V1.0.

Der Workflow verhindert insbesondere:

* unnötige Änderungen am Core
* doppelte Dateien
* parallele Implementierungen
* unkontrollierte Architekturänderungen
* Vermischung von Core und Modulen

—

## 2. Dokumentationshierarchie

### Verbindlich und Frozen

VISION.md
RULES.md
WORKFLOW.md
PROJECT_MASTERLIST.md
PROJECT_STATUS.md

Diese Dateien sind nach ihrer Erstellung Read-Only.

### Laufende Chronik

PROJECT_CHRONICLE_001.md
PROJECT_CHRONICLE_002.md
...

Die Chronik dokumentiert den tatsächlichen Entwicklungsverlauf.

—

## 3. Entwicklungsphasen

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

—

## 4. Phase 1 – Dokumentation

Zuerst werden die verbindlichen Architektur- und Projektdateien erstellt.

Danach gelten sie als Frozen.

Die Entwicklung darf nicht laufend die grundlegende Architektur verändern.

—

## 5. Phase 2 – Core-Inventur

Vor Änderungen am Core wird jede vorhandene Datei untersucht.

Für jede Datei wird entschieden:

A – NEU
B – LÖSCHEN
C – VOLLSTÄNDIG ERSETZEN
D – UNVERÄNDERT ÜBERNEHMEN

Es gibt keine Kategorie „nur ein bisschen ändern“.

Wenn eine Datei geändert werden muss, wird sie vollständig ersetzt.

—

## 6. Phase 3 – Core-Bereinigung

Doppelte oder überflüssige Dateien werden entfernt.

Funktionen, die fachlich in Module gehören, werden aus dem Core entfernt.

Der Core wird auf generische Infrastruktur reduziert.

—

## 7. Phase 4 – Core-Implementierung

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

—

## 8. Phase 5 – Core-Validierung

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

—

## 9. Phase 6 – Core-Abnahme

Der Core gilt erst dann als fertig, wenn die technische Validierung abgeschlossen ist.

Der Status muss nachvollziehbar dokumentiert werden.

—

## 10. Phase 7 – Core Freeze

Nach Abnahme:

CORE V1.0 = FROZEN

Ab diesem Zeitpunkt ist:

/Core/*

für AI-Agenten Read-Only.

Neue Funktionen dürfen den Core nicht mehr verändern.

—

## 11. Phase 8 – Modul-System

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

—

## 12. Modulinstallation

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

—

## 13. Modul-Deinstallation

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

—

## 14. User-Modul

Das User-Modul wird nach Fertigstellung des generischen Core- und Module-Systems umgesetzt.

Es ist ein eigenständiges Modul.

—

## 15. Admin-Modul

Das Admin-Modul wird ebenfalls als eigenständiges Modul umgesetzt.

Es erhält Zugriff auf Funktionen wie:

Users
Roles
Packages
Modules
System

nur über entsprechende Permissions.

—

## 16. Fachmodule

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

—

## 17. Neue Funktion

Bei jeder neuen Anforderung wird zuerst entschieden:

Infrastruktur?
→ Core

Fachfunktion?
→ Modul

Ist die Antwort „Modul“, darf keine Core-Datei verändert werden.

—

## 18. Testprinzip

Jedes Modul muss unabhängig getestet werden.

Tests dürfen nicht voraussetzen, dass ein anderes Fachmodul zufällig installiert ist, sofern keine explizite Abhängigkeit besteht.

—

## 19. Dokumentation des Fortschritts

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

—

## 20. Abschlussregel

Ein Arbeitsschritt ist erst abgeschlossen, wenn:

1. die Dateien vollständig erstellt oder ersetzt wurden
2. keine bekannten Fehler verbleiben
3. die Funktion in der Vorschau vom Entwickler/User getestet wurde
4. Abhängigkeiten geprüft wurden
5. die Chronik aktualisiert wurde

—

## 21. Grundsatz

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

—

## 22. GitHub als verbindliche Projekt-Referenz

GitHub main ist die verbindliche technische Referenz für den aktuellen Projektstand.

Vor jeder Prüfung, Analyse oder Änderung einer bereits vorhandenen Projektdatei muss grundsätzlich zuerst die aktuelle Version aus GitHub main ausgelesen werden.

Lokale Arbeitskopien aus Codespace, Working Copy oder anderen Entwicklungsumgebungen dürfen nicht ohne Prüfung als aktueller Projektstand angenommen werden.

Bei einer Abweichung zwischen GitHub main und einer lokalen Arbeitskopie gilt:

1. Abweichung feststellen
2. GitHub-Stand prüfen
3. lokalen Stand prüfen
4. Unterschied feststellen
5. erst danach über eine Änderung entscheiden

Es darf nicht eigenmächtig angenommen werden, welcher abweichende Stand korrekt ist.

Dies gilt insbesondere für:

* Core-Dateien
* Module
* Projektstatus
* Masterlisten
* Workflow- und Regeldateien
* Chronikdateien
* Konfigurationsdateien

Auch PROJECT_CHRONICLE_*.md wird vor einer Ergänzung zunächst vollständig aus GitHub main gelesen.

—

## 23. Vollständigkeits- und Originaldatei-Regel

Eine Datei gilt erst dann als geprüft, wenn ihr vollständiger relevanter Inhalt zuverlässig verfügbar ist.

Wird eine Datei bei der Übertragung, Anzeige oder Ausgabe abgeschnitten oder kann ihr Inhalt nicht vollständig gelesen werden, darf nicht auf Grundlage des unvollständigen Inhalts gearbeitet werden.

Werden widersprüchliche Versionen derselben Datei festgestellt, muss zunächst der tatsächliche GitHub-Stand geprüft werden.

Besteht danach weiterhin Unklarheit, wird der Benutzer um Bereitstellung seiner vorhandenen Originaldatei gebeten.

Die vom Benutzer bereitgestellte Originaldatei dient dann als Vergleichsreferenz.

Es darf niemals stillschweigend angenommen werden, dass eine abgeschnittene oder unvollständige Ausgabe den vollständigen Dateiinhalt darstellt.

Nach einer Änderung einer Datei ist eine vorherige Version nicht automatisch als Backup verfügbar.

Deshalb gilt bei Unsicherheit:

PRÜFEN
→ VERGLEICHEN
→ RÜCKFRAGEN

Nicht raten und nicht rekonstruieren.

—

## 24. Terminal-Prüfungen und terminal.md

Für umfangreiche technische Prüfungen über das Codespace-Terminal wird im Repository-Root die Datei:

terminal.md

als temporäre Arbeits- und Übertragungsdatei verwendet.

terminal.md ist kein Bestandteil der Anwendung und keine Projektdokumentation.

Sie dient ausschließlich dazu, umfangreiche Terminal-Ergebnisse zwischen Codespace und der Entwicklungsprüfung zu übertragen.

Bei umfangreichen Prüfungen sollen Terminal-Befehle ihre vollständige Ausgabe nach Möglichkeit direkt in terminal.md schreiben.

Beispiel:

git show origin/main:PROJECT_CHRONICLE_001.md > terminal.md

Bei mehreren Prüfungen können mehrere Befehle zusammengeführt werden:

{
  command1
  command2
  command3
} > terminal.md 2>&1

terminal.md darf jederzeit vollständig überschrieben werden.

terminal.md ersetzt weder:

* PROJECT_STATUS.md
* PROJECT_MASTERLIST.md
* WORKFLOW.md
* RULES.md
* VISION.md
* PROJECT_CHRONICLE_*.md

Ergebnisse aus terminal.md müssen vor der Verwendung geprüft werden.

terminal.md darf niemals als alleinige Grundlage für eine Architekturänderung am Core verwendet werden.

Die Datei wird nicht als Teil des produktiven Projektstands behandelt und darf nicht committed werden.

—

## 25. Schutz der Frozen Documents

Die als Frozen definierten Dokumente dürfen von AI-Agenten und automatisierten Entwicklungswerkzeugen nur gelesen werden.

Nach dem Freeze gibt es keine automatische Änderungsfreigabe.

Ein AI-Agent darf nicht:

* die Datei eigenmächtig ändern
* die Datei automatisch aktualisieren
* die Datei formatieren oder „verbessern“
* Inhalte daraus entfernen
* Inhalte darin ergänzen
* nach einer Änderungserlaubnis fragen und anschließend aufgrund einer pauschalen Zustimmung ändern

Änderungen an Frozen Documents sind ausschließlich ein bewusst geplanter menschlicher Projektschritt und müssen ausdrücklich außerhalb eines normalen automatisierten Entwicklungsablaufs durchgeführt werden.

Die laufende Chronik ist davon ausgenommen. Neue abgeschlossene oder relevante Entwicklungsschritte werden ausschließlich dort dokumentiert.

—

## 26. Arbeitsgrundsatz für AI-Agenten

AI-Agenten arbeiten grundsätzlich nach folgendem Ablauf:

AKTUELLEN GITHUB-STAND LESEN
↓
VOLLSTÄNDIGKEIT PRÜFEN
↓
ABHÄNGIGKEITEN PRÜFEN
↓
ÄNDERUNGSBEDARF FESTSTELLEN
↓
ARCHITEKTURREGELN PRÜFEN
↓
ÄNDERUNG DURCHFÜHREN
↓
FUNKTION TESTEN
↓
ERGEBNIS PRÜFEN
↓
CHRONIK AKTUALISIEREN

Ein AI-Agent darf keine bestehenden Architekturentscheidungen stillschweigend neu interpretieren.

Bei Widersprüchen zwischen Dateien, GitHub-Stand, lokaler Arbeitskopie oder Benutzerangaben gilt:

PRÜFEN
→ VERGLEICHEN
→ RÜCKFRAGEN

—

## 27. Abschlussprinzip

Der Workflow dient dazu, CatchTrack schrittweise zu einem stabilen System mit klarer Trennung zwischen:

CORE
MODULE
USER
ADMIN
FACHFUNKTIONEN

zu entwickeln.

Nach dem Core-Freeze darf die Erweiterbarkeit des Systems nicht mehr durch Änderungen am Core erkauft werden.

Neue Funktionalität wird grundsätzlich über das bestehende Modul-System bereitgestellt, sofern sie keine echte Core-Infrastruktur darstellt.