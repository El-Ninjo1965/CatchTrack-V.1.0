# CatchTrack V1.0 – AI Agent Index

## Zweck

Diese Datei ist der zentrale Einstiegspunkt für AI-Agenten, die am CatchTrack-Projekt arbeiten.

Sie definiert:

- welche Dokumente gelesen werden müssen
- in welcher Reihenfolge sie gelesen werden
- welche Priorität die Dokumente besitzen
- welche Dokumente verbindliche Regeln enthalten
- welche Dokumente Architektur und Planung beschreiben
- wie mit dem vorhandenen Quellcode umzugehen ist

Diese Datei enthält selbst keine Projektregeln, keinen Arbeitscursor und keine eigenständigen Architekturentscheidungen.

—

# 1. Verbindliche Lesereihenfolge

Ein AI-Agent muss vor jeder Änderung am Projekt mindestens folgende Dokumente in dieser Reihenfolge lesen:

1. `RULES.md`
2. `WORKFLOW.md`
3. `PROJECT.md`
4. `STATE.md`

Danach sind – abhängig vom Arbeitsbereich – die relevanten technischen Dokumente zu lesen.

Für Core-Arbeiten:

5. `CORE_TARGET_STRUCTURE.md`
6. `CORE_FUNCTIONAL_ANALYSIS.md`
7. `INFRASTRUCTURE_ANALYSIS.md`

Danach:

8. die tatsächlich betroffenen Quellcodedateien
9. deren direkte Abhängigkeiten
10. relevante Modul- oder Infrastrukturdateien

—

# 2. Dokumentenpriorität

Bei widersprüchlichen Informationen gilt folgende Priorität:

1. `RULES.md`
2. `WORKFLOW.md`
3. `PROJECT.md`
4. `STATE.md`
5. `CORE_TARGET_STRUCTURE.md`
6. `CORE_FUNCTIONAL_ANALYSIS.md`
7. `INFRASTRUCTURE_ANALYSIS.md`
8. sonstige Dokumentation
9. Quellcode
10. Kommentare und sonstige Hinweise innerhalb einzelner Dateien

## Wichtige Ausnahme

Der Quellcode beschreibt den tatsächlichen technischen Ist-Zustand.

Wenn eine Analyse oder Zieldokumentation vom tatsächlichen Quellcode abweicht, darf der AI-Agent diesen Unterschied nicht eigenmächtig auflösen.

Er muss:

- den Widerspruch feststellen
- die betroffenen Dateien nennen
- die Auswirkung beschreiben
- die weitere Entscheidung anhand der verbindlichen Projektregeln treffen

—

# 3. Rolle der einzelnen Steuerungsdateien

## RULES.md

Definiert die verbindlichen Projektregeln.

Regeln aus dieser Datei dürfen nicht durch niedrigere Dokumentationsstufen überschrieben werden.

—

## WORKFLOW.md

Definiert das verbindliche Arbeitsverfahren.

Der AI-Agent muss den dort festgelegten Entwicklungs- und Prüfprozess einhalten.

—

## PROJECT.md

Definiert:

- Projektziel
- Projektumfang
- grundlegende Architektur
- langfristige Ausrichtung

PROJECT.md ist keine Arbeitsstatusdatei.

—

## STATE.md

Ist die einzige autoritative Datei für:

- aktuellen Arbeitsschritt
- nächsten Arbeitsschritt
- Projektstatus
- dokumentierten Arbeitsfortschritt
- aktuelle Blocker

Kein anderes Dokument darf einen konkurrierenden Arbeitscursor oder Fortsetzungsschlüssel enthalten.

—

# 4. Technische Planungsdokumente

## CORE_TARGET_STRUCTURE.md

Definiert die beschlossene Zielarchitektur des Core.

Sie beschreibt:

- Zielstruktur
- Verantwortlichkeiten
- Schnittstellen
- Abgrenzungen
- Zielentscheidungen
- Implementierungsreihenfolge
- Validierungsanforderungen

