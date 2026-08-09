# CatchTrack V1.0 – PROJECT ARCHITECTURE
Version: 1.1
Stand: 09.08.2026
Repository:
El-Ninjo1965/CatchTrack-V.1.0
Branch:
main
Status:
AKTUALISIERTE MASTER-ARCHITEKTUR
==================================================
1. ZWECK
==================================================
Diese Datei beschreibt die technische Architektur von
CatchTrack V1.0.
Sie dient dazu, bei jeder Weiterentwicklung eindeutig
festzustellen:
- welche Komponenten existieren
- welche Aufgaben sie besitzen
- welche Schnittstellen verwendet werden
- wo Daten gespeichert werden
- welche Module voneinander abhängig sind
- welche Dateien zentrale Bestandteile der Architektur sind
- welche Strukturen nicht ohne Prüfung verändert werden dürfen
- welche Legacy-Strukturen existieren
- welche Funktionen zentral bereitgestellt werden
- wie externe Datenquellen integriert werden
Diese Datei ist kein Arbeitsplan.
Der Entwicklungsplan befindet sich in:
PROJECT_MODULE_PLAN.md
Der aktuelle Entwicklungsstatus befindet sich in:
PROJECT_STATUS.md
Das gesammelte Projektwissen befindet sich in:
PROJECT_KNOWLEDGE.md
Die verbindlichen Arbeitsregeln befinden sich in:
PROJECT_RULES.md
Die Arbeitsweise für die AI befindet sich in:
AI_CONTEXT.md
==================================================
2. ARCHITEKTURPRINZIP
==================================================
CatchTrack V1.0 besteht aus einer zentralen Anwendung mit
modularer Erweiterungsstruktur.
Grundprinzip:
Application
│
├── Core
│   ├── API
│   ├── Database
│   ├── Error Handler
│   ├── Language Manager
│   ├── Module Installer
│   ├── Module Manager
│   ├── Permission Manager
│   ├── Router
│   └── Storage Manager
│
├── Database
│
├── Services
│
├── Config
│
├── Modules
│
├── Runtime
│
├── Assets
│
└── Libraries
Module arbeiten möglichst eigenständig.
Sie verwenden jedoch vorhandene zentrale Core- und
Service-Schnittstellen.
Es darf keine Parallelarchitektur aufgebaut werden,
wenn bereits eine geeignete zentrale Funktion existiert.
==================================================
3. ZENTRALES ARCHITEKTURPRINZIP
==================================================
Die Anwendung folgt grundsätzlich diesem Datenfluss:
UI
 ↓
Module
 ↓
Core / Services
 ↓
Database / Storage / API
 ↓
Daten
Bei Integrationen:
Modul A
 ↓
definierte Schnittstelle
 ↓
Core / Service / Datenquelle
 ↓
