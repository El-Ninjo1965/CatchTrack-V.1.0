# CatchTrack V1.0 – Project Rules

## 1. Verbindlichkeit

Diese Datei enthält verbindliche Projektregeln.

AI-Agenten müssen diese Regeln vor jeder Arbeit am Projekt berücksichtigen.

Regeln dieser Datei dürfen nicht eigenmächtig verändert, abgeschwächt oder entfernt werden.

## 2. Frozen Documentation

Folgende Dateien sind nach ihrer Erstellung verbindliche, eingefrorene Dokumentation:

VISION.md
RULES.md
WORKFLOW.md
PROJECT_MASTERLIST.md
PROJECT_STATUS.md

Diese Dateien sind für AI-Agenten Read-Only.

AI-Agenten dürfen sie:

* lesen
* analysieren
* als Vorgabe verwenden

AI-Agenten dürfen sie nicht:

* ändern
* überschreiben
* löschen
* verschieben
* umbenennen

Eine Änderung kann ausschließlich durch eine bewusste Projektentscheidung des Projektinhabers außerhalb des normalen Agenten-Workflows erfolgen.

## 3. GitHub als verbindliche Referenz

GitHub main ist die maßgebliche Quelle für den aktuellen Projektstand.

Vor jeder Prüfung, Analyse, Erstellung oder Änderung einer Datei wird grundsätzlich zuerst geprüft, ob diese Datei bereits auf GitHub main vorhanden ist.

Lokale Arbeitskopien aus Codespace oder Working Copy dürfen nicht ungeprüft als aktuell angenommen werden.

Bei Abweichungen ist zuerst der Unterschied zwischen GitHub und lokalem Stand festzustellen.

Bei abgeschnittenen, unvollständigen oder widersprüchlichen Dateien wird nicht geraten oder rekonstruiert.

In diesem Fall wird das vorhandene Original angefordert.

## 4. Verbindliche Dateivorprüfung

Vor jeder Dateiausgabe muss der AI-Agent folgende Prüfung durchführen:

DATEIAUFTRAG
→ nächste erforderliche Datei bestimmen
→ GitHub main prüfen
→ Datei vorhanden?
→ vorhandene Datei vollständig auslesen
→ vorhandene Version mit dem erforderlichen Ziel vergleichen
→ Reihenfolge des Arbeitsschrittes prüfen
→ erst danach Datei ausgeben

Wenn die Datei bereits auf GitHub vorhanden ist:

* darf keine neue Version aus dem Gedächtnis erzeugt werden
* muss die aktuelle GitHub-Version als Grundlage verwendet werden
* muss festgestellt werden, ob überhaupt eine Änderung erforderlich ist

Wenn die vorhandene GitHub-Version bereits dem erforderlichen Ziel entspricht:

* darf die Datei nicht erneut ausgegeben werden
* ist mit dem nächsten offenen Arbeitsschritt fortzufahren

Wenn eine Änderung erforderlich ist:

* muss die aktuelle GitHub-Version als Ausgangsbasis verwendet werden
* darf keine ältere lokale oder erinnerte Version als Grundlage verwendet werden

Wenn die Datei nicht auf GitHub vorhanden ist:

* darf sie neu erstellt werden

Keine Dateiausgabe ohne erfolgreich abgeschlossene GitHub-Prüfung.

## 5. Reihenfolgeprüfung

Bei jedem Arbeitsschritt muss zusätzlich geprüft werden:

* Welche Datei wurde zuletzt tatsächlich bearbeitet?
* Welche Datei ist als Nächstes erforderlich?
* Wurde diese Datei bereits erstellt oder committed?
* Gibt es einen offenen vorherigen Arbeitsschritt?

Bei einem Benutzerbefehl wie „OK“ bedeutet dies:

OK
→ aktuellen Arbeitsstand bestimmen
→ nächsten offenen Arbeitsschritt bestimmen
→ GitHub prüfen
→ Datei prüfen
→ erst dann nächste Datei ausgeben

„OK“ bedeutet niemals, eine bereits erledigte Datei erneut auszugeben.

## 6. Autonomer Arbeitsmodus

Der Benutzer definiert Ziel und gewünschtes Ergebnis.

Der AI-Agent arbeitet danach eigenständig.

Der AI-Agent:

* prüft den aktuellen Projektstand
* liest relevante Projektdateien selbstständig
* prüft bestehende Regeln und Abhängigkeiten
* trifft technische Entscheidungen selbstständig
* setzt eindeutige Anforderungen ohne zusätzliche Bestätigung um
* fragt nur bei echter Unklarheit oder notwendiger fachlicher Entscheidung
* arbeitet ohne unnötige Zwischenbestätigungen
* setzt nach einem bestätigten Arbeitsschritt direkt mit dem nächsten sinnvollen Schritt fort

Lange Erklärungen werden vermieden.

Der Benutzer muss technische Entscheidungen nicht bestätigen, die sich eindeutig aus Projektziel, Architektur und Regeln ergeben.

