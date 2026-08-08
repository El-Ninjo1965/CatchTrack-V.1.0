# CatchTrack V1.0
# Datenbank-Dokumentation


## Datenbanksystem

CatchTrack verwendet eine zentrale SQLite-Datenbank.

Die Datenbank funktioniert offline und bildet die zentrale
Datenspeicherung aller Module.


## Grundprinzip

Module besitzen keine eigenen Datenbanken.

Alle Daten werden zentral gespeichert.


Beispiel:

Fangbuch

↓

SQLite


Statistik

↓

SQLite


Rekorde

↓

SQLite


## Haupttabellen


### catches

Speichert alle Fänge.

Wichtige Daten:

- Datum
- Uhrzeit
- Fischart
- Gewicht
- Länge
- Köder
- Methode
- Gewässer
- GPS
- Fotos


### fish

Fischdatenbank.

Speichert:

- Name
- wissenschaftlicher Name
- Beschreibung
- Rekordwerte


### waters

Gewässerverwaltung.

Speichert:

- Name
- Gewässertyp
- Region
- GPS-Daten


### equipment

Ausrüstungsverwaltung.


### weather

Wetterdaten.


### moon

Mondphasen.


### tides

Gezeiteninformationen.


### records

Persönliche Rekorde.


### users

Benutzerdaten.


### modules

Aktive und installierte Module.


### emergency

Sicherheitskontakte.


## Datenbank-Erweiterungen

Neue Tabellen werden zuerst definiert.

Danach:

1. schema.sql aktualisieren
2. Core anpassen
3. Modul integrieren


## Datenschutz

Cloud-Daten werden nur nach aktiver Zustimmung übertragen.

Lokale Daten bleiben auf dem Gerät.