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

## 4. Technische Follow-ups – Vorimplementierungsentscheidungen

### 4.1 AUTH-DUPLIKAT

Die Architekturentscheidung ist eindeutig: `core-auth` ist die einzige Authentifizierungswahrheit.
Ein zweiter Auth-Pfad ist hier nicht zulässig.

Umsetzungsvorgaben:
- `service-manager.js` wird als Legacy-/Compatibility-Wrapper behandelt, nicht als zweite Authentifizierungsquelle.
- `AuthService.authenticate()` darf nur noch als Delegation an `core-auth` fungieren.
- `UserModule.currentUser` und `ServiceManager.AuthService.currentUser` dürfen keine getrennten, parallelen Session-Status-Felder weiterführen.
- Auth-Events bleiben auf `auth:*` begrenzt; keine parallelen `user-module:*`-Authentifizierungsereignisse als alternative Wahrheit.
- Die zentrale Authentifizierung liefert Session-Status, User-Context und Token-/Login-Resultat.

Bevorzugte Variante:
- `service-manager.js` erhält eine deprecation warning und darf nur noch adapterartig auf `core-auth` verweisen.
- Das verhindert doppelte Wahrheiten beim Login/Logout und entlastet die spätere Implementierung von einem zweiten Sicherheitszustand.

FOLLOW-UP-ENTSCHEIDUNG:
- `core-auth` ist der einzige authentifizierende Pfad.
- Legacy Auth im Service-Manager ist nur noch Delegationsschicht und darf keine eigene Session-Logik mehr behalten.

### 4.2 ASYNCHRONE PERSISTENZ

Die Architektur verlangt `async`-fähig für alle datenberührenden User-/Admin-Operationen.
Synchrones Verhalten ist nur zulässig, wenn es keinen Persistenz- oder Storage-Call verkapselt und keine langfristige Benutzer-/Admin-API definiert.

Umsetzungsvorgaben:
- `createUser`, `getUserById`, `listUsers`, `updateUser`, `deleteUser`, `login`, `logout`, `session`-Operationen werden als `async`-APIs modelliert.
- Persistenz über IndexedDB oder späteren Backend-Store darf dabei keine Brake-Change-Schnittstelle erzwingen.
- Das Master-Interface darf keine synchronen Signaturen festlegen, die später nur durch Storage-Schnittstellen oder Server-Calls verzerrt werden.
- Ergebnis- und Fehlerobjekte bleiben im zentralen Ergebnis-/Fehlermodell.

Bevorzugte Variante:
- `async` wird als Standard für alle Datenbank-/Persistance-Aktionen gewählt.
- Damit bleibt die spätere Persistenz-Implementierung kompatibel und ohne API-Breaks umsetzbar.

FOLLOW-UP-ENTSCHEIDUNG:
- Alle benutzer- und adminbezogenen Datenoperationen werden als asynchron modelliert; die Master-Architektur erlaubt keine synchronen Persistenzsignaturen.

### 4.3 DEVELOPER-ROLLE

Die Rolle `developer` ist ein normaler, explizit berechtigter Zugriffskontext und kein eigener Sicherheitsmodus.
Sie ist nicht mit `admin` identisch und darf keine Sonderrechte außerhalb der zentralen Access-Logik bekommen.

Umsetzungsvorgaben:
- `developer` ist eine Rolle im `roles[]`-Modell.
- Die Rechte werden über `permissions[]` bzw. Access-Regeln vergeben.
- `developer` darf Diagnose-/Debug-Access erhalten, aber nur auf Basis der zentralen Permission-Logik.
- Das Recht auf Benutzer-/Admin-Operationen bleibt weiterhin explizit und wird nicht durch `developer` automatisch gewährt.
- `developer` ist kein Admin-Bypass und kein eigener Superuser.

Bevorzugte Variante:
- `developer` bleibt ein normales Rollen- und Permissions-Objekt, nicht ein dedizierter Sonderfall im Admin-
  oder Auth-Kontext.

FOLLOW-UP-ENTSCHEIDUNG:
- `developer` ist Teil des zentralen Access-Modells, nicht ein eigener Auth-/Admin-Pfad.

### 4.4 EVENT-RINGPUFFER

Der Event-Ringpuffer ist für Diagnose, Debugging und Audit-Unterstützung zulässig, aber streng begrenzt.
Er ist kein Ersatz für einen Audit-Log und keine permanente Ereignis-Store-Mechanik.

Umsetzungsvorgaben:
- Maximalgröße: 256 Einträge pro Event-Namespace.
- Ringpuffer verwirft immer die ältesten Einträge, wenn die Grenze erreicht ist.
- Keine unkontrollierte Persistenz auf Disk oder IndexedDB.
- Ringpuffer ist nur ein in-memory Debug-/Diagnose-Kontext innerhalb der Laufzeit.
- Audit-Events und Debug-Events sind getrennt zu behandeln; der Ringpuffer unterstützt nur die Diagnose, nicht die primäre Audit-Wahrheit.

Bevorzugte Variante:
- 256 Einträge pro Namespace als feste, nachvollziehbare Obergrenze.
- Das ist ausreichend für Nachvollziehbarkeit und verhindert Speicher-Leaks oder ungebremste Event-Sammlung.

FOLLOW-UP-ENTSCHEIDUNG:
- Event-Ringpuffer max. 256 Einträge pro Namespace, in-memory, keine Dauerpersistenz, ausschließlich für Diagnose/Debugging/Audit-Unterstützung.

## 5. Abschlussbewertung

STATUS: READY FOR USER/ADMIN MASTER CORE IMPLEMENTATION

Begründung:
- Die 11 genehmigten Architekturentscheidungen bleiben unverändert gültig.
- Die vier dokumentierten technischen Follow-ups wurden konsistent konkretisiert und als Vorimplementierungsregeln festgelegt.
- Es gibt keine offen gebliebenen Architektur-Blocker für die spätere User/Admin-Implementierung.
- Keine Implementierung wurde gestartet; die Architektur ist für die nächste technische Umsetzungsphase vorbereitet.

Es verbleiben keine technischen Blocker im Sinne der Master-Architektur.

## 6. Abschlussstatus

Die 11 Architekturentscheidungen sind genehmigt und als verbindlich festgesetzt.
Die technischen Follow-ups wurden vor der Implementierung als klare, umsetzungsfähige Regeln konkretisiert.
Die Implementierung selbst bleibt weiterhin offen und wird nicht eingefroren.
Die Datei dient als Grundlage für die spätere technische Umsetzung in den Master-Komponenten.