Modul B
Direkte Abhängigkeiten zwischen Modulen sollen möglichst
gering bleiben.
Gemeinsame Daten werden vorzugsweise über zentrale
Schnittstellen bereitgestellt.
==================================================
4. ZENTRALE EINSTIEGSPUNKTE
==================================================
Aktuell relevante Einstiegspunkte:
index.html
app.js
Diese Dateien bilden die zentrale Anwendungsebene.
Sie dürfen bei der Entwicklung einzelner Module nicht
unnötig umgebaut werden.
Vor Änderungen müssen mindestens geprüft werden:
- Modulinitialisierung
- Router
- Module Manager
- Language Manager
- Storage
- Database
- globale UI-Struktur
- vorhandene Services
==================================================
5. CORE
==================================================
Aktuelle zentrale Core-Struktur:
core/
├── api.js
├── database.js
├── errorHandler.js
├── languageManager.js
├── moduleInstaller.js
├── moduleManager.js
├── permissionManager.js
├── router.js
└── storageManager.js
Zusätzlich relevant:
runtime/
├── error.log
└── runtime_status.json
localStorage.json
==================================================
6. CORE – API
==================================================
Datei:
core/api.js
Aufgabe:
- zentrale Kommunikation
- externe Datenquellen
- gemeinsame API-Funktionen
- Fehlerbehandlung von API-Aufrufen
Vor Entwicklung einer neuen API-Anbindung:
1. bestehende API-Funktionen prüfen
2. vorhandene Provider-Strukturen prüfen
3. bestehende Fehlerbehandlung prüfen
4. bestehende Konfiguration prüfen
Keine unnötige parallele API-Schicht erzeugen.
==================================================
7. CORE – DATABASE
==================================================
Datei:
core/database.js
Aufgabe:
- zentraler Datenbankzugriff
- Datenbankkommunikation kapseln
- Datenbankfunktionen für Module bereitstellen
Module sollen keine unnötigen eigenen Datenbankabstraktionen
erzeugen.
Vor Änderungen:
- Tabellen prüfen
- Felder prüfen
- Beziehungen prüfen
- Migrationen prüfen
- Seed-Daten prüfen
- bestehende Abfragen prüfen
==================================================
8. DATABASE
==================================================
Aktuelle Struktur:
database/
├── database.js
├── database.sql
├── fish_names_seed.sql
├── fish_seed.sql
├── migrations/
└── schema.sql
Die Datenbank ist eine zentrale Grundlage der Anwendung.
Grundregel:
Ein fachliches Datenobjekt besitzt möglichst einen eindeutigen
Datenbesitzer.
Beispiele:
Fish
→ Fish Database
Equipment
→ Equipment
Water
→ Waters
Catch
→ Catches
Photo
→ Photos
Keine redundanten parallelen Tabellen anlegen, wenn bereits
eine zentrale Struktur existiert.
==================================================
9. CORE – ERROR HANDLER
==================================================
Datei:
core/errorHandler.js
Aufgabe:
- zentrale Fehlerbehandlung
- Fehlerklassifizierung
- Fehlerprotokollierung
- kontrollierte Weitergabe
- Runtime-Integration
Neue Module sollen Fehler nicht einfach verschlucken.
Ein Modul darf zusätzliche lokale Fehlerbehandlung besitzen,
muss aber mit dem zentralen Error-System kompatibel bleiben.
==================================================
10. RUNTIME
==================================================
Runtime-Daten:
runtime/error.log
runtime/runtime_status.json
Persistenter Anwendungssnapshot:
localStorage.json
Grundprinzip:
Fehler
 ↓
errorHandler
 ↓
runtimeStorage / Storage
 ↓
LocalStorage
 ↓
localStorage.json
`runtime/error.log` ist die technische Fehlerhistorie.
`runtime/runtime_status.json` enthält den Runtime-Status.
`localStorage.json` ist der übertragene Persistenz-/
Diagnose-Snapshot.
==================================================
11. LOCALSTORAGE
==================================================
Datei:
localStorage.json
Diese Datei ist insbesondere bei Runtime- und Fehleranalysen
relevant.
Wenn eine aktualisierte `localStorage.json` über Working Copy
übertragen wurde, ist diese Version die relevante Grundlage
für die anschließende Analyse.
Sie darf nicht als statische Konfigurationsdatei behandelt
werden.
Eine Änderung am Storage-System muss berücksichtigen:
- Datenformat
- bestehende Einträge
- Versionierung
- Migration
- Fehlerdaten
- Runtime-Status
==================================================
12. CORE – LANGUAGE MANAGER
==================================================
Datei:
core/languageManager.js
Aufgabe:
- zentrale Sprachverwaltung
- Erkennung der Standardsprache
- manuelle Sprachauswahl
- Übersetzungen
- Sprachwechsel
- Bereitstellung von Übersetzungstexten
Alle Module müssen dieses zentrale System verwenden.
Kein Modul soll eine vollständig eigene Sprachverwaltung
entwickeln.
==================================================
13. MULTILINGUALITÄT
==================================================
CatchTrack wird von Anfang an multilingual entwickelt.
Unterstützt werden:
A) automatische Erkennung der bevorzugten
   Gerätesprache / Browsersprache
