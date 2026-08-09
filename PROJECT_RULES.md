CatchTrack – PROJECT RULES

Version: 2.2
Status: MASTER
Last Update: 2026-08-09

—

1. Zweck dieser Datei

Diese Datei ist die verbindliche Arbeitsgrundlage für die Weiterentwicklung von CatchTrack.

Vor jeder Änderung am Projekt müssen diese Regeln und der aktuelle Projektstand berücksichtigt werden.

Ziele:

* keine fertigen Funktionen erneut erstellen
* keine bestehenden Abläufe unbeabsichtigt verändern
* keine fertigen Dateien ohne ausdrücklichen Auftrag ändern
* keine Module mehrfach oder parallel entwickeln
* Änderungen nachvollziehbar halten
* Abhängigkeiten zwischen Modulen berücksichtigen
* Datenbankstruktur von Anfang an mehrbenutzerfähig planen
* automatische Daten niemals als unveränderbare Werte behandeln

—

2. Grundprinzip

CatchTrack wird modular entwickelt.

Jede eigenständige Funktion soll, soweit technisch sinnvoll, als eigenes Modul aufgebaut werden.

Ein fertiges Modul muss anschließend von anderen Modulen verwendet werden können, ohne seine interne Implementierung zu kopieren.

Grundprinzip:

MODULE
↓
KLARE SCHNITTSTELLEN
↓
ZENTRALE DATENBANK

—

3. Zentrale Datenbank

CatchTrack verwendet grundsätzlich eine zentrale SQLite-Datenbank.

Es werden NICHT mehrere voneinander unabhängige Datenbanken pro Modul angelegt.

Gründe:

* Beziehungen zwischen Daten
* Benutzerzuordnung
* Datenintegrität
* Backups
* Statistiken
* Datenmigrationen
* Vermeidung redundanter Daten

Die Datenbank ist zentral.

Die Datenlogik bleibt innerhalb der jeweiligen Module gekapselt.

—

4. Modulprinzip

Ein Modul besitzt grundsätzlich:

modules//

├── .html
├── .css
└── .js

Zusätzliche Dateien sind erlaubt, wenn sie technisch sinnvoll sind.

Beispiel:

modules/gps/

├── gps.html
├── gps.css
├── gps.js
└── gps.data.js

—

5. Module müssen mehrfach verwendbar sein

Ein Modul darf nicht ausschließlich für einen einzigen Anwendungsfall entwickelt werden.

Jedes Datenmodul muss:

1. selbstständig über seine Benutzeroberfläche verwendet werden können
2. seine Daten anderen Modulen über definierte Schnittstellen zur Verfügung stellen können

Beispiele:

GPS:

GPS.getCurrentLocation()

Weather:

Weather.getData(latitude, longitude, timestamp)

Tides:

Tides.getData(latitude, longitude, timestamp)

Moon:

Moon.getData(timestamp)

Waters:

Waters.getNearby(latitude, longitude)

Photos:

Photos.getForCatch(catchId)

—

6. Wiederverwendung von Modulen

Andere Module dürfen die Funktionen eines fertigen Moduls verwenden.

Die interne Logik darf nicht kopiert werden.

Beispiel:

Catches benötigt Wetterdaten.

Catches implementiert NICHT selbst die Wetterermittlung.

Stattdessen:

Weather.getData(…)

Das Wettermodul liefert die benötigten Daten.

Damit bleibt Weather unabhängig und kann gleichzeitig direkt vom Benutzer geöffnet werden.

—

7. Fertige Module

Wenn ein Modul vollständig entwickelt und getestet wurde:

* Version festhalten
* Funktion dokumentieren
* Schnittstellen dokumentieren
* Abhängigkeiten dokumentieren
* Datenstruktur dokumentieren

Danach gilt das Modul als fertiger Baustein.

Andere Module dürfen es verwenden.

Ein fertiges Modul darf nicht für jede neue Funktion unnötig umgebaut werden.

Änderungen an fertigen Modulen nur:

* wenn technisch erforderlich
* wenn ausdrücklich beauftragt
* oder wenn ein Fehler behoben werden muss

—

8. Benutzerstruktur

CatchTrack muss von Anfang an mehrere unabhängige Benutzer unterstützen.

Jeder Benutzer besitzt eine eindeutige user_id.

Beispiel:

users

├── id
├── username
├── display_name
├── email
├── created_at
└── updated_at

Weitere Benutzerinformationen können getrennt geführt werden:

