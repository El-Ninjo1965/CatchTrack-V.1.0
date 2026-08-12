# CatchTrack V1.0 Rules

## 1. Zweck

Diese Datei enthält die verbindlichen Regeln für die Zusammenarbeit und Entwicklung von CatchTrack V1.0.

Die Projektsteuerung besteht ausschließlich aus:

- `RULES.md`
- `WORKFLOW.md`
- `PROJECT.md`
- `STATE.md`

Keine weiteren Root-MD-Dateien werden für die Projektsteuerung benötigt.

—

## 2. Verbindliche Quellen

Die vier Dateien haben klar getrennte Aufgaben:

| Datei | Aufgabe |
|—|—|
| `RULES.md` | Verbindliche Regeln |
| `WORKFLOW.md` | Verbindlicher Arbeitsablauf |
| `PROJECT.md` | Projektziel und Architektur |
| `STATE.md` | Einziger aktueller Arbeitsstand |

Nur `STATE.md` darf einen aktuellen oder nächsten Arbeitsschritt definieren.

`RULES.md`, `WORKFLOW.md` und `PROJECT.md` dürfen keinen eigenen Arbeitscursor, Fortsetzungsschlüssel oder nächsten Arbeitsschritt enthalten.

—

## 3. Repository als Referenz

`origin/main` ist die Referenz für den aktuellen Repository-Stand.

Vor jeder Änderung oder Erstellung einer Datei:

1. Repository-Stand prüfen.
2. Vorhandene Datei prüfen.
3. Vollständigen aktuellen Inhalt lesen.
4. Abhängigkeiten und Auswirkungen prüfen.
5. Erst danach eine Änderung vornehmen.

Eine Datei darf nicht aus einer alten Version, einer Vermutung oder aus dem Gedächtnis neu erstellt werden, wenn eine aktuelle Repository-Version vorhanden ist.

—

## 4. Keine unnötigen Dateien

Vor jeder Neuerstellung ist zu prüfen, ob bereits eine geeignete Datei existiert.

Grundsatz:

```text
VORHANDENE DATEI
→ VERWENDEN / ANPASSEN

KEINE GEEIGNETE DATEI
→ NEUE DATEI NUR BEI ECHTER NOTWENDIGKEIT
```

Keine:

- doppelten Dateien
- parallelen Steuerungsdateien
- unnötigen Hilfsdateien
- Ersatzdateien mit gleicher Aufgabe
- Wiederherstellung bewusst gelöschter Dateien

—

## 5. Arbeitsweise

Der AI-Agent arbeitet nach den festgelegten Regeln selbstständig.

Routineprüfungen, Einlesungen, Vergleiche und technische Prüfungen werden ohne zusätzliche Bestätigung durchgeführt.

Der Benutzer muss nicht für jeden Prüfungsschritt ein `OK` geben.

Nur bei einer echten fachlichen oder architektonischen Entscheidung mit mehreren wesentlichen Alternativen ist eine Rückfrage erforderlich.

—

## 6. OK-Regel

`OK` bedeutet:

- gelesen
- verstanden
- bestätigt
- vorhandene Vorschläge bestätigt
- aktueller Arbeitsschritt abgeschlossen

Danach wird automatisch der nächste offene Arbeitsschritt aus `STATE.md` bestimmt.

`OK` bedeutet ausdrücklich nicht:

- dieselbe Datei erneut ausgeben
- denselben Arbeitsschritt wiederholen
- eine bereits getroffene Entscheidung erneut abfragen
- den Arbeitsstand zurücksetzen

—

## 7. Loop-Schutz

Vor jeder Fortsetzung muss der tatsächliche Zustand geprüft werden:

```text
LETZTER ABGESCHLOSSENER SCHRITT
↓
AKTUELLER ARBEITSSCHRITT
↓
NÄCHSTER ARBEITSSCHRITT
```

Ein bereits abgeschlossener Schritt darf nicht erneut als aktueller oder nächster Schritt ausgewählt werden.

Es darf nur einen einzigen aktiven Arbeitscursor geben.

Dieser befindet sich ausschließlich in `STATE.md`.

—

## 8. Änderungen

Änderungen werden so klein wie möglich gehalten.

Grundsätze:

- nur erforderliche Dateien ändern
- keine unnötigen Nebenänderungen
- bestehende Strukturen bevorzugen
- keine veralteten oder widersprüchlichen Inhalte behalten
- keine parallelen Lösungen für dieselbe Aufgabe erstellen

—

## 9. Vollständige Dateien

Bei einer Dateiänderung wird immer die vollständige aktuelle Datei erzeugt.

Keine:

- Patches
- Teilstücke
- Auslassungen
- Fortsetzungsschlüssel
- fragmentierten Dateien

—

## 10. Dateiausgabe

Wenn eine Datei manuell an den Benutzer ausgegeben wird, erfolgt dies immer in genau drei getrennten Copyblöcken:

1. vollständiger Repository-Pfad
2. exakter Dateiname
3. vollständiger Quellcode

Der dritte Block enthält ausschließlich den Quellcode.

Der Dateiname darf nicht zusätzlich in der ersten Zeile des Quellcodeblocks stehen.

Wenn der Quellcode selbst Markdown-Codeblöcke enthält, muss der äußere Copyblock eine entsprechend höhere Backtick-Anzahl verwenden.

Der Quellcodeblock muss vollständig kopierbar sein und darf niemals durch verschachtelte Markdown-Blöcke zerstört werden.

—

## 11. Core

Der Core enthält ausschließlich generische Infrastruktur.

Fachliche Funktionen gehören in Module.

Grundsatz:

```text
INFRASTRUKTUR
→ CORE

FACHFUNKTION
→ MODUL
```

Der Core darf nicht für ein einzelnes Modul angepasst werden.

Ein Modul darf keine Änderung bestehender Core-Dateien voraussetzen, ohne dass zuvor die Architektur geprüft wurde.

—

## 12. Module

Module sind fachlich eigenständig.

Sie verwenden definierte Core-Schnittstellen.

Module dürfen nicht auf private Implementierungsdetails anderer Module zugreifen.

Neue Fachfunktionen werden grundsätzlich als Module umgesetzt.

—

## 13. Core-Freeze

Der Core v1.0.0 ist eingefroren.

Der Core wird nicht für neue Funktionen verändert.

Core-Änderungen sind nur zulässig bei:

- nachgewiesenem Fehler
- zwingender technischer Korrektur
- Sicherheitskorrektur

Neue Funktionalität wird als Modul entwickelt.

User und Admin sind eigenständige Module.

Module dürfen den Core verwenden, dürfen ihn aber nicht eigenmächtig verändern.

Der Core bleibt nach dem Freeze grundsätzlich Read-Only.

—

## 14. Keine Fake-Funktionen

Nicht implementierte oder nicht geprüfte Funktionen werden nicht als fertig bezeichnet.

Statusangaben müssen dem tatsächlichen Zustand entsprechen.

—

## 15. Validierung

Vor dem Abschluss eines Arbeitsschrittes müssen die relevanten Ergebnisse geprüft werden.

Mindestens:

- betroffene Dateien korrekt
- keine unbeabsichtigten Änderungen
- Architektur eingehalten
- Tests bzw. geeignete Validierung durchgeführt
- Repository-Zustand nachvollziehbar

—

## 16. Working Copy

Working Copy auf dem iPad ist die manuelle Git-Arbeitsumgebung des Benutzers.

Der Benutzer übernimmt dort die vollständigen Dateien, prüft sie, committed sie und synchronisiert sie mit GitHub.

Der bekannte fehlende direkte GitHub-Schreibzugriff des AI-Agenten wird nicht bei jedem Arbeitsschritt erneut erwähnt.

—

## 17. Git

Relevante Änderungen werden nachvollziehbar committed.

Nach einem relevanten Commit wird geprüft, ob der Repository-Stand mit `origin/main` synchronisiert ist.

—

## 18. Freeze der Projektsteuerung

Nach vollständiger Konsolidierung müssen die vier Steuerungsdateien:

- widerspruchsfrei
- vollständig
- minimal
- eindeutig
- geprüft

sein.

Danach werden sie gemeinsam eingefroren.

Eine spätere Änderung erfolgt nur bei einer tatsächlichen Änderung der Regeln, des Workflows, der Projektarchitektur oder des Projektzustands.