B) manuelle Sprachauswahl durch den Benutzer
Priorität:
manuelle Auswahl
        >
automatische Gerätesprache
Die Sprache gilt grundsätzlich für die gesamte Anwendung.
==================================================
14. SPRACHNEUTRALE DATEN
==================================================
Interne Daten müssen sprachneutral bleiben.
Beispiel:
pressure = 1013.2
Darstellung:
Deutsch:
Luftdruck
Englisch:
Pressure
Datenbankwerte dürfen nicht unnötig an eine einzelne Sprache
gekoppelt werden.
==================================================
15. CORE – MODULE MANAGER
==================================================
Datei:
core/moduleManager.js
Aufgabe:
- Module laden
- Module aktivieren
- Module initialisieren
- Modulstatus verwalten
- Modulabhängigkeiten berücksichtigen
Dies ist eine zentrale Architekturkomponente.
Module dürfen keine zweite unabhängige Modulverwaltung
implementieren.
==================================================
16. MODULE INSTALLER
==================================================
Datei:
core/moduleInstaller.js
Aufgabe:
- Modulinstallation
- Modulverwaltung
- Verarbeitung von Moduldefinitionen
Vor Änderungen an `module.json` muss geprüft werden:
- wer die Datei lädt
- ob sie tatsächlich verwendet wird
- welche Informationen daraus gelesen werden
- ob `config/modules.json` maßgeblich ist
- ob die Datei aus einer älteren Architektur stammt
==================================================
17. CONFIG
==================================================
Aktuelle zentrale Konfiguration:
config/
├── app.json
├── languages.json
└── modules.json
`config/modules.json` ist insbesondere für die konfigurierte
Modulstruktur relevant.
Die tatsächliche Verwendung muss immer anhand des aktuellen
Codes geprüft werden.
==================================================
18. MODULE.JSON
==================================================
Ein Modul kann grundsätzlich folgende Struktur besitzen:
modules/<module>/
├── module.json
├── <module>.html
├── <module>.js
└── <module>.css
Dies ist kein zwingendes Schema.
Nicht jedes Modul benötigt alle Dateien.
Entscheidend ist die tatsächliche Verwendung.
Für jede `module.json` muss geprüft werden:
- wird sie geladen?
- wer lädt sie?
- wird sie vom Module Manager verwendet?
- wird sie vom Module Installer verwendet?
- enthält sie relevante Metadaten?
- ist sie Legacy?
Mögliche Status:
ACTIVE
MASTER
LEGACY
UNUSED
DELETE CANDIDATE
==================================================
19. STORAGE
==================================================
Datei:
core/storageManager.js
Aufgabe:
- lokale Speicherung
- persistente Daten
- Storage-Zugriff
- gemeinsame Storage-Schnittstelle
Vor Einführung einer neuen Speicherlösung muss geprüft
werden:
- Database
- Storage Manager
- Browser Storage
- lokale Dateien
- temporärer Speicher
- Runtime Storage
Keine parallele Speicherarchitektur ohne zwingenden Grund.
==================================================
20. ROUTER
==================================================
Datei:
core/router.js
Aufgabe:
- Navigation
- Modulwechsel
- Routing
- URL-/Ansichtssteuerung
Neue Module müssen mit dem vorhandenen Routing-System
kompatibel sein.
==================================================
21. PERMISSION MANAGER
==================================================
Datei:
core/permissionManager.js
Aufgabe:
- Berechtigungen
- Zugriffskontrolle
- Modul-/Funktionsrechte
Module mit besonderen Berechtigungen verwenden nach
Möglichkeit diese zentrale Komponente.
==================================================
22. SERVICES
==================================================
Vor Entwicklung eines Moduls müssen vorhandene Services
geprüft werden.
Grundregel:
bestehende zentrale Funktion
        ↓