Sie ist die verbindliche technische Grundlage für die Core-Bereinigung und Core-Implementierung.

—

## CORE_FUNCTIONAL_ANALYSIS.md

Dokumentiert die Analyse des bestehenden Core.

Sie beschreibt:

- vorhandene Komponenten
- aktuelle Verantwortlichkeiten
- Probleme
- Überschneidungen
- bisherige Bereinigungsentscheidungen

Sie beschreibt primär den analysierten Ist-Zustand und die daraus abgeleiteten Entscheidungen.

—

## INFRASTRUCTURE_ANALYSIS.md

Dokumentiert die Analyse der bestehenden Infrastruktur außerhalb des direkten Core.

Insbesondere:

- Config
- Database
- Services
- Storage
- Logging
- weitere technische Infrastruktur

—

# 5. Grundregel vor jeder Änderung

Ein AI-Agent darf keine Änderung am Repository beginnen, bevor er:

1. `RULES.md` gelesen hat
2. `WORKFLOW.md` gelesen hat
3. `PROJECT.md` gelesen hat
4. `STATE.md` gelesen hat
5. die für die Aufgabe relevanten technischen Dokumente gelesen hat
6. den tatsächlichen Quellcode der betroffenen Komponenten geprüft hat

—

# 6. Keine eigenmächtigen Architekturentscheidungen

Der AI-Agent darf nicht eigenständig:

- Projektregeln ändern
- Workflow-Regeln ändern
- die Projektarchitektur ändern
- den Core-Freeze aufheben
- einen Core-Freeze ausrufen
- den Arbeitscursor in einer anderen Datei festlegen
- konkrete Module fest in den Core integrieren
- bestehende Architekturentscheidungen stillschweigend ersetzen

Erkennt der Agent einen notwendigen Änderungsbedarf, muss dieser zunächst anhand der bestehenden Dokumentation und des tatsächlichen Codes geprüft werden.

—

# 7. Umgang mit vorhandenen Dateien

Vor dem Erstellen einer neuen Datei muss geprüft werden:

1. ob bereits eine Datei mit gleicher Funktion existiert
2. ob eine bestehende Datei diese Aufgabe übernehmen kann
3. ob die Funktion bereits an anderer Stelle implementiert ist
4. ob eine Zusammenlegung sinnvoller ist
5. ob die Zielarchitektur die neue Datei tatsächlich vorsieht

## Grundregel

Keine neue Datei nur deshalb erstellen, weil eine Funktion einfacher dort untergebracht werden könnte.

Neue Dateien müssen architektonisch begründet sein.

—

# 8. Umgang mit bestehenden Dateien

Bestehende Dateien dürfen nicht ohne Prüfung:

- gelöscht
- ersetzt
- dupliziert
- umbenannt
- funktional verändert

werden.

Vor einer solchen Änderung muss die tatsächliche Verwendung der Datei geprüft werden.

Dabei sind insbesondere zu prüfen:

- Imports
- Exports
- Referenzen
- Abhängigkeiten
- Ladepfade
- Event-Verbindungen
- Modulabhängigkeiten
- HTML-/Script-Einbindungen

—

# 9. Core-Regel

Der Core ist technische Infrastruktur.

Der Core darf keine konkrete Fachlogik enthalten.

Insbesondere darf der Core nicht fest von folgenden Fachmodulen abhängig sein:

- User
- Admin
- GPS
- Weather
- i18n
- Catchbook
- Catches
- weitere zukünftige Fachmodule

Module werden über definierte Core-Schnittstellen integriert.

—

# 10. Modul-Regel

Module enthalten ihre eigene Fachlogik.

Module dürfen:

- Core-APIs verwenden
- eigene Services besitzen
- eigene Datenmodelle besitzen
- eigene Konfiguration besitzen
- über definierte Events kommunizieren

