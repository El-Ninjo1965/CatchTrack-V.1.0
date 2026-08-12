# CatchTrack V1.0 – Development Workflow

## 1. Zweck

Dieser Workflow definiert den verbindlichen Entwicklungsablauf für CatchTrack V1.0.

Ziele:

* klare Trennung von Core und Modulen
* keine unnötigen Core-Änderungen
* keine doppelten oder parallelen Implementierungen
* nachvollziehbare Entwicklung
* minimale manuelle Eingriffe des Benutzers
* reproduzierbare und versionierte Arbeitsschritte

## 2. Dokumentationshierarchie

### Verbindlich und Frozen

VISION.md
RULES.md
WORKFLOW.md
PROJECT_MASTERLIST.md
PROJECT_STATUS.md

Diese Dateien werden nach ihrer Freigabe nicht eigenständig durch AI-Agenten verändert.

### Laufende Dokumentation

PROJECT_CHRONICLE_001.md
PROJECT_CHRONICLE_002.md
...

Die Chronik dokumentiert relevante abgeschlossene Entwicklungsschritte, Entscheidungen und Statusänderungen.

### Technisches Entwicklungsprotokoll

DEV_LOG.md

DEV_LOG.md dokumentiert technische Arbeitsschritte, insbesondere:

* Datum und Uhrzeit
* Aktion bzw. Terminal-Befehl
* Ergebnis
* Commit-ID
* Commit-Nachricht
* betroffene Dateipfade

## 3. GitHub als verbindliche Referenz

GitHub main ist die maßgebliche Quelle für den aktuellen Projektstand.

Vor jeder Prüfung, Analyse oder Änderung einer bestehenden Datei wird grundsätzlich zuerst der aktuelle Stand aus GitHub gelesen.

Lokale Arbeitskopien aus Codespace oder Working Copy dürfen nicht ohne Prüfung als aktuell angenommen werden.

Bei Abweichungen:

GitHub prüfen
→ lokalen Stand prüfen
→ Unterschied feststellen
→ Entscheidung treffen

Bei abgeschnittenen, unvollständigen oder widersprüchlichen Dateien wird nicht geraten oder rekonstruiert.

In diesem Fall wird das vorhandene Original angefordert.

## 4. Autonomer Arbeitsmodus

Der Benutzer beschreibt Ziel und gewünschtes Ergebnis.

Der AI-Agent:

1. prüft selbstständig den aktuellen Projektstand
2. prüft die relevanten Architektur- und Workflowregeln
3. entscheidet technische Details selbstständig
4. setzt eindeutige Anforderungen ohne zusätzliche Bestätigung um
5. fragt nur bei echter Unklarheit oder einer notwendigen fachlichen Entscheidung
6. liefert nach einem bestätigten Verbesserungsvorschlag direkt die erforderlichen Dateien
7. arbeitet in kurzen, überprüfbaren Etappen
8. setzt nach einem bestätigten Arbeitsschritt direkt mit dem nächsten sinnvollen Schritt fort

Unnötige Erklärungen, Begründungen und Rückfragen werden vermieden.

Arbeitsprinzip:

ZIEL
→ PRÜFEN
→ ENTSCHEIDEN
→ UMSETZEN
→ TESTEN
→ KORRIGIEREN
→ ABSCHLIESSEN
→ DOKUMENTIEREN
→ COMMIT

## 5. Änderungsprinzip

Vor Änderungen wird festgestellt, ob eine Anforderung:

Infrastruktur
→ Core

oder:

Fachfunktion
→ Modul

ist.

Fachfunktionen dürfen den Core nicht verändern.

Vorhandene Dateien werden bei der Core-Inventur klassifiziert:

A – NEU
B – LÖSCHEN
C – VOLLSTÄNDIG ERSETZEN
D – UNVERÄNDERT ÜBERNEHMEN

Es gibt keine Kategorie „nur ein bisschen ändern“.

## 6. Entwicklungsphasen

CatchTrack wird in dieser Reihenfolge entwickelt:

Phase 1 – Architektur und Dokumentation
Phase 2 – Core-Inventur
Phase 3 – Core-Bereinigung
Phase 4 – Core-Implementierung
Phase 5 – Core-Validierung
Phase 6 – Core-Abnahme
Phase 7 – Core-Freeze
Phase 8 – Module-System
Phase 9 – User/Admin
Phase 10 – Fachmodule

Die Reihenfolge darf nicht ohne begründete Architekturentscheidung umgangen werden.

## 7. Core

Der Core stellt ausschließlich generische Infrastruktur bereit.

Mindestens:

* Startup
* Runtime
* Lifecycle
* Event System
* State
* Storage
* Database
* Error Handling
* Logging
* Module Interface
* Module Registry
* Module Manager
* Permissions
* Package/Entitlements
* System Configuration

Fachliche Funktionen gehören nicht in den Core.

## 8. Core-Freeze

Nach technischer Abnahme gilt:

CORE V1.0 = FROZEN

Danach ist:

/Core/*

für AI-Agenten Read-Only.

Neue Fachfunktionen werden ausschließlich über Module bereitgestellt.

## 9. Module

Module müssen unabhängig vom Core entwickelt und getestet werden.

Der Module Manager unterstützt:

* install
* uninstall
* enable
* disable
* update
* status
* registry
* dependencies

Ein Modul darf keine direkte Änderung bestehender Core-Dateien benötigen.

## 10. Testprinzip

Arbeit wird nicht unnötig bis zum Ende durchgebaut.

Nach sinnvollen Entwicklungsabschnitten wird ein Testpunkt erreicht.

Der Benutzer testet die verfügbare Version.

Testergebnis:

BESTANDEN
→ nächster Arbeitsschritt

FEHLER
→ Fehler analysieren
→ korrigieren
→ erneut testen

## 11. Terminal-Arbeiten

Terminal-Prüfungen werden grundsätzlich so ausgeführt, dass ihre vollständige relevante Ausgabe in einer versionierbaren Datei gespeichert wird.

Für umfangreiche Prüfungen kann terminal.md im Repository-Root als Arbeitsdatei verwendet werden.

Beispiel:

{ command1; command2; command3; } > terminal.md 2>&1

terminal.md ist eine technische Arbeitsdatei und keine Projektdokumentation.

Wenn Terminal-Ergebnisse für die weitere Entwicklung relevant sind, werden sie in DEV_LOG.md oder der Chronik dokumentiert.

## 12. Git und Versionierung

Relevante Entwicklungsdateien werden committed.

Ein relevanter Arbeitsschritt gilt erst als abgeschlossen, wenn die erzeugten oder geänderten Dateien versioniert sind.

Da der AI-Agent keinen direkten GitHub-Schreibzugriff voraussetzt, erfolgt der Transfer zu GitHub über die verfügbare Entwicklungsumgebung, insbesondere Working Copy.

Commit-Informationen müssen nachvollziehbar bleiben.

Dazu gehören insbesondere:

* Commit-ID
* Commit-Nachricht
* betroffene Dateipfade

## 13. DEV_LOG

DEV_LOG.md ist die technische Chronik der Entwicklungsarbeit.

Sie wird chronologisch ergänzt und enthält die für spätere Prüfungen relevanten technischen Informationen.

Mindestens:

Datum/Uhrzeit
→ Aktion
→ Terminal-Befehl bzw. Arbeitsschritt
→ Ergebnis
→ Commit
→ betroffene Pfade

DEV_LOG ersetzt nicht die Projektchronik.

## 14. Projektchronik

Die Projektchronik dokumentiert nur relevante Projektentscheidungen und abgeschlossene Meilensteine.

Sie enthält:

* eindeutige ID
* Status
* Arbeitsschritt
* Ergebnis
* relevante Fehler und Lösungen
* wichtige Entscheidungen
* Statusänderungen
* aktuellen Fortsetzungspunkt

Die Chronik wird nicht mit technischen Terminalausgaben überladen.

## 15. Fortsetzungspunkt

Am aktuellen Ende der laufenden Chronik wird ein Fortsetzungspunkt geführt.

Er enthält:

* aktuellen Arbeitsstand
* zuletzt abgeschlossenen Schritt
* nächsten Arbeitsschritt
* kurzen Fortsetzungsschlüssel

Dadurch kann eine spätere AI-Sitzung direkt am letzten bekannten Arbeitspunkt fortsetzen.

## 16. Dateiausgabe

Bei der Ausgabe einer vollständigen Datei zur manuellen Übernahme gelten verbindlich:

1. Copy-Block 1 enthält ausschließlich den exakten Dateinamen.
2. Copy-Block 2 enthält ausschließlich den vollständigen Dateiinhalt.
3. Der Dateiname steht nicht im zweiten Copy-Block.
4. Zwischen den beiden Copy-Blöcken stehen keine technischen Kommentare.
5. Für eine Datei werden genau diese zwei Copy-Blöcke verwendet.
6. Der zweite Copy-Block enthält keine verschachtelten Codeblöcke.
7. Der vollständige Dateiinhalt muss mit einer einzigen Kopieraktion übernommen werden können.
8. Der Dateiinhalt darf nicht wegen Formatierung, Kommentaren oder zusätzlicher Blöcke aufgeteilt werden.

Diese Regel gilt für jede Datei, unabhängig vom Dateityp.

## 17. Abschlussregel

Ein Arbeitsschritt ist abgeschlossen, wenn:

1. die erforderlichen Dateien vollständig erstellt oder ersetzt wurden
2. bekannte Fehler behoben wurden
3. der vorgesehene Test erfolgreich durchgeführt wurde
4. Abhängigkeiten geprüft wurden
5. relevante Dokumentation aktualisiert wurde
6. die Änderungen committed wurden

## 18. Grundprinzip

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
→ CORE ÄNDERN
→ NEUES MODUL
→ CORE ERNEUT ÄNDERN
→ NEUE CORE-DATEI