verwenden / erweitern
nur wenn ungeeignet:
neue Funktion entwickeln
Ziel:
- keine doppelte Logik
- keine widersprüchlichen Daten
- weniger Wartungsaufwand
- klare Verantwortlichkeiten
==================================================
23. MODULARCHITEKTUR
==================================================
Ein Modul besitzt grundsätzlich:
- eigene UI
- eigene Logik
- eigenes Styling
- eigene Moduldefinition, sofern erforderlich
Ein Modul darf jedoch zentrale Funktionen nicht unnötig
duplizieren.
Beispiele:
Weather
→ verwendet GPS
Weather
→ verwendet API
Weather
→ verwendet Error Handler
Weather
→ verwendet Language Manager
Weather
→ verwendet Storage
==================================================
24. DATENBESITZER
==================================================
Jedes zentrale Datenobjekt besitzt einen fachlichen Besitzer.
Beispiele:
Fish
→ Fish Database
Equipment
→ Equipment
Water
→ Waters
Catch
→ Catches
Photo
→ Photos
Andere Module greifen auf diese Daten zu.
Sie führen nicht unnötig eigene Kopien derselben Stammdaten.
==================================================
25. CATCHES
==================================================
Catches ist eines der zentralen Integrationsobjekte.
Ein Catch kann enthalten:
- Fisch
- Datum
- Uhrzeit
- Gewicht
- Länge
- Gewässer
- GPS
- Wetter
- Tide
- Moon
- Conditions
- Equipment
- Köder
- Fangmethode
- Fotos
- Notizen
Deshalb sind Änderungen am Catch-Datenmodell besonders kritisch.
==================================================
26. BASISMODULE
==================================================
Die aktuelle Entwicklungsstrategie priorisiert zunächst
möglichst unabhängige Datenmodule.
Reihenfolge:
Weather
↓
GPS
↓
Tides
↓
Moon
↓
Waters
↓
Equipment
Danach:
Fish Data
↓
Fish Database
↓
Catches
↓
Catchbook
↓
Statistics
↓
Records
↓
Leaderboard
Diese Reihenfolge ist ein Entwicklungsplan und keine starre
technische Einschränkung.
==================================================
27. WEATHER-ARCHITEKTUR
==================================================
Pfad:
modules/weather/
Aktuelle Dateien:
modules/weather/
├── module.json
├── weather.js
├── weather.html
└── weather.css
Alle Dateinamen sind kleingeschrieben.
Nicht vorhandene Varianten mit großem Anfangsbuchstaben gelten
nicht als fehlende Dateien.
==================================================
28. WEATHER – DATENFLUSS
==================================================
GPS
 ↓
Latitude / Longitude
 ↓
Weather Provider
 ↓
Weather Module
 ↓
standardisierter Wetterdatensatz
Der Wetterdatensatz kann später verwendet werden von:
- Catches
- Catchbook
- Statistics
- AI
==================================================
29. WEATHER – PROVIDER
==================================================
Vorgesehener erster Provider:
Open-Meteo
Die Provider-Schicht muss austauschbar bleiben.
Später soll der Admin-Bereich ermöglichen:
- Provider ändern
- API-URL ändern
- API-Key hinterlegen
- Providerparameter ändern
Ein API-Key darf niemals fest im Frontend-Code eingebaut
werden, wenn der betreffende Provider einen geheimen Schlüssel
erfordert.
==================================================
30. WEATHER – STANDORT
==================================================
Standard:
GPS
 ↓
aktueller Standort
 ↓
aktuelles Wetter
Zusätzlich:
Benutzer sucht Ort
 ↓
ausgewählter Wetterort
 ↓
Wetter für diesen Ort
Wetterort und tatsächlicher Fangort sind unterschiedliche
Konzepte.
Eine manuelle Wetterortauswahl darf den späteren Fangort
nicht verändern.
==================================================
31. WEATHER – FORECAST
==================================================
Mindestziel:
7 Tage
Bevorzugt:
10 Tage
Anzuzeigen bzw. intern bereitzustellen:
- Wetterzustand
- Wetter-Symbol
- Temperatur
- Luftdruck
- Luftfeuchtigkeit
- Niederschlag
- Regenwahrscheinlichkeit
- Windgeschwindigkeit
- Windrichtung
- Windböen
- Bewölkung
- UV
- Sonnenaufgang
- Sonnenuntergang
Die Benutzeroberfläche muss übersichtlich bleiben.
==================================================
32. WEATHER – CACHE
==================================================
Weather verwendet einen Tagescache.
Grundprinzip:
erster Abruf des Tages
 ↓