user_settings
social_connections
privacy_settings

—

9. Benutzertrennung

Daten verschiedener Benutzer dürfen niemals vermischt werden.

Persönliche Daten müssen, soweit relevant, eine user_id besitzen.

Beispiele:

catches.user_id

waters.user_id

photos.user_id

saved_locations.user_id

statistics müssen immer auf den jeweiligen Benutzer begrenzt werden.

—

10. User-Modul

Das User-Modul verwaltet:

* Benutzerprofil
* Benutzername
* Anzeigename
* persönliche Einstellungen
* Social-Media-Verbindungen
* Datenschutz
* Freigabeeinstellungen

Social-Media-Verbindungen gehören zum Benutzerprofil.

Sie gehören nicht direkt in einen Fangdatensatz.

—

11. GPS-Modul

GPS ist ein eigenständiges Grundmodul.

Es darf nicht als Bestandteil von Catches implementiert werden.

Das GPS-Modul soll unterstützen:

* aktuellen Standort ermitteln
* Home-Standort speichern
* Home-Standort ändern
* Fangposition ermitteln
* Gewässerposition ermitteln
* Standort manuell auswählen
* Standort bearbeiten
* gespeicherte Standorte verwalten
* Entfernungen berechnen
* Standort teilen

Beispielhafte Schnittstellen:

GPS.getCurrentLocation()

GPS.getHomeLocation()

GPS.saveHomeLocation()

GPS.saveLocation()

GPS.getLocation()

GPS.calculateDistance()

GPS.shareLocation()

—

12. Standortdaten

GPS-Daten werden zentral gespeichert.

Beispiele:

users
└── home_location

catches
├── latitude
├── longitude
└── location_timestamp

waters
├── latitude
└── longitude

saved_locations
├── user_id
├── name
├── latitude
├── longitude
└── type

Mögliche Standorttypen:

* home
* favorite
* meeting
* other

Der Home-Standort ist ein persönlicher Benutzerstandort.

Er darf nicht automatisch öffentlich geteilt werden.

—

13. Weather-Modul

Weather ist ein eigenständiges Datenmodul.

Es muss:

* selbstständig aufgerufen werden können
* Wetterdaten anzeigen können
* Wetterdaten anderen Modulen zur Verfügung stellen können

Mögliche Wetterdaten:

* Temperatur
* Luftdruck
* Luftfeuchtigkeit
* Windgeschwindigkeit
* Windrichtung
* Niederschlag
* Wetterzustand
* weitere verfügbare Wetterdaten

Beispiel:

Weather.getData(latitude, longitude, timestamp)

Catches kann diese Daten anschließend dem Fang zuordnen.

—

14. Tides-Modul

Tides ist ein eigenständiges Datenmodul.

Es muss:

* selbstständig aufgerufen werden können
* Gezeitendaten anzeigen können
* Gezeitendaten anderen Modulen zur Verfügung stellen können

Catches kann die Gezeitendaten anhand von:

* GPS/Ort
* Datum
* Uhrzeit

abrufen und dem Fang zuordnen.

—

15. Moon-Modul

Moon ist ein eigenständiges Datenmodul.

Es muss:

* selbstständig aufgerufen werden können
* Mondinformationen anzeigen können
* Mondinformationen anderen Modulen zur Verfügung stellen können

Catches kann die Mondinformationen anhand des Fangzeitpunktes abrufen.

—

16. Waters-Modul

Waters ist ein eigenständiges Modul für Gewässer.

Es soll:

* Gewässer verwalten
* Gewässerpositionen speichern
* Gewässer suchen
* Gewässer anhand der GPS-Position vorschlagen
* Gewässer anderen Modulen zur Verfügung stellen

Beispiel:

Waters.getNearby(latitude, longitude)

—

17. Photos-Modul

Photos ist ein eigenständiges Modul.

Es soll Fotos verwalten und anderen Modulen zuordnen können.

Beispiel:

Photos.getForCatch(catchId)

Fotos gehören grundsätzlich zum jeweiligen Benutzer und dürfen nicht mit Daten anderer Benutzer vermischt werden.

—

18. Automatisch ermittelte Daten

Dies ist eine verbindliche Grundregel für CatchTrack:

AUTOMATISCH ERMITTELTE DATEN SIND VORSCHLÄGE UND NIEMALS UNVERÄNDERBARE DATEN.

Der Benutzer muss automatisch ermittelte Werte korrigieren können, sofern dies fachlich sinnvoll ist.

