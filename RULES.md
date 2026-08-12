# CatchTrack V1.0 – Project Rules

## 1. Verbindlichkeit

Diese Datei enthält die verbindlichen Projektregeln.

Die Regeln werden vor jeder Projektarbeit berücksichtigt.

Regeln werden nicht eigenmächtig abgeschwächt oder entfernt.

—

## 2. Aktueller Freeze-Status

Alle Projektdateien sind derzeit offen.

Das gilt ausdrücklich für:

- Dokumentationsdateien
- Core
- Module
- UI
- sonstige Projektdateien

Der Core ist **NICHT eingefroren**.

Ein Freeze erfolgt erst nach vollständiger Prüfung, Tests, Abnahme und ausdrücklicher Projektentscheidung.

—

## 3. Regeln vor jeder Arbeit

Vor jedem neuen Arbeitsschritt:

```text
RULES LESEN
→ AKTUELLEN ARBEITSSTAND BESTIMMEN
→ GITHUB MAIN PRÜFEN
→ DATEI / DATEIEN PRÜFEN
→ ZIEL UND ARCHITEKTUR ABGLEICHEN
→ ENTSCHEIDEN
→ UMSETZEN
```

Die Prüfung erfolgt selbstständig.

Der Benutzer muss dafür kein OK geben.

—

## 4. GitHub als Referenz

GitHub `main` ist die verbindliche Referenz für den Repository-Stand.

Vor jeder Erstellung oder Änderung einer Datei muss geprüft werden, ob diese Datei bereits vorhanden ist.

Wenn sie vorhanden ist:

- vollständige aktuelle Version einlesen
- Inhalt bewerten
- mit dem aktuellen Ziel vergleichen
- vorhandene Datei weiterverwenden, ändern oder vollständig ersetzen

Wenn die vorhandene Datei bereits dem Ziel entspricht:

- nicht erneut ausgeben
- direkt zum nächsten offenen Arbeitsschritt weitergehen

Neue Dateien werden nur erstellt, wenn keine geeignete vorhandene Datei existiert.

Es wird niemals aus Vermutungen, alten Versionen oder Erinnerungen gearbeitet, wenn eine aktuelle Repository-Version verfügbar ist.

—

## 5. Keine unnötigen Dateien

Vor jeder Neuerstellung:

```text
Existiert bereits eine geeignete Datei?
→ JA: vorhandene Datei verwenden
→ NEIN: neue Datei nur bei tatsächlicher Notwendigkeit erstellen
```

Keine:

- doppelten Dateien
- parallelen Masterdateien
- unnötigen Hilfsdateien
- Ersatzdateien mit gleicher Aufgabe

—

## 6. Autonomer Arbeitsmodus

Der Benutzer definiert Ziel und gewünschtes Ergebnis.

Der AI-Agent bestimmt den technisch sinnvollen Weg dorthin selbstständig.

Der AI-Agent führt selbstständig durch:

- Einlesen
- Prüfungen
- Vergleiche
- Abhängigkeitsprüfungen
- Repository-Prüfungen
- technische Entscheidungen
- Tests
- Dokumentation
- Vorbereitung des nächsten Arbeitsschritts

Zusätzliche Bestätigungen für Routineprüfungen sind nicht erforderlich.

Technische Entscheidungen werden nicht unnötig zur Bestätigung vorgelegt.

Nur bei einer echten fachlichen oder architektonischen Entscheidung mit mehreren wesentlichen Alternativen wird gefragt.

—

## 7. Erklärungen

Keine langen technischen Erklärungen.

Grundsätzlich ausgeben:

- Ergebnis
- notwendige Hinweise
- notwendige Entscheidung
- nächste Datei bzw. nächster Arbeitsschritt

Nicht erklären:

- bereits festgelegte Arbeitsregeln
- bereits bekannte technische Rahmenbedingungen
- unnötige Hintergrunddetails

Der Benutzer möchte das Ergebnis, nicht eine technische Lehrveranstaltung.

—

## 8. OK-Regel

`OK` bedeutet:

- gelesen
- verstanden
- bestätigt
- vorhandene Vorschläge bestätigt
- aktueller Arbeitsschritt abgeschlossen

Danach automatisch:

```text
OK
→ AKTUELLEN STATUS PRÜFEN
→ ERLEDIGTEN SCHRITT ABSCHLIESSEN
→ NÄCHSTEN OFFENEN SCHRITT BESTIMMEN
→ RULES BERÜCKSICHTIGEN
→ GITHUB PRÜFEN
→ DATEI PRÜFEN
→ NÄCHSTE DATEI AUSGEBEN
```

`OK` bedeutet ausdrücklich nicht:

- dieselbe Datei erneut ausgeben
- denselben Arbeitsschritt wiederholen
- erneut nach einer bereits beantworteten Entscheidung fragen

Ein bereits erledigter Schritt darf nicht erneut als nächster Schritt erscheinen.

—

## 9. Arbeitsfortschritt

Der aktuelle Arbeitszustand muss eindeutig bleiben.

Vor jeder nächsten Ausgabe ist zu bestimmen:

- letzter erledigter Schritt
- aktuell offener Schritt
- nächste erforderliche Datei
- bereits ausgegebene Datei
- bereits bestätigte Datei

Dadurch wird verhindert, dass der Workflow in einen Loop gerät.

—

## 10. Dateiausgabe

Jede Datei wird vollständig ausgegeben.

Immer genau drei getrennte Copyblöcke:

### Copyblock 1

Nur der vollständige Repository-Pfad.

### Copyblock 2

Nur der exakte Dateiname.

### Copyblock 3

Der vollständige Quelltext.

Keine:

- Patches
- Teilstücke
- Auslassungen
- fragmentierten Dateien
- zusätzlichen Dateinamen im Quelltextblock
- Fortsetzungsschlüssel innerhalb eines unvollständigen Blocks

Der dritte Copyblock muss vollständig und direkt kopierbar sein.

Wenn der Dateiinhalt selbst Markdown-Codeblöcke enthält, muss für den äußeren Copyblock eine höhere Markdown-Begrenzung verwendet werden.

Der Quelltext darf niemals durch verschachtelte Codeblöcke zerstört werden.

—

## 11. Vollständigkeitsprinzip

Bei Änderungen an einer Datei wird immer die vollständige aktuelle Datei ausgegeben.

Keine Patch-Ausgabe.

Keine einzelnen Codeabschnitte als Ersatz.

Keine gekürzte Datei.

—

## 12. Working Copy

Working Copy auf dem iPad ist die manuelle Git-Arbeitsumgebung des Benutzers.

Dort werden die von der KI ausgegebenen vollständigen Dateien übernommen, geprüft und committed.

Der Benutzer arbeitet nicht mit dem Terminal.

Der fehlende direkte GitHub-Schreibzugriff des AI-Agenten ist eine bekannte Rahmenbedingung und wird nicht bei jedem Arbeitsschritt erneut erwähnt.

—

## 13. Commit-Prinzip

Ein relevanter Arbeitsschritt gilt erst als abgeschlossen, wenn die betreffende Datei versioniert wurde.

Relevante Commits werden nachvollziehbar dokumentiert.

Nach Möglichkeit werden festgehalten:

- Commit-ID
- Commit-Nachricht
- Datum
- Uhrzeit
- betroffene Dateipfade
- Arbeitsschritt
- Ergebnis

Die Dateipfade sind ausdrücklich Bestandteil der Commit-Dokumentation.

—

## 14. Projektchronik

`PROJECT_CHRONICLE_001.md` dokumentiert abgeschlossene Projektfortschritte und Meilensteine.

Weitere Chroniken werden bei Bedarf erstellt.

Historische Einträge werden nicht unnötig verändert.

Die Chronik ersetzt nicht den DEV_LOG.

—

## 15. DEV_LOG

`DEV_LOG.md` dokumentiert technische Vorgänge.

Dazu gehören insbesondere:

- Prüfungen
- technische Arbeitsschritte
- relevante Befehle
- relevante Ergebnisse
- Commit-IDs
- Commit-Nachrichten
- betroffene Dateipfade
- technische Entscheidungen

Die Chronik dokumentiert Projektfortschritt.

Der DEV_LOG dokumentiert technische Vorgänge.

—

## 16. Dokumentationsdateien

Aktuelle Dokumentations- und Steuerungsdateien:

- `RULES.md`
- `WORKFLOW.md`
- `VISION.md`
- `PROJECT_MASTERLIST.md`
- `PROJECT_STATUS.md`
- `PROJECT_CHRONICLE_001.md`
- `DEV_LOG.md`
- `WORK_STATE.md`
- `REPOSITORY_INVENTORY.md`

Alle sind derzeit **NICHT eingefroren**.

Sie werden einmalig auf Konsistenz gebracht.

Danach erfolgt der gemeinsame Freeze der relevanten Master-/Steuerungsdateien.

—

## 17. Core

Der Core ist die technische Plattform.

Der Core enthält ausschließlich generische Infrastruktur.

Der Core darf keine konkrete Fachlogik einzelner Module enthalten.

Der Core darf nicht für einzelne Module angepasst werden.

Fachmodule dürfen keine Änderungen an bestehenden Core-Dateien erzwingen.

—

## 18. Core Freeze

Der Core ist derzeit:

**NICHT EINGEFROREN**

Vor dem Freeze:

1. Repository-Inventur
2. funktionale Core-Analyse
3. Bereinigung
4. Implementierung
5. Validierung
6. Tests
7. Abnahme
8. ausdrückliche Freeze-Entscheidung

Nach dem Freeze:

```text
/Core/*
```

ist grundsätzlich Read-Only.

Installation, Deinstallation, Aktualisierung oder Erweiterung eines Moduls darf danach keine Core-Änderung benötigen.

—

## 19. Neue Funktionalität

Vor jeder neuen Funktion:

```text
INFRASTRUKTUR?
→ CORE

FACHFUNKTION?
→ MODUL
```

Beispiele für Module:

- User
- Admin
- GPS
- Weather
- Catchbook
- Fish Database
- Tides
- Maps
- Statistics