API
 ↓
Cache
Der Cache gilt grundsätzlich bis 00:00 Uhr Ortszeit.
Zusätzlich:
anderer Standort
→ eigener Cache
manueller Refresh
→ Cache umgehen
API-Ausfall
→ gültigen Cache verwenden
kein Cache + API-Ausfall
→ kontrollierte Fehlerbehandlung
Der Cache ist keine Wetterhistorie.
==================================================
33. WEATHER – DATENMENGE
==================================================
Weather darf keine unnötige dauerhafte Datenhistorie erzeugen.
Grundsatz:
- aktuelle Daten beim Aufruf
- gültiger Tagescache
- keine unbegrenzte Wetterhistorie
- keine dauerhafte Speicherung kompletter API-Antworten
Historische Wetterdaten entstehen später nur dort, wo sie
fachlich benötigt werden.
==================================================
34. WEATHER – FANG-SNAPSHOT
==================================================
Beim Speichern eines Fangs:
Weather
 ↓
relevante Werte
 ↓
Snapshot
 ↓
Catch
Der Snapshot verhindert, dass spätere Änderungen des
Wetterproviders historische Fangdaten verändern.
==================================================
35. WEATHER – SCHNITTSTELLE
==================================================
Andere Module dürfen nicht auf interne Weather-Variablen
oder DOM-Elemente zugreifen.
Weather stellt eine definierte öffentliche Schnittstelle bereit.
Beispiel:
Weather.getWeatherData()
Der konkrete Name muss anhand der tatsächlichen Architektur
festgelegt werden.
==================================================
36. GPS
==================================================
GPS ist die zentrale Standortquelle.
Mögliche Aufgaben:
- aktueller Standort
- Latitude
- Longitude
- Genauigkeit
- Home-Standort
- gespeicherte Standorte
- manuelle Standortauswahl
- Entfernung
- Übergabe an Weather
- Übergabe an Waters
- Übergabe an Maps
- Übergabe an Catches
==================================================
37. TIDES
==================================================
Tides ist eine eigenständige Datenquelle.
Bereitstellen:
- aktuelle Tide
- nächstes Hochwasser
- nächstes Niedrigwasser
- Zeitpunkt
- Wasserstand
- Standort
Die Provider-Anbindung muss austauschbar bleiben.
==================================================
38. MOON
==================================================
Moon liefert:
- Mondphase
- Beleuchtungsgrad
- Mondalter
- Mondaufgang
- Monduntergang
- relevante Standortinformationen
==================================================
39. WATERS
==================================================
Waters verwaltet Gewässer.
Mögliche Daten:
- Name
- Typ
- Position
- Beschreibung
- Eigenschaften
- Standort
- Benutzerzuordnung
Waters kann später mit GPS, Maps und Catches verbunden werden.
==================================================
40. EQUIPMENT
==================================================
Equipment verwaltet Angelausrüstung.
Bereiche:
- Ruten
- Rollen
- Schnüre
- Vorfächer
- Haken
- Köder
- Kunstköder
- Zubehör
- sonstige Ausrüstung
Equipment wird zunächst eigenständig entwickelt.
Die spätere Integration erfolgt über Catches/Catchbook.
==================================================
41. FISH DATABASE
==================================================
Fish Database ist der fachliche Besitzer der Fisch-Stammdaten.
Mögliche Daten:
- Name
- lokale Namen
- wissenschaftlicher Name
- Familie
- Beschreibung
- Bild
- Lebensraum
- Gewässertyp
- Tiefe
- Temperatur
- Köder
- Fangmethode
- Saison
- Schonzeit
- Mindestgröße
- typische Größe
- typisches Gewicht
==================================================
42. CATCHBOOK
==================================================
Catchbook ist ein Integrationsmodul.
Es verwendet die Daten der bereits stabilisierten
Basis-Module.
Es soll keine eigene parallele Wetter-, GPS-, Tide- oder
Equipment-Logik enthalten.
Grundstruktur:
Basisdaten
 ↓
