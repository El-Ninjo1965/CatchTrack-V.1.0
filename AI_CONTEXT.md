# CatchTrack – AI Context

## Zweck

Diese Datei ist der zentrale Einstiegspunkt für ChatGPT/AI zur
Wiederaufnahme der CatchTrack-Entwicklung.

Wenn der Benutzer sagt:

„AI einlesen“

oder

„Lies die AI-Datei ein“

sollen zunächst diese Datei und anschließend alle darin
aufgeführten Referenzdateien eingelesen werden.

—

## 1. Verbindliche Projektregeln

Zuerst einlesen:

- `PROJECT_RULES.md`

Diese Datei definiert die verbindlichen Arbeitsregeln.

—

## 2. Aktueller Projektwissensstand

Einlesen:

- `PROJECT_KNOWLEDGE.md`

Diese Datei beschreibt den bisher bekannten Projektstand,
Entscheidungen, Architektur und Übergabepunkte.

—

## 3. Modul- und Arbeitsplan

Einlesen:

- `PROJECT_MODULE_PLAN.md`

Diese Datei enthält:

- Modulreihenfolge
- zu erstellende Dateien
- bereits bearbeitete Dateien
- offene Dateien
- Abhängigkeiten
- Altlasten
- geplante Löschungen
- Bearbeitungsstatus

—

## 4. Runtime- und Teststatus

Einlesen:

- `runtime/runtime_status.json`
- `runtime/error.log`

Diese Dateien zeigen den aktuellen Laufzeitstatus und bekannte
Fehler.

—

## 5. Projektstruktur

Die aktuelle GitHub-Projektstruktur prüfen.

Besonders beachten:

- `core/`
- `modules/`
- `config/`
- `database/`
- `runtime/`
- `libraries/`

Nicht nur die genannten Dateien verwenden, sondern die
tatsächliche GitHub-Struktur als Referenz betrachten.

—

## 6. GitHub-Referenz

Repository:

`El-Ninjo1965/CatchTrack-V.1.0`

Branch:

`main`

Bei jeder Wiederaufnahme zusätzlich prüfen:

1. aktuellen Branch-Stand
2. letzten relevanten Commit
3. Commit-Datum und Uhrzeit
4. Commit-Nachricht
5. geänderte Dateien
6. relevante Diff-Informationen

Die Commit-Historie dient als zusätzliche Fortschrittsreferenz.

—

## 7. Arbeitsreihenfolge bei Wiederaufnahme

Bei „AI einlesen“:

1. `AI_CONTEXT.md`
2. `PROJECT_RULES.md`
3. `PROJECT_KNOWLEDGE.md`
4. `PROJECT_MODULE_PLAN.md`
5. `runtime/runtime_status.json`
6. `runtime/error.log`
7. aktuelle GitHub-Projektstruktur
8. relevante aktuelle Dateien
9. relevante Commit-Historie

Danach den tatsächlichen Stand mit den Planungsdateien
abgleichen.

—

## 8. Dateiarbeit

Der Benutzer arbeitet über Working Copy.

Dateien werden vom Benutzer einzeln nach GitHub übertragen
und committed.

Bei Änderungen bestehender Dateien:

1. aktuelle Datei aus GitHub einlesen
2. Abhängigkeiten prüfen
3. Projektplan prüfen
4. vollständige Datei nach Möglichkeit ausgeben
5. Benutzer übernimmt die Datei über Working Copy
6. Benutzer erstellt den GitHub-Commit
7. anschließend GitHub-Stand und Commit prüfen

Keine Änderungen an GitHub durch ChatGPT voraussetzen.

—

## 9. Wichtig

Diese Datei ist ein Lesefahrplan.

Sie enthält keine:

- Passwörter
- Access Tokens
- SSH-Private-Keys
- sonstigen Zugangsdaten

Bei widersprüchlichen Informationen gilt:

tatsächliche GitHub-Datei
>
GitHub-Commit-Historie
>
Projektstatus
>
Projektplan
>
ältere Dokumentation

—

## 10. Aktueller Übergabepunkt

Das Basisskelett des Projekts steht.

Die nächste Hauptphase ist:

MODULE

Die Module werden chronologisch anhand von
`PROJECT_MODULE_PLAN.md` bearbeitet.

Vor Beginn eines neuen Moduls müssen dessen Abhängigkeiten
und vorhandene Altdateien geprüft werden.