## 7. Projektchronik

Die Projektchronik ist von den Frozen Documents getrennt.

Aktuelle Chronik:

PROJECT_CHRONICLE_001.md

Spätere Chroniken können erstellt werden:

PROJECT_CHRONICLE_002.md
PROJECT_CHRONICLE_003.md
...

Die Chronik darf laufend fortgeschrieben werden.

Bereits dokumentierte historische Ereignisse dürfen nicht rückwirkend verfälscht werden.

Die Chronik enthält außerdem den aktuellen Fortsetzungspunkt des Projekts.

## 8. Technisches Entwicklungsprotokoll

DEV_LOG.md dokumentiert technische Entwicklungsarbeit.

Dazu gehören insbesondere:

* Datum und Uhrzeit
* Aktion
* Terminal-Befehl bzw. Arbeitsschritt
* Ergebnis
* Commit-ID
* Commit-Nachricht
* betroffene Dateipfade

DEV_LOG.md ersetzt nicht die Projektchronik.

## 9. Git und Versionierung

Relevante Entwicklungsdateien werden grundsätzlich committed.

Ein relevanter Arbeitsschritt gilt erst als abgeschlossen, wenn die betreffenden Dateien versioniert sind.

Der AI-Agent darf nicht voraussetzen, dass direkter GitHub-Schreibzugriff verfügbar ist.

Der aktuelle technische Workflow kann deshalb Codespace für die Entwicklung und Working Copy für Versionierung und Übertragung zu GitHub verwenden.

Ein HTTP-403-Fehler beim GitHub-Schreibzugriff ist als bekannte technische Randbedingung zu behandeln und darf nicht als unbekannter Projektfehler interpretiert werden.

Commit-Informationen müssen nachvollziehbar bleiben.

Insbesondere müssen Commit-ID, Commit-Nachricht und betroffene Dateipfade ermittelbar sein.

## 10. Terminal-Arbeiten

Terminal-Prüfungen werden so ausgeführt, dass die vollständige relevante Ausgabe in einer versionierbaren Datei gespeichert wird.

Für Terminal-Arbeiten kann terminal.md im Repository-Root verwendet werden.

Terminal-Ausgaben dürfen nicht ausschließlich als Bildschirmtext behandelt werden, wenn sie für die weitere Entwicklung benötigt werden.

Relevante Ergebnisse werden zusätzlich in DEV_LOG.md oder der Projektchronik dokumentiert.

## 11. Core-Regel

Der Core ist die technische Plattform.

Der Core darf keine konkrete Fachlogik enthalten.

Der Core darf nicht für einzelne Module angepasst werden.

Insbesondere dürfen Fachmodule keine Änderungen an Core-Dateien erzwingen.

## 12. Core Freeze

Nach erfolgreicher Fertigstellung und Abnahme wird der Core eingefroren.

Danach gilt für AI-Agenten:

/Core/*

ist Read-Only.

Erlaubt:

* lesen
* analysieren
* verwenden

Nicht erlaubt:

* ändern
* überschreiben
* löschen
* verschieben
* umbenennen

Der Core darf nach dem Freeze nicht durch Installation, Deinstallation, Aktualisierung oder Erweiterung einzelner Module verändert werden.

## 13. Neue Funktionalität

Neue fachliche Funktionalität wird grundsätzlich als Modul umgesetzt.

Vor jeder Änderung ist zu prüfen:

Ist das Infrastruktur?
→ möglicherweise Core

Ist das eine fachliche Funktion?
→ Modul

Beispiele für Module:

* User
* Admin
* GPS
* Weather
* Catchbook
* Fish Database
* Tides
* Maps
* Statistics

## 14. Keine Core-Anpassung für Module

Folgendes ist grundsätzlich falsch:

Neues Modul
→ Core-Datei ändern
→ Modul einbauen

Richtig:

Neues Modul
→ definierte Core-Schnittstelle verwenden
→ Modul registrieren
→ Modul installieren

Wenn ein Modul eine Core-Änderung benötigt, ist zunächst die Modularchitektur zu überprüfen.

## 15. Module müssen unabhängig bleiben

Module dürfen nicht unnötig voneinander abhängig sein.

Direkte Abhängigkeiten müssen ausdrücklich definiert werden.

Ein Modul darf keine privaten Implementierungsdetails eines anderen Moduls verwenden.

## 16. Module Lifecycle

Jedes installierbare Modul muss konzeptionell folgende Zustände unterstützen:

available
installed
enabled
disabled
updated
uninstalled

Der Module Manager ist für den Lifecycle zuständig.

## 17. Datenbank

Module dürfen eigene Datenstrukturen besitzen.

Datenbankoperationen eines Moduls gehören zum Modul-Lifecycle.

Installation:

Modul installieren
→ Datenbank installieren
→ Modul registrieren

Deinstallation:

Modul deaktivieren
→ Daten behandeln
→ Datenbank entfernen oder behalten
→ Modul deregistrieren
→ Dateien entfernen

## 18. User und Admin

User und Admin sind Module.

Sie werden nicht als fachliche Bestandteile des Core implementiert.

Der Core stellt nur die dafür erforderliche Infrastruktur bereit.

## 19. Rollen und Permissions

Berechtigungen müssen zentral und konsistent behandelt werden.

Ein Benutzer erhält Berechtigungen über Rollen und/oder Paket-/Entitlement-Regeln.

Ein Menüpunkt darf nur angezeigt werden, wenn der Benutzer tatsächlich Zugriff darauf besitzt.

## 20. Keine Fake-Funktionen

Es dürfen keine Menüeinträge für nicht verfügbare Funktionen angezeigt werden, nur um anschließend eine Meldung wie:

Diese Funktion ist für Ihr Paket nicht aktiviert.

anzuzeigen.

Nicht verfügbare Funktionen werden nicht angezeigt.

## 21. Status nicht vortäuschen

Eine Funktion darf nur als fertig, implementiert, getestet oder abgenommen bezeichnet werden, wenn dies tatsächlich überprüft wurde.

Insbesondere darf der Core nicht als FROZEN bezeichnet werden, bevor die technische Abnahme abgeschlossen ist.

## 22. Keine unnötigen Dateien

Vor dem Erstellen einer neuen Datei muss geprüft werden, ob bereits eine Datei mit derselben oder einer vergleichbaren Aufgabe existiert.

Doppelte Dateien oder parallele Implementierungen derselben Funktion sind zu vermeiden.

## 23. Keine parallelen Startsysteme

CatchTrack darf nicht mehrere konkurrierende Startup-/Runtime-Systeme besitzen.

Der Start der Anwendung muss über einen eindeutig definierten Einstieg erfolgen.

## 24. Vollständige Dateien

Wenn eine bestehende Projektdatei geändert werden muss, wird sie als vollständige Datei behandelt.

Teilweise, widersprüchliche oder parallele Versionen derselben Datei sind zu vermeiden.

## 25. Dateiausgabe

Wenn eine Datei zur manuellen Übernahme ausgegeben wird, gelten verbindlich:

1. Copy-Block 1 enthält ausschließlich den exakten Dateinamen.
2. Copy-Block 2 enthält ausschließlich den vollständigen Dateiinhalt.
3. Der Dateiname steht nicht im zweiten Copy-Block.
4. Zwischen den beiden Copy-Blöcken stehen keine technischen Kommentare.
5. Für eine Datei werden genau diese zwei Copy-Blöcke verwendet.
6. Der zweite Copy-Block enthält keine verschachtelten Codeblöcke.
7. Der vollständige Dateiinhalt muss mit einer einzigen Kopieraktion übernommen werden können.
8. Der Dateiinhalt darf nicht wegen Formatierung, Kommentaren oder zusätzlicher Blöcke aufgeteilt werden.

Diese Regel gilt für jede Datei, unabhängig vom Dateityp.

## 26. Änderungen dokumentieren

Wichtige Architekturentscheidungen, Meilensteine und relevante technische Änderungen werden dokumentiert.

Technische Details gehören in DEV_LOG.md.

Projektentscheidungen und Meilensteine gehören in die Projektchronik.

Frozen Documents werden nicht als laufendes Änderungsprotokoll verwendet.

## 27. Arbeitsablauf

Der verbindliche Arbeitsablauf lautet:

ZIEL
→ AKTUELLEN GITHUB-STAND PRÜFEN
→ NÄCHSTEN OFFENEN ARBEITSSCHRITT BESTIMMEN
→ DATEIEXISTENZ PRÜFEN
→ AKTUELLE DATEI AUSLESEN
→ REGELN PRÜFEN
→ ENTSCHEIDEN
→ UMSETZEN
→ TESTEN
→ KORRIGIEREN
→ DOKUMENTIEREN
→ COMMIT
→ COMMIT UND DATEIPFADE PRÜFEN

Nach einem bestätigten Arbeitsschritt wird ohne unnötige Zwischenfragen mit dem nächsten sinnvollen Schritt fortgesetzt.

Bei sinnvollen Entwicklungsabschnitten wird ein Testpunkt eingeplant.

## 28. Priorität

Bei Entscheidungen gilt:

1. Sicherheit und Datenintegrität
2. aktuelle GitHub-Version
3. Frozen Architecture
4. Core/Module-Trennung
5. definierte Core-Schnittstellen
6. bestehende Funktionalität
7. neue Funktionalität

Neue Funktionalität darf keine bestehende Architekturregel umgehen.

## 29. Grundregel

Die wichtigste Regel von CatchTrack V1.0 lautet:

Der Core stellt Infrastruktur bereit.

Module stellen Funktionen bereit.

GitHub main ist die verbindliche Referenz.

Keine Datei wird erneut erstellt oder ausgegeben, bevor ihr aktueller GitHub-Stand und ihre Position im Arbeitsablauf geprüft wurden.

Diese Trennung und dieser Prüfprozess sind verbindlich.