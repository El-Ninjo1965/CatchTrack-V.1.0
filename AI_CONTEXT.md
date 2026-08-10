CatchTrack – AI_CONTEXT.md

1. ZWECK DIESER DATEI

Diese Datei definiert die verbindlichen technischen Arbeitsregeln für die Weiterentwicklung von CatchTrack.

Sie dient als zentrale Arbeitsgrundlage für jede weitere Entwicklung.

Der tatsächlich vorhandene GitHub-Dateistand hat grundsätzlich Vorrang vor älteren Annahmen, Chatverläufen oder nicht mehr aktuellen Dokumentationen.

Die praktische Zusammenarbeit erfolgt über ChatGPT, Working Copy und GitHub.

⸻

2. PRIORITÄT DER INFORMATIONSQUELLEN

Bei jeder technischen Aufgabe gilt folgende Reihenfolge:

1. Aktueller GitHub-Dateistand
2. Tatsächliche aktuelle Ordner- und Dateistruktur
3. Aktuelle Commit-Historie
4. PROJECT_STATUS.md
5. PROJECT_RULES.md
6. PROJECT_MODULE_PLAN.md
7. AI_CONTEXT.md
8. Ältere Chatverläufe und frühere Annahmen

Bei Widersprüchen ist der tatsächliche aktuelle GitHub-Stand maßgeblich.

⸻

3. GRUNDREGEL: NICHT RATEN

Es darf niemals aufgrund einer erwarteten oder früher bekannten Struktur angenommen werden, dass eine Datei oder Funktion existiert.

Vor Änderungen müssen die tatsächlich vorhandenen Dateien geprüft werden.

Insbesondere bei Modulen:

modules/[MODULNAME]/

muss immer der vollständige aktuelle Ordner geprüft werden.

Dabei sind einzubeziehen:

* HTML
* CSS
* JavaScript
* JSON
* Daten-/Service-Dateien
* Konfigurationen
* Unterordner
* sonstige Dateien
* Altbestände

⸻

4. ÄNDERUNGSGRUNDSATZ

Bestehende funktionierende Dateien werden nicht unnötig verändert.

Vor jeder Änderung ist zu prüfen:

* Wird die Datei tatsächlich benötigt?
* Wird sie importiert?
* Wird sie dynamisch geladen?
* Wird sie vom Module Manager verwendet?
* Wird sie vom Router verwendet?
* Wird sie von anderen Modulen verwendet?
* Bestehen Datenbankabhängigkeiten?
* Bestehen Konfigurationsabhängigkeiten?
* Ist sie Bestandteil einer abgeschlossenen Architektur?

Keine Datei darf stillschweigend gelöscht werden.

Löschungen müssen ausdrücklich als Löschkandidaten ausgewiesen werden.

⸻

5. CORE-MASTER – VERBINDLICHER FREEZE

Der zentrale CatchTrack-Core wird als Master-Version konsolidiert.

Nach ausdrücklicher Fertigstellung gilt:

CORE MASTER
STATUS: ABGESCHLOSSEN / FROZEN

Zum Core-Master gehören insbesondere:

