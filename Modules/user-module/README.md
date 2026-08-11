# CatchTrack User Module

**Version:** 1.1.0  
**Status:** ✓ Abgeschlossen  
**Rolle:** Benutzerverwaltung und Authentifizierung  
**Letzte Aktualisierung:** 2026-08-11

## Zweck

Das User-Modul verwaltet Benutzer in der CatchTrack-Anwendung. Es stellt vollständige Benutzeridentitäten bereit – mit eindeutigem Username, Anzeigenamen, Avatar-Referenz, Status und Login-Tracking.

## Benutzerdatenstruktur

```javascript
{
    id: string,           // Eindeutige Benutzer-ID
    username: string,     // Eindeutiger Username (für Catches, Leaderboards, Community)
    displayName: string,  // Anzeigename in der UI
    email: string,        // E-Mail-Adresse
    avatar: string|null,  // URL/Referenz auf Profilbild (null = kein Avatar)
    role: string,         // Rolle: 'user' | 'admin' | 'developer'
    status: string,       // Status: 'active' | 'inactive' | 'banned'
    createdAt: string,    // ISO-Zeitstempel der Erstellung
    lastLoginAt: string|null  // ISO-Zeitstempel des letzten Logins
}
```

## Testbenutzer

Das Modul erstellt automatisch zwei Test-Benutzer:

| ID | Username | Anzeigename | E-Mail | Rolle |
|---|---|---|---|---|
| `test-user-001` | `devuser` | Dev User | dev@catchtrack.local | developer |
| `test-admin-001` | `admin` | Administrator | admin@catchtrack.local | admin |

## API

### `authenticate(userId)`
Authentifiziert einen Benutzer. Setzt `lastLoginAt` auf den aktuellen Zeitstempel.

```javascript
const user = CatchTrackUserModule.authenticate('test-user-001');
```

### `getCurrentUser()`
Gibt den aktuell eingeloggten Benutzer zurück.

### `logout()`
Meldet den aktuellen Benutzer ab.

### `getAllUsers()`
Gibt alle Benutzer als Array zurück.

### `getUserById(userId)`
Gibt einen Benutzer nach ID zurück (oder `null`).

### `getUserByUsername(username)`
Gibt einen Benutzer nach eindeutigem Username zurück (oder `null`).

```javascript
const user = CatchTrackUserModule.getUserByUsername('devuser');
```

### `createUser(userData)`
Erstellt einen neuen Benutzer. `username` ist Pflichtfeld und muss eindeutig sein.

```javascript
const newUser = CatchTrackUserModule.createUser({
    username: 'janedoe',
    displayName: 'Jane Doe',
    email: 'jane@catchtrack.local',
    role: 'user'
});
```

Wirft einen Fehler wenn `username` fehlt oder bereits vergeben ist.

### `updateUser(userId, updates)`
Aktualisiert Felder eines Benutzers. `id` und `createdAt` sind schreibgeschützt. Bei Username-Änderung wird Eindeutigkeit geprüft.

### `deleteUser(userId)`
Löscht einen Benutzer. Gibt `true` zurück bei Erfolg.

### `hasRole(role)`
Prüft die Rolle des eingeloggten Benutzers.

### `isAdmin()`
Shortcut für `hasRole('admin')`.

## Events

| Event | Auslöser |
|---|---|
| `user-module:initialized` | Modul geladen |
| `user-module:authenticated` | Login erfolgreich |
| `user-module:auth-failed` | Login fehlgeschlagen |
| `user-module:logout` | Abmeldung |
| `user-module:user-created` | Neuer Benutzer erstellt |
| `user-module:user-updated` | Benutzer aktualisiert |
| `user-module:user-deleted` | Benutzer gelöscht |

## Dateistruktur

```
Modules/user-module/
├── user-module.js      # Hauptmodul mit Datenstruktur und Logik
├── user-interface.js   # Modulschnittstelle (öffentliche API)
├── user-loader.js      # Registrierung und Aktivierung im Core
└── README.md           # Diese Datei
```

## Funktionen

- Benutzerverwaltung (Erstellen, Lesen, Aktualisieren, Löschen)
- Benutzer-Authentifizierung
- Rollenverwaltung (user, admin, developer)
- Test-Benutzer für die Entwicklung
- Event-Emission bei Benutzeraktionen

## Testbenutzer

