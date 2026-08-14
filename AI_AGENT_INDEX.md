# CatchTrack V1.0 – AI Agent Index

## Zweck

Diese Datei ist der zentrale AI-/Agenten-Kontext und Regelindex für das CatchTrack-Projekt.

Sie dient:

- zukünftigen Coding-Agenten als zentraler Einstiegspunkt
- der AI-Unterstützung bei der Orientierung im Projekt
- der eindeutigen Zuordnung von verbindlichen Regeln, Zuständen und Verantwortlichkeiten
- der klaren Definition der relevanten Projekt- und Arbeitsdokumente
- der Verknüpfung zwischen Projektvision, aktuellem Zustand und Arbeitsprotokoll

Sie enthält verbindliche Projekt- und Arbeitsregeln sowie Referenzen auf den aktuellen technischen Zustand und die langfristige Architektur.

Zentrale Dokumente und ihre Rolle:

- [AI_AGENT_INDEX.md](AI_AGENT_INDEX.md): zentraler AI-/Agenten-Kontext und Regelindex des Projekts
- [STATE.md](STATE.md): autoritativer aktueller technischer Zustand
- [MODULE_WORK_LOG.md](MODULE_WORK_LOG.md): dokumentiert tatsächliche Arbeiten und Änderungen
- [PROJECT.md](PROJECT.md): langfristige Projekt- und Architekturvision
- [CatchTrack-Direct-Backup](https://github.com/El-Ninjo1965/CatchTrack-Direct-Backup.git): aktuelles GitHub-Backup-Repository für den vollständigen 1:1-Snapshot des Projektstandes; lokales Backup unter /workspaces/CatchTrack-V1.0-BACKUP bleibt unverändert, bis der GitHub-Stand verifiziert wurde
- Historischer lokaler Backup-Name: CatchTrack-V1.0-BACKUP (nur noch als veraltete Bezeichnung dokumentiert, nicht als aktives Backup-Repository)
- [WORKFLOW.md](WORKFLOW.md): Arbeitsabläufe und Vorgehensregeln
- [RULES.md](RULES.md): verbindliche Projektregeln
- [PLATFORM_GAP_ANALYSIS.md](PLATFORM_GAP_ANALYSIS.md): dauerhafte AI-lesbare Gap-Analyse der tatsächlichen Implementierung gegen dokumentierte Plattformverträge
- [AGENT_REVIEW.md](AGENT_REVIEW.md): temporäre AI-Arbeits- und Review-Datei für alternative technische Vorschläge vor einer Entscheidung
- [PERMISSION_PACKAGE_UI_ARCHITECTURE.md](PERMISSION_PACKAGE_UI_ARCHITECTURE.md): dauerhafte Zielarchitektur für das generische Permission-/Package-/UI-Menümodell

Keine Datei darf dabei widersprüchliche oder konkurrierende Zustandsaussagen erzeugen.

## Strategische Architekturentscheidung

CatchTrack V1.0 ist die erste Anwendung auf einer langfristig neutralen, wiederverwendbaren modularen Plattform.

Die Plattform-/Framework-Ebene umfasst generische Komponenten für:

- Core
- User Identity / User Interface
- Administration
- Module Manager / Modulverwaltung
- Modul- und Plugin-Schnittstellen
- Berechtigungs- und Paketlogik
- dynamische Benutzeroberfläche
- Konfigurations- und Einstellungsmechanismen
- Connection-/Server- und Cloud-Konzept
- spätere Wiederverwendung für andere Apps

Die Anwendungsebene umfasst nur CatchTrack selbst als erste konkrete Anwendung.

Die Fachmodule bilden eigenständige Einheiten und bleiben auf das fachliche Thema CatchTrack begrenzt, z. B.:

- Angeln
- Fangbuch / Catches
- Equipment
- GPS
- Wetter
- Kalender
- zukünftige Angelmodule

User Identity, User Interface, Administration sowie Berechtigungs-/Paketlogik gehören nicht zu den CatchTrack-Fachmodulen, sondern zur generischen Plattform-/Framework-Ebene. Der Core bleibt eingefroren und technisch klein. Module werden als eigenständige Einheiten installiert, aktiviert, deaktiviert, konfiguriert und ggf. deinstalliert. Die Module kommunizieren über definierte Schnittstellen, gemeinsame Dienste und gemeinsame Konfigurations-/Rollenstrukturen, nicht durch direkte Core-Änderungen.

Die Architektur schützt zugleich:

- spätere Store-/App-Verpackbarkeit
- Wiederverwendung des Grundgerüsts für weitere Anwendungen
- generische Benutzer- und Admin-Identität
- modulare Rechte-/Tariflogik
- Datenschutzprinzip mit lokaler Speicherung von GPS-Daten soweit möglich
- responsive und dynamische UI mit Benutzerpräferenzen, Menü- und Reihenfolge-Definitionen sowie Upgrade-Hinweisen

## Projektverantwortung

Das Projekt wird von einer einzigen Person entwickelt und verantwortet.

Diese Person ist alleiniger Entwickler, Entscheider und Projektverantwortlicher.

AI-Systeme und Coding-Agenten sind digitale Werkzeuge zur Unterstützung. Sie treffen keine endgültigen Projektentscheidungen.

Technische Vorschläge von AI-Systemen sind kritisch zu prüfen. Die endgültige Entscheidung über Architektur, Umsetzung und Priorisierung liegt beim Entwickler.

Keine privaten finanziellen oder persönlichen Informationen werden in der Projektarchitektur oder den Dokumenten festgehalten.

## Projektkontext

Das Projekt ist langfristig modular aufgebaut.

CatchTrack wird zunächst als konkrete Anwendung verwendet, verfolgt aber eine neutrale und wiederverwendbare Plattformbasis.

Die Plattformbasis soll später als Grundlage für weitere Anwendungen dienen können, inklusive einer späteren Store-/App-Perspektive.

Die Architektur darf eine spätere Wiederverwendung für andere Apps nicht ausschließen.

## Review-First / Analyse vor Umsetzung

Nicht-triviale technische oder architektonische Aufträge werden nicht blind ausgeführt.

Die P0-Hybridarchitektur für Package, Permission, Module Access, Feature Access und UI Visibility ist als Proposed-Design definiert und darf nicht als implementiert betrachtet werden. Sie bleibt ein review- und entscheidungsbasierter Zielvertrag für eine spätere Umsetzung.

Der Agent muss zunächst prüfen:

1. den tatsächlichen Repository-Zustand,
2. vorhandene Implementierungen und Abhängigkeiten,
3. den vorgeschlagenen Lösungsweg kritisch zu bewerten,
4. bestehende Alternativen zu suchen,
5. Risiken und Widersprüche zu identifizieren,
6. unnötige Änderungen zu vermeiden,
7. gegebenenfalls eine bessere technische Lösung zu empfehlen.

Bei einem Auftrag, der ausdrücklich eine Analyse oder einen Review verlangt, darf keine Implementierung vor dem Review erfolgen.

Bei ausdrücklich freigegebenen Umsetzungsaufträgen gilt: Analyse zuerst, danach autonome Umsetzung.

Die Entwicklerentscheidung bleibt maßgeblich.

Der Agent darf jedoch eine offensichtlich technisch bessere, sicherere oder kompatiblere Lösung empfehlen, sofern sie mit den Projektregeln vereinbar ist.

## Entwickler-Vorschlag kritisch prüfen

Der vom Entwickler formulierte Lösungsweg ist zunächst als Vorschlag zu behandeln.

Vor der Umsetzung muss der Agent prüfen, ob er aufgrund des tatsächlichen Repository-Zustands eine:

- technisch bessere
- einfachere
- sicherere
- wartbarere
- zukunftsfähigere

Lösung erkennt.

Wenn keine bessere Alternative erkennbar ist, wird der Auftrag gemäß den bestehenden Regeln ausgeführt.

Wenn eine bessere Alternative erkannt wird:

- nicht stillschweigend den Auftrag verändern,
- Alternative dokumentieren,
- noch nicht implementieren,
- auf die anschließende Entscheidung warten.

Ausnahmen gelten für ausdrücklich freigegebene autonome Routinearbeiten.

## Verbindlicher Workflow für zukünftige nicht-triviale Aufträge

Entwicklerziel

      ↓

AI-/Architekturvorschlag

      ↓

Agent prüft tatsächlichen Repository-Zustand

      ↓

Agent bewertet Vorschlag kritisch

      ↓

AGENT_REVIEW.md

      ↓

Entscheidung des Entwicklers

      ↓

Implementierungsauftrag

      ↓

Umsetzung

      ↓

Tests / Validierung

      ↓

Commit

      ↓

Push

      ↓

MODULE_WORK_LOG.md

Der Agent darf bei einem Review-Auftrag nicht vor der Entscheidung implementieren.

## Entscheidungsgrundlagen und Priorität

Tatsächlicher Repository-Zustand

        ↓

Verbindliche Projektregeln

        ↓

Core-Freeze

        ↓

Dokumentierte Architektur

        ↓

Technische Analyse

        ↓

Entwicklervorgabe

        ↓

Implementierung

Bei Konflikten muss der Agent den Konflikt erkennen, dokumentieren und gemäß dieser Reihenfolge entscheiden.

Der Core-Freeze darf durch keine Agentenentscheidung aufgehoben werden.

## Autonomie des Agenten

Der Agent arbeitet innerhalb der verbindlichen Regeln möglichst autonom.

Bei eindeutigen Routinearbeiten darf er direkt handeln.

Bei Architektur-, Sicherheits-, Datenbank- oder größeren Änderungsentscheidungen gilt Review-First.

Wenn eine Entscheidung zwingend vom Entwickler abhängt, darf der Agent nur dann nachfragen, wenn sie nicht innerhalb der dokumentierten Regeln eindeutig entschieden werden kann.

## Abweichungen vom Auftrag

Wenn die Analyse ergibt, dass ein anderer Lösungsweg besser ist, muss der Agent:

- den ursprünglichen Vorschlag erkennen,
- das Problem feststellen,
- eine bessere Alternative bestimmen,
- die Abweichung dokumentieren.

Bei ausdrücklich autonom freigegebenen Umsetzungsaufträgen darf der Agent die bessere Alternative direkt umsetzen, sofern sie mit den Projektregeln vereinbar ist.

Jede relevante Abweichung muss in [MODULE_WORK_LOG.md](MODULE_WORK_LOG.md) dokumentiert werden.

## Qualitätsprinzip

So wenig Änderung wie möglich, so viel technische Wirkung wie nötig.

Prioritäten:

- vorhandene Lösungen wiederverwenden
- kompatibel erweitern
- unnötige Komplexität vermeiden
- keine redundanten Systeme schaffen
- keine Architektur nur aus ästhetischen Gründen umbauen
- funktionierende Komponenten nicht ohne zwingenden Grund ersetzen

## Verbindliche Agenten-Protokoll-Regel

Jeder zukünftige Coding-Agent-Auftrag muss nachvollziehbar protokolliert werden.

Das Protokoll muss mindestens enthalten:

- Datum
- Auftrag / Arbeitseinheit
- Ziel
- Analyse
- geänderte Dateien
- relevante technische Änderungen
- Tests
- Validierungen
- erkannte Probleme
- Entscheidungen
- Commit-SHA
- Branch
- Push-Status
- gegebenenfalls Pull-Request-Nummer
- Ergebnis
- nächster sinnvoller Arbeitsschritt

Eine Arbeit darf erst als abgeschlossen protokolliert werden, wenn:

1. die Änderungen tatsächlich durchgeführt wurden,
2. die Validierung erfolgreich war,
3. ein Commit erstellt wurde,
4. der Commit erfolgreich gepusht wurde.

Wenn ein Auftrag nicht erfolgreich abgeschlossen werden konnte, muss der aktuelle Repository-Zustand dokumentiert werden, inklusive Fehler, offenem Punkt und eindeutigem Commit-/Push-Status.

Diese Regel gilt ab sofort für alle zukünftigen Agentenaufträge.

—

# 0. ChatGPT Superpowers – Projektarbeitsregel

Bei jeder Arbeit am CatchTrack-Projekt in ChatGPT sollen die verfügbaren Superpowers-Skills nach ihrer jeweiligen Anwendbarkeit verwendet werden.

Insbesondere sind bei passenden Aufgaben zu berücksichtigen:

- `systematic-debugging` für Fehleranalyse und systematische Ursachenfindung
- `verification-before-completion` vor einer Aussage, dass eine Arbeit abgeschlossen, korrekt oder validiert ist
- `writing-plans` für mehrstufige Implementierungs- oder Änderungsaufgaben
- `test-driven-development` bei neuen Funktionen oder Bugfixes, soweit technisch sinnvoll
- `requesting-code-review` bei größeren Änderungen oder vor einem relevanten Abschluss

Diese Regel aktiviert oder installiert Superpowers nicht in einem Codespace- oder Copilot-Agenten. Sie ist eine verbindliche Projektarbeitsregel für die Zusammenarbeit mit ChatGPT, sofern die entsprechenden Skills in der jeweiligen ChatGPT-Umgebung verfügbar sind.

Für AI-Agenten im Codespace gilt weiterhin deren tatsächlich verfügbare Skill-, Plugin- und Agenten-Infrastruktur.

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

`PROJECT.md` ist keine Arbeitsstatusdatei.

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

```
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
```

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

```
Dokumentation:
X ist vorgesehen.

Tatsächlicher Code:
Y wird verwendet.

Bewertung:
X und Y sind nicht kompatibel.

Folge:
Architekturentscheidung erforderlich.
```

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
# 19. CORE_WORK_LOG Freeze

`CORE_WORK_LOG.md` ist nach Abschluss der Core-Phase eingefroren.

Status:

`FROZEN / READ-ONLY`

Die Datei darf von AI-Agenten und ChatGPT weiterhin gelesen und zur historischen Verifikation verwendet werden.

Sie darf jedoch im normalen Projektworkflow nicht verändert werden.

Die laufende Dokumentation der Modulphase erfolgt ausschließlich über:

`MODULE_WORK_LOG.md`

Der aktuelle Arbeitscursor bleibt ausschließlich in:

`STATE.md`

Der Core-Worklog darf nicht als aktives Arbeitsprotokoll der Modulphase verwendet werden.

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

```
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
```

Der Agent darf keinen Konflikt durch stillschweigende Interpretation beseitigen.

—

# 24. Aktuelle Projektphase

Der aktuelle Projektstatus wird ausschließlich aus `STATE.md` gelesen.

Diese Datei enthält bewusst keinen eigenen Arbeitsstatus.

Der Agent muss `STATE.md` lesen, bevor er entscheidet, welcher Arbeitsschritt als Nächstes ausgeführt werden darf.

—

# 25. Verbindliche Grundregel

Vor jeder Änderung gilt:

```
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
```

Keine Änderung ohne vorherige Prüfung.

Keine neue Datei ohne Begründung.

Keine Architekturänderung ohne Prüfung.

Keine widersprüchlichen Steuerungsdateien.

Keine eigenmächtige Änderung verbindlicher Regeln.

—

# 26. Arbeitsworkflow für ChatGPT, Terminal, Working Copy und AI-Agent

Für Änderungen am Repository gilt folgende Priorität:

## Priorität 1 – Terminal

Alles, was ohne unnötige Agentennutzung über das Codespace-Terminal erledigt werden kann, soll bevorzugt dort durchgeführt werden.

Dazu gehören insbesondere:

- `git status`
- `git diff`
- `git log`
- `git tag`
- `git fetch`
- `git pull —ff-only`
- Syntaxprüfungen
- vorhandene Tests
- Build-Prüfungen
- weitere reine Prüf-, Diagnose- und Git-Operationen

Das Terminal hat Priorität 1, weil es für diese Aufgaben ressourcenschonend und direkt ist.

—

## Priorität 2 – Working Copy + Benutzer

Wenn eine Datei erstellt, ersetzt, bearbeitet oder vollständig geändert werden muss und dies nicht sinnvoll über das Terminal erfolgen soll, erfolgt die Änderung bevorzugt über Working Copy durch den Benutzer.

ChatGPT liefert dafür die vollständige Datei.

Der Benutzer übernimmt die Datei in Working Copy und führt anschließend den Commit und Push nach dem vereinbarten Workflow durch.

—

## Priorität 3 – AI-Agent

Der AI-Agent im Codespace soll eingesetzt werden, wenn eine Aufgabe über Terminal und Working Copy wesentlich aufwendiger wäre und der Agent sie deutlich schneller oder einfacher erledigen kann.

Der AI-Agent soll nicht aus Bequemlichkeit eingesetzt werden, wenn die Aufgabe mit Terminal oder Working Copy einfach erledigt werden kann.

Der Copilot-/AI-Agenten-Verbrauch soll auf notwendige Aufgaben beschränkt werden.

—

## Nach einem Push

Nach Änderungen und Push nach `origin/main` wird der Codespace bei Bedarf synchronisiert mit:

```
git fetch origin
git pull —ff-only origin main
```

Vor dem Pull muss geprüft werden, ob lokale Änderungen vorhanden sind.

Lokale Änderungen dürfen nicht ungeprüft überschrieben werden.

—

# 27. Verbindliche Datei- und Code-Ausgabe von ChatGPT

Diese Regel gilt für alle Projekte, nicht nur für CatchTrack.

Bei der Ausgabe von Quellcode oder beim Erstellen bzw. vollständigen Ändern einer Datei verwendet ChatGPT immer folgende Struktur:

1. Dateipfad als normalen Text
2. ein Copyblock, der ausschließlich den Dateinamen enthält
3. ein weiterer Copyblock, der ausschließlich den vollständigen Dateiinhalt bzw. Quellcode enthält

Beispiel:

Dateipfad: `src/example.js`

```
example.js
```

```javascript
// vollständiger Dateiinhalt
```

## Verbindliche Regeln

- Keine Patches.
- Keine Diff-Ausgaben als Ersatz für die vollständige Datei.
- Keine Ausschnitte, wenn eine vollständige Datei benötigt wird.
- Keine Mischung aus Änderungsanweisung und Dateiinhalt innerhalb desselben Codeblocks.
- Der Dateiname-Copyblock enthält ausschließlich den Dateinamen.
- Der Quellcode-Copyblock enthält ausschließlich den vollständigen Dateiinhalt.
- Der Copyblock darf nicht durch zusätzliche Erklärungen, weitere Codeblöcke oder eingeschobenen Text unterbrochen werden.
- Bei mehreren Dateien wird dieses Schema für jede Datei einzeln wiederholt.
- Der vollständige Dateiinhalt muss so ausgegeben werden, dass er direkt in Working Copy übernommen werden kann.

—

# 28. Schutz der Copyblöcke

Bei vollständigen Datei-Ausgaben muss verhindert werden, dass die Markdown- oder Quellcodesyntax innerhalb der Datei den äußeren Copyblock vorzeitig beendet.

Insbesondere gilt für Markdown-Dateien:

- Enthält die vollständige Datei selbst dreifache Backticks, muss der äußere Copyblock mindestens vier Backticks verwenden.
- Enthält die Datei vier oder mehr aufeinanderfolgende Backticks, muss der äußere Copyblock entsprechend länger gewählt werden.
- Der äußere Copyblock muss immer länger sein als jede innerhalb der Datei enthaltene Backtick-Sequenz.
- Der Dateiinhalt darf innerhalb des äußeren Copyblocks nicht verändert werden, nur um den Copyblock technisch funktionsfähig zu machen.
- Die in der Datei enthaltenen Markdown-Codeblöcke müssen exakt erhalten bleiben.
- Diese Schutzregel gilt für alle Markdown-Dateien und generell für jede Datei, deren Inhalt selbst eine Blocksyntax enthält.

Ziel:

Die vollständige Datei muss als ein einziger zusammenhängender Copyblock kopierbar sein.

—

# 29. Dateiänderungen durch ChatGPT

ChatGPT soll Repository-Dateien nicht eigenständig verändern, wenn der Projektworkflow die Änderung über Terminal oder Working Copy vorsieht.

Bei einer notwendigen Dateiänderung:

1. Datei lesen
2. Änderung analysieren
3. vollständige aktualisierte Datei erzeugen
4. Dateipfad als normalen Text ausgeben
5. Dateiname in eigenem Copyblock ausgeben
6. vollständige Datei in eigenem, gegen Syntaxkonflikte geschütztem Copyblock ausgeben
7. Benutzer übernimmt die Datei über Working Copy
8. Benutzer commitet und pusht
9. Repository-Zustand wird anschließend geprüft

Keine Patch-Übergabe.

—

# 30. Übergabe von Audit- und Agentenergebnissen

Wenn der AI-Agent im Codespace eine Analyse oder Prüfung durchführt und die Chat-Ausgabe nicht zuverlässig übernommen werden kann, muss das vollständige Ergebnis in einer dafür vorgesehenen bestehenden Dokumentationsdatei gespeichert werden.

Für Core-Audits ist grundsätzlich `CORE_WORK_LOG.md` zu verwenden.

Dabei soll:

- kein unnötiges neues Übergabedokument erstellt werden
- der vollständige Bericht gespeichert werden
- ein eindeutiger Abschnittstitel verwendet werden
- Git-Status und Commit-ID dokumentiert werden
- nach dem Push eine Remote-Verifikation erfolgen

Der vollständige Bericht muss dadurch anschließend über GitHub auslesbar sein.

—

# 31. Keine unnötigen Dateien

Vor jeder neuen Datei ist zu prüfen, ob eine bestehende Datei die Aufgabe übernehmen kann.

Insbesondere sollen für:

- Prompts
- Agentenaufträge
- Auditberichte
- Übergabeinformationen
- Arbeitsprotokolle

keine zusätzlichen Dateien erstellt werden, wenn eine vorhandene Dokumentationsdatei dafür geeignet ist.

—

# 32. Ende des Index

`AI_AGENT_INDEX.md` ist ausschließlich ein Navigations-, Prioritäts- und Arbeitsworkflow-Dokument.

Die verbindlichen Projektregeln befinden sich in `RULES.md`.

Der verbindliche Workflow befindet sich in `WORKFLOW.md`.

Die Projektdefinition befindet sich in `PROJECT.md`.

Der aktuelle Projektstatus befindet sich ausschließlich in `STATE.md`.

Die technische Core-Zielarchitektur befindet sich in `CORE_TARGET_STRUCTURE.md`.

—

# 33. Bedeutung von „Okay“ als Arbeitsfreigabe

Wenn der Benutzer im laufenden Projektworkflow lediglich „Okay“ sagt oder schreibt, ist dies als **Freigabe zum nächsten sinnvollen Arbeitsschritt** zu verstehen.

„Okay“ ist kein Gesprächsabschluss und kein Anlass, den vorherigen Schritt erneut zusammenzufassen oder erneut zu bestätigen.

Je nach Kontext bedeutet „Okay“:

- **A – Erledigungsbestätigung:** Der Benutzer hat die zuvor von ihm erwartete Arbeit erledigt. Der AI-Agent soll unmittelbar mit dem nächsten erforderlichen Arbeitsschritt fortfahren.
- **B – Vorschlagsfreigabe:** Der Benutzer akzeptiert einen vorgeschlagenen nächsten Schritt. Der AI-Agent soll diesen Schritt unmittelbar ausführen.
- **C – Arbeitsfreigabe:** Der Benutzer bestätigt, dass eine vom AI-Agenten vorgeschlagene oder bereits vorbereitete Arbeit durchgeführt werden soll. Der AI-Agent soll unmittelbar damit beginnen.

Nach einem „Okay“ gilt daher:

- bereits erledigte Schritte nicht wiederholen
- keine erneute Freigabe für denselben Schritt verlangen
- keine unnötige Zusammenfassung des vorherigen Schrittes ausgeben
- automatisch mit dem nächsten sinnvollen Schritt fortfahren
- bei mehreren nacheinander zu bearbeitenden Dateien nach jedem erforderlichen Benutzer-„Okay“ automatisch die nächste Datei im vereinbarten Ausgabeformat liefern
- erst nach der tatsächlich letzten Datei beziehungsweise dem letzten Arbeitsschritt feststellen, dass die Arbeitseinheit abgeschlossen ist

Eine Rückfrage ist nur erforderlich, wenn eine **neue fachliche, architektonische, sicherheitsrelevante oder koordinative Entscheidung** getroffen werden muss.

Routineprüfungen, Dateivergleiche, Syntaxprüfungen, Konsistenzprüfungen und andere bereits definierte Arbeitsschritte sind selbstständig durchzuführen.

—

# 34. Keine redundanten Hinweise zum Zugriffsstatus

Der bekannte Zugriffs- und Arbeitsstatus von ChatGPT im Projekt ist als bereits geklärt zu behandeln.

Insbesondere darf der AI-Agent bzw. ChatGPT nicht bei jedem Arbeitsschritt erneut darauf hinweisen, dass:

- keine direkten Repository-Schreibrechte vorhanden sind
- Änderungen nicht direkt durch ChatGPT geschrieben werden können
- ein Schreibversuch mit `403` abgelehnt werden könnte
- der Benutzer Änderungen über Working Copy oder Terminal durchführen muss

Diese Information ist Bestandteil des vereinbarten Projektworkflows und muss nicht wiederholt werden.

Wenn eine Datei geändert werden muss, ist unmittelbar die vereinbarte vollständige Datei im festgelegten Ausgabeformat bereitzustellen.

Wenn eine Prüfung, Diagnose oder Analyse ohne Repository-Änderung möglich ist, soll sie ohne weitere Hinweise zum Zugriffsstatus selbstständig durchgeführt werden.

Der Benutzer erwartet bei bekannten und bereits geklärten Rahmenbedingungen keine wiederholten Status- oder Berechtigungserklärungen.

—

# Ende des Index

`AI_AGENT_INDEX.md` ist ausschließlich ein Navigations-, Prioritäts- und Arbeitsworkflow-Dokument.

Die verbindlichen Projektregeln befinden sich in `RULES.md`.

Der verbindliche Workflow befindet sich in `WORKFLOW.md`.

Die Projektdefinition befindet sich in `PROJECT.md`.

Der aktuelle Projektstatus befindet sich ausschließlich in `STATE.md`.

Die technische Core-Zielarchitektur befindet sich in `CORE_TARGET_STRUCTURE.md`.