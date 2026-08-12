# CatchTrack V1.0 – Development Workflow

## 1. Zweck

Dieser Workflow definiert den verbindlichen Entwicklungsablauf für CatchTrack V1.0.

Ziele:

- klare Trennung von Core und Modulen
- keine unnötigen Core-Änderungen
- keine doppelten oder parallelen Implementierungen
- nachvollziehbare Entwicklung
- minimale manuelle Eingriffe des Benutzers
- reproduzierbare und versionierte Arbeitsschritte
- möglichst autonomer Arbeitsablauf
- keine unnötigen Wiederholungen

—

## 2. Grundprinzip

Der Benutzer definiert:

- Ziel
- gewünschtes Ergebnis
- besondere Anforderungen

Der AI-Agent bestimmt den technisch sinnvollen Weg dorthin selbstständig.

Grundablauf:

```text
ZIEL
→ RULES LESEN
→ ARBEITSSTAND BESTIMMEN
→ GITHUB MAIN PRÜFEN
→ DATEI PRÜFEN
→ ENTSCHEIDEN
→ UMSETZEN
→ TESTEN
→ KORRIGIEREN
→ DOKUMENTIEREN
→ COMMIT
→ NÄCHSTEN SCHRITT BESTIMMEN
```

Routineprüfungen, Einlesungen und technische Entscheidungen benötigen keine zusätzliche Benutzerbestätigung.

—

## 3. Regeln vor jeder Arbeit

Vor jedem neuen Arbeitsschritt werden die aktuellen Projektregeln berücksichtigt.

Insbesondere:

- RULES.md
- WORKFLOW.md
- aktueller Arbeitszustand
- Projektchronik
- relevante weitere Masterdateien

Die Regeln werden nicht nur beim Start eines Entwicklungsblocks berücksichtigt, sondern vor jedem neuen Arbeitsschritt.

—

## 4. GitHub als Referenz

GitHub `main` ist die verbindliche Referenz für den Repository-Stand.

Vor jeder Änderung oder Erstellung einer Datei:

```text
GITHUB MAIN PRÜFEN
→ DATEI VORHANDEN?
→ VORHANDENE VERSION VOLLSTÄNDIG LESEN
→ AKTUELLEN INHALT BEWERTEN
→ ZIEL ABGLEICHEN
```

Eine vorhandene Datei wird niemals aus dem Gedächtnis neu erzeugt.

Wenn die vorhandene Datei bereits dem gewünschten Ziel entspricht:

```text
NICHT ERNEUT AUSGEBEN
→ NÄCHSTEN OFFENEN SCHRITT BESTIMMEN
```

Wenn sie angepasst werden muss:

```text
AKTUELLE GITHUB-VERSION
→ ÄNDERUNG
→ VOLLSTÄNDIGE NEUAUSGABE
```

Wenn sie nicht vorhanden ist:

```text
NEUE DATEI ERSTELLEN
```

—

## 5. Keine unnötigen Dateien

Vor jeder Neuerstellung wird geprüft, ob bereits eine Datei mit derselben oder einer vergleichbaren Aufgabe existiert.

Keine:

- doppelten Dateien
- parallelen Masterdateien
- unnötigen Hilfsdateien
- Ersatzdateien mit identischer Aufgabe

Eine bestehende Datei wird bevorzugt angepasst oder vollständig ersetzt.

—

## 6. Autonomer Arbeitsmodus

Der AI-Agent arbeitet nach Vorgabe des Benutzers selbstständig weiter.

Der AI-Agent:

1. liest relevante Regeln
2. bestimmt den aktuellen Arbeitsstand
3. prüft GitHub
4. liest vorhandene Dateien
5. prüft Abhängigkeiten
6. prüft die Arbeitsreihenfolge
7. trifft technische Entscheidungen
8. setzt eindeutige Anforderungen direkt um
9. testet an sinnvollen Zwischenpunkten
10. dokumentiert relevante Ergebnisse
11. bestimmt den nächsten offenen Arbeitsschritt

Unnötige Zwischenfragen werden vermieden.

—

## 7. OK-Regel

`OK` bedeutet:

- gelesen
- verstanden
- bestätigt
- vorhandene Vorschläge bestätigt
- aktueller Arbeitsschritt abgeschlossen

Danach:

```text
OK
→ AKTUELLEN STATUS BESTIMMEN
→ LETZTEN SCHRITT ALS ERLEDIGT BEHANDELN
→ NÄCHSTEN OFFENEN SCHRITT BESTIMMEN
→ RULES BERÜCKSICHTIGEN
→ GITHUB PRÜFEN
→ DATEI PRÜFEN
→ NÄCHSTE ERFORDERLICHE DATEI AUSGEBEN
```

`OK` bedeutet ausdrücklich nicht:

- dieselbe Datei erneut ausgeben
- denselben Arbeitsschritt wiederholen
- erneut nach einer bereits beantworteten Entscheidung fragen

Nach `OK` wird unmittelbar mit dem nächsten offenen Arbeitsschritt fortgefahren.

—

## 8. Arbeitszustand und Loop-Schutz

Vor jeder nächsten Dateiausgabe muss festgestellt werden:

- letzter abgeschlossener Schritt
- aktuell offener Schritt
- bereits ausgegebene Datei
- bereits bestätigte Datei
- nächste erforderliche Datei

Eine Datei, die gerade bestätigt und abgeschlossen wurde, darf nicht erneut als nächste Datei ausgegeben werden.

Der Workflow darf nicht in einen Wiederholungsloop geraten.

—

## 9. Erklärungen

Der Workflow ist auf minimale Kommunikation ausgelegt.

Grundsätzlich werden nur ausgegeben:

- Ergebnis
- notwendige Hinweise
- notwendige Entscheidungen
- nächste Datei bzw. nächster Arbeitsschritt

Keine langen technischen Erklärungen, sofern diese nicht ausdrücklich verlangt werden.

—

## 10. Entwicklungsphasen

CatchTrack wird grundsätzlich in dieser Reihenfolge entwickelt:

### Phase 1
Architektur und Dokumentation

### Phase 2
Repository-Inventur

### Phase 3
Core-Inventur

### Phase 4
Core-Bereinigung

### Phase 5
Core-Implementierung

### Phase 6
Core-Validierung

### Phase 7
Core-Abnahme

### Phase 8
Core-Freeze

### Phase 9
Module-System

### Phase 10
User / Admin

### Phase 11
Fachmodule

### Phase 12
UI-Integration

### Phase 13
Gesamttest

### Phase 14
Release-Abnahme

Die Reihenfolge darf nur bei einer begründeten Architekturentscheidung geändert werden.

—

## 11. Aktuelle Dokumentationsphase

Derzeit werden die bestehenden MD-Dateien einmalig konsolidiert.

Alle relevanten Dokumentationsdateien sind weiterhin offen.

Nach Abschluss:

```text
DOCUMENTATION-SYNC
→ DOCUMENTATION-FREEZE
→ CORE-INVENTORY-DEEP-DIVE
```

Es werden dabei keine unnötigen neuen Dokumentationsdateien erstellt.

—

## 12. Core

Der Core stellt ausschließlich generische Infrastruktur bereit.

Mindestens:

- Startup
- Runtime
- Lifecycle
- Event System
- State
- Storage
- Database
- Error Handling
- Logging
- Module Interface
- Module Registry
- Module Manager
- Permissions
- Package / Entitlements
- System Configuration

Fachliche Funktionen gehören nicht in den Core.

Der Core darf keine konkreten Fachmodule kennen oder benötigen.

—

## 13. Core Freeze

Der Core ist derzeit nicht eingefroren.

Vor dem Freeze:

```text
REPOSITORY-INVENTUR
→ CORE-INVENTUR
→ BEREINIGUNG
→ IMPLEMENTIERUNG
→ VALIDIERUNG
→ TESTS
→ ABNAHME
→ FREEZE-ENTSCHEIDUNG
```

Nach dem Freeze gilt:

```text
/Core/*
```

grundsätzlich als Read-Only.

Neue Fachfunktionen dürfen danach keine Core-Änderung benötigen.

—

## 14. Änderungsprinzip

Vor jeder Änderung:

```text
INFRASTRUKTUR?
→ CORE

FACHFUNKTION?
→ MODUL
```

Fachfunktionen dürfen den Core nicht verändern.

Vorhandene Dateien werden im Rahmen der Inventur klassifiziert:

- A – NEU
- B – LÖSCHEN
- C – VOLLSTÄNDIG ERSETZEN
- D – UNVERÄNDERT ÜBERNEHMEN

—

## 15. Module

Module werden unabhängig vom Core entwickelt und getestet.

Der Module Manager unterstützt konzeptionell:

- install
- uninstall
- enable
- disable
- update
- status
- registry
- dependencies

Ein Modul darf keine direkte Änderung bestehender Core-Dateien benötigen.

Wenn ein Modul eine Core-Änderung benötigt, wird zuerst die Architektur geprüft.

—

## 16. Modulunabhängigkeit

Module dürfen nicht unnötig voneinander abhängig sein.

Direkte Abhängigkeiten werden ausdrücklich definiert.

Ein Modul darf keine privaten Implementierungsdetails eines anderen Moduls verwenden.

—

## 17. Datenbank

Module dürfen eigene Datenstrukturen besitzen.

Die generische Datenbankinfrastruktur enthält keine unnötige Fachlogik einzelner Module.

—

## 18. User und Admin

User und Admin sind Module.

Sie gehören nicht zur fachlichen Core-Logik.

—

## 19. Rollen und Berechtigungen

Berechtigungen werden zentral und konsistent behandelt.

Berechtigungen ergeben sich aus Rollen und/oder Paket-/Entitlement-Regeln.

Nicht zugängliche Funktionen werden nicht als verfügbar dargestellt.

—

## 20. Keine Fake-Funktionen

Nicht implementierte oder nicht getestete Funktionen werden nicht als fertig dargestellt.

Eine Funktion darf nur als:

- fertig
- implementiert
- getestet
- abgenommen
- stabil
- eingefroren

bezeichnet werden, wenn dies tatsächlich festgestellt wurde.

—

## 21. Startup

CatchTrack besitzt keinen unnötigen Parallelbetrieb mehrerer konkurrierender Startup-/Runtime-Systeme.

Der endgültige Startablauf muss eindeutig definiert sein.

Der Core darf keine konkrete Fachmodulliste für seinen Start benötigen.

—

## 22. Testprinzip

Entwicklung erfolgt in kurzen, überprüfbaren Abschnitten.

Nach einer sinnvollen funktionsfähigen Zwischenstufe:

```text
IMPLEMENTIEREN
→ TESTEN
→ ERGEBNIS BEWERTEN
```

Bei Fehler:

```text
FEHLER
→ ANALYSIEREN
→ KORRIGIEREN
→ ERNEUT TESTEN
```

Bei Erfolg:

```text
BESTANDEN
→ DOKUMENTIEREN
→ NÄCHSTER SCHRITT
```

Der Benutzer soll frühzeitig testen können.

—

## 23. Terminal-Arbeiten

Terminal-Prüfungen werden so durchgeführt, dass relevante vollständige Ergebnisse versionierbar bleiben.

Für umfangreiche Prüfungen kann eine technische Arbeitsdatei im Repository-Root verwendet werden.

Beispiel:

```text
{ command1; command2; command3; } > terminal.md 2>&1
```

Eine solche Arbeitsdatei ist keine Projektdokumentation.

Relevante Ergebnisse werden anschließend in DEV_LOG oder Chronik dokumentiert.

—

## 24. Git und Working Copy

Working Copy auf dem iPad ist die manuelle Git-Arbeitsumgebung des Benutzers.

