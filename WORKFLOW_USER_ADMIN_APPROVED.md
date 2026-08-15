# USER & ADMIN MASTER CORE – APPROVED ARCHITECTURE

## Status

STATUS: BESCHLOSSEN / ARCHITEKTUR BESTÄTIGT

Dokumentationsstatus:
- 11 offene Architekturentscheidungen wurden gemeinsam technisch bewertet.
- Die Empfehlung und die technische Bewertung von Lea stimmen überein.
- Die 11 Punkte gelten als genehmigt.
- Keine Core-Implementierung wurde verändert.
- Die Architektur wird hier als verbindliche Grundlage für die spätere Implementierung festgehalten.

## 1. Verbindliche Entscheidungen

1. User-ID
   - Technische UUID als unveränderliche Identität.
   - Benutzerfreundliche Anzeige-ID: `USR-000001`.
   - Die Anzeige-ID ist lokales Präsentationsformat; die technische ID bleibt stabil und unveränderlich.

2. Architektur
   - Klare Trennung von Identity, Auth, Access, Audit und den User/Admin-Fassaden.
   - User/Admin bleiben Core-Schnittstellen, keine fachlichen Optional-Module.

3. Owner
   - Kein generisches `owner`-Recht.
   - Verwenden statt dessen `protected` bzw. vergleichbare Schutzmetadaten.

4. Username
   - Mindestlänge 3 Zeichen.

5. Mehrfachrollen
   - `roles[]` im Datenmodell von Anfang an vorsehen.
   - Die vollständige komplexe Mehrfachrollenlogik wird nicht vorzeitig implementiert, solange sie nicht benötigt wird.

6. Events
   - Einheitliches fachliches Namespace-Schema:
     - `user:*`
     - `auth:*`
     - `admin:*`
     - `module:*`
   - Keine datei- oder implementierungsabhängigen Event-Namen.

7. User/Admin
   - User und Admin sind feste Core-Bestandteile und keine sicherheitsrelevanten optionalen Feature-Flags.

8. Event-Historie
   - Begrenzter Event-Ringpuffer zur Diagnose und Nachvollziehbarkeit.
   - Keine unkontrollierte dauerhafte Event-Persistenz.

9. ModuleManager
   - `update()` als definierte Lifecycle-Schnittstelle vorsehen.
   - Die Update-Logik gehört in den ModuleManager, nicht in den Admin.

10. Fehlerbehandlung
    - Einheitliches, klar definiertes Fehler-/Ergebnismodell.
    - Keine Mischung aus `null`, `false`, uneinheitlichen Exceptions usw.
    - Die konkrete technische Umsetzung erfolgt auf Basis der vorhandenen Architektur.

11. Auth
    - Langfristig nur eine zentrale Authentifizierungswahrheit.
    - `core-auth` wird die zentrale Authentifizierung.
    - Der konkurrierende zweite Auth-Pfad in `service-manager.js` wird bereinigt bzw. deprecated.

## 2. Architektur-Konsistenzprüfung

### 2.1 Widerspruchsprüfung

Keine neuen Widersprüche aus den 11 Entscheidungen:
- Die Identität bleibt technisch stabil, während die Anzeige-ID als Präsentationsschicht separat bleibt.
- Die Authentifizierungslogik wird in eine zentrale Komponente verschoben, statt doppelte Session- und Login-Sichten zu pflegen.
- Rollen und Permissions werden logisch getrennt modelliert, wodurch spätere Erweiterungen möglich sind, ohne die Core-Fassade zu brechen.
- Der Admin wird als Orchestrator definiert, nicht als eigener Benutzer-/Zugriffskern.
- Event-Namensräume sind fachlich und nicht technisch gebunden; damit bleibt die Integration robust gegenüber Dateinamen und Implementationsdetails.

### 2.2 Logische Konsistenz: User-ID, Session, Auth und Permission

Die Logik ist konsistent, wenn die folgenden Regeln eingehalten werden:
- `user.id` ist die unveränderliche technische Identität.
- `user.displayId` oder `user.displayName` ist nur Präsentation.
- `session.userId` verweist auf die technische User-ID.
- `auth` entscheidet über Gültigkeit, Ablauf und Login-Status.
- `access` entscheidet über Berechtigung anhand von Rolle, Permission und Schutzmetadaten.
- `audit` protokolliert nur Entscheidungen, nicht deren Berechnung.

Damit gibt es keine doppelte Wahrheit über den aktiv angemeldeten Benutzer, solange `core-auth` als einzige Auth-Quelle gilt.

### 2.3 Trennung Identity / Auth / Access / Audit