Module dürfen nicht:

- Core-Dateien eigenmächtig verändern
- Core-interne Implementierungen voraussetzen
- andere Module ohne definierte Schnittstelle direkt manipulieren

—

# 11. Analyse vor Implementierung

Bei größeren Änderungen gilt:

Analyse
    ↓
Zieldefinition
    ↓
Abgleich mit vorhandenem Code
    ↓
Änderungsplan
    ↓
Implementierung
    ↓
Tests
    ↓
Validierung

Der AI-Agent darf nicht direkt vom Problem zur Implementierung springen, wenn dadurch Architektur- oder Abhängigkeitsfragen ungeprüft bleiben.

—

# 12. Core-Bereinigung

Bei der Core-Bereinigung muss jede vorhandene Core-Datei einer der folgenden Kategorien zugeordnet werden:

- BEHALTEN
- ERSETZEN
- ZUSAMMENLEGEN
- VERSCHIEBEN
- LÖSCHEN
- NEU ERSTELLEN

Keine Datei darf allein aufgrund ihres Dateinamens als überflüssig betrachtet werden.

—

# 13. Syntax- und Funktionsprüfung

Nach Änderungen müssen die betroffenen Dateien mindestens auf folgende Punkte geprüft werden:

- Syntaxfehler
- Import-/Export-Fehler
- fehlende Abhängigkeiten
- falsche Pfade
- doppelte Funktionen
- doppelte Verantwortlichkeiten
- undefinierte Variablen
- falsche API-Aufrufe
- fehlerhafte Lifecycle-Übergänge
- fehlerhafte Event-Verbindungen
- unerlaubte Abhängigkeiten
- Inkonsistenzen mit der Zielarchitektur

Bei Core-Änderungen ist zusätzlich die Start- und Ladefolge zu prüfen.

—

# 14. Keine stillschweigenden Änderungen

Wenn der AI-Agent während der Arbeit feststellt, dass eine bestehende Planung nicht mehr sinnvoll oder technisch korrekt ist, darf er sie nicht stillschweigend ändern.

Er muss den Widerspruch eindeutig benennen.

Beispiel:

    Dokumentation:
    X ist vorgesehen.

    Tatsächlicher Code:
    Y wird verwendet.

    Bewertung:
    X und Y sind nicht kompatibel.

    Folge:
    Architekturentscheidung erforderlich.

—

# 15. Dokumentationsdisziplin

Dokumente dürfen keine konkurrierenden Steuerungsinformationen enthalten.

Insbesondere dürfen technische Analyse- und Zieldokumente keinen eigenen:

- Current work step
- Next work step
- Fortsetzungsschlüssel
- Arbeitscursor

enthalten.

Diese Informationen gehören ausschließlich in `STATE.md`.

—

# 16. Statusänderungen

Der AI-Agent darf den Projektstatus nicht durch bloße Annahme verändern.

Ein Status wie:

- COMPLETED
- NOT STARTED
- IN PROGRESS
- VALIDATED
- FROZEN

muss durch den tatsächlichen Projektstand begründet sein.

Ein Freeze darf erst nach Erfüllung der dafür definierten Prüfungen erfolgen.

—

# 17. Core Freeze

Ein Core Freeze ist erst zulässig, wenn:

- die Zielstruktur umgesetzt wurde
- alle vorgesehenen Core-Dateien vorhanden sind
- unnötige Dateien entfernt wurden
- Abhängigkeiten geprüft wurden
- Syntax geprüft wurde
- Start und Shutdown geprüft wurden
- Lifecycle geprüft wurde
- Module-System geprüft wurde
- Error Handling geprüft wurde
- Storage geprüft wurde
- Database geprüft wurde
- relevante Tests erfolgreich sind
- keine bekannten kritischen Widersprüche bestehen

—

# 18. Arbeitsweise bei Unsicherheit

