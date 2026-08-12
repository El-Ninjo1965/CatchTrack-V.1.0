# CatchTrack V1.0 Workflow

## 1. Zweck

Dieser Workflow definiert den verbindlichen Ablauf für Entwicklungs- und Änderungsarbeiten.

Der Workflow verhindert:

- doppelte Dateien
- unnötige Änderungen
- Arbeiten auf veralteten Versionen
- widersprüchliche Arbeitsstände
- Wiederholungen
- Endlosschleifen

—

## 2. Verbindlicher Ablauf

Jeder Arbeitsschritt folgt diesem Ablauf:

```text
RULES BERÜCKSICHTIGEN
↓
STATE LESEN
↓
REPOSITORY-STAND PRÜFEN
↓
BETROFFENE DATEIEN PRÜFEN
↓
ABHÄNGIGKEITEN PRÜFEN
↓
ZIEL MIT IST-STAND VERGLEICHEN
↓
MINIMALE GÜLTIGE ÄNDERUNG BESTIMMEN
↓
UMSETZEN
↓
VALIDIEREN
↓
STATE AKTUALISIEREN
↓
DIFF PRÜFEN
↓
COMMIT
↓
REMOTE SYNCHRONISIEREN
↓
STATE ERNEUT PRÜFEN
↓
NÄCHSTEN SCHRITT BESTIMMEN
```

—

## 3. Beginn eines Arbeitsschrittes

Vor jeder Änderung:

1. `STATE.md` vollständig lesen.
2. Aktuellen Arbeitsschritt feststellen.
3. `origin/main` prüfen.
4. Betroffene Datei auf `origin/main` prüfen.
5. Datei vollständig lesen.
6. Abhängigkeiten prüfen.
7. Ziel und vorhandenen Stand vergleichen.

Erst danach wird entschieden, ob eine Änderung erforderlich ist.

—

## 4. Vorhandene Dateien

Wenn eine benötigte Datei bereits existiert:

```text
VORHANDEN
→ VOLLSTÄNDIG LESEN
→ BEWERTEN
→ NUR BEI BEDARF ÄNDERN
```

Wenn sie bereits korrekt ist:

```text
NICHT ÄNDERN
→ SCHRITT ALS ERLEDIGT BETRACHTEN
→ STATE PRÜFEN
→ NÄCHSTEN SCHRITT
```

Eine bereits korrekte Datei wird nicht erneut erzeugt oder als neue Datei ausgegeben.

—

## 5. Neue Dateien

Eine neue Datei darf nur erstellt werden, wenn:

- keine geeignete vorhandene Datei existiert
- die Datei architektonisch notwendig ist
- ihre Aufgabe nicht bereits durch eine bestehende Datei erfüllt wird

Vorher ist eine Repository-Prüfung verpflichtend.

—

## 6. Änderungen

Es werden nur Dateien geändert, die für den aktuellen Arbeitsschritt erforderlich sind.

Keine:

- unnötigen Nebenänderungen
- kosmetischen Änderungen ohne Zweck
- parallelen Implementierungen
- Wiederherstellung gelöschter Dateien
- zusätzlichen Dokumentationsdateien

—

## 7. STATE als Arbeitscursor

`STATE.md` ist die einzige Quelle für den aktuellen Arbeitsfortschritt.

Es gibt genau:

- einen aktuellen Arbeitsschritt
- einen nächsten Arbeitsschritt

Andere Dateien dürfen keinen konkurrierenden Arbeitscursor definieren.

Der Arbeitsablauf darf nicht anhand historischer Dokumente rekonstruiert werden, wenn `STATE.md` den aktuellen Zustand eindeutig enthält.

—

## 8. OK und Fortsetzung

Wenn der Benutzer `OK` sagt:

```text
AKTUELLEN SCHRITT ABSCHLIESSEN
↓
STATE PRÜFEN
↓
NÄCHSTEN OFFENEN SCHRITT BESTIMMEN
```

Danach wird unmittelbar mit dem nächsten erforderlichen Schritt fortgefahren.

Eine bereits abgeschlossene Datei wird nicht erneut ausgegeben.

—

## 9. Loop-Schutz

Vor der Auswahl des nächsten Arbeitsschrittes muss geprüft werden:

```text
IST DIESER SCHRITT BEREITS ABGESCHLOSSEN?
→ JA: NICHT ERNEUT AUSFÜHREN

IST DIESE DATEI BEREITS KORREKT?
→ JA: NICHT ERNEUT ERSTELLEN

IST DIESER SCHRITT DER IN STATE DEFINIERTE NÄCHSTE SCHRITT?
→ NEIN: NICHT AUSFÜHREN
```

Bei widersprüchlichen Zuständen wird zuerst `STATE.md` korrigiert.