Die Trennung bleibt sauber, wenn:
- Identity nur Benutzer- und Identitätsdaten verwaltet.
- Auth nur Login, Session, Token, Ablauf und Status prüft.
- Access nur kann-Entscheidungen basierend auf Rollen, Permissions und Schutzmetadaten beantwortet.
- Audit nur Ereignisse mit Actor, Aktion, Ressource, Zeitstempel und Ergebnis aufzeichnet.

### 2.4 User/Admin als Core korrekt getrennt

User und Admin sind Core-Bestandteile, aber funktional getrennt:
- User fasst Identität, Benutzerverwaltung und Benutzer-Session-Status zusammen.
- Admin bündelt Diagnostik, Systemüberwachung, Audit- und Verwaltungseinsichten, aber keine eigene Sicherheitslogik.
- Admin ist keine zweite Auth- oder Permission-Engine.
- Admin darf keine direkten Schreibrechte auf User-Identität ohne explizite Security-Delegation besitzen.

### 2.5 Rollen-/Berechtigungslogik erweiterbar

Die Rollen-/Permission-Architektur bleibt erweitertbar, wenn:
- `roles[]` als Array modelliert wird.
- `permissions[]` als explizite, fachliche Listung dient.
- `can()` anhand von Subject, Action, Resource und Context arbeitet.
- `protected` oder vergleichbare Metadaten vor einer unkontrollierten Freigabe schützen.
- Admin-Bypass als Designentscheidung nicht als implizite Berechtigung dient.

### 2.6 Event-Namensgebung konsistent

Das Event-Schema bleibt konsistent:
- `user:*` für User- und Identitätsereignisse
- `auth:*` für Login/Logout/Session-Status
- `admin:*` für Verwaltungs- und Diagnoseereignisse
- `module:*` für Lifecycle, Registrierung und Aktualisierung

Keine Event-Namen dürfen von Dateinamen oder internen Implementationsnamen abgeleitet sein.

### 2.7 Event-Ringpuffer sicher und begrenzt

Der Event-Ringpuffer ist zulässig, wenn:
- eine feste Obergrenze definiert ist
- alte Einträge verworfen werden
- keine unlimitierte Persistenz stattfindet
- Diagnostik und Audit klar getrennt bleiben

### 2.8 Module-Lifecycle vollständig genug

Der Lifecycle ist ausreichend, wenn:
- `init()` und `update()` als definierte Zustände existieren
- `ModuleManager` die Update-Logik und Lebenszyklus-Koordination übernimmt
- Admin keinen Module-Update-Mechanismus selbst implementiert
- ein Rückfall- oder Fehlerpfad für Module definiert ist

### 2.9 Fehler-/Ergebnismodell geeignet für spätere UI-Schichten

Das Modell ist für spätere UI-Schichten geeignet, wenn:
- Ergebnisse als strukturierte Objekte zurückkommen
- Fehler als Typen oder Result-Objekte kommuniziert werden
- keine Überladung mit `null`/`false` erfolgt
- das Model in UI, Service und Core konsistent bleibt

## 3. Verbindliche Spezifikation

### 3.1 Datenmodell-Grundsätze

User-Datensatz:
- `id` – technische, unveränderliche UUID
- `displayId` – humane Anzeige-ID, z. B. `USR-000001`
- `username` – Mindestlänge 3, eindeutig
- `displayName` – anzeigbar, optional
- `email` – optional, validierbar
- `status` – `active`, `inactive`, `locked`, `deleted`
- `roles[]` – Rollenliste, ab jetzt vorgesehen
- `permissions[]` – explizite Berechtigungen
- `protected` – Schutzmetadaten / Schutzstatus
- `createdAt`, `updatedAt`
- `schemaVersion`

Session-Datensatz:
- `sessionId`
- `userId`
- `issuedAt`
- `expiresAt`
- `status`
- `authContext`

### 3.2 Verantwortlichkeiten der Komponenten

Identity:
- verwaltet Benutzer- und Accountdaten
- liefert User-Records und Metadaten
- kennt keine Login-Entscheidung

Auth:
- prüft Zugangsfaktoren
- verwaltet Session-Status und Login/Logout
- ist die zentrale Authentifizierungswahrheit

Access:
- wertet Rollen, Permissions und Schutzmetadaten aus
- liefert `can()`-Ergebnisse
- kennt keine UI-Logik

Audit:
- zeichnet Aktionen mit Kontext auf
- bleibt nach außen lesbar und begrenzt
- speichert nur relevante Sicherheitsevents

User Facade:
- stellt public API für Benutzeroperationen bereit
- delegiert an Identity/Auth/Access
- keine Sicherheitsentscheidung in der Fassade selbst

