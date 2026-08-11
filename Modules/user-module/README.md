# CatchTrack User Module

**Version:** 1.0  
**Status:** Aktiv  
**Rolle:** Benutzerverwaltung und Authentifizierung

## Zweck

Das User-Modul verwaltet Benutzer und Authentifizierung in der CatchTrack-Anwendung. Es stellt die Grundlagen für die Benutzeridentifizierung und Rollenverwaltung bereit.

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