Das gilt insbesondere für:

* Datum
* Uhrzeit
* GPS
* Gewässer
* Temperatur
* Luftdruck
* Luftfeuchtigkeit
* Wind
* Niederschlag
* Wetterzustand
* Gezeiten
* Mondinformationen

—

19. Automatische Daten und Benutzerwerte

Wenn ein automatisch ermittelter Wert vom Benutzer geändert werden kann, muss die Datenstruktur die Herkunft des Wertes nachvollziehbar halten.

Beispiel:

temperature
temperature_source

Mögliche Quellen:

* api
* gps
* calculated
* user

Alternativ können Originalwert und bestätigter Wert getrennt gespeichert werden.

Beispiel:

temperature_auto = 16.0

temperature_user = 23.0

Die Anwendung muss anschließend den bestätigten Benutzerwert verwenden.

—

20. Beispiel Weather

Wetterdienst meldet:

Temperatur = 16 °C

Der Benutzer stellt vor Ort fest:

Temperatur = 23 °C

Der Benutzer darf den Wert ändern.

Das gespeicherte Ergebnis muss erkennen lassen:

* welcher Wert automatisch ermittelt wurde
* welcher Wert vom Benutzer bestätigt/geändert wurde

Dadurch bleiben Daten für spätere Auswertungen nachvollziehbar.

—

21. Beispiel GPS

GPS ermittelt:

latitude = A
longitude = B

Der Benutzer stellt fest, dass die Position nicht korrekt ist.

Der Benutzer kann:

* GPS erneut ermitteln
* Position manuell korrigieren
* Position auf einer Karte auswählen

Der anschließend bestätigte Standort wird dem jeweiligen Datensatz zugeordnet.

—

22. Catches / Neuer Fang

Das Modul wird in der Benutzeroberfläche auf Deutsch als:

NEUER FANG

bezeichnet.

Catches ist die zentrale Eingabefunktion für einen Fang.

Der Fangdatensatz soll später unter anderem enthalten können:

* user_id
* Datum
* Uhrzeit
* Fischart
* Gewicht
* Länge
* Gewässer
* GPS
* Köder
* Fangmethode
* Wetter
* Gezeiten
* Mondphase
* Fotos
* Notizen

Automatisch ermittelte Daten werden vorgeschlagen und können vom Benutzer korrigiert werden.

—

23. Neuer Fang – Datum und Uhrzeit

Beim Öffnen von „Neuer Fang“:

Datum und Uhrzeit werden standardmäßig vorgeschlagen.

Der Benutzer kann beide Werte jederzeit ändern.

Dies ist erforderlich, weil ein Fang auch:

* später am selben Tag
* zu Hause
* am nächsten Tag
* mehrere Tage später

eingetragen werden kann.

Der gespeicherte Fangzeitpunkt ist der vom Benutzer bestätigte Zeitpunkt.

—

24. Neuer Fang – Gewässer

Das Gewässer kann:

* automatisch vorgeschlagen werden
* anhand von GPS ermittelt werden
* aus vorhandenen Gewässern ausgewählt werden
* manuell geändert werden

Der Benutzer hat immer die Möglichkeit, den vorgeschlagenen Wert zu korrigieren.

—

25. Neuer Fang – GPS

Die Fangposition kann:

* automatisch über GPS ermittelt werden
* manuell geändert werden
* auf einer Karte ausgewählt werden

Die bestätigte Position wird mit dem Fang gespeichert.

—

26. Neuer Fang – Wetter

Das Wetter kann anhand von:

* Fangposition
* Fangdatum
* Fangzeit

automatisch ermittelt werden.

Die ermittelten Werte werden vorgeschlagen.

Der Benutzer kann sie korrigieren.

Beispielsweise:

API:
16 °C

Benutzer:
23 °C

Gespeichert wird der bestätigte Wert sowie, soweit technisch möglich, die ursprüngliche Datenquelle.

—

27. Neuer Fang – Gezeiten

Die Gezeiten können anhand von:

* Fangposition
* Fangdatum
* Fangzeit

automatisch ermittelt werden.

Die Werte können dem Fang zugeordnet werden.

Wenn die automatische Ermittlung nicht verfügbar oder nicht korrekt ist, muss der Benutzer die Daten manuell ergänzen oder korrigieren können.

—

28. Neuer Fang – Mond

Die Mondinformationen werden anhand des bestätigten Fangzeitpunktes ermittelt.

Sie können dem Fang zugeordnet werden.

