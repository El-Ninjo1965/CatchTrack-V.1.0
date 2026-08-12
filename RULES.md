CatchTrack V1.0 – Project Rules

1. Verbindlichkeit

Diese Datei enthält verbindliche Projektregeln.

AI-Agenten müssen diese Regeln vor jeder Arbeit am Projekt berücksichtigen.

Regeln dieser Datei dürfen nicht eigenmächtig verändert, abgeschwächt oder entfernt werden.

⸻

2. Frozen Documentation

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

Ein AI-Agent darf nicht nachfragen, ob eine Änderung erlaubt ist.

Es existiert im normalen Entwicklungsworkflow keine Option, diese Dateien durch eine Agentenentscheidung zu verändern.

Eine Änderung kann ausschließlich durch eine bewusste Projektentscheidung des Projektinhabers außerhalb des normalen Agenten-Workflows erfolgen.

⸻

3. Project Chronicle

Die Projektchronik ist davon getrennt.

Aktuelle Chronik:

PROJECT_CHRONICLE_001.md

Spätere Chroniken können erstellt werden:

PROJECT_CHRONICLE_002.md
PROJECT_CHRONICLE_003.md
...

Die Chronik darf laufend fortgeschrieben werden.

Bereits dokumentierte historische Ereignisse dürfen nicht rückwirkend verfälscht werden.

⸻

4. chatgpt-info.md

chatgpt-info.md ist ein technisches Analyse-/Prüfdokument.

Es ist keine verbindliche Architekturdefinition.

Darin enthaltene Fehlerberichte oder Empfehlungen dürfen nicht automatisch als aktueller Projektstatus interpretiert werden.

⸻

5. Core-Regel

Der Core ist die technische Plattform.

Der Core darf keine konkrete Fachlogik enthalten.

Der Core darf nicht für einzelne Module angepasst werden.

Insbesondere dürfen Fachmodule keine Änderungen an Core-Dateien erzwingen.

⸻

6. Core Freeze

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

Es gibt keine automatische Rückfrage, ob Core-Dateien verändert werden dürfen.

⸻

7. Neue Funktionalität

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

⸻

8. Keine Core-Anpassung für Module

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

⸻

9. Module müssen unabhängig bleiben

Module dürfen nicht unnötig voneinander abhängig sein.

Direkte Abhängigkeiten müssen ausdrücklich definiert werden.

Ein Modul darf keine privaten Implementierungsdetails eines anderen Moduls verwenden.

⸻

10. Module Lifecycle

Jedes installierbare Modul muss konzeptionell folgende Zustände unterstützen:

available
installed
enabled
disabled
updated
uninstalled

Der Module Manager ist für den Lifecycle zuständig.

⸻

11. Datenbank

Module dürfen eigene Datenstrukturen besitzen.

Datenbankoperationen eines Moduls gehören zum Modul-Lifecycle.

Installation:

Module installieren
→ Datenbank installieren
→ Modul registrieren

Deinstallation:

Modul deaktivieren
→ Daten behandeln
→ Datenbank entfernen oder behalten
→ Modul deregistrieren
→ Dateien entfernen

⸻

12. User und Admin

User und Admin sind Module.

Sie werden nicht als fachliche Bestandteile des Core implementiert.

Der Core stellt nur die dafür erforderliche Infrastruktur bereit.

⸻

13. Rollen und Permissions

Berechtigungen müssen zentral und konsistent behandelt werden.

Ein Benutzer erhält Berechtigungen über Rollen und/oder Paket-/Entitlement-Regeln.

Ein Menüpunkt darf nur angezeigt werden, wenn der Benutzer tatsächlich Zugriff darauf besitzt.

⸻

14. Keine Fake-Funktionen

Es dürfen keine Menüeinträge für nicht verfügbare Funktionen angezeigt werden, nur um anschließend eine Meldung wie:

Diese Funktion ist für Ihr Paket nicht aktiviert.

anzuzeigen.

Nicht verfügbare Funktionen werden nicht angezeigt.

⸻

15. Status nicht vortäuschen

Eine Funktion darf nur als fertig, implementiert, getestet oder abgenommen bezeichnet werden, wenn dies tatsächlich überprüft wurde.

Insbesondere darf der Core nicht als:

FROZEN

bezeichnet werden, bevor die technische Abnahme abgeschlossen ist.

⸻

16. Keine unnötigen Dateien

Vor dem Erstellen einer neuen Datei muss geprüft werden, ob bereits eine Datei mit derselben oder einer vergleichbaren Aufgabe existiert.

Doppelte Dateien oder parallele Implementierungen derselben Funktion sind zu vermeiden.

⸻

17. Keine parallelen Startsysteme

CatchTrack darf nicht mehrere konkurrierende Startup-/Runtime-Systeme besitzen.

Der Start der Anwendung muss über einen eindeutig definierten Einstieg erfolgen.

⸻

18. Vollständige Dateien

Wenn eine bestehende Projektdatei geändert werden muss, wird sie als vollständige Datei behandelt.

Teilweise, widersprüchliche oder parallele Versionen derselben Datei sind zu vermeiden.

⸻

19. Änderungen dokumentieren

Wichtige Architekturentscheidungen, Meilensteine und relevante technische Änderungen werden in der Projektchronik dokumentiert.

Die Frozen Documents werden nicht als laufendes Änderungsprotokoll verwendet.

⸻

20. Priorität

Bei Entscheidungen gilt:

1. Sicherheit und Datenintegrität
2. Frozen Architecture
3. Core/Module Trennung
4. definierte Core-Schnittstellen
5. bestehende Funktionalität
6. neue Funktionalität

Neue Funktionalität darf keine bestehende Architekturregel umgehen.

⸻

21. Grundregel

Die wichtigste Regel von CatchTrack V1.0 lautet:

Der Core stellt Infrastruktur bereit. Module stellen Funktionen bereit.

Diese Trennung ist verbindlich.