Das Modul erstellt automatisch zwei Test-Benutzer:

| ID | Name | E-Mail | Rolle |
|---|---|---|---|
| `test-user-001` | Test Developer | dev@catchtrack.local | developer |
| `test-admin-001` | Test Administrator | admin@catchtrack.local | admin |

## API

### Methoden

#### `authenticate(userId)`
Authentifiziert einen Benutzer.

```javascript
const user = CatchTrackUserModule.authenticate('test-user-001');
```

**Parameter:** 
- `userId` (string) - Benutzer-ID

**Rückgabe:** Benutzer-Objekt oder null

---

#### `getCurrentUser()`
Gibt den aktuellen Benutzer zurück.

```javascript
const currentUser = CatchTrackUserModule.getCurrentUser();
```

**Rückgabe:** Benutzer-Objekt oder null

---

#### `logout()`
Meldet den aktuellen Benutzer ab.

```javascript
CatchTrackUserModule.logout();
```

---

#### `getAllUsers()`
Gibt alle Benutzer zurück.

```javascript
const users = CatchTrackUserModule.getAllUsers();
```

**Rückgabe:** Array von Benutzerobjekten

---

#### `getUserById(userId)`
Gibt einen Benutzer nach ID zurück.

```javascript
const user = CatchTrackUserModule.getUserById('test-user-001');
```

**Parameter:**
- `userId` (string) - Benutzer-ID

**Rückgabe:** Benutzer-Objekt oder undefined

---

#### `createUser(userData)`
Erstellt einen neuen Benutzer.

```javascript
const newUser = CatchTrackUserModule.createUser({
    name: 'Jane Doe',
    email: 'jane@catchtrack.local',
    role: 'user'
});
```

**Parameter:**
- `userData` (object) - Benutzerdaten mit `name`, `email`, `role`

**Rückgabe:** Neu erstelltes Benutzerobjekt

---

#### `updateUser(userId, updates)`
Aktualisiert einen Benutzer.

```javascript
const updated = CatchTrackUserModule.updateUser('test-user-001', {
    name: 'Updated Name'
});
```

**Parameter:**
- `userId` (string) - Benutzer-ID
- `updates` (object) - Zu aktualisierende Felder

**Rückgabe:** Aktualisiertes Benutzerobjekt oder null

---

#### `deleteUser(userId)`
Löscht einen Benutzer.

```javascript
const success = CatchTrackUserModule.deleteUser('test-user-001');
```

**Parameter:**
- `userId` (string) - Benutzer-ID

**Rückgabe:** Boolean (erfolgreich gelöscht)

---

#### `hasRole(role)`
Prüft, ob der aktuelle Benutzer eine Rolle hat.

```javascript
if (CatchTrackUserModule.hasRole('admin')) {
    // Admin-Aktionen
}
```

**Parameter:**
- `role` (string) - Zu prüfende Rolle

**Rückgabe:** Boolean

---

#### `isAdmin()`
Prüft, ob der aktuelle Benutzer ein Admin ist.

```javascript
if (CatchTrackUserModule.isAdmin()) {
    // Admin-Aktionen
}
```

**Rückgabe:** Boolean

## Events

Das Modul gibt folgende Events aus:

- `user-module:initialized` - Modul wurde initialisiert
- `user-module:authenticated` - Benutzer authentifiziert
- `user-module:auth-failed` - Authentifizierung fehlgeschlagen
- `user-module:logout` - Benutzer abgemeldet
- `user-module:user-created` - Benutzer erstellt
- `user-module:user-updated` - Benutzer aktualisiert
- `user-module:user-deleted` - Benutzer gelöscht

## Benutzer-Objektstruktur

```javascript
{
    id: string,              // Eindeutige Benutzer-ID
    name: string,            // Benutzername
    email: string,           // E-Mail-Adresse
    role: string,            // Rolle (user, admin, developer)
    active: boolean,         // Benutzer aktiv
    createdAt: string        // ISO-Zeitstempel der Erstellung
}
```

## Dateistruktur

```
Modules/user-module/
├── user-module.js          # Hauptmodul
├── user-interface.js       # Modulschnittstelle
└── README.md               # Diese Datei
```

## Zukünftige Erweiterungen

- Permanente Speicherung in Datenbank
- Passwort-Verwaltung
- Berechtigungssystem
- Sessionsmanagement
- Audit-Logging
