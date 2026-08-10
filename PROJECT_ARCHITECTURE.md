CatchTrack V1.0 – PROJECT ARCHITECTURE

Version: 2.0
Stand: 10.08.2026
Repository: El-Ninjo1965/CatchTrack-V.1.0
Branch: main

1. Zweck

Diese Datei beschreibt die technische Masterarchitektur von CatchTrack.

Sie definiert:

* zentrale Komponenten
* Datenverantwortlichkeiten
* Modulgrenzen
* Datenbeziehungen
* Identity
* Datenbankprinzipien
* Offline-/Cloud-Grundstruktur
* langfristige Integrationspunkte

Sie beschreibt nicht den aktuellen Arbeitsstatus und nicht den Testablauf.

⸻

2. Grundarchitektur

CatchTrack
│
├── Application
│
├── Core
│   ├── API
│   ├── Database
│   ├── Error Handler
│   ├── Language Manager
│   ├── Module Manager
│   ├── Permission Manager
│   ├── Router
│   ├── Storage Manager
│   └── Identity
│
├── Database
│   └── migrations
│
├── Config
│
├── Runtime
│
└── Modules

⸻

3. Datenfluss

UI
↓
Fachmodul
↓
Core / zentrale Schnittstelle
↓
Datenbank / Service / API
↓
Daten

Module dürfen vorhandene zentrale Funktionen verwenden.

Parallele Ersatzsysteme werden nicht aufgebaut.

⸻

4. Identity Core

Die Benutzeridentität ist eine zentrale Architekturkomponente.

User
↓
Identity Core
↓
current user_id
↓
persönliche Daten

Die vorhandene users-Struktur bildet die Grundlage.

Der Identity Core stellt konzeptionell bereit:

* aktuellen Benutzer laden
* aktuellen Benutzer setzen
* aktuellen Benutzer wechseln
* aktuellen Benutzer zurücksetzen
* user_id bereitstellen
* Gültigkeit der Benutzeridentität prüfen

Die konkrete Implementierung richtet sich ausschließlich nach dem tatsächlich vorhandenen Core-Code.

⸻

5. Persönliche Daten

Persönliche Fachobjekte werden grundsätzlich über user_id getrennt.

Beispiele:

users
│
├── waters
├── catches
├── photos
├── fishing_spots
├── settings
└── weitere persönliche Daten

user_id wird nicht künstlich in globale Stammdaten eingebaut.

⸻

6. Waters

Waters verwaltet ausschließlich Gewässer-Stammdaten.

Zukünftige Masterstruktur:

waters
├── id
├── user_id
├── name
├── type
├── country
├── region
├── description
├── gps_lat
├── gps_lon
├── created_at
└── updated_at

Die tatsächliche Struktur wird durch die vorhandene Datenbank und Migrationen bestimmt.

Waters enthält nicht:

* Fanghistorien
* Fotosammlungen
* Fishing Spots
* Wetterhistorien
* Community-Daten
* Marketplace-Daten

⸻

7. Fachobjekt-Beziehungen

Identity
│
└── user_id
    │
    ├── Waters
    │   └── water_id
    │
    ├── Catches
    │   └── water_id
    │
    ├── Fishing Spots
    │   └── water_id
    │
    └── Photos
        └── optionale Objektbeziehungen

Daten werden über IDs verbunden.

Redundante Stammdatenkopien werden vermieden.

⸻

8. GPS

GPS ist ein eigenständiges Positionsmodul.

Es liefert Positionsdaten wie:

* latitude
* longitude
* accuracy
* altitude
* altitudeAccuracy
* timestamp
* source

Höhe und Höhengenauigkeit sind optional.

GPS erkennt nicht automatisch endgültige Gewässer.

Automatisch ermittelte Positionen sind korrigierbare Vorschläge.

⸻

9. GPS → Waters

Der historische Übergang ist:

GPS
↓
waters:entries
↓
Waters

waters:entries gilt als Legacy-Bestand.

Die langfristige Architektur lautet:

GPS
↓
Positionsdaten
↓
Waters
↓
zentrale Datenbank

Die endgültige Speicherung eines persönlichen Gewässers erfolgt über Waters und user_id.

⸻

10. Catches

Catches verwaltet Fangdaten.

Ein Fang kann unter anderem Beziehungen besitzen zu:

* user_id
* water_id
* Fisch
* Fishing Spot
* GPS
* Wetter
* Tide
* Mond
* Equipment
* Fotos
* Notizen

Die Fanghistorie wird nicht in Waters gespeichert.

