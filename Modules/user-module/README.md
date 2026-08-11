# CatchTrack User Module

**Version:** 1.1.0  
**Status:** ✓ Abgeschlossen  
**Rolle:** Benutzerverwaltung und Authentifizierung  
**Letzte Aktualisierung:** 2026-08-11

## Zweck

Das User-Modul verwaltet Benutzeridentitäten in CatchTrack. Es stellt eine stabile API für Authentifizierung, Rollenprüfung und Benutzerpflege bereit.

## Benutzerdatenstruktur

```javascript
{
    id: string,               // Eindeutige Benutzer-ID
    username: string,         // Eindeutiger Username
    displayName: string,      // Anzeigename in der UI
    email: string,            // E-Mail-Adresse
    avatar: string|null,      // URL/Referenz auf Profilbild
    role: string,             // 'user' | 'admin' | 'developer'
    status: string,           // 'active' | 'inactive' | 'banned'
    createdAt: string,        // ISO-Zeitstempel
    lastLoginAt: string|null  // ISO-Zeitstempel des letzten Logins
}
```

## Demo-Benutzer

Das Modul erstellt automatisch zwei Demo-Benutzer:

| ID | Username | Anzeigename | E-Mail | Rolle |
|---|---|---|---|---|
| `demo-user-001` | `demo-user` | Demo User | demo@catchtrack.local | developer |
| `demo-admin-001` | `admin` | Administrator | admin@catchtrack.local | admin |

## Öffentliche API

### `authenticate(userId)`
Authentifiziert einen Benutzer und setzt `lastLoginAt`.

### `getCurrentUser()`
Gibt den aktuell angemeldeten Benutzer zurück.

### `logout()`
Meldet den aktuellen Benutzer ab.

### `getAllUsers()`
Gibt alle Benutzer als Array zurück.

### `getUserById(userId)`
Gibt einen Benutzer per ID zurück, sonst `null`.

### `getUserByUsername(username)`
Gibt einen Benutzer per Username zurück, sonst `null`.

### `createUser(userData)`
Erstellt einen neuen Benutzer. `username` ist Pflichtfeld und muss eindeutig sein.

### `updateUser(userId, updates)`
Aktualisiert einen Benutzer. `id` und `createdAt` sind schreibgeschützt.

### `deleteUser(userId)`
Löscht einen Benutzer und gibt `true` bei Erfolg zurück.

### `hasRole(role)`
Prüft, ob der aktuelle Benutzer eine bestimmte Rolle besitzt.

### `isAdmin()`
Shortcut für `hasRole('admin')`.

## Beispiele

```javascript
const user = CatchTrackUserModule.authenticate('demo-user-001');
if (user) {
    console.log('Angemeldet als', user.username);
}

const byName = CatchTrackUserModule.getUserByUsername('admin');

const created = CatchTrackUserModule.createUser({
    username: 'janedoe',
    displayName: 'Jane Doe',
    email: 'jane@catchtrack.local',
    role: 'user'
});

const updated = CatchTrackUserModule.updateUser(created.id, {
    displayName: 'Jane D.',
    status: 'active'
});
```

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
├── user-module.js
├── user-interface.js
├── user-loader.js
└── README.md
```

## Funktionen

- Benutzerverwaltung (CRUD)
- Authentifizierung
- Rollen- und Statusprüfung
- Login-Tracking (`lastLoginAt`)
- Event-Emission bei Benutzeraktionen

## Zukünftige Erweiterungen

- Persistente Speicherung in Datenbank
- Passwort-Verwaltung
- Session-Management
- Audit-Logging
