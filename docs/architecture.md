# CatchTrack V1.0
# Architektur-Dokumentation


## Projektziel

CatchTrack ist eine modulare Offline-first Angel-Plattform.

Die Anwendung startet als Web-App und ist so aufgebaut,
dass später eine Umsetzung als Android- und iOS-App möglich ist.


## Grundarchitektur

CatchTrack besteht aus:

- Core-System
- Admin-System
- Datenbank
- Services
- Module
- Konfiguration
- Speicherverwaltung


## Datenfluss

Benutzer

↓

Modul

↓

Core

↓

Service

↓

SQLite Datenbank


Module greifen nicht direkt auf andere Module zu.


## Core-System

Der Core übernimmt zentrale Aufgaben:

- Modulverwaltung
- Datenbankzugriff
- Sprache
- Rechte
- Speicher
- Fehlerbehandlung
- Navigation


## Module

Jedes Modul ist eine eigenständige Einheit.

Standard:

- module.json
- modul.html
- modul.js
- modul.css


Module kommunizieren ausschließlich über:

- Core
- Services
- Datenbank


## Offline-Prinzip

Die Anwendung funktioniert ohne Internet.

Lokale Speicherung:

- SQLite
- lokale Dateien
- lokale Konfiguration


## Erweiterungen

Spätere Erweiterungen:

- Cloud
- Community
- KI
- Bluetooth
- Online-Ranglisten


## Versionsregel

Grundlegende Architekturänderungen führen zu einer neuen Version.

Beispiel:

CatchTrack V1.1