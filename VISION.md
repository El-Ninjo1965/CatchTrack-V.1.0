# CatchTrack V1.0 – Vision

## 1. Zweck

CatchTrack V1.0 ist eine modulare, offlinefähige Fishing-Anwendung.

Die Anwendung besteht aus:

1. einem stabilen, generischen Core
2. einem generischen Modul-System
3. installierbaren Fachmodulen
4. einem User-Modul
5. einem Admin-Modul
6. einem Berechtigungs- und Paket-System

Der Core stellt ausschließlich die technische Plattform bereit.

Fachliche Funktionen werden ausschließlich durch Module bereitgestellt.

—

## 2. Grundprinzip

CatchTrack wird nach dem Prinzip eines modernen modularen Systems aufgebaut.

```text
CATCHTRACK
    │
    ├── CORE
    │
    └── MODULE SYSTEM
          │
          ├── USER
          ├── ADMIN
          └── FACHMODULE
```

Der Core kennt keine konkreten Fachmodule.

—

## 3. Der Core

Der Core ist die technische Basis von CatchTrack.

Der Core stellt generische Infrastruktur bereit für:

- Application Startup
- Runtime
- Lifecycle
- Event-System
- State Management
- Storage
- Database Infrastructure
- Error Handling
- Logging
- Module Management
- Module Registry
- Module Interface
- Module Lifecycle
- Permissions
- Package / Entitlements
- zentrale Systemkonfiguration

Der Core enthält keine fachliche Fishing-Funktionalität.

Insbesondere gehören GPS, Wetter, Catchbook, Fischdatenbank, Gezeiten, Statistiken, Karten und ähnliche Funktionen nicht in den Core.

—

## 4. Core Freeze

Der Core wird nach vollständiger Implementierung, Prüfung und Abnahme eingefroren.

Bis zu diesem Zeitpunkt ist der Core ausdrücklich nicht eingefroren.

Nach dem Freeze gilt:

Neue Funktionalität wird ausschließlich als Modul implementiert.

Ein neues Modul darf grundsätzlich keine Änderung an bestehenden Core-Dateien benötigen.

Der eingefrorene Core ist anschließend für AI-Agenten ausschließlich lesbar.

AI-Agenten dürfen:

- Core-Dateien lesen
- Core-Dateien analysieren
- Core-APIs verwenden

AI-Agenten dürfen nicht:

- Core-Dateien ändern
- Core-Dateien überschreiben
- Core-Dateien löschen
- Core-Dateien verschieben
- Core-Dateien umbenennen

Eine Änderung des eingefrorenen Core ist ausschließlich eine bewusste Projektentscheidung außerhalb des normalen Modul-Entwicklungsprozesses.

—

## 5. Module

Jede fachliche Funktion wird als eigenständiges Modul umgesetzt.

Beispiele:

- User
- Admin
- GPS
- Weather
- Catchbook
- Fish Database
- Tides
- Maps
- Statistics
- Reverse Geocoding

Module müssen über definierte Core-Schnittstellen mit der Anwendung kommunizieren.

Ein Modul darf nicht auf interne Implementierungsdetails anderer Module zugreifen.

Module sollen möglichst unabhängig voneinander funktionieren.

—

## 6. Modulinstallation

Module werden über das Admin-System verwaltet.

Der Benutzer soll Module nicht manuell in Core-Dateien integrieren müssen.

Ein Modul muss konzeptionell installiert, aktiviert, deaktiviert, aktualisiert und deinstalliert werden können.

Die Installation umfasst bei Bedarf auch die Einrichtung der zum Modul gehörenden Datenbankstrukturen.

—

## 7. Modul-Deinstallation

Ein Modul muss vollständig entfernt werden können.

Dabei gehören grundsätzlich dazu:

- Modul deaktivieren
- Modul aus der Registry entfernen
- Modul-Datenbankstrukturen behandeln
- Moduldateien entfernen
- Abhängigkeiten prüfen

Das System muss zwischen dem Entfernen des Moduls und dem unwiderruflichen Löschen seiner Benutzerdaten unterscheiden können.

—

## 8. User-Modul

Benutzerfunktionen gehören in das User-Modul.

