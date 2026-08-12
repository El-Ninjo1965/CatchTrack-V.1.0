# CatchTrack V1.0 – Work State

## Zweck

Diese Datei hält den aktuellen Arbeitszustand des Projekts fest.

Sie verhindert, dass bereits abgeschlossene Arbeitsschritte nach einem `OK` erneut ausgegeben oder bearbeitet werden.

—

## Arbeitsprinzip

Ein Arbeitsschritt besitzt immer einen eindeutigen Zustand:

- OFFEN
- IN ARBEIT
- AUSGEGEBEN
- ERLEDIGT
- ÜBERSPRUNGEN

—

## OK-Regel

Wenn der Benutzer `OK` bestätigt:

1. Der zuletzt ausgegebene Arbeitsschritt wird als ERLEDIGT betrachtet.
2. Dieser Arbeitsschritt darf nicht erneut ausgegeben werden.
3. Der nächste OFFENE Arbeitsschritt wird bestimmt.
4. Die aktuellen Regeln werden berücksichtigt.
5. Der aktuelle GitHub-Stand wird geprüft.
6. Die betreffende Datei wird auf GitHub gesucht.
7. Falls vorhanden, wird sie vollständig eingelesen und bewertet.
8. Erst danach wird entschieden, ob sie aktualisiert, ersetzt oder unverändert übernommen wird.
9. Der nächste erforderliche Arbeitsschritt wird ohne zusätzliche Bestätigung ausgeführt.

`OK` bedeutet:

```text
AKTUELLEN SCHRITT ABSCHLIESSEN
→ STATUS AKTUALISIEREN
→ NÄCHSTEN OFFENEN SCHRITT BESTIMMEN
→ REGELN BERÜCKSICHTIGEN
→ GITHUB PRÜFEN
→ DATEI PRÜFEN
→ WEITERARBEITEN
```

—

## Arbeitsautonomie

Prüfungen, Einlesungen, Vergleiche und notwendige Entscheidungen werden selbstständig durchgeführt.

Der Benutzer muss keine zusätzlichen Freigaben für technische Prüfungen oder Routineentscheidungen geben.

Der Benutzer gibt das Ziel vor.

Der AI-Agent bestimmt den technisch sinnvollen Weg dorthin.

Nur bei einer echten fachlichen oder architektonischen Entscheidungsalternative, bei der unterschiedliche Lösungen wesentliche Auswirkungen haben, wird der Benutzer gefragt.

—

## Aktueller Arbeitsstand

Bereits bestätigt:

- DEV_LOG.md
- VISION.md
- PROJECT_MASTERLIST.md
- PROJECT_STATUS.md
- REPOSITORY_INVENTORY.md

Status:

**ERLEDIGT**

—

## Nächster offener Arbeitsschritt

Die verbleibenden relevanten Dokumentations-/Steuerungsdateien werden zunächst auf Konsistenz geprüft.

Danach erfolgt:

```text
DOCUMENTATION-FREEZE
→ CORE-INVENTORY-DEEP-DIVE
```

—

## Regel zur Dateiausgabe

Eine bereits als ERLEDIGT gekennzeichnete Datei darf nicht erneut als nächste Datei ausgegeben werden.

Vor jeder neuen Dateiausgabe muss geprüft werden:

- aktueller Arbeitsstatus
- letzter erledigter Schritt
- nächster offener Schritt
- Existenz der betreffenden Datei auf GitHub main
- aktueller Inhalt der Datei, falls vorhanden
- Abhängigkeiten zu bereits aktualisierten Dokumentationsdateien

—

## Dateiausgabeformat

Jede Datei wird vollständig und in genau drei separaten Copyblöcken ausgegeben:

1. vollständiger Pfad
2. exakter Dateiname
3. vollständiger Quelltext

Keine Patches.

Keine Teilstücke.

Keine Wiederholung bereits erledigter Dateien.

Keine zusätzlichen Informationen innerhalb des Quelltext-Copyblocks.

Der Quelltext-Copyblock muss vollständig geschlossen und direkt kopierbar sein.

—

## Dokumentationsstatus

Alle Dokumentationsdateien bleiben bis zum Abschluss der einmaligen Synchronisation:

**NICHT EINGEFROREN**

Nach erfolgreicher Konsistenzprüfung werden die relevanten Master-/Steuerungsdateien gemeinsam eingefroren.

—

## Repository-Referenz

GitHub `main` ist die verbindliche Repository-Referenz.

Vor jeder Dateiänderung oder Neuerstellung gilt:

```text
REGELN BERÜCKSICHTIGEN
→ GITHUB MAIN PRÜFEN
→ DATEI SUCHEN
→ DATEI VOLLSTÄNDIG LESEN
→ BESTAND BEWERTEN
→ ENTSCHEIDUNG TREFFEN
→ VOLLSTÄNDIGE DATEI AUSGEBEN
```

Eine Datei wird niemals allein aufgrund einer Erinnerung oder Vermutung neu erstellt.

—

## Fortsetzungsschlüssel

`DOCUMENTATION-SYNC`

Nach Abschluss:

`DOCUMENTATION-FREEZE`

Danach:

`CORE-INVENTORY-DEEP-DIVE`