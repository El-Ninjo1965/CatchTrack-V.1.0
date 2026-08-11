# CatchTrack – Development Workflow

## 1. Grundablauf

Die Entwicklung erfolgt Schritt für Schritt.

Standardablauf:

1. Anforderungen klären
2. Modul oder Aufgabe festlegen
3. benötigte Dateien bestimmen
4. vollständige Dateien erstellen
5. Dateien übernehmen
6. committen
7. GitHub-Stand prüfen
8. testen
9. Fehler beheben
10. erneut testen
11. Abschluss dokumentieren
12. Chronik aktualisieren

## 2. Neue Module

Wenn ein neues Modul gewünscht wird, werden zunächst nur die notwendigen Anforderungen geklärt.

Die KI fragt insbesondere:

- Welche Funktion soll das Modul erfüllen?
- Welche Eingaben benötigt es?
- Welche Ausgaben soll es liefern?
- Welche Benutzerfunktionen werden benötigt?
- Welche Daten werden gespeichert?
- Welche Schnittstellen zu anderen Komponenten sind erforderlich?

Weitere Fragen werden nur gestellt, wenn sie für die Umsetzung notwendig sind.

## 3. Dateierstellung

Nach Abschluss der Anforderungsdefinition erstellt die KI die vollständigen Dateien.

Jede Datei wird separat ausgegeben.

Jede Ausgabe enthält:

- Dateiname
- vollständigen Pfad
- vollständigen Dateiinhalt

## 4. Übergabe

Der Benutzer übernimmt die Dateien in Working Copy und führt den Commit durch.

Danach kann der GitHub-Stand geprüft werden.

## 5. Prüfung

Ein Modul ist erst abgeschlossen, wenn der tatsächlich auf GitHub vorhandene Stand geprüft wurde und die Tests erfolgreich sind.

Ein bloß erstellter Quellcode gilt nicht als abgeschlossen.

## 6. Fehlerbehandlung

Treten beim Test Fehler auf:

1. Fehler feststellen
2. Ursache bestimmen
3. notwendige Datei ändern
4. erneut committen
5. erneut testen

Die Chronik wird erst nach erfolgreichem Abschluss aktualisiert.

## 7. Abschlussmeldung

Nach erfolgreichem Abschluss werden mindestens dokumentiert:

- Modul
- Status
- relevante Dateien
- GitHub-Commit
- Testergebnis

## 8. Weiterarbeit

Nach einem bestätigten Abschluss kann unmittelbar mit dem nächsten vorgesehenen Arbeitsschritt fortgefahren werden.

Es wird nicht erneut über bereits abgeschlossene Grundlagen diskutiert, sofern keine neue technische Notwendigkeit besteht.

## 9. Kommunikation

Die KI gibt keine unnötigen Beschreibungen ihrer internen Arbeitsschritte aus.

Bei einem eindeutigen Auftrag wird die Aufgabe direkt ausgeführt.

Nachfragen erfolgen nur bei fehlenden oder technisch notwendigen Entscheidungen.

Nach erfolgreicher Übergabe der Dateien ist keine zusätzliche Bestätigung durch den Benutzer erforderlich, sofern der vereinbarte nächste Schritt eindeutig ist.