index.html
app.js
core/*
database/database.js
database/schema.sql
database/migrations/*

Die tatsächlich vorhandenen Dateien haben Vorrang vor dieser beispielhaften Auflistung.

Diese Dateien dürfen bei der Entwicklung einzelner Fachmodule nicht unnötig neu erstellt, ersetzt oder verändert werden.

Insbesondere gilt:

app.js
database/schema.sql
database/database.js
core/*

sind grundsätzlich eingefroren.

⸻

6. AUSNAHME VOM CORE-FREEZE

Eine Änderung des Core-Masters ist nur zulässig, wenn eine konkrete technische Anforderung dies zwingend erforderlich macht.

Vor einer Core-Änderung muss ausdrücklich festgestellt werden:

CORE-ÄNDERUNG ERFORDERLICH

Die Änderung wird anschließend begründet und als eigener Arbeitsschritt behandelt.

⸻

7. APP.JS – MASTER-REGEL

app.js ist der zentrale Application Bootstrap.

Die Datei ist für globale Initialisierung zuständig.

Dazu gehören insbesondere:

* Konfiguration laden
* Datenbank initialisieren
* Migrationen registrieren
* Core-Dienste initialisieren
* Modulkonfiguration laden
* Module starten
* globale Fehlerbehandlung
* Runtime-Status

Ein einzelnes Fachmodul darf nicht dazu führen, dass app.js bei jedem Modulwechsel erweitert wird.

Module müssen über die vorhandenen Core-Schnittstellen eingebunden werden.

⸻

8. DATABASE/SCHEMA.SQL – MASTER-REGEL

database/schema.sql ist das zentrale Basisschema für eine neue CatchTrack-Datenbank.

Es ist kein Modul-Schema.

Die Datei wird nicht für jedes neue Modul verändert.

Bereits vorhandene zentrale Datenstrukturen müssen wiederverwendet werden.

Wenn eine neue Datenbankstruktur für ein Modul tatsächlich erforderlich ist, wird dafür eine eigene Migration verwendet.

⸻

9. DATENBANK-MIGRATIONSSYSTEM

CatchTrack verwendet ein migrationsbasiertes Datenbanksystem.

Vorhandene Migrationen sind Bestandteil der Datenbankhistorie.

Sie dürfen nicht nachträglich verändert oder gelöscht werden, nur weil spätere Versionen die Struktur erweitern.

Neue strukturelle Änderungen werden ausschließlich durch neue Migrationen vorgenommen.

Eine Migration muss:

* eindeutig versioniert sein
* reproduzierbar sein
* bestehende Daten berücksichtigen
* keine bestehenden Informationen unnötig zerstören
* zur zentralen Datenbankarchitektur passen

⸻

10. MODULARCHITEKTUR

Jedes Fachmodul befindet sich unter:

modules/[MODULNAME]/

Eine mögliche Struktur ist beispielsweise:

modules/
└── gps/
├── module.json
├── gps.html
├── gps.css
└── gps.js

Die tatsächliche Struktur muss jedoch immer aus GitHub gelesen werden.

Es darf keine Dateiliste aus früheren Annahmen vorausgesetzt werden.

⸻

11. MODULE MANAGER

Module werden über den zentralen Module Manager geladen.

Der Module Manager übernimmt unter anderem:

* Moduldefinition
* Aktivierung
* HTML-Laden
* CSS-Laden
* JavaScript-Laden
* Initialisierung
* Modulstatus
* Fehlerbehandlung

Ein Fachmodul darf nicht am Module Manager vorbei eigene globale Ladewege etablieren.

⸻

12. MODULE.JSON

module.json definiert die technische Modulbeschreibung.

Dazu können gehören:

* Modulname
* Version
* Pfad
* Aktivierungsstatus
* HTML-Datei
* CSS-Datei
* JavaScript-Datei
* Initializer
* Abhängigkeiten
* weitere Modulmetadaten

Die tatsächlich bestehende Definition hat Vorrang.

⸻

13. SCHNITTSTELLEN

Module müssen klare Schnittstellen zum Core besitzen.

Ein Modul darf globale Core-Funktionen verwenden, soll diese aber nicht duplizieren.

Beispiele:

CatchTrackDatabase
CatchTrackAPI
CatchTrackRouter
CatchTrackStorageManager
CatchTrackLanguageManager
CatchTrackPermissionManager
CatchTrackRuntimeStatus
CatchTrackErrorHandler
CatchTrackModuleManager
CatchTrackIdentity

Wenn eine benötigte globale Funktion bereits existiert, wird sie verwendet.

Es werden keine parallelen Ersatzsysteme gebaut.

⸻

14. DATENBANKZUGRIFF VON MODULEN

Module greifen auf die zentrale Datenbank zu.

Es wird keine zweite parallele Datenbank aufgebaut.

Grundsätzlich:

Modul
↓
CatchTrackDatabase
↓
SQL.js
↓
zentrale CatchTrack-Datenbank

Modulspezifische Datenbankerweiterungen werden über Migrationen vorgenommen.

⸻

15. AUTOMATISCH ERMITTELTE DATEN

Automatisch ermittelte Daten sind grundsätzlich als:

VORSCHLAG

zu behandeln, sofern sie nicht ausdrücklich als verlässlich und endgültig definiert wurden.

Das betrifft insbesondere:

* GPS
* Wetter
* Fischidentifikation
* Geodaten
* automatische Standortbestimmung
* KI-Ergebnisse
* externe Daten
* berechnete Werte

Der Benutzer muss automatische Werte bei Bedarf korrigieren können.

Automatisch ermittelte Daten dürfen nicht ungeprüft endgültige Benutzerdaten überschreiben.

⸻

16. GPS – ABGESCHLOSSENE VERSION

Stand: 09.08.2026

Das GPS-Modul wurde als funktional abgeschlossene Version 2.5.0 umgesetzt und geprüft.

Modulpfad:

modules/gps/

Aktuelle Dateien:

* gps.html
* gps.css
* gps.js

Die tatsächlich vorhandene module.json ist maßgeblich für die technische Moduldefinition.

⸻

17. FUNKTIONEN DES GPS-MODULS

Das GPS-Modul umfasst aktuell:

* aktuelle Standortbestimmung
* explizite Standortaktualisierung
* Vermeidung alter Geolocation-Cache-Daten
* Latitude
* Longitude
* GPS-Genauigkeit
* Höhe über Meeresspiegel, soweit vom Endgerät geliefert
* Höhengenauigkeit, soweit vom Endgerät geliefert
* Zeitpunkt der Standortbestimmung
* Aufenthaltsdauer
* Home Location speichern
* Home Location löschen
* Route zum aktuellen Standort
* Route zur Home Location
* aktuellen Standort teilen
* manuelle Eingabe eines Gewässernamens
* Speicherung des aktuellen GPS-Standorts als Gewässer
* Speicherung der Routing-Koordinaten des Gewässers

Nicht Bestandteil des GPS-Moduls:

* Bewegungsrichtung
* Geschwindigkeit
* Höhenunterschied zu Home
* automatischer Standortstatus
* automatische Gewässererkennung

⸻

18. GPS-DATENSTRUKTUR

Ein GPS-Positionsobjekt enthält konzeptionell:

* latitude
* longitude
* accuracy
* altitude
* altitudeAccuracy
* timestamp
* source

Nicht jedes Endgerät liefert zwingend alle Werte.

Insbesondere Höhe und Höhengenauigkeit können abhängig vom Endgerät fehlen.

⸻

19. GEWÄSSER-SPEICHERUNG DURCH GPS

Der Benutzer kann auf der GPS-Seite einen eigenen Gewässernamen eingeben.

Erst durch eine bewusste Benutzeraktion wird das Gewässer gespeichert.

Es erfolgt keine automatische Gewässererkennung.

Der bisherige gemeinsame Speicher-Schlüssel lautet:

waters:entries

Ein bisher gespeicherter Legacy-Gewässerdatensatz enthält derzeit:

* id
* name
* latitude
* longitude
* altitude
* accuracy
* timestamp
* createdAt
* source

Latitude und Longitude bilden die Routing-Position.

Das GPS-Modul hat damit die Grundlage für das Waters-Modul geschaffen.

Der bisherige waters:entries-Speicher gilt im Rahmen der späteren Identity-/Waters-Migration als Legacy-Bestand.

Er darf nicht ungeprüft als dauerhafte parallele Datenquelle weitergeführt werden.

⸻

20. GPS → WATERS

Der bisherige Übergabepunkt lautet:

GPS
↓
waters:entries
↓
Waters-Modul

Das GPS-Modul ermittelt und speichert die Position.

Das Waters-Modul verwaltet die Gewässer.

Zukünftiger Master-Übergabepunkt:

GPS
↓
Positionsdaten
↓
Waters
↓
zentrale CatchTrack-Datenbank

Die endgültige Speicherung eines persönlichen Gewässers erfolgt im Waters-Datenmodell mit Zuordnung zum aktuellen Benutzer.

⸻

21. IDENTITY CORE – ZENTRALE BENUTZERIDENTITÄT

CatchTrack verwendet eine zentrale Benutzeridentität.

Die bereits vorhandene Datenbankstruktur mit users bildet die Grundlage der Benutzeridentität.

Der Identity Core stellt für die gesamte Anwendung mindestens folgende Informationen und Funktionen bereit:

* aktueller Benutzer
* aktuelle user_id
* Benutzer laden
* aktuellen Benutzer setzen
* aktuellen Benutzer wechseln, sofern dies später erforderlich ist
* aktuellen Benutzer zurücksetzen
* Prüfung, ob ein gültiger Benutzer vorhanden ist

Die konkrete technische Implementierung muss sich in die vorhandene CatchTrack-Core-Architektur integrieren.

Es darf kein Fachmodul eine eigene Benutzeridentität oder eigene user_id-Logik entwickeln.

Grundprinzip:

User
↓
Identity Core
↓
current user_id
↓
persönliche Daten aller Fachmodule

Der Identity Core ist eine zentrale technische Abhängigkeit für alle persönlichen Datenmodule.

⸻

22. USER_ID ALS STANDARD FÜR PERSÖNLICHE DATEN

Daten, die eindeutig einem Benutzer gehören, müssen langfristig über user_id dem Benutzer zugeordnet werden.

Dies betrifft insbesondere:

* Waters
* Catches
* Fotos
* persönliche Einstellungen
* persönliche Fishing Spots
* weitere personenbezogene Fachmoduldaten
* persönliche Statistiken
* persönliche Cloud-Daten

Eine bereits vorhandene zentrale user_id wird wiederverwendet.

Es werden keine parallelen Benutzer- oder Identifikationssysteme aufgebaut.

Bei neuen persönlichen Datenstrukturen ist grundsätzlich zu prüfen, ob eine user_id erforderlich ist.

Die Benutzerzuordnung erfolgt möglichst auf Datenbankebene über Foreign Keys und geeignete Indizes.

⸻

23. VERBINDLICHE USER-ID-PRÜFUNG BEI JEDEM MODUL

Bei jedem neuen oder zu überarbeitenden Fachmodul muss vor der Implementierung geprüft werden, ob die vom Modul verwalteten Daten einem Benutzer zugeordnet werden müssen.

Diese Prüfung ist verbindlicher Bestandteil der Modul-Bestandsaufnahme.

Dabei ist insbesondere zu prüfen:

* Ist der Datensatz persönlich?
* Kann der Datensatz von mehreren Benutzern unabhängig voneinander existieren?
* Muss der Datensatz später über den Identity Core gefiltert werden?
* Wird der Datensatz später mit Cloud-/Sharing-Funktionen verwendet?
* Wird der Datensatz für persönliche Statistiken benötigt?
* Kann der Datensatz in anonymisierten oder globalen Statistiken erscheinen?
* Besteht eine Beziehung zu einem bereits user_id-gebundenen Objekt?
* Kann der Datensatz später für Community-, Pinnwand- oder Marketplace-Funktionen relevant werden?

Wenn die Daten benutzerbezogen sind, wird user_id von Anfang an in:

* Datenmodell
* Migration
* Foreign Keys
* Indizes
* Abfragen
* Speicherlogik
* Lade-/Anzeigeprozesse
* Bearbeitung
* Löschung
* Modul-Schnittstellen

berücksichtigt.

user_id darf nicht erst nachträglich ergänzt werden, wenn bereits erkennbar ist, dass die Daten persönlich sind.

user_id wird jedoch nicht blind in jede Tabelle aufgenommen.

Rein globale Stammdaten oder Daten, die fachlich keinem Benutzer gehören, benötigen keine künstliche Benutzerzuordnung.

Wenn die fachliche Zuordnung nicht eindeutig ist, darf nicht geraten werden.

In diesem Fall ist vor der Implementierung eine Rückfrage erforderlich.

⸻

24. USER-ID UND STATISTIKMODULE

Spätere Statistikmodule müssen die Benutzerzuordnung von Anfang an berücksichtigen.

Statistische Auswertungen müssen unterscheiden können zwischen:

* persönlichen Statistiken
* anonymisierten Community-Statistiken
* globalen Statistiken
* aggregierten weltweiten Statistiken

Beispiele:

* persönliche Fangstatistik
* persönliche Gewässerstatistik
* persönliche Köderstatistik
* Fangstatistik nach Fischart
* Fangzeiten
* Fangorte
* Ködererfolg
* Wetterbedingungen
* Gewässervergleiche
* globale Durchschnittswerte
* weltweite Hitparaden

Statistikmodule sollen vorhandene Fachobjekte über IDs und user_id auswerten.

Statistiken dürfen nicht unnötig dieselben Rohdaten in eigenen Tabellen duplizieren.

Für Cloud- oder Community-Auswertungen dürfen nur Daten verwendet werden, für deren Veröffentlichung bzw. Verarbeitung eine entsprechende Freigabe besteht.

⸻

25. WATERS-MODUL – MASTER-ARCHITEKTUR

Das Waters-Modul verwaltet ausschließlich die Stammdaten eines Gewässers.

Die zukünftige Master-Struktur besteht konzeptionell aus:

* id
* user_id
* name
* type
* country
* region
* description
* gps_lat
* gps_lon
* created_at
* updated_at

Die tatsächlich implementierte Struktur wird durch den aktuellen GitHub-Stand und die Datenbankmigrationen bestimmt.

user_id ist verbindlicher Bestandteil der zukünftigen Master-Struktur.

Ein persönlicher Waters-Datensatz gehört genau zu dem Benutzer, dem er zugeordnet wurde.

Waters-Zugriffe müssen die Benutzerzuordnung berücksichtigen.

Insbesondere müssen:

* Auflisten
* Anzeigen
* Suchen
* Bearbeiten
* Löschen
* GPS-Übernahme
* Navigation

auf die zulässigen Datensätze des aktuellen Benutzers begrenzt werden.

Ein Benutzer darf niemals über eine manipulierte Datensatz-ID auf ein fremdes persönliches Gewässer zugreifen können.

⸻

26. WATERS BLEIBT SCHLANK

Das Waters-Modul wird nicht zu einer Sammeldatenbank für sämtliche Informationen über ein Gewässer.

Waters enthält primär die Gewässer-Stammdaten.

Folgende Informationen werden ausdrücklich nicht ungeordnet in die Waters-Tabelle aufgenommen:

* Fanghistorie
* einzelne Fangstellen
* Fotos
* Wetterhistorien
* sonstige umfangreiche Fachinformationen

Diese Informationen werden später über eigene Fachmodule bzw. Datenstrukturen mit water_id verbunden.

Grundprinzip:

waters
│
├── water_id → Catches
├── water_id → Fishing Spots
├── water_id → Photos
└── water_id → weitere gewässerbezogene Daten

⸻

27. CATCHER – FANGHISTORIE

Das Fangbuch-Modul Catcher ist für die Fanghistorie zuständig.

Ein Fang gehört fachlich zum Fangbuch und nicht zur Waters-Stammdatentabelle.

Ein Fang kann über water_id einem Gewässer zugeordnet werden.

Zusätzlich bleibt die Benutzerzuordnung über user_id bestehen.

Grundprinzip:

User
↓
Catch
├── user_id
└── water_id
↓
Waters

Die Fanghistorie wird nicht redundant in Waters gespeichert.

Fangdaten sollen später für persönliche und – bei entsprechender Freigabe – anonymisierte bzw. globale Statistiken nutzbar sein.

Relevante Daten können unter anderem sein:

* Fischart
* Größe
* Gewicht
* Köder
* Methode
* Zeitpunkt
* Wetter
* Gewässer
* Fishing Spot
* GPS-Bezug
* weitere fachliche Fangdaten

Diese Informationen werden nicht in Waters dupliziert.

⸻

28. FISHING SPOTS

Ein späteres Fishing-Spots-Modul kann konkrete Angelstellen innerhalb eines Gewässers verwalten.

Eine Angelstelle ist nicht dasselbe wie ein Gewässer.

Eine Fishing-Spot-Struktur kann insbesondere enthalten:

* id
* user_id
* water_id
* name
* gps_lat
* gps_lon
* description
* created_at
* updated_at

Die genaue Struktur wird erst bei der Entwicklung des entsprechenden Moduls festgelegt.

GPS-Koordinaten dienen dabei als Positionsdaten der Angelstelle.

Eine automatische Erkennung oder automatische endgültige Speicherung darf nicht vorausgesetzt werden.

Automatisch ermittelte GPS-Daten gelten gemäß den allgemeinen CatchTrack-Regeln zunächst als korrigierbare Vorschläge.

⸻

29. FOTOS

Fotos werden nicht grundsätzlich als Binärdaten direkt in die Waters-Tabelle integriert.

Das spätere Fotosystem soll möglichst wiederverwendbar aufgebaut werden.

Ein Foto kann perspektivisch mit unterschiedlichen Fachobjekten verbunden werden, beispielsweise:

* Gewässer
* Fishing Spot
* Catch

Die konkrete Datenstruktur wird erst bei Entwicklung des Fotosystems festgelegt.

Grundprinzip:

Photo
├── user_id
├── water_id
├── fishing_spot_id (optional)
└── catch_id (optional)

Fotos können später abhängig von den Freigabeeinstellungen des Benutzers auch für Cloud-/Community-Funktionen verwendet werden.

⸻

30. WASSERBEZOGENE MODULBEZIEHUNGEN

CatchTrack verwendet für gewässerbezogene Fachinformationen grundsätzlich Beziehungen statt redundanter Datenhaltung.

Das Gewässer ist der zentrale Bezugspunkt.

Beispiel:

Waters
│
├── Catches
├── Fishing Spots
├── Photos
└── Weather

Dadurch bleiben die einzelnen Module fachlich getrennt und können trotzdem miteinander arbeiten.

Module dürfen benötigte Informationen über definierte Schnittstellen und IDs beziehen.

Informationen dürfen nicht unnötig in mehreren Modulen dupliziert werden.

⸻

31. GPS → WATERS → FACHMODULE

GPS liefert Positionsdaten.

Waters verwaltet Gewässer.

Catcher verwaltet Fänge.

Fishing Spots verwaltet konkrete Angelstellen.

Photos verwaltet Fotos.

Weather verwaltet Wetterinformationen.

Diese Verantwortlichkeiten bleiben getrennt.

Grundprinzip:

GPS
↓
Position
↓
Waters
↓
water_id
├── Catcher
├── Fishing Spots
├── Photos
└── Weather

Kein Fachmodul übernimmt dauerhaft die fachliche Verantwortung eines anderen Moduls.

⸻

32. WATERS-MIGRATION

Da Waters ursprünglich ohne user_id angelegt wurde, muss die Erweiterung über eine neue Datenbankmigration erfolgen.

Vorhandene Migrationen werden nicht nachträglich verändert.

Die neue Migration muss:

* waters.user_id ergänzen
* einen geeigneten Foreign Key herstellen
* einen geeigneten Index anlegen
* bestehende Waters-Datensätze berücksichtigen
* keine vorhandenen Gewässerdaten unnötig zerstören
* mit der vorhandenen Users-Struktur kompatibel sein

Die Zuordnung bestehender Datensätze muss eindeutig und reproduzierbar erfolgen.

Es darf keine stillschweigende Löschung oder zufällige Benutzerzuordnung stattfinden.

Der bisherige waters:entries-Bestand wird bei der Migration als Legacy-Datenquelle behandelt.

Nach erfolgreicher Migration darf keine unnötige parallele Waters-Datenhaltung entstehen.

⸻

33. CLOUD-ARCHITEKTUR – GRUNDSATZ

CatchTrack ist zunächst eine Offline-First-Anwendung.

Die Architektur muss jedoch von Anfang an cloudfähig entwickelt werden.

Cloud-Funktionalität darf nicht dazu führen, dass die Offline-Funktionalität unnötig von einer Internetverbindung abhängig wird.

Grundprinzip:

Offline CatchTrack
↓
lokale zentrale Datenbank
↓
optionale Cloud-Synchronisation
↓
Cloud-Datenbestand

Die Cloud ist eine spätere Erweiterung und kein Ersatz für die lokale Datenhaltung.

Module müssen deshalb so entwickelt werden, dass ihre Daten später über definierte Schnittstellen abgefragt, synchronisiert und – sofern freigegeben – veröffentlicht werden können.

⸻

34. CLOUD UND BENUTZERDATEN

Persönliche Daten können später optional in die Cloud übertragen werden.

Dies betrifft beispielsweise:

* Gewässer
* Fänge
* Fotos
* Fishing Spots
* Statistiken
* ausgewählte weitere Daten

Die Übertragung erfolgt nicht automatisch für alle persönlichen Daten.

Der Benutzer muss über geeignete Einstellungen bzw. Freigaben bestimmen können, welche Daten für Cloud-, Community- oder öffentliche Funktionen verwendet werden dürfen.

Besonders sensible Daten, insbesondere aktuelle GPS-Positionen, dürfen nicht ungeprüft veröffentlicht werden.

⸻

35. DATENFREIGABE UND PRIVATSPHÄRE

CatchTrack benötigt langfristig eine zentrale, benutzersteuerbare Freigabearchitektur.

Ein Benutzer soll grundsätzlich unterscheiden können zwischen:

* privat
* anonymisiert
* unter Nutzername sichtbar
* öffentlich
* für bestimmte Community-Funktionen freigegeben
* nicht für Cloud-Funktionen freigegeben

Die konkrete technische Umsetzung wird über das User-/Identity-System und spätere Cloud-/Permission-Komponenten festgelegt.

Ein Fachmodul darf keine eigene parallele Freigabelogik entwickeln.

⸻

36. IDENTITÄT BEI ÖFFENTLICHEN DATEN

Die interne user_id bleibt die technische Identität eines Benutzers.

Sie ist nicht automatisch der öffentlich sichtbare Name.

Ein Benutzer kann später über sein User-Modul festlegen, wie er in öffentlichen oder Community-Funktionen dargestellt wird.

Mögliche Darstellungen:

* anonym
* Benutzer-ID bzw. anonymisierte Kennung
* selbst gewählter Nutzername
* freigegebener Anzeigename

Die interne user_id darf nicht ohne ausdrückliche fachliche Notwendigkeit als öffentlich sichtbare Identität behandelt werden.

⸻

37. CLOUD-DATENMODELL

Cloud-Funktionen müssen langfristig auf den lokalen Fachobjekten aufbauen.

Beispiel:

User
↓
user_id
↓
Waters
├── water_id
├── Catches
├── Fishing Spots
├── Photos
└── Statistics

Für Cloud-Funktionen sollen diese Daten über definierte IDs und Schnittstellen abgefragt werden können.

Es wird kein zweites fachliches Datenmodell in einzelnen Modulen aufgebaut, nur weil später eine Cloud vorgesehen ist.

Lokale und Cloud-Daten müssen langfristig über stabile Identifikatoren miteinander verbunden werden können.

⸻

38. GLOBALE STATISTIKEN UND COMMUNITY-DATEN

CatchTrack soll langfristig aus freigegebenen Daten anonymisierte und aggregierte Statistiken erzeugen können.

Beispiele:

* beste Fangzeit einer Fischart
* häufig erfolgreiche Köder
* Fanghäufigkeit nach Gewässertyp
* Fangwahrscheinlichkeit unter bestimmten Wetterbedingungen
* durchschnittliche Fanggrößen
* regionale Unterschiede
* weltweite Hitparaden

Dabei dürfen nur Daten berücksichtigt werden, die entsprechend freigegeben wurden.

Aktuelle persönliche GPS-Positionen gehören grundsätzlich nicht automatisch zu diesen Daten.

Statistiksysteme müssen zwischen Rohdaten, personenbezogenen Daten und anonymisierten Aggregaten unterscheiden.

⸻

39. WORLDWIDE HITPARADE

Eine spätere weltweite Hitparade kann auf freigegebenen Fangdaten basieren.

Mögliche Kategorien:

* größter Fisch
* schwerster Fisch
* größte Fischart
* Rekord pro Gewässer
* Rekord pro Region
* Rekord weltweit
* saisonale Ranglisten
* weitere fachliche Ranglisten

Die technische Identität bleibt user_id-basiert.

Die öffentliche Darstellung erfolgt ausschließlich entsprechend der Freigabeeinstellungen des Benutzers.

⸻

40. ANGELTREFFEN / COMMUNITY-PINNWAND

CatchTrack soll langfristig eine Community-Funktion für Angeltreffen ermöglichen.

Ein Benutzer kann beispielsweise veröffentlichen:

* Gewässer
* geplantes Datum
* geplante Uhrzeit
* gewünschte Dauer
* Anzahl möglicher Teilnehmer
* kurze Beschreibung
* weitere optionale Informationen

Beispiel:

„Morgen ab 07:00 Uhr am Gewässer X. Wer kommt mit?“

Die konkrete Datenstruktur wird erst bei Entwicklung des entsprechenden Community-Moduls festgelegt.

Ein Angeltreffen gehört grundsätzlich zu einem Benutzer bzw. Ersteller und benötigt daher voraussichtlich user_id.

Beziehungen zu Waters sollen über water_id erfolgen.

⸻

41. COMMUNITY-PINNWAND

Die spätere Pinnwand soll mehrere fachlich getrennte Inhalte unterstützen können.

Mögliche Bereiche:

* Angeltreffen
* allgemeine Beiträge
* Gesuche
* Angebote
* Informationen
* Community-Ankündigungen

Die Pinnwand ist nicht Bestandteil des Waters-Moduls.

Sie wird später als eigenes Fachmodul bzw. Community-System umgesetzt.

⸻

42. MARKETPLACE

CatchTrack soll langfristig einen Marketplace ermöglichen.

Benutzer können dort beispielsweise gebrauchte Angelprodukte anbieten.

Mögliche Inhalte:

* Angebotstitel
* Beschreibung
* Kategorie
* Preis
* Fotos
* Zustand
* Standort/Region
* Verkäuferreferenz
* Status
* Erstellungszeitpunkt

Marketplace-Daten sind benutzerbezogen und benötigen daher grundsätzlich user_id.

Die technische Struktur wird erst bei Entwicklung des Marketplace-Moduls festgelegt.

Der Marketplace darf nicht in Waters oder Catcher integriert werden.

⸻

43. PAKETE UND FUNKTIONSFREIGABEN

CatchTrack soll langfristig unterschiedliche Nutzungspakete unterstützen.

Beispielhaft:

* Free
* weitere kostenpflichtige Pakete
* optionale Add-ons

Die konkrete Preis- und Paketstruktur wird später festgelegt.

Funktionen können abhängig vom Paket freigeschaltet werden.

Beispiel:

Marketplace
→ nur bei entsprechendem Paket oder Add-on

Weitere mögliche Premium-Funktionen können später hinzukommen.

Pakete und Berechtigungen müssen zentral verwaltet werden.

Ein Fachmodul darf keine eigene Tariflogik aufbauen.

⸻

44. ADMINISTRATION / CMS

CatchTrack soll langfristig ein administrierbares System erhalten.

Das Admin-System soll insbesondere ermöglichen:

* Benutzer verwalten
* Benutzerstatus verwalten
* Pakete zuweisen
* Add-ons verwalten
* Berechtigungen verwalten
* Freigaben verwalten
* Community-Inhalte moderieren
* Marketplace-Inhalte verwalten
* Systemeinstellungen verwalten
* Cloud-Funktionen administrieren
* gegebenenfalls Aktualisierungen verwalten

Das Admin-Modul wird als eigenes System entwickelt.

Die Administration darf nicht dauerhaft in Fachmodule integriert werden.

⸻

45. ADMIN UND CLOUD

Die spätere Administration kann über eine Cloud-basierte Administrationsoberfläche erfolgen.

Die lokale App muss nicht sämtliche administrativen Funktionen selbst bereitstellen.

Lokale Admin-Funktionen können jedoch für Offline- bzw. Grundfunktionen erforderlich sein.

Die konkrete Aufteilung zwischen lokaler Administration und Cloud-Administration wird später festgelegt.

⸻

46. UPDATE-SYSTEM

CatchTrack soll langfristig ein Update-System erhalten.

Grundprinzip:

App-Start
↓
Prüfung auf verfügbare Aktualisierung
↓
falls vorhanden
↓
Benutzer informieren
↓
Update nach Bestätigung durchführen

Die Prüfung soll später optional cloudgestützt erfolgen können.

Die Offline-Funktionalität darf dadurch nicht unnötig beeinträchtigt werden.

Eine Update-Funktion darf niemals ungeprüft Dateien überschreiben.

Versionen müssen eindeutig nachvollziehbar sein.

⸻

47. UPDATE-SICHERHEIT

Spätere Updates müssen mindestens berücksichtigen:

* aktuelle App-Version
* verfügbare Zielversion
* Kompatibilität
* Datenbankmigrationen
* notwendige Mindestversion
* Rollback-/Fehlerstrategie
* Integrität der Update-Dateien

Datenbankmigrationen müssen vor bzw. während eines Updates kontrolliert ausgeführt werden.

Ein Update darf bestehende Benutzerdaten nicht unnötig zerstören.

⸻

48. MULTILINGUALITÄT

Neue Module müssen multilingual vorbereitet werden.

Texte dürfen nicht unnötig fest in JavaScript oder HTML eingebaut werden.

Die vorhandene CatchTrackLanguageManager-Architektur ist zu verwenden.

Deutsch ist derzeit die Standardsprache.

Weitere Sprachen müssen später ergänzt werden können.

⸻

49. RUNTIME UND FEHLERBEHANDLUNG

Module müssen die vorhandene Runtime- und Fehlerarchitektur verwenden.

Insbesondere:

CatchTrackErrorHandler
CatchTrackRuntimeStatus
CatchTrackRuntimeStorage

Fehler dürfen nicht stillschweigend verschluckt werden.

Modulfehler müssen nachvollziehbar bleiben.

⸻

50. WIEDERVERWENDBARKEIT

Funktionen sollen möglichst so entwickelt werden, dass andere Module sie später verwenden können.

GPS stellt eine wiederverwendbare Positionsstruktur bereit.

Identity stellt eine wiederverwendbare Benutzeridentität bereit.

Waters stellt eine wiederverwendbare Gewässerreferenz über water_id bereit.

Andere Module sollen diese Daten verwenden können, ohne internen Modulcode zu duplizieren.

⸻

51. KEINE PARALLELENTWICKLUNG

Bei der Entwicklung eines Moduls werden grundsätzlich keine anderen Fachmodule nebenbei umgebaut.

Ausnahmen sind nur:

* zwingende Core-Abhängigkeiten
* nachgewiesene Schnittstellenfehler
* ausdrücklich beauftragte Änderungen

Die Identity-Implementierung ist in diesem Zusammenhang eine zwingende Core-/Architekturabhängigkeit für die Benutzerzuordnung persönlicher Daten.

Ziel:

ein Modul
→ vollständig
→ geprüft
→ abgeschlossen
→ nächstes Modul

⸻

52. ARBEITSREIHENFOLGE DER AKTUELLEN ARCHITEKTUR

Die Entwicklung erfolgt grundsätzlich in technischer Abhängigkeitsreihenfolge.

Aktueller Übergang:

GPS
↓
Identity Core
↓
Waters Master

Danach folgen die weiteren Fachmodule gemäß aktuellem PROJECT_MODULE_PLAN.md.

Die konkrete Reihenfolge zukünftiger Module wird durch den aktuellen Projektstand und PROJECT_MODULE_PLAN.md bestimmt.

Technische Abhängigkeiten haben Vorrang vor einer rein alphabetischen oder historischen Reihenfolge.

⸻

53. KEINE VORZEITIGE AUSIMPLEMENTIERUNG ZUKÜNFTIGER MODULE

Die Architektur muss spätere Module ermöglichen.

Zukünftige Module werden jedoch nicht vorzeitig als Teil eines anderen Moduls implementiert.

Beispiel:

Waters darf water_id als zentrale Beziehung bereitstellen.

Waters implementiert aber nicht selbst:

* vollständige Fanghistorie
* Fishing-Spots-Verwaltung
* Fotoverwaltung
* Wetterhistorie
* Community
* Marketplace
* Statistiksystem
* Cloud-Synchronisation

Diese Funktionen werden später in ihren jeweiligen Modulen umgesetzt.

⸻

54. ARCHITEKTURZIEL

CatchTrack soll langfristig aus klar getrennten, miteinander verbundenen Fachmodulen bestehen.

Die zentrale Identität bildet die Benutzergrenze.

Die Fachobjekte werden über IDs miteinander verbunden.

Grundprinzip:

Identity Core
↓
user_id
↓
Fachobjekte
↓
Beziehungen über IDs

Dabei gilt:

* keine unnötige Datenredundanz
* keine parallelen Speichersysteme
* keine parallelen Identitätssysteme
* klare Modulverantwortlichkeiten
* zentrale Datenbank
* migrationsbasierte Erweiterungen
* wiederverwendbare Schnittstellen
* automatische Daten nur als korrigierbare Vorschläge
* Cloud-Fähigkeit von Anfang an berücksichtigen
* Benutzerfreigaben berücksichtigen
* persönliche Daten niemals ungeprüft öffentlich machen

⸻

55. MODULREIHENFOLGE UND ABHÄNGIGKEITEN

Der aktuelle Entwicklungsstand wird nicht allein anhand einer historischen Modulliste bestimmt.

Vor Beginn eines neuen Moduls muss geprüft werden:

* bestehende Core-Abhängigkeiten
* bestehende Datenbankabhängigkeiten
* Benutzer-/Identity-Abhängigkeiten
* Schnittstellen zu bereits abgeschlossenen Modulen
* PROJECT_MODULE_PLAN.md
* tatsächlicher GitHub-Stand

Zusätzlich ist bei jedem Modul die langfristige Bedeutung für:

* user_id
* Cloud
* Sharing
* Statistiken
* Community
* Berechtigungen

zu prüfen.

Ein Modul darf nicht nur deshalb vorgezogen oder fertiggestellt werden, weil eine ältere Dokumentation dies vorsieht.

Der tatsächlich erforderliche technische Unterbau hat Vorrang.

⸻

56. MASTER-DATEIEN

Bei der Entwicklung eines Moduls werden zusammengehörige Dateien möglichst gemeinsam als vollständige Master-Version erstellt.

Ziel:

* keine unnötigen Zwischenstände
* keine wiederholten Teilreparaturen
* konsistente Schnittstellen
* vollständige Abhängigkeiten
* klare Datenstrukturen
* langfristige Wiederverwendbarkeit
* spätere Cloud-Fähigkeit

Eine Master-Version muss den bekannten zukünftigen Architekturanforderungen Rechnung tragen, ohne zukünftige Fachmodule vorzeitig vollständig zu implementieren.

⸻

57. VOLLSTÄNDIGE DATEIEN STATT PATCHES

Wenn eine Datei erstellt, ersetzt oder überarbeitet werden muss, wird grundsätzlich immer die vollständige Datei ausgegeben.

Es werden keine:

* Patch-Fragmente
* Diff-Ausschnitte
* einzelnen zu ersetzenden Codezeilen
* Such-und-Ersetzen-Anweisungen
* unvollständigen Dateiausschnitte

als primäre Arbeitsgrundlage geliefert.

Auch bei kleinen Änderungen wird die vollständige aktuelle Master-Version der betroffenen Datei ausgegeben.

Wenn mehrere Dateien zusammengehören, werden alle betroffenen Dateien gemeinsam als vollständige Dateien ausgegeben.

Ziel ist, dass jede bereitgestellte Datei direkt als vollständige Datei in Working Copy übernommen werden kann.

⸻

58. VORHANDENE DATEIEN

Eine vorhandene Datei wird nicht zwanghaft geflickt.

Wenn die Struktur sinnvoll ist:

→ gezielt integrieren

Wenn sie beschädigt, widersprüchlich, veraltet oder unnötig kompliziert ist:

→ vollständige Master-Version erstellen

Gültige bestehende Funktionen und Informationen dürfen dabei nicht verloren gehen.

⸻

59. AUSGABEFORMAT FÜR NEUE DATEIEN

Bei der Entwicklung werden zunächst vollständig aufgelistet:

ZU ERSETZEN

* Dateien

NEU ZU ERSTELLEN

* Dateien

LÖSCHKANDIDATEN

* Dateien
* kurze Begründung

UNVERÄNDERT

* Dateien

Danach folgen die vollständigen Inhalte aller zu ersetzenden und neu zu erstellenden Dateien.

Jede Datei wird möglichst in genau einem Copyblock ausgegeben.

Keine unnötigen Teilstücke.

Keine unvollständigen Patch-Fragmente.

⸻

60. COPYBLOCK-REGEL

Wenn mehrere Dateien gleichzeitig erstellt oder ersetzt werden müssen, werden sie möglichst gemeinsam in einer Ausgabe geliefert.

Beispiel:

gps.html
gps.css
gps.js
module.json

werden möglichst gemeinsam ausgegeben.

Diese Regel gilt verbindlich für alle weiteren Entwicklungsarbeiten.

⸻

61. ARBEITSABLAUF: CHATGPT → WORKING COPY → GITHUB

Die CatchTrack-Entwicklung erfolgt nach folgendem verbindlichen Arbeitsablauf:

ChatGPT
↓
vollständige Master-Dateien / Änderungen
↓
Benutzer übernimmt die Dateien mit Working Copy
↓
Working Copy speichert und committet
↓
GitHub
↓
ChatGPT liest den aktuellen GitHub-Stand zur Kontrolle

ChatGPT übernimmt die Entwicklung, technische Prüfung und Kontrolle.

Working Copy übernimmt die lokale Integration, Speicherung und den Commit.

GitHub ist der maßgebliche technische Projektstand.

ChatGPT muss nicht prüfen oder thematisieren, ob ein direkter Schreibzugriff auf GitHub besteht.

Nach dem Benutzer-OK wird der aktuelle GitHub-Stand erneut gelesen.

Dabei werden abhängig vom Arbeitsschritt insbesondere geprüft:

* Dateien vorhanden
* aktueller Dateiinhalt
* relevante Ordnerstruktur
* Versionen
* Commit
* Commit-SHA, sofern verfügbar
* relevante Abhängigkeiten
* tatsächlicher Projektstand

⸻

62. OK-REGEL

Wenn der Benutzer:

OK

antwortet, bedeutet dies verbindlich:

Der Benutzer hat den vorgesehenen Arbeitsschritt ausgeführt.

Nach OK wird ohne weitere Rückfrage der aktuelle GitHub-Stand geprüft, sofern der GitHub-Zugriff verfügbar ist.

Wenn die Prüfung erfolgreich ist:

→ nächsten vorgesehenen Arbeitsschritt ausführen.

Wenn etwas nicht korrekt ist:

→ konkret mitteilen, was fehlt oder nicht stimmt.

Es ist keine zusätzliche Bestätigung erforderlich, dass Dateien gespeichert, übernommen oder committed wurden.

Es ist nicht erforderlich, den Benutzer darüber zu informieren, dass keine Dateien direkt durch ChatGPT geschrieben wurden.

Der Arbeitsablauf ChatGPT → Working Copy → GitHub gilt als verbindlich.

Kein nächster Entwicklungsschritt wird als abgeschlossen dargestellt, wenn die erforderliche Kontrolle fehlgeschlagen ist.

⸻

63. ARBEITSWEISE UND KOMMUNIKATION

Die technische Zusammenarbeit soll ohne unnötige Wiederholungen erfolgen.

Wenn ein Arbeitsschritt durch den Benutzer mit:

OK

bestätigt wurde, wird der nächste vorgesehene Arbeitsschritt ausgeführt.

Es sind keine zusätzlichen Bestätigungen erforderlich, wenn die Architektur und der nächste Schritt eindeutig festgelegt sind.

Lange allgemeine Erklärungen sind zu vermeiden.

Ausgaben sollen sich auf:

* tatsächlichen Projektstand
* relevante technische Entscheidungen
* notwendige Änderungen
* Ergebnisse
* nächste Schritte

konzentrieren.

Bei technischen Unsicherheiten darf nicht geraten werden.

Wenn eine Entscheidung für die Architektur erforderlich ist und aus dem Projektstand nicht eindeutig hervorgeht, muss gezielt nachgefragt werden.

⸻

64. AKTUELLER PROJEKTSTATUS

Stand: 10.08.2026

Abgeschlossen:

* Weather-Modul
* GPS-Modul Version 2.5.0
* bisheriger Waters-Entwicklungsstand wurde committed

Identity Core:

* core/identityManager.js ist vorhanden
* die tatsächliche Datei und ihre aktuelle Implementierung sind maßgeblich
* der Identity Core bildet die Grundlage für user_id-bezogene Fachmodule

Aktueller technischer Übergang:

GPS
↓
Identity Core
↓
Waters Master

Nächste vorgesehene Arbeitsschritte:

1. aktuellen Identity-Stand vollständig prüfen
2. vorhandene users-Struktur und bestehende Benutzerbeziehungen prüfen
3. Identity Core als vollständige Master-Version konsolidieren
4. Identity Core testen
5. Waters-Datenbankmigration mit user_id prüfen bzw. entwickeln
6. bestehende Waters-Daten berücksichtigen
7. Waters-Dateien als vollständige Identity-kompatible Master-Version entwickeln
8. Waters testen
9. GitHub-Stand über Lesen kontrollieren
10. Identity und Waters als abgeschlossenen Architekturstand dokumentieren
11. danach mit dem nächsten technisch vorgesehenen Modul fortfahren

Bei jedem folgenden Modul ist die User-ID-Prüfung verbindlich.

⸻

65. WICHTIGE ABSCHLUSSREGEL

Abgeschlossene Module werden nicht ohne konkreten technischen Grund erneut verändert.

Das GPS-Modul gilt ab Version 2.5.0 als abgeschlossen.

Änderungen am GPS-Modul erfolgen nur bei:

* nachgewiesenem Fehler
* notwendiger Schnittstellenänderung
* notwendiger Core-Anpassung
* ausdrücklich gewünschter Erweiterung

Das Waters-Modul wird auf Grundlage des bestehenden committeden Standes und der neuen Identity-Architektur als Master-Version fertiggestellt.

⸻

66. VERBINDLICHE ZIELARCHITEKTUR

Die langfristige CatchTrack-Architektur folgt diesem Grundprinzip:

User
↓
Identity Core
↓
user_id
↓
┌──────────────┬──────────────┬──────────────┬──────────────┐
│              │              │              │              │
Waters       Catcher        Photos        Settings       weitere
│              │              │              │              │
water_id       water_id       water_id       user_id        user_id
│              │              │
└──────────────┴──────────────┴──────────────┘

Zusätzliche langfristige Ebene:

User
↓
Identity
↓
Freigaben / Berechtigungen
↓
lokale Daten
↓
optionale Cloud-Daten
↓
Community / Statistiken / Marketplace

Waters bleibt dabei das zentrale Gewässer-Stammdatenobjekt.

Andere Fachinformationen werden über definierte Beziehungen angebunden.

Die Architektur darf nicht dadurch vereinfacht werden, dass unterschiedliche Fachinformationen dauerhaft in eine einzige große Waters-Tabelle integriert werden.

Ziel ist eine langfristig wartbare, erweiterbare, cloudfähige und wiederverwendbare CatchTrack-Masterarchitektur.

⸻

67. LANGFRISTIGE GESAMTARCHITEKTUR

Die langfristige CatchTrack-Struktur soll grundsätzlich folgende Ebenen ermöglichen:

Lokale Ebene

User
↓
Identity Core
↓
zentrale lokale Datenbank
↓
Fachmodule

Optionale Cloud-Ebene

lokale Datenbank
↓
freigegebene Daten
↓
Cloud-Synchronisation
↓
Cloud-Datenbestand

Community-Ebene

Cloud-Daten
↓
Freigaben
↓
Community
├── Angeltreffen
├── Pinnwand
├── Marketplace
├── Statistiken
└── Hitparaden

Administration

Admin
↓
Benutzer
├── Identität
├── Pakete
├── Add-ons
├── Berechtigungen
├── Freigaben
└── Moderation

Diese Ebenen dürfen technisch nicht unnötig miteinander vermischt werden.

⸻

68. GRUNDSATZ FÜR ZUKÜNFTIGE MODULE

Bei jedem zukünftigen Modul ist automatisch zu prüfen:

1. Welche Daten verwaltet das Modul?
2. Gehören diese Daten einem Benutzer?
3. Wird user_id benötigt?
4. Bestehen Beziehungen zu user_id-gebundenen Objekten?
5. Wird eine water_id benötigt?
6. Wird eine andere Fachobjekt-ID benötigt?
7. Können die Daten später für Statistiken verwendet werden?
8. Können die Daten später optional in die Cloud übertragen werden?
9. Können die Daten anonymisiert veröffentlicht werden?
10. Gibt es Datenschutz- oder Freigabeanforderungen?
11. Muss das Modul später von Community- oder Admin-Funktionen verwendet werden?

Diese Prüfung erfolgt vor der eigentlichen Implementierung.

Wenn die Antwort auf eine dieser Fragen technisch relevant und nicht eindeutig ist, darf nicht geraten werden.

⸻

69. ENDE DES AI_CONTEXT

Diese Datei ist verbindliche Arbeitsgrundlage für die technische Weiterentwicklung von CatchTrack.

Bei jedem neuen Arbeitsschritt gilt:

aktueller GitHub-Stand

aktuelle technische Realität
Commit-Historie
aktuelle Projektdokumentation
AI_CONTEXT
ältere Annahmen und Chatverläufe

Die Architektur wird schrittweise als vollständige Master-Version aufgebaut.

Zukünftige Anforderungen werden berücksichtigt, ohne zukünftige Fachmodule vorzeitig vollständig zu implementieren.

Ende AI_CONTEXT.md