Dort werden vollständige Dateien übernommen, geprüft, committed und synchronisiert.

Der Benutzer arbeitet nicht mit dem Terminal.

Der bekannte fehlende direkte GitHub-Schreibzugriff wird nicht bei jedem Arbeitsschritt erneut erwähnt.

—

## 25. Commit-Prinzip

Ein relevanter Arbeitsschritt gilt erst als abgeschlossen, wenn die betreffenden Dateien versioniert wurden.

Nach Möglichkeit werden dokumentiert:

- Commit-ID
- Commit-Nachricht
- Datum
- Uhrzeit
- betroffene Dateipfade
- Arbeitsschritt
- Ergebnis

—

## 26. DEV_LOG

`DEV_LOG.md` dokumentiert technische Entwicklungsarbeit.

Mindestens:

```text
Datum/Uhrzeit
→ Aktion
→ Arbeitsschritt / Befehl
→ Ergebnis
→ Commit
→ betroffene Pfade
```

DEV_LOG ersetzt nicht die Projektchronik.

—

## 27. Projektchronik

Die Projektchronik dokumentiert:

- relevante Entscheidungen
- abgeschlossene Meilensteine
- wichtige Fehler und Lösungen
- Statusänderungen
- aktuellen Fortsetzungspunkt

Sie wird nicht mit unnötigen technischen Details überladen.

—

## 28. Fortsetzungspunkt

Am Ende der laufenden Chronik wird ein Fortsetzungspunkt geführt.

Er enthält:

- aktuellen Arbeitsstand
- letzten abgeschlossenen Schritt
- nächsten Arbeitsschritt
- kurzen Fortsetzungsschlüssel

Dadurch kann eine spätere Sitzung ohne unnötige Wiederholung fortgesetzt werden.

—

## 29. Dateiausgabe

Bei der manuellen Ausgabe einer Datei gelten immer genau drei Copyblöcke.

### Copyblock 1

Nur der vollständige Repository-Pfad.

### Copyblock 2

Nur der exakte Dateiname.

### Copyblock 3

Der vollständige Dateiinhalt.

Der Dateiname steht nicht im dritten Copyblock.

Keine Patches.

Keine Teilstücke.

Keine Auslassungen.

Keine zusätzlichen Kommentare innerhalb des Quelltext-Copyblocks.

Der vollständige Dateiinhalt muss mit einer einzigen Kopieraktion übernommen werden können.

Enthält der Dateiinhalt selbst Markdown-Codeblöcke, muss der äußere Copyblock entsprechend höher begrenzt werden.

Der Quelltext-Copyblock darf niemals durch verschachtelte Markdown-Blöcke zerstört werden.

—

## 30. Abschlussregel

Ein Arbeitsschritt ist abgeschlossen, wenn:

1. die erforderlichen Dateien vollständig erstellt oder ersetzt wurden
2. bekannte Fehler behoben wurden
3. der vorgesehene Test erfolgreich durchgeführt wurde
4. Abhängigkeiten geprüft wurden
5. relevante Dokumentation aktualisiert wurde
6. die Änderungen versioniert wurden

—

## 31. Grundprinzip

```text
ARCHITEKTUR
↓
DOKUMENTATION
↓
REPOSITORY-INVENTUR
↓
CORE-INVENTUR
↓
CORE-BEREINIGUNG
↓
CORE-IMPLEMENTIERUNG
↓
VALIDIERUNG
↓
CORE-FREEZE
↓
MODULE
↓
ERWEITERUNG
```

Nicht:

```text
MODUL
→ CORE ÄNDERN
→ NEUES MODUL
→ CORE ERNEUT ÄNDERN
→ NEUE CORE-DATEI
```

—

## 32. Aktueller Fortsetzungsschlüssel

`DOCUMENTATION-SYNC`

Nach Abschluss der Dokumentationskonsolidierung:

`DOCUMENTATION-FREEZE`

Danach:

`CORE-INVENTORY-DEEP-DIVE`