Catches
 ↓
Catchbook
==================================================
43. STATISTICS
==================================================
Statistics verwendet gespeicherte Catch-Daten.
Mögliche Auswertungen:
- Fänge
- Gewicht
- Länge
- Arten
- Gewässer
- Köder
- Fangmethoden
- Wetter
- Tide
- Moon
- Equipment
- Zeiträume
==================================================
44. RECORDS / LEADERBOARD
==================================================
Records und Leaderboard verwenden bestätigte Catch-Daten.
Grundstruktur:
Catches
 ↓
Records
 ↓
Leaderboard
Keine eigenständigen, widersprüchlichen Fangdatenbanken.
==================================================
45. PHOTOS
==================================================
Photos verwaltet Fangfotos.
Mögliche Aufgaben:
- Fotoaufnahme
- Speicherung
- Zuordnung
- Anzeige
- Löschung
- mehrere Fotos pro Fang
Fotos werden einem eindeutigen Datenobjekt zugeordnet.
==================================================
46. CONDITIONS
==================================================
Conditions verwaltet zusätzliche Angelbedingungen.
Mögliche Daten:
- Wind
- Strömung
- Sicht
- Wasserzustand
- Wassertemperatur
- manuelle Beobachtungen
Automatische Werte und Benutzerwerte müssen unterscheidbar
bleiben.
==================================================
47. EXPORT / BACKUP
==================================================
Export:
- JSON
- CSV
- vollständiger Export
- selektiver Export
Backup:
- vollständiges Backup
- Wiederherstellung
- Integritätsprüfung
Beide Funktionen greifen auf die zentrale Datenarchitektur zu.
==================================================
48. AI
==================================================
AI wird auf den zentral gespeicherten Daten aufbauen.
Mögliche spätere Aufgaben:
- Fangdatenanalyse
- Mustererkennung
- Empfehlungen
- natürliche Suche
- statistische Interpretation
- Assistenz
AI wird erst nach Stabilisierung der zugrunde liegenden
Datenarchitektur umfassend integriert.
==================================================
49. BLUETOOTH
==================================================
Bluetooth ist für spätere externe Sensor-/Geräteintegration
vorgesehen.
Mögliche Daten:
- Bissanzeiger
- Temperatur
- weitere Sensorwerte
Keine konkrete Gerätearchitektur festlegen, bevor die
Anforderungen geklärt sind.
==================================================
50. ADMIN
==================================================
Admin verwaltet zentrale Systemeinstellungen.
Langfristig:
- API Provider
- API URLs
- API Keys
- Module
- Sprache
- Systemdiagnose
- Datenpflege
- Backup
- Runtime
==================================================
51. ALTARCHITEKTUR
==================================================
Das Repository enthält Dateien aus unterschiedlichen
Entwicklungsständen.
Grundsatz:
Vorhanden
≠
aktuell
Vorhanden
≠
verwendet
Vorhanden
≠
fertig
Eine Datei darf nicht allein aufgrund ihres Alters gelöscht
werden.
==================================================
52. LÖSCHREGEL
==================================================
Vor Löschung:
Datei
 ↓
globale Referenzsuche
 ↓
Imports
 ↓
dynamische Imports
 ↓
HTML
 ↓
Module Manager
 ↓
Module Installer
 ↓
Config
 ↓
Services
 ↓
Core
 ↓
Dokumentation
 ↓
Git-Historie
 ↓
Abhängigkeiten
 ↓