Es wird nicht durch parallele Dokumente improvisiert.

—

## 10. Umsetzung

Änderungen werden vollständig umgesetzt.

Bei einer Dateiänderung wird die komplette Datei ersetzt bzw. erstellt.

Patches oder Teilstücke werden nicht als Endergebnis verwendet.

—

## 11. Validierung

Nach der Umsetzung:

1. betroffene Datei prüfen
2. Syntax bzw. Format prüfen
3. relevante Tests durchführen
4. Architektur prüfen
5. `git diff` prüfen
6. sicherstellen, dass keine unbeabsichtigten Dateien verändert wurden

Bei Fehler:

```text
FEHLER
↓
URSACHE ANALYSIEREN
↓
KORRIGIEREN
↓
ERNEUT VALIDIEREN
```

—

## 12. STATE-Aktualisierung

Nach erfolgreicher Validierung wird `STATE.md` so aktualisiert, dass es den tatsächlichen Zustand beschreibt.

Dabei dürfen keine parallelen nächsten Schritte eingetragen werden.

—

## 13. Commit

Ein abgeschlossener relevanter Arbeitsschritt wird committed.

Vor dem Commit:

```text
git diff
→ DATEIEN PRÜFEN
→ UNBEABSICHTIGTE ÄNDERUNGEN AUSSCHLIESSEN
```

Nach dem Commit:

```text
REMOTE PRÜFEN
→ ORIGIN/MAIN SYNCHRONISIEREN
→ FINALEN STAND PRÜFEN
```

—

## 14. Repository-Synchronisation

Ein Arbeitsschritt gilt erst als vollständig abgeschlossen, wenn der vorgesehene Stand auf `origin/main` vorhanden ist.

Danach wird geprüft:

```text
LOCAL HEAD == origin/main
```

Wenn nicht identisch:

```text
NICHT ALS ABGESCHLOSSEN BETRACHTEN
```

—

## 15. Core und Module

Vor jeder funktionalen Änderung:

```text
INFRASTRUKTUR?
→ CORE

FACHFUNKTION?
→ MODUL
```

Der Core bleibt generisch.

Module verwenden definierte Core-Schnittstellen.

Ein Modul darf nicht einfach eine bestehende Core-Datei verändern.

—

## 16. Core-Entwicklung

Der Core befindet sich derzeit im Entwicklungszustand.

Die Core-Arbeit erfolgt grundsätzlich:

```text
INVENTUR
↓
ANALYSE
↓
BEREINIGUNG
↓
IMPLEMENTIERUNG
↓
VALIDIERUNG
↓
TEST
↓
ABNAHME
↓
FREEZE
```

Erst danach beginnt die normale modulare Erweiterung auf Basis des eingefrorenen Core.

—

## 17. Tests

Tests erfolgen in sinnvollen Zwischenstufen.

Grundsatz:

```text
IMPLEMENTIEREN
→ TESTEN
→ BEWERTEN
→ KORRIGIEREN
→ ERNEUT TESTEN
```

Nicht bis zum Ende eines großen Entwicklungsblocks warten, wenn vorher bereits sinnvoll getestet werden kann.

—

## 18. Dateiausgabe an den Benutzer

Wenn eine Datei ausgegeben werden muss, erfolgt dies immer in drei getrennten Copyblöcken:

1. Repository-Pfad
2. exakter Dateiname
3. vollständiger Quellcode

Der Quellcodeblock enthält keinen zusätzlichen Dateinamen und keine Erläuterungen.

Enthält der Quellcode eigene Markdown-Codeblöcke, wird für den äußeren Copyblock eine höhere Backtick-Ebene verwendet.

Der vollständige Dateiinhalt muss in einem einzigen Copyblock kopierbar sein.

—

## 19. Abschluss

Ein Arbeitsschritt ist abgeschlossen, wenn:

- die erforderliche Änderung vollständig umgesetzt wurde
- die Validierung erfolgreich war
- keine unbeabsichtigten Änderungen vorhanden sind
- `STATE.md` den tatsächlichen Zustand wiedergibt
- der Commit erstellt wurde
- der vorgesehene Stand synchronisiert wurde

Danach darf der Schritt nicht erneut als offen behandelt werden.

—

## 20. Projektsteuerung

Die Projektsteuerung besteht ausschließlich aus:

```text
RULES.md
WORKFLOW.md
PROJECT.md
STATE.md
```

Keine weitere Root-MD-Datei wird für diesen Zweck erstellt.

`PROJECT.md` beschreibt das Projekt.

`RULES.md` beschreibt die Regeln.

`WORKFLOW.md` beschreibt den Ablauf.

`STATE.md` beschreibt den aktuellen Zustand.

Diese Zuständigkeiten dürfen nicht vermischt werden.

—