Automatisch berechnete Informationen müssen nachvollziehbar bleiben.

—

29. Fangbuch

Catchbook wird in der Benutzeroberfläche als:

FANGBUCH

bezeichnet.

Das Fangbuch zeigt die gespeicherten Fangdaten.

Es soll später auch anzeigen können:

* Wetter
* Gezeiten
* Mond
* GPS
* Gewässer
* Fotos
* Köder
* Fangmethode
* Notizen

—

30. Datenbeziehungen

Ein Fang kann Daten aus mehreren Modulen verwenden.

Beispiel:

Fang
│
├── User
├── GPS
├── Waters
├── Weather
├── Tides
├── Moon
├── Photos
├── Fish Database
└── Equipment

Diese Verknüpfungen erfolgen über eindeutige IDs und definierte Schnittstellen.

Daten sollen nicht unnötig mehrfach gespeichert werden.

Wenn für historische Daten ein Snapshot erforderlich ist, muss dieser ausdrücklich als historischer Wert gekennzeichnet werden.

—

31. Historische Daten

Daten, die zum Zeitpunkt eines Fangs automatisch ermittelt wurden, sollen grundsätzlich als historische Fangdaten erhalten bleiben.

Beispiel:

Der aktuelle Wetterdienst ändert später seine Daten.

Der bereits gespeicherte Fang darf dadurch nicht rückwirkend verändert werden.

Ein Fang muss die zum Zeitpunkt der Speicherung bestätigten Daten behalten.

—

32. Social Media / Teilen

Social-Media-Verbindungen gehören zum Benutzerprofil.

Das Teilen ist eine eigene Funktion.

Der Benutzer entscheidet:

* ob geteilt wird
* was geteilt wird
* mit wem geteilt wird
* über welchen Dienst geteilt wird

Home-Standorte und private GPS-Daten dürfen nicht automatisch öffentlich geteilt werden.

—

33. Datenschutz

Benutzerbezogene Daten müssen voneinander getrennt bleiben.

Private Daten dürfen nicht automatisch veröffentlicht werden.

Besonders geschützt:

* Home-Standort
* persönliche GPS-Daten
* Benutzerprofil
* Social-Media-Verbindungen

Freigaben müssen ausdrücklich durch den Benutzer ausgelöst werden.

—

34. Sprache der Benutzeroberfläche

Die Benutzeroberfläche soll grundsätzlich Deutsch verwenden.

Beispiele:

Catches → Neuer Fang

Catchbook → Fangbuch

Fish Database → Fischdatenbank

Fish → Fisch

Weather → Wetter

Tides → Gezeiten

Moon → Mond

Settings → Einstellungen

Englische Begriffe dürfen intern im Code verwendet werden.

Sie sollen jedoch nicht unnötig in der Benutzeroberfläche erscheinen.

—

35. Modulaktivierung

Module werden zentral registriert.

Ein Modul kann registriert, aber deaktiviert sein.

Deaktivierte Module dürfen keine aktive Benutzerfunktion bereitstellen.

Die Aktivierung erfolgt erst, wenn das Modul technisch ausreichend fertiggestellt und getestet ist.

—

36. Keine unnötigen Änderungen

Bei jeder Änderung gilt:

Nur die tatsächlich benötigten Dateien verändern.

Keine fertigen Module neu schreiben.

Keine bestehenden Abläufe ändern, wenn dies für die aktuelle Aufgabe nicht erforderlich ist.

Keine Dateien löschen, solange ihre Funktion nicht eindeutig geprüft und ihre Entfernung beschlossen wurde.

—

37. Vollständige Dateien

Bei Änderungen an Projektdateien wird grundsätzlich die vollständige neue Version der betroffenen Datei erstellt.

Keine unklaren Teiländerungen.

Keine Anweisungen wie:

„Ersetze irgendwo Zeile X.“

Die vollständige Datei ist die neue Masterversion.

—

38. Working Copy / GitHub

Der praktische Arbeitsablauf:

ChatGPT
↓
vollständige Datei
↓
Working Copy
↓
Vorschau / Test
↓
Commit
↓
Push
↓
GitHub

ChatGPT arbeitet grundsätzlich auf Basis des aktuellen GitHub-Stands.

Nach Änderungen über Working Copy muss der aktuelle Stand erneut geprüft werden, bevor darauf aufgebaut wird.

—

39. Projektstand vor jeder Arbeit

Vor einer Änderung müssen geprüft werden:

1. PROJECT_RULES.md
2. aktueller GitHub-Stand
3. betroffene Dateien
4. vorhandene Module
5. Abhängigkeiten
6. Datenbankstruktur
7. bereits abgeschlossene Funktionen
8. relevante Schnittstellen

Bereits fertige Funktionen dürfen nicht erneut erstellt werden.

—

40. Änderungsprotokoll

Wichtige Architekturentscheidungen müssen dokumentiert werden.

Insbesondere:

* abgeschlossene Module
* neue Datenbankstrukturen
* neue Schnittstellen
* Architekturentscheidungen
* Änderungen an Abhängigkeiten
* bewusste Abweichungen vom ursprünglichen Plan

—

41. Step-System

Step 1 endet mit dem abgeschlossenen Weather-Modul.

Step 2 beginnt danach.

Vor jedem neuen Step wird der aktuelle Projektstand geprüft.

Ein abgeschlossener Step wird nicht erneut begonnen.

—

42. Entwicklungsreihenfolge

Die grundlegenden Abhängigkeiten sollen möglichst zuerst fertiggestellt werden.

Empfohlene Reihenfolge:

1. User / Account
2. Benutzertrennung in Datenbank
3. GPS
4. Waters
5. Weather
6. Tides
7. Moon
8. Photos
9. Fish Database
10. Equipment
11. Catches / Neuer Fang
12. Fangbuch
13. Statistics
14. Sharing / Social Media
15. weitere Funktionen

Die Reihenfolge darf geändert werden, wenn technische Abhängigkeiten dies erfordern.

—

43. Keine unnötige Kopplung

Module sollen möglichst unabhängig bleiben.

Catches darf beispielsweise nicht die interne Implementierung von:

* GPS
* Weather
* Tides
* Moon
* Waters
* Photos

kennen müssen.

Catches verwendet ausschließlich deren definierte Schnittstellen.

—

44. Änderungen an Schnittstellen

Eine bestehende Schnittstelle darf nicht ohne Prüfung inkompatibel geändert werden.

Wenn eine Schnittstelle geändert werden muss:

1. Abhängige Module identifizieren
2. Auswirkungen prüfen
3. Schnittstelle dokumentieren
4. betroffene Module kontrolliert anpassen
5. anschließend testen

—

45. Fehlerbehandlung

Automatische Datenquellen können ausfallen oder falsche Werte liefern.

Daher muss jedes Datenmodul grundsätzlich mit folgenden Situationen umgehen können:

* keine Verbindung
* keine Daten
* ungenaue Daten
* veraltete Daten
* ungültige Daten
* Benutzerkorrektur

Die Anwendung darf bei einem Ausfall eines externen Datenmoduls nicht unnötig andere Funktionen blockieren.

—

46. Offline-Grundprinzip

Soweit technisch möglich, sollen bereits gespeicherte Fangdaten auch ohne Internetverbindung verfügbar bleiben.

Externe Daten wie:

* Weather
* Tides
* Karten
* externe Dienste

können eine Verbindung benötigen.

Bereits gespeicherte historische Daten dürfen dadurch nicht verloren gehen.

—

47. Masterprinzip

CatchTrack wird nach folgendem Prinzip entwickelt:

ZENTRALE DATENBANK
+
MEHRBENUTZERFÄHIGKEIT
+
UNABHÄNGIGE MODULE
+
KLARE SCHNITTSTELLEN
+
WIEDERVERWENDBARE FUNKTIONEN
+
AUTOMATISCHE DATEN ALS VORSCHLÄGE
+
BENUTZERKORREKTUR
+
HISTORISCHE DATENSTABILITÄT
+
DOKUMENTIERTE ARCHITEKTUR

Ziel ist eine stabile Masterversion, bei der neue Funktionen bestehende Funktionen nicht unnötig verändern oder zerstören.

—

48. Absolute Arbeitsregel

Bei Unsicherheit:

NICHT raten.

NICHT von einem alten Projektstand ausgehen.

NICHT bereits fertige Funktionen neu erstellen.

NICHT bestehende Abläufe verändern.

NICHT Dateien löschen.

Zuerst den aktuellen Projektstand lesen.

Dann Abhängigkeiten prüfen.

Dann die kleinste notwendige Änderung planen.

Dann die vollständige betroffene Datei erstellen.

Nach der Übertragung über Working Copy den neuen GitHub-Stand erneut prüfen.

Erst danach mit dem nächsten Arbeitsschritt fortfahren.

—