Löschentscheidung
Status:
DELETE CANDIDATE
↓
ZUR LÖSCHUNG FREIGEGEBEN
↓
LÖSCHEN
↓
GitHub erneut prüfen
==================================================
53. DATEIÄNDERUNGEN
==================================================
Bei Änderungen an bestehenden Dateien gilt:
1. aktuelle Datei auf GitHub einlesen
2. Inhalt vollständig verstehen
3. Abhängigkeiten prüfen
4. Git-Historie prüfen
5. bestehende Funktionen erhalten
6. Änderungen integrieren
7. vollständige Ersatzdatei erstellen
8. testen
9. Working Copy
10. Commit
11. GitHub erneut prüfen
Es werden keine unnötigen Teiländerungen geliefert.
==================================================
54. MASTER-NEUERSTELLUNG
==================================================
Eine vollständige Neuerstellung ist ausdrücklich erlaubt,
wenn die bestehende Datei:
- technisch widersprüchlich ist
- aus mehreren Entwicklungsständen besteht
- unnötiges Flickwerk enthält
- eine saubere Architektur verhindert
- schwer wartbar ist
- durch eine konsistente Master-Version ersetzt werden kann
Die Neuerstellung darf jedoch erst nach dem vollständigen
Einlesen und Verstehen der vorhandenen Datei erfolgen.
==================================================
55. KRITISCHE ARCHITEKTURDATEIEN
==================================================
Besonders kritisch sind:
- index.html
- app.js
- core/*
- database/*
- config/modules.json
- config/app.json
- config/languages.json
Vor Änderungen müssen Auswirkungen auf alle abhängigen
Komponenten geprüft werden.
==================================================
56. GIT-HISTORIE
==================================================
Git liefert:
- Versionen
- Commit-Daten
- Änderungen
- Entwicklungsschritte
Das Commit-Datum ist jedoch kein alleiniger Beweis für den
funktionalen Entwicklungsstand.
Für die Statusbestimmung gilt:
aktueller Code
+
Git-Historie
+
Projektstatus
+
Tests
+
Runtime
==================================================
57. ARCHITEKTURÄNDERUNGEN
==================================================
Neue Architekturentscheidungen werden dokumentiert.
Format:
Datum:
Entscheidung:
Grund:
Betroffene Dateien:
Betroffene Module:
Alternative:
Folgen:
Aktuelle Entscheidung:
09.08.2026
Entscheidung:
GitHub ist die technische Referenz.
Working Copy ist der operative Schreibweg.
ChatGPT übernimmt Analyse, Planung und Erstellung vollständiger
Dateiversionen.
==================================================
58. AKTUELLE ENTWICKLUNGSREIHENFOLGE
==================================================
Basisphase:
Weather
↓
GPS
↓
Tides
↓
Moon
↓
Waters
↓
Equipment
Integrationsphase:
Fish Data
↓
Fish Database
↓
Catches
↓
Catchbook
↓
Statistics
↓
Records
↓
Leaderboard
Ergänzend:
Maps
Conditions
Photos
Settings
Admin
Export
Backup
Safety
Bluetooth
AI
Die konkrete Reihenfolge kann anhand technischer
Abhängigkeiten angepasst werden.
==================================================
59. ARCHITEKTURZIEL
==================================================
Die Architektur soll gewährleisten:
- zentrale Datenhaltung
- klare Verantwortlichkeiten
- modulare Erweiterbarkeit
- geringe Kopplung
- stabile Schnittstellen
- keine unnötige doppelte Logik
- Mehrbenutzerfähigkeit
- Multilingualität
- sichere Fehlerbehandlung
- kontrollierte externe API-Anbindung
- stabile historische Fangdaten
- wartbare Datenstrukturen
- mobile Nutzung
- spätere AI-Integration
==================================================
60. AKTUELLER ÜBERGABEPUNKT
==================================================
Aktueller technischer Schwerpunkt:
WEATHER
Als nächstes:
GPS
↓
TIDES
↓
MOON
↓
WATERS
↓
EQUIPMENT
Danach:
FISH DATA
↓
FISH DATABASE
↓
CATCHES
↓
CATCHBOOK
↓
STATISTICS
↓
RECORDS / LEADERBOARD
==================================================
ENDE PROJECT_ARCHITECTURE
==================================================