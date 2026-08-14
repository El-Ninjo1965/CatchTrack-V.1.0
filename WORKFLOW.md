# Core Workflow

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

## 16. Neutralisierungs- und Start-Module-Änderung

Im Rahmen der Neutralisierung des generischen Application-Core wurden nur projektbezogene, nicht funktionale Hinweise im Core und in der Konfigurationsschicht auf allgemeine Bezeichnungen umgestellt. Die technische Funktionalität blieb unverändert, da die vorhandene Core-Architektur als funktional eingefrorener Stand dient und keine grundlegende Neuarchitektur eingeführt werden sollte.

### Ausgangszustand
- Workspace: /workspaces/CatchTrack-V.1.0
- GitHub-Ziel: https://github.com/El-Ninjo1965/CatchTrack-V.1.0.git
- Branch: main
- Frozen-Backup: /workspaces/CatchTrack-V.1.0/Archiv/CatchTrack-V1.0-Frozen-Backup.zip
- Alter lokaler Backup-Workspace: /workspaces/CatchTrack-V1.0-BACKUP

### Repository-Suche und Bewertung
Es wurden gezielt CatchTrack-spezifische Benennungen in den Core- und Konfigurationsdateien geprüft. Dabei wurden nur Hinweise neutralisiert, die als Produktname oder fachliche Einbindung interpretiert werden konnten. Technische API-Namen, globale Core-Objekte und Modulstrukturen wurden bewusst nicht verändert, weil sie die funktionale Core-Architektur bilden und als eingefroren gelten.

### Betroffene Dateien
- Core/core.js
- Core/core-config.js
- Core/core-context.js
- Core/core-storage.js
- Core/app.js
- Config/config-manager.js
- Database/database-manager.js
- Services/service-manager.js
- WORKFLOW.md

### Vorgenommene Änderungen
- Produktbezogene Bezeichnungen im Core und in den Konfigurations- und Datenbank-Standards wurden auf generische Namen umgestellt.
- Das Core-Interface blieb unverändert, damit keine Laufzeit- oder Modul-Integrität verloren geht.
- Der Start-Modul-Ordner wurde angelegt: Modules/start-module/
- Der Ordner wurde bewusst leer gelassen, wie vom Auftrag vorgesehen.
- Das historische Frozen-Backup-ZIP wurde nicht verändert, verschoben, gelöscht oder neu gepackt.
- Der alte lokale Backup-Workspace wurde entfernt, nachdem der aktive Workspace als die einzige Quelle der Wahrheit bestätigt wurde.

### Unveränderte Treffer und Begründung
- Globale technische Benennungen wie CatchTrackCore, CatchTrackModuleRegistry und ähnliche Symbole wurden nicht geändert, weil sie die bestehende Core-Architektur und Laufzeitstruktur definieren und eine Funktionserhaltung priorisiert wurde.
- Fachliche Modulfunktionen (GPS, Weather, User, Admin, i18n etc.) blieben unverändert, da sie außerhalb des neutralen Core-Standes liegen und nicht Gegenstand der Neutralisierung waren.
- Das Frozen-Backup-ZIP bleibt ein eingefrorener Referenzstand und wird nicht als aktive Projektdatei verändert.

### Validierung
- Repository-Stand und zugehöriges Git-Remote wurden geprüft.
- Die aktive Arbeitsumgebung wurde bestätigt.
- Die Core-Dateien wurden syntaktisch überprüft und die Änderungen wurden in den Workflow-Dokumentationsdaten vermerkt.
- Der Start-Modul-Ordner wurde als leerer Ausgangspunkt bestätigt.
- Das Frozen-Backup blieb unverändert.

### Finaler Zustand
- Neutraler Core-Stand erhalten.
- Start-Modul-Ordner vorhanden und leer.
- Historisches Backup nicht mehr als aktive Projektquelle genutzt.
- Einfrierung des ZIP-Backups erhalten.
- Arbeitsablauf in dieser Datei dokumentiert.


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

Der Core ist aktuell eingefroren.

Aktueller Status:

```text
CORE: FROZEN
MODULE DEVELOPMENT: ACTIVE
USER: DEVELOPMENT
ADMIN: DEVELOPMENT
OTHER MODULES: DEVELOPMENT
```

Die historische Core-Entwicklungsfolge bleibt dokumentarisch nachvollziehbar, aber der aktuelle Zustand ist kein Entwicklungslauf mehr, sondern ein eingefrorener Core mit aktiver Modulentwicklung darüber.

Historischer Verlauf (nur für Nachvollziehbarkeit):

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

## 17. Eingefrorene historische Worklogs

Nach Abschluss einer Projektphase kann deren Worklog eingefroren werden.

Ein eingefrorenes Worklog ist:

- lesbar
- historisch verbindlich
- nicht Teil des laufenden Arbeitsprozesses
- nicht zu verändern
- nicht zu ergänzen
- nicht umzustrukturieren

Für die abgeschlossene Core-Phase gilt:

`CORE_WORK_LOG.md = FROZEN / READ-ONLY`

Für die Modulphase gilt:

`MODULE_WORK_LOG.md = ACTIVE`

Die detaillierte technische Änderungshistorie bleibt Aufgabe von Git.

Das aktive Worklog dokumentiert abgeschlossene Arbeitseinheiten auf zusammengefasster Ebene.

Kleine Einzeländerungen müssen nicht einzeln protokolliert werden.

Eine Arbeitseinheit wird erst nach erfolgreicher:

`IMPLEMENTIERUNG → TEST → VALIDIERUNG → COMMIT → PUSH`

als abgeschlossen in das aktive Worklog aufgenommen.

---

## 18. Tests

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