GitHub-Commit-Historie als Fortschrittsreferenz

Da jede bearbeitete Datei einzeln über Working Copy nach GitHub übertragen und committed wird, gilt die Git-Commit-Historie als zusätzliche Referenz für den tatsächlichen Projektfortschritt.

Bei jeder weiteren Projektprüfung ist daher:

1. der aktuelle Dateistand auf main zu prüfen
2. die Commit-Historie der betreffenden Datei zu prüfen
3. Datum und Uhrzeit des letzten relevanten Commits zu berücksichtigen
4. die Commit-Nachricht zur Identifikation der bearbeiteten Datei/Funktion heranzuziehen
5. der Commit-Verlauf mit den Projektstatus- und Planungsdateien sowie dem tatsächlichen Dateistand abzugleichen

Da grundsätzlich jede Datei einzeln committed wird, kann anhand der Historie nachvollzogen werden, welche Datei zuletzt bearbeitet wurde.

Ein einzelner Commit gilt jedoch NICHT automatisch als Nachweis dafür, dass eine Funktion vollständig fertiggestellt ist.

Entscheidend ist immer die Kombination aus:

GitHub-Dateistand
+
Commit-Historie
+
Projektplan
+
Projektregeln
+
tatsächliche Funktionalität.

Bei zukünftigen Bestandsaufnahmen soll der letzte relevante Commit deshalb automatisch als zusätzliche Fortschrittsreferenz berücksichtigt werden.

—

Nach Möglichkeit Vollständige Ersatzdateien

Bei jeder Änderung oder Neuerstellung einer Projektdatei wird grundsätzlich immer die vollständige Datei ausgegeben.

Es werden keine:

* Teilstücke
* Codefragmente
* Such-und-Ersetze-Anweisungen
* einzelnen anzufügenden Passagen
* Zeilenänderungen
* Patch-Anweisungen

als Arbeitsgrundlage verwendet.

Der Benutzer übernimmt die von ChatGPT bereitgestellte vollständige Datei anschließend über Working Copy in das Projekt und erstellt den entsprechenden GitHub-Commit.

Arbeitsablauf:

CHATGPT
↓
VOLLSTÄNDIGE MASTERDATEI
↓
WORKING COPY
↓
GITHUB COMMIT

Diese Vorgehensweise dient der Vermeidung von:

* vergessenen Änderungen
* falschen Einfügepositionen
* doppelten Codeabschnitten
* beschädigten Dateien
* Versionsabweichungen zwischen ChatGPT und GitHub

Wenn eine bestehende Datei geändert werden muss, wird zuerst die aktuelle Datei aus GitHub eingelesen und anschließend eine vollständige neue Version dieser Datei ausgegeben.

—

49. Verbindliche Modul-Gesamtprüfung

Vor jeder Erstellung oder grundlegenden Überarbeitung eines Moduls muss der vollständige tatsächliche Modulordner auf GitHub geprüft werden.

Es darf nicht ausschließlich von einer erwarteten oder dokumentierten Dateiliste ausgegangen werden.

Dabei müssen mindestens geprüft werden:

* alle vorhandenen Dateien
* Dateinamen
* Dateiendungen
* Unterordner
* HTML-Dateien
* CSS-Dateien
* JavaScript-Dateien
* JSON-Dateien
* Konfigurationsdateien
* Services
* Daten- und Hilfsdateien
* sonstige Dateien

Grundsatz:

TATSÄCHLICHER MODULORDNER
↓
VOLLSTÄNDIG EINLESEN
↓
ABHÄNGIGKEITEN PRÜFEN
↓
DANN ERST ÄNDERN

—

50. Altbestände und Löschkandidaten

Bei jeder Modulprüfung muss ausdrücklich nach Altbeständen gesucht werden.

Mögliche Altbestände:

* alte Dateiversionen
* nicht mehr verwendete Dateien
* umbenannte Dateien
* doppelte Dateien
* frühere Implementierungen
* Testdateien
* temporäre Dateien
* veraltete Konfigurationen
* Dateien aus früheren Modulstrukturen

Altbestände dürfen nicht einfach ignoriert werden.

Eine möglicherweise nicht mehr benötigte Datei wird zunächst als:

LÖSCHKANDIDAT

eingestuft.

Vor einer Löschung muss geprüft werden, ob die Datei:

1. importiert wird
2. dynamisch geladen wird
3. vom Module Manager referenziert wird
4. in module.json angegeben ist
5. vom Router verwendet wird
6. von Core-Dateien verwendet wird
7. von anderen Modulen verwendet wird
8. in Konfigurationen referenziert wird
9. für eine noch benötigte Funktion erforderlich ist
10. tatsächlich nur ein veralteter Altbestand ist

ChatGPT löscht solche Dateien nicht stillschweigend.

Der Benutzer wird über einen bestätigten Löschkandidaten informiert und entscheidet über die tatsächliche Löschung.

—

51. Modul als Gesamtpaket

Ein Modul wird grundsätzlich als zusammengehöriges Gesamtpaket betrachtet.

Wenn mehrere Dateien für die Funktion eines Moduls erforderlich sind, sollen diese nicht isoliert voneinander entwickelt werden.

Arbeitsablauf:

MODULORDNER PRÜFEN
↓
ALLE DATEIEN EINLESEN
↓
ABHÄNGIGKEITEN PRÜFEN
↓
ALTBESTÄNDE IDENTIFIZIEREN
↓
ARCHITEKTUR PRÜFEN
↓
MASTERSTRUKTUR FESTLEGEN
↓
ERFORDERLICHE DATEIEN GEMEINSAM ERSTELLEN
↓
GESAMTTEST

Die Anzahl der Dateien eines Moduls ist nicht künstlich begrenzt.

Zusätzliche Dateien sind zulässig, wenn sie die Wartbarkeit, Trennung der Verantwortlichkeiten oder technische Funktion verbessern.

—

52. Master-Modul statt Flickwerk

Wenn ein Modul fertiggestellt oder grundlegend überarbeitet wird, sollen nach Möglichkeit alle erforderlichen Dateien in einem Arbeitsgang als abgestimmte Master-Version erstellt werden.

Beispiel:

modules/weather/

├── module.json
├── weather.html
├── weather.css
└── weather.js

Alle Dateien müssen miteinander harmonieren.

Wenn eine andere Dateiaufteilung technisch sinnvoller ist, darf das Modul beispielsweise zusätzlich Services oder Daten-/Hilfsdateien enthalten.

Eine bestehende Datei darf vollständig neu erstellt werden, wenn eine saubere Master-Version technisch sinnvoller ist als eine Vielzahl kleiner Reparaturen.

Grundsatz:

FUNKTIONIERENDE UND WARTBARE GESAMTSTRUKTUR
vor
HISTORISCHER DATEIERHALTUNG

—

53. Keine künstliche Dateierhaltung

Eine vorhandene Datei muss nicht erhalten bleiben, nur weil sie bereits existiert.

Wenn eine saubere Master-Struktur eine andere Dateiaufteilung erfordert, dürfen:

* Dateien vollständig ersetzt werden
* Dateien auf mehrere Dateien aufgeteilt werden
* mehrere Dateien zusammengeführt werden
* überflüssige Dateien als Löschkandidaten markiert werden

Voraussetzung ist immer die vorherige Prüfung der Abhängigkeiten.

Historische Altbestände werden nicht aus Prinzip erhalten.

Ebenso werden bestehende Dateien nicht aus Prinzip neu geschrieben.

Entscheidend ist die technisch sinnvollste Gesamtstruktur.

—

54. Vollständige Moduldateien gemeinsam ausgeben

Wenn mehrere Dateien eines Moduls geändert oder neu erstellt werden müssen, sollen diese Dateien nach Möglichkeit gemeinsam als vollständige Masterdateien ausgegeben werden.

Bevorzugter Ablauf:

ANALYSE
↓
MASTERSTRUKTUR
↓
ALLE ERFORDERLICHEN DATEIEN
↓
EIN KOPIER-/ÜBERTRAGUNGSVORGANG
↓
WORKING COPY
↓
TEST
↓
COMMIT
↓
GITHUB-PRÜFUNG

Es sollen keine künstlichen Einzeldatei-Schritte erzeugt werden, wenn bereits feststeht, dass mehrere Dateien miteinander abgestimmt werden müssen.

—

55. Abschlussübersicht eines Modul-Arbeitsschritts

Nach der Entwicklung oder grundlegenden Überarbeitung eines Moduls muss die Ausgabe eine vollständige Übersicht enthalten.

Beispiel:

MODUL:
modules/weather/

ZU ERSETZEN:

1. modules/weather/module.json
2. modules/weather/weather.html
3. modules/weather/weather.css
4. modules/weather/weather.js

NEU ZU ERSTELLEN:
5. …

LÖSCHKANDIDATEN:
6. …