Historische Snapshots müssen erhalten bleiben, wenn sich externe Datenquellen später ändern.

⸻

11. Fishing Spots

Fishing Spots verwaltet konkrete Angelstellen innerhalb eines Gewässers.

Konzeptionell:

fishing_spots
├── id
├── user_id
├── water_id
├── name
├── gps_lat
├── gps_lon
├── description
├── created_at
└── updated_at

Die endgültige Struktur wird erst bei Entwicklung des Moduls festgelegt.

⸻

12. Photos

Fotos sind ein eigenes Fachmodul.

Fotos können später verbunden werden mit:

* user_id
* water_id
* fishing_spot_id
* catch_id

Die konkrete Datenstruktur wird beim Fotosystem festgelegt.

⸻

13. Weather

Weather liefert Wetterdaten.

Es bleibt von der Darstellung anderer Module getrennt.

Grundprinzip:

GPS / Ort
↓
Weather Provider
↓
standardisierter Wetterdatensatz
↓
Fachmodule

Dauerhafte historische Wetterdaten entstehen insbesondere über Fang-Snapshots.

Der Provider muss austauschbar bleiben.

⸻

14. Tides

Tides ist ein eigenständiges Datenmodul für Gezeiten.

Es liefert später unter anderem:

* Hochwasser
* Niedrigwasser
* Zeitpunkte
* Wasserstände
* Standortbezug

Provider bleiben austauschbar.

⸻

15. Moon

Moon liefert Mondinformationen.

Mögliche Daten:

* Mondphase
* Beleuchtung
* Mondaufgang
* Monduntergang
* weitere berechnete Werte

Berechnete Werte werden nachvollziehbar behandelt.

⸻

16. Equipment

Equipment verwaltet persönliche Angelausrüstung.

Beispiele:

* Ruten
* Rollen
* Schnüre
* Vorfächer
* Haken
* Köder
* Kunstköder
* Zubehör

Persönliche Ausrüstung benötigt grundsätzlich eine Benutzerzuordnung.

⸻

17. Fish Database

Die Fish Database verwaltet fachliche Fischstammdaten.

Globale Fischstammdaten benötigen nicht automatisch user_id.

Benutzerbezogene Erweiterungen können später separat angebunden werden.

⸻

18. Statistics

Statistics wertet bestehende Fachobjekte aus.

Statistiken sollen möglichst keine redundanten Rohdaten speichern.

Es wird unterschieden zwischen:

* persönlichen Statistiken
* anonymisierten Statistiken
* globalen Aggregaten
* Community-Auswertungen

⸻

19. Community

Langfristige Community-Funktionen können umfassen:

* Angeltreffen
* Pinnwand
* Marketplace
* Ranglisten
* Hitparaden

Diese Funktionen bleiben fachlich von Waters und Catches getrennt.

⸻

20. Cloud

CatchTrack ist Offline-First.

lokale Datenbank
↓
freigegebene Daten
↓
optionale Cloud-Synchronisation
↓
Cloud

Die Cloud ersetzt nicht die lokale Datenhaltung.

⸻

21. Datenschutz

Persönliche Daten bleiben grundsätzlich privat.

Mögliche Freigabestufen:

* privat
* anonymisiert
* unter Nutzername
* öffentlich
* Community
* Cloud nicht freigegeben

Interne user_id ist nicht automatisch eine öffentliche Identität.

⸻

22. Migrationen

Datenbankänderungen erfolgen migrationsbasiert.

Bestehende Migrationen werden nicht nachträglich verändert.

Neue strukturelle Änderungen erhalten eine neue Migration.

Migrationen müssen:

* versioniert
* reproduzierbar
* datenschonend
* kompatibel
* nachvollziehbar

sein.

⸻

23. Core-Verantwortung

Der Core stellt zentrale Funktionen bereit.

Fachmodule dürfen diese Funktionen verwenden.

Fachmodule dürfen nicht unnötig eigene Systeme für:

* Identity
* Storage
* Routing
* Fehlerbehandlung
* Sprache
* Berechtigungen
* Datenbankzugriff
* Modulverwaltung

entwickeln.

⸻

24. Architekturprinzip

Identity
↓
user_id
↓
Fachobjekte
↓
Beziehungen über IDs
↓
optionale Cloud-/Community-Ebene

Ziel:

* klare Verantwortlichkeiten
* geringe Redundanz
* zentrale Datenhaltung
* stabile Schnittstellen
* Offline-First
* Cloud-Fähigkeit
* Mehrbenutzerfähigkeit
* Erweiterbarkeit

Ende PROJECT_ARCHITECTURE.md