Das User-Modul ist kein Bestandteil des Core.

Es verwaltet unter anderem:

- Benutzerkonto
- Login
- Logout
- Session
- Profil
- Benutzerstatus
- Rollen
- Paketzuordnung
- Berechtigungen

—

## 9. Admin-Modul

Das Admin-Modul ist ebenfalls ein eigenständiges Modul.

Es stellt Funktionen für Benutzer mit entsprechenden Berechtigungen bereit.

Dazu gehören insbesondere:

- Dashboard
- Benutzerverwaltung
- Rollenverwaltung
- Paketverwaltung
- Modulverwaltung
- Systemverwaltung

Die Modulverwaltung muss perspektivisch ermöglichen:

- verfügbare Module anzeigen
- Module installieren
- Module aktivieren
- Module deaktivieren
- Module aktualisieren
- Module deinstallieren

—

## 10. Rollen und Berechtigungen

Der Zugriff auf Funktionen wird über Benutzer, Rollen, Berechtigungen und Pakete bestimmt.

User
 ├── Role
 ├── Package
 └── Permissions

Ein Benutzer erhält nur die Funktionen, für die er tatsächlich berechtigt ist.

Nicht freigeschaltete Funktionen werden nicht als nutzlose Menüeinträge angezeigt.

—

## 11. Dynamische Benutzeroberfläche

Die Navigation wird dynamisch aufgebaut.

Grundprinzip:

Login
 ↓
User
 ↓
Role / Package
 ↓
Permissions
 ↓
installierte Module
 ↓
Module registrieren ihre Navigation
 ↓
sichtbares App-Menü

Ein Benutzer sieht nur die Module und Funktionen, die für ihn verfügbar sind.

—

## 12. Paket-System

CatchTrack wird auf ein späteres Paket-/Entitlement-System vorbereitet.

Ein Paket kann bestimmen, welche Module und Funktionen einem Benutzer zur Verfügung stehen.

Beispielhafte Pakete können später sein:

- FREE
- BASIC
- PRO
- DEVELOPER

Diese Bezeichnungen sind keine endgültige Produktdefinition.

Die Architektur muss lediglich sicherstellen, dass solche Pakete später ohne grundlegenden Umbau des Core eingeführt werden können.

—

## 13. Offline First

CatchTrack soll grundsätzlich offlinefähig sein.

Lokale Datenhaltung und Synchronisation werden über generische Core-Infrastruktur bereitgestellt.

Konkrete Fachdaten gehören in die jeweiligen Module.

—

## 14. Erweiterbarkeit

Das System muss so aufgebaut sein, dass neue Fachmodule hinzugefügt werden können, ohne bestehende Core-Dateien verändern zu müssen.

Ein neues Modul soll:

installieren
→ registrieren
→ aktivieren
→ verwenden
→ deaktivieren
→ aktualisieren
→ deinstallieren

können.

Dies ist ein wesentliches Architekturziel von CatchTrack V1.0.

—

## 15. Arbeits- und Dokumentationsprinzip

Die Vision beschreibt die Zielarchitektur.

Konkrete Arbeitsregeln, Prüfabläufe, Dateiausgabe und Entwicklungsprozesse werden ausschließlich in RULES.md und WORKFLOW.md festgelegt.

Die Vision wird nicht mit operativen Arbeitsanweisungen überladen.

—

## 16. Zielzustand

Der endgültige Zielzustand lautet:

Der Core läuft unabhängig von den Fachmodulen und bleibt stabil.

Module können über das Admin-System installiert und entfernt werden.

Benutzer sehen ausschließlich die für sie verfügbaren Funktionen.

Neue Fachfunktionen erfordern keine Änderungen am eingefrorenen Core.

CatchTrack kann dadurch langfristig wie ein modulares System erweitert werden.

—

## Status

VISION: OFFEN

Die Datei wird nach Abschluss der einmaligen Dokumentations-Synchronisation erneut gegen RULES.md, WORKFLOW.md, PROJECT_MASTERLIST.md und PROJECT_STATUS.md geprüft.

Danach wird sie gemeinsam mit den übrigen relevanten Masterdateien eingefroren.