UNVERÄNDERT:
7. …

Danach werden die vollständigen Inhalte aller zu ersetzenden oder neu zu erstellenden Dateien gemeinsam ausgegeben.

Löschkandidaten werden nicht automatisch gelöscht.

—

56. Modul-Abschlussprüfung

Ein Modul darf erst als MASTER bzw. technisch abgeschlossen bezeichnet werden, wenn mindestens geprüft wurde:

* vollständiger Modulordner geprüft
* alle benötigten Dateien vorhanden
* Dateinamen und Pfade korrekt
* Dateien miteinander abgestimmt
* Abhängigkeiten geprüft
* Altbestände identifiziert
* Löschkandidaten dokumentiert
* Mehrsprachigkeit berücksichtigt
* Fehlerbehandlung berücksichtigt
* Runtime-System berücksichtigt
* Daten-Schnittstellen geprüft
* relevante externe Abhängigkeiten geprüft
* Modul getestet
* keine ungeklärten kritischen Fehler bestehen

Ein einzelner erfolgreicher Test einer Datei reicht nicht aus, um ein gesamtes Modul als fertig zu bezeichnen.

—

57. Keine unnötigen Modul-Wiederholungen

Ein bereits geprüfter und aktueller Modulstand wird nicht ohne konkreten Grund erneut vollständig überarbeitet.

Eine erneute Modulprüfung ist insbesondere erforderlich, wenn:

* sich der GitHub-Stand geändert hat
* neue Dateien hinzugekommen sind
* relevante Commits hinzugekommen sind
* der Benutzer ausdrücklich eine erneute Prüfung verlangt
* ein Fehler oder Widerspruch festgestellt wurde
* eine neue Funktion Abhängigkeiten des Moduls betrifft

Ist ein Modul bereits aktuell und besteht kein Änderungsbedarf:

MODUL AKTUELL
↓
KEINE NEUERSTELLUNG
↓
KEINE UNNÖTIGE ÜBERARBEITUNG
↓
WEITER MIT DEM NÄCHSTEN SINNVOLLEN ARBEITSSCHRITT

—

58. Priorität bei Modulentscheidungen

Bei der Entscheidung, ob eine Datei erhalten, ersetzt, aufgeteilt, zusammengeführt oder gelöscht werden soll, gilt folgende Reihenfolge:

1. tatsächliche Funktionalität
2. Abhängigkeiten
3. Datenintegrität
4. definierte Schnittstellen
5. Wartbarkeit
6. Erweiterbarkeit
7. bestehende Projektarchitektur
8. historische Dateistruktur

Eine technisch bessere Master-Struktur darf eine historische Dateistruktur ersetzen.

—

59. Verbindlicher Arbeitsgrundsatz für Module

Bei jedem Modul gilt:

ZUERST LESEN.
DANN VERSTEHEN.
DANN ABHÄNGIGKEITEN PRÜFEN.
DANN ENTSCHEIDEN.
DANN MASTERDATEIEN ERSTELLEN.
DANN TESTEN.
DANN COMMITTEN.
DANN GITHUB-STAND ERNEUT PRÜFEN.

Nicht von einer erwarteten Dateiliste ausgehen.

Altbestände ausdrücklich erkennen.

Löschkandidaten ausdrücklich melden.

Zusammengehörige Dateien als zusammengehöriges Modul behandeln.

Wenn eine vollständige Neuerstellung technisch sinnvoller ist, darf sie durchgeführt werden.

Ziel ist immer eine funktionierende, abgestimmte und wartbare Masterversion.

—

60. Aktualisierungsgrundsatz dieser PROJECT_RULES.md

Diese Datei wird nach demselben Prinzip wie die übrige Projektdokumentation behandelt.

Vor einer Änderung:

1. aktuelle Datei einlesen
2. aktuelle Versionsnummer feststellen
3. vorhandene Regeln prüfen
4. prüfen, ob die gewünschte Regel bereits vorhanden ist
5. nur tatsächlich fehlende oder widersprüchliche Regeln ergänzen
6. Versionsnummer erhöhen
7. Änderungsdatum aktualisieren
8. vollständige Datei als neue Masterversion ausgeben

Bereits vorhandene Regeln werden nicht unnötig dupliziert.

Bei widersprüchlichen Regeln ist die ältere oder schwächere Regel gezielt zu korrigieren, anstatt parallel eine zweite widersprüchliche Regel einzuführen.

—

Ende PROJECT_RULES.md