Admin Facade:
- stellt öffentliche Verwaltungs- und Diagnose-API bereit
- orchestriert, aber darf keine zweite Auth-Wahrheit sein
- verwaltet keine echten Benutzerzustände ohne Delegation

### 3.3 Auth-/Session-Grundsätze

- Es gibt genau eine aktive Authentifizierungsquelle: `core-auth`.
- Der zweite Pfad in `service-manager.js` wird als legacy / deprecated markiert und bereinigt.
- Login- und Session-Status werden nicht in mehreren Objekten dupliziert.
- `currentUser` darf nur als Snapshot aus Auth-/Session-Status abgeleitet werden.

### 3.4 Rollen-/Permission-Grundsätze

- Rollen sind Bündel, keine alleinige Sicherheitsentscheidung.
- Berechtigungen sind die Prüfgröße.
- `owner` wird nicht als generisches Recht geführt.
- `protected` oder vergleichbare Schutzmetadaten machen sensible Ressourcen explizit und kontrollierbar.
- `admin` ist eine Rolle, aber kein globaler Sicherheits-Exempt.

### 3.5 Event-Grundsätze

- Nur fachliche Namespaces.
- Keine technischen Dateinamen oder Klassennamen in Event-Schemata.
- Event-Namen sind priorisiert und bleiben stabil.
- Event-Historie ist diagnostisch begrenzt und nicht Dauerpersistenz.

### 3.6 Audit-Grundsätze

- Jeder relevante Änderungs- und Zugriffsakt wird auf sinnvoller Ebene protokolliert.
- Audit enthält: Actor, Action, Resource, Result, Timestamp.
- Audit bleibt getrennt von Event-Historie und Diagnostik.
- Keine Endlosspeicherung; Begrenzung durch Ringpuffer oder definierte Retention.

### 3.7 Module-Lifecycle-Grundsätze

- `update()` ist Teil der Core-Lifecycle-Spezifikation.
- `ModuleManager` ist der verantwortliche Koordinator.
- Der Admin darf nicht selbst die Update-Logik der Module verwalten.
- Die Module sind technisch sauber von User/Admin getrennt.

### 3.8 Fehler-/Ergebnis-Grundsätze

- Einheitliche Result- oder Error-Objekte statt `null`/`false`-Mix.
- Fehler werden typisiert und semantisch klar kommuniziert.
- UI kann Ergebnisse anzeigen, ohne die intern zugrunde liegende Architektur zu kennen.
- Keine Sicherheits-Checks werden als `false`-Werte versteckt.

## 4. Technische Follow-ups

### FOLLOW-UP / TECHNISCHE LÜCKE 1

Doppelte Auth- und Session-Wahrheiten existieren derzeit noch im Repository. Die Architektur löst das durch die zentrale `core-auth`-Regel, aber die vorhandenen Legacy-Pfade müssen vor der Implementierung bereinigt werden.

Empfehlung:
- `service-manager.js` als legacy/deprecated behandeln
- Überschneidungen mit `UserModule` vor der Implementierung auflösen
- keine neue Auth-Logik parallel zu `core-auth` etablieren

### FOLLOW-UP / TECHNISCHE LÜCKE 2

Persistenz und asynchrone Datenmodelle müssen in der späteren Implementierung sauber durchgesetzt werden. Die Masterarchitektur erlaubt jetzt `async`-APIs, aber der aktuelle Code verwendet noch synchrones Verhalten in mehreren Stellen.

Empfehlung:
- `async` als Standard für User-/Session-/Auth-APIs
- Persistenz über Datenbank-/Storage-Schicht anstatt in RAM-Map
- keine synchronen Master-APIs einfrieren

### FOLLOW-UP / TECHNISCHE LÜCKE 3

Die Rolle `developer` und die exakten Audit-/Security-Metadaten müssen in der späteren Implementierung präzisiert werden.

Empfehlung:
- `developer` als separaten Status/Rolle mit klarer Zweckgrenze modellieren
- `protected` und `audit` als explizite Metadaten in der Datenstruktur definieren
- keine generischen `owner`-Semantiken in der späteren Implementierung aufnehmen

### FOLLOW-UP / TECHNISCHE LÜCKE 4

Der Event-Ringpuffer ist erlaubt, aber seine konkrete Obergrenze und Retention müssen noch spezifiziert werden.

Empfehlung:
- feste Obergrenze je Event-Typ
- separate Audit- und Diagnostics-Queues
- keine unlimitierte eventuelle Persistenz

## 5. Abschlussstatus

Die 11 Architekturentscheidungen sind genehmigt und als verbindlich festgesetzt.
Die Implementierung selbst bleibt weiterhin offen und wird nicht eingefroren.
Die Datei dient als Grundlage für die spätere technische Umsetzung in den Master-Komponenten.
