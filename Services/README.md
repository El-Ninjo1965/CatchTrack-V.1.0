# CatchTrack Services Layer

**Version:** 1.0  
**Status:** Aktiv  
**Rolle:** Business-Logik und Service-Verwaltung

## Zweck

Der Service Manager koordiniert geschäftslogische Operationen. Alle Services werden zentral registriert und können von Modulen und anderen Services aufgerufen werden.

## Verfügbare Services

### User Service
Verwaltet Benutzeroperationen:
- `getUser(userId)` - Holt einen Benutzer
- `saveUser(user)` - Speichert einen Benutzer
- `deleteUser(userId)` - Löscht einen Benutzer
- `getAllUsers()` - Gibt alle Benutzer zurück

### Auth Service
Verwaltet Authentifizierung:
- `authenticate(userId)` - Authentifiziert einen Benutzer
- `getCurrentUser()` - Gibt den aktuellen Benutzer zurück
- `logout()` - Meldet ab
- `isAuthenticated()` - Prüft Authentifizierung

### Module Service
Verwaltet Modul-Metadaten:
- `registerModule(moduleData)` - Registriert ein Modul
- `getAllModules()` - Gibt alle Module zurück

### Logging Service
Verwaltet Protokollierung:
- `log(message, level, source)` - Protokolliert eine Nachricht
- `info(message, source)` - Protokolliert ein Info
- `warn(message, source)` - Protokolliert eine Warnung
- `error(message, source)` - Protokolliert einen Fehler

### Cache Service
Verwaltet Caching:
- `set(key, value, ttl)` - Speichert im Cache
- `get(key)` - Ruft aus Cache ab
- `delete(key)` - Löscht aus Cache
- `clear()` - Löscht gesamten Cache

## API

Siehe `Services/service-manager.js` für vollständige Dokumentation.