Wenn Informationen fehlen, darf der AI-Agent nicht raten.

Er muss:

1. die vorhandenen Dateien prüfen
2. die Dokumentation prüfen
3. Abhängigkeiten prüfen
4. den Widerspruch beziehungsweise die fehlende Information benennen

Eine neue Architekturentscheidung darf nicht aus einer Vermutung entstehen.

—

# 19. Änderungsprinzip

Der AI-Agent soll die kleinste sinnvolle Änderung durchführen, die den definierten Zweck erfüllt.

Keine unnötigen:

- Dateien
- Abstraktionen
- Wrapper
- Services
- Konfigurationsschichten
- Duplikate
- Architekturänderungen

—

# 20. Repository als Wahrheit über den Ist-Zustand

Für den tatsächlichen technischen Zustand gilt:

Der Repository-Code ist maßgeblich.

Dokumentationen beschreiben:

- Regeln
- Architektur
- Planung
- Analyse
- Status

Der Agent muss deshalb bei jeder technischen Änderung Dokumentation und tatsächlichen Code miteinander vergleichen.

—

# 21. Abschluss einer Arbeitseinheit

Eine Arbeitseinheit ist erst abgeschlossen, wenn:

1. die Änderung implementiert wurde
2. die betroffenen Dateien geprüft wurden
3. Syntax geprüft wurde
4. Abhängigkeiten geprüft wurden
5. relevante Tests durchgeführt wurden
6. keine offensichtlichen Widersprüche bestehen
7. der Repository-Zustand geprüft wurde
8. `STATE.md` bei einer relevanten Statusänderung aktualisiert wurde

—

# 22. Kein automatisches Aufräumen außerhalb des Auftrags

Der AI-Agent darf nicht nebenbei:

- alte Dokumentationen löschen
- Dateien umbenennen
- Architektur neu organisieren
- Module verschieben
- weitere Verbesserungen implementieren

wenn dies nicht Bestandteil des aktuellen Arbeitsschrittes ist.

—

# 23. Priorität bei Konflikten

Bei einem Konflikt gilt:

RULES.md
    ↓
WORKFLOW.md
    ↓
PROJECT.md
    ↓
STATE.md
    ↓
CORE_TARGET_STRUCTURE.md
    ↓
Analyse-Dokumente
    ↓
sonstige Dokumentation
    ↓
Quellcode als Ist-Zustand

Der Agent darf keinen Konflikt durch stillschweigende Interpretation beseitigen.

—

# 24. Aktuelle Projektphase

Der aktuelle Projektstatus wird ausschließlich aus `STATE.md` gelesen.

Diese Datei enthält bewusst keinen eigenen Arbeitsstatus.

Der Agent muss `STATE.md` lesen, bevor er entscheidet, welcher Arbeitsschritt als Nächstes ausgeführt werden darf.

—

# 25. Verbindliche Grundregel

Vor jeder Änderung gilt:

READ
    ↓
UNDERSTAND
    ↓
COMPARE
    ↓
PLAN
    ↓
IMPLEMENT
    ↓
TEST
    ↓
VALIDATE

Keine Änderung ohne vorherige Prüfung.

Keine neue Datei ohne Begründung.

Keine Architekturänderung ohne Prüfung.

Keine widersprüchlichen Steuerungsdateien.

Keine eigenmächtige Änderung verbindlicher Regeln.

—

# 26. Ende des Index

`AI_AGENT_INDEX.md` ist ausschließlich ein Navigations- und Prioritätsdokument.

Die verbindlichen Projektregeln befinden sich in `RULES.md`.

Der verbindliche Workflow befindet sich in `WORKFLOW.md`.

Die Projektdefinition befindet sich in `PROJECT.md`.

Der aktuelle Projektstatus befindet sich ausschließlich in `STATE.md`.

Die technische Core-Zielarchitektur befindet sich in `CORE_TARGET_STRUCTURE.md`.