—

## 20. Modulprinzip

Module verwenden ausschließlich definierte Core-Schnittstellen.

Grundsätzlich falsch:

```text
Neues Modul
→ Core-Datei ändern
→ Modul integrieren
```

Richtig:

```text
Neues Modul
→ Core-Schnittstelle verwenden
→ registrieren
→ installieren
→ aktivieren
```

Benötigt ein Modul eine Core-Änderung, wird zuerst die Architektur geprüft.

—

## 21. Modulunabhängigkeit

Module bleiben grundsätzlich unabhängig.

Direkte Abhängigkeiten müssen ausdrücklich definiert werden.

Ein Modul darf keine privaten Implementierungsdetails eines anderen Moduls verwenden.

—

## 22. Modul-Lifecycle

Das Modul-System muss konzeptionell unterstützen:

```text
available
installed
enabled
disabled
updated
uninstalled
```

Der Module Manager kontrolliert den Lifecycle.

—

## 23. Datenbank

Module dürfen eigene Datenstrukturen besitzen.

Die generische Datenbankinfrastruktur enthält keine unnötige Fachlogik einzelner Module.

—

## 24. User und Admin

User und Admin sind Module.

Sie sind keine Bestandteile der fachlichen Core-Logik.

Der Core stellt ausschließlich benötigte Infrastruktur bereit.

—

## 25. Rollen und Berechtigungen

Berechtigungen werden zentral und konsistent behandelt.

Berechtigungen ergeben sich aus Rollen und/oder Paket-/Entitlement-Regeln.

Nicht verfügbare Funktionen werden nicht als verfügbar dargestellt.

—

## 26. Keine Fake-Funktionen

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

## 27. Startup

CatchTrack besitzt keinen unnötigen Parallelbetrieb mehrerer konkurrierender Startup-/Runtime-Systeme.

Der endgültige Startablauf muss eindeutig definiert sein.

—

## 28. Teststrategie

Entwicklungsblöcke werden in sinnvolle Abschnitte geteilt.

Wenn eine technisch sinnvolle Zwischenstufe erreicht ist:

```text
IMPLEMENTIEREN
→ TESTEN
→ ERGEBNIS DOKUMENTIEREN
→ FEHLER KORRIGIEREN
→ ERNEUT TESTEN
→ WEITER
```

Der Benutzer soll bereits während der Entwicklung testen können.

Es wird nicht unnötig bis zum Ende eines kompletten Entwicklungsblocks gewartet.

—

## 29. Dokumentations- und Arbeitsablauf

Der verbindliche Gesamtworkflow:

```text
RULES LESEN
→ AKTUELLEN ARBEITSSTAND BESTIMMEN
→ GITHUB MAIN PRÜFEN
→ NÄCHSTEN OFFENEN ARBEITSSCHRITT BESTIMMEN
→ DATEI SUCHEN
→ VORHANDENE DATEI VOLLSTÄNDIG LESEN
→ ZIEL UND ARCHITEKTUR VERGLEICHEN
→ ENTSCHEIDEN
→ VOLLSTÄNDIGE DATEI ERSTELLEN/ÄNDERN
→ TESTEN
→ KORRIGIEREN
→ DOKUMENTIEREN
→ COMMIT PRÜFEN
→ NÄCHSTEN SCHRITT BESTIMMEN
```

Prüfungen und Einlesungen erfolgen selbstständig.

—

## 30. Keine unnötigen Wiederholungen

Bereits erledigte Dateien werden nicht erneut ausgegeben.

Bereits geprüfte Informationen werden nicht unnötig erneut abgefragt.

Bereits beantwortete Entscheidungen werden nicht erneut zur Bestätigung vorgelegt.

Bei `OK` wird immer der nächste offene Arbeitsschritt bestimmt.

—

## 31. Fortsetzungsschlüssel

Der aktuelle Fortsetzungsschlüssel wird in den relevanten Steuerungsdateien konsistent geführt.

Aktueller Schlüssel:

`DOCUMENTATION-SYNC`

Nach Abschluss der Dokumentations-Synchronisation:

`DOCUMENTATION-FREEZE`

Danach:

`CORE-INVENTORY-DEEP-DIVE`

—

## 32. Priorität

Bei Entscheidungen gilt:

1. Datenintegrität und Sicherheit
2. aktuelle GitHub-Version
3. aktuelle Projektregeln
4. dokumentierte Architektur
5. bestehende Projektstruktur
6. technische Einfachheit
7. minimale unnötige Änderungen
8. Geschwindigkeit

Bei Konflikten hat eine höhere Priorität Vorrang.

—

## 33. Ziel

CatchTrack soll:

- einen stabilen und generischen Core besitzen
- ein unabhängiges Modulsystem besitzen
- klare Modulgrenzen besitzen
- reproduzierbar weiterentwickelbar sein
- keine unnötigen Core-Abhängigkeiten besitzen
- keine doppelten Strukturen besitzen
- einen nachvollziehbaren Entwicklungsstand besitzen
- ohne unnötige Rückfragen effizient entwickelt werden können