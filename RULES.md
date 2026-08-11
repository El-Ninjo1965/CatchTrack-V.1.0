# CatchTrack – Development Rules

## 1. Verbindliche Grundlage

Diese Regeln gelten für die gesamte Entwicklung von CatchTrack.

Bestehende Regeln dürfen nicht stillschweigend geändert werden.

Bei widersprüchlichen Anforderungen muss nachgefragt werden.

## 2. Arbeitsweise der KI

Die KI arbeitet zielgerichtet.

Keine unnötigen Erklärungen über interne Arbeitsschritte.

Keine langen Ausführungen darüber, was als Nächstes gemacht werden soll.

Wenn eine Aufgabe eindeutig ist, wird sie ausgeführt.

Nachfragen erfolgen nur, wenn eine notwendige Information fehlt oder eine fachliche Entscheidung erforderlich ist.

## 3. Bestehende Dateien

Bestehende Dateien werden nicht ohne konkreten Grund verändert.

Insbesondere Core-Dateien dürfen nicht wegen einzelner Module ständig angepasst oder neu geschrieben werden.

Vor einer Änderung an einer bestehenden Datei muss geprüft werden, ob die Änderung tatsächlich erforderlich ist.

## 4. Module

Module sind eigenständige Funktionseinheiten.

Ein Modul soll möglichst:
- selbstständig funktionieren
- klar definierte Schnittstellen besitzen
- keine unnötigen Abhängigkeiten erzeugen
- unabhängig aktiviert oder deaktiviert werden können
- später ersetzt oder erweitert werden können

## 5. Vollständige Dateien

Bei der Erstellung oder Änderung einer Datei wird grundsätzlich der vollständige Dateiinhalt ausgegeben.

Keine unnötigen Ausschnitte.

Wenn mehrere Dateien erstellt werden, wird jede Datei in einem eigenen Copy-Block ausgegeben.

Jeder Copy-Block enthält:
- Dateiname
- vollständigen Pfad
- vollständigen Inhalt

## 6. Entwicklungsreihenfolge

Die vereinbarte Projektstruktur und Masterliste bestimmen die Reihenfolge der Entwicklung.

Keine zusätzlichen Dateien oder Ordner ohne technischen oder organisatorischen Grund.

Keine vorzeitige Erstellung leerer Dateien.

## 7. Änderungen

Keine wiederholten Änderungen an bereits abgeschlossenen Dateien ohne nachvollziehbaren Grund.

Eine abgeschlossene Datei gilt als stabil.

Änderungen nach Abschluss müssen einen konkreten Grund haben und erneut getestet werden.

## 8. Abschluss eines Moduls

Ein Modul darf erst als abgeschlossen markiert werden, wenn:

- Anforderungen definiert
- Dateien erstellt
- Code funktionsfähig
- Dateien committed
- Dateien auf GitHub vorhanden
- Commit überprüfbar
- Tests erfolgreich
- Funktionen erfolgreich geprüft
- Dokumentation aktualisiert

sind.

## 9. GitHub

GitHub ist die maßgebliche externe Referenz für den tatsächlich committeden Projektstand.

Ein lokal vorhandener oder in Working Copy vorhandener Stand gilt nicht automatisch als abgeschlossen.

## 10. Chronik

Jeder abgeschlossene relevante Entwicklungsschritt wird in der Projektchronik dokumentiert.

Die Chronik wird fortlaufend geführt.

Bei Erreichen der festgelegten maximalen Länge wird eine neue Chronikdatei begonnen.

## 11. Fehler

Fehler und Testprobleme werden nachvollziehbar dokumentiert.

Insbesondere Fehler, die bei Vorschau oder Tests auftreten, dürfen nicht stillschweigend ignoriert werden.

## 12. Keine Endlosschleifen

Die KI darf nicht ohne konkreten Grund zu bereits abgeschlossenen Architekturentscheidungen zurückkehren.

Keine wiederholte Grundsatzdiskussion.

Keine unnötige Neuplanung bereits festgelegter Bereiche.

Wenn eine Entscheidung getroffen und dokumentiert wurde, wird sie als verbindliche Grundlage verwendet.