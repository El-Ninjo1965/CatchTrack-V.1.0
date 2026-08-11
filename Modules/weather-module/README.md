# CatchTrack Weather Module

**Version:** 1.0.0  
**Status:** ✓ Abgeschlossen  
**Rolle:** Wetterdaten für Angelspots  
**Letzte Aktualisierung:** 2026-08-11

## Zweck

Das Weather-Modul stellt aktuelle Wetterdaten und Vorhersagen für die CatchTrack-App bereit.
Es ist eigenständig und besitzt keine Abhängigkeiten zu anderen CatchTrack-Modulen (User, Admin, Catch etc.).

## Gewählte Wetterdatenquelle

**Open-Meteo** (open-meteo.com)

| Kriterium | Open-Meteo |
|---|---|
| API-Key erforderlich | Nein ✓ |
| Kostenlos | Ja (nicht-kommerziell) ✓ |
| CORS-fähig (Browser) | Ja ✓ |
| Globale Abdeckung | Ja ✓ |
| Aktuelle Daten | Ja (stündlich aktualisiert) ✓ |
| Stündliche Vorhersage | Ja (bis 7+ Tage) ✓ |
| Tägliche Vorhersage | Ja (7 Tage) ✓ |
| Wind + Böen + Richtung | Ja ✓ |
| Luftdruck | Ja ✓ |
| Luftfeuchtigkeit | Ja ✓ |
| Niederschlag + Wahrsch. | Ja ✓ |
| Sonnenaufgang/Untergang | Ja ✓ |
| Lizenz | CC BY 4.0 (Daten) |
| Kommerzielle Nutzung | Kostenpflichtiger Plan erforderlich ⚠️ |

**Entscheidungsbegründung:** Open-Meteo ist die einzige kostenlose Wetterdatenquelle, die alle
benötigten Parameter ohne API-Key direkt im Browser abrufbar macht. Kein anderer kostenloser
Dienst erfüllt alle Anforderungen gleichzeitig (kein Key, CORS, vollständige Daten).

## Lizenzhinweis

Die **kostenlose** Nutzung von Open-Meteo ist ausschließlich für **nicht-kommerzielle** Projekte
gestattet (CC BY 4.0). Für eine kommerzielle Nutzung von CatchTrack muss auf einen kostenpflichtigen
Open-Meteo-Plan gewechselt oder ein anderer Provider über die Provider-Abstraktion eingebunden werden.

**Pflichtangabe bei Nutzung:**  
`Wetterdaten bereitgestellt von Open-Meteo (open-meteo.com) – CC BY 4.0`

## Provider-Abstraktion

Das Modul trennt Provider und Logik vollständig:

```
WeatherModule → WeatherProviderRegistry → OpenMeteoProvider → open-meteo.com
```

Provider-Wechsel (z.B. zu einem anderen Dienst):
```javascript
// Neuen Provider registrieren und aktivieren
CatchTrackWeatherProviderRegistry.register(MyNewProvider);
CatchTrackWeatherProviderRegistry.setActive('my-new-provider');
```

Der neue Provider muss `name`, `fetchWeather(lat, lon)`, `getName()`, `getAttribution()` implementieren.

## Dateistruktur

```
Modules/weather-module/
├── weather-provider.js    # Provider-Abstraktion + Open-Meteo-Implementierung
├── weather-module.js      # Hauptlogik: Fetch, Normalisierung, Cache, Offline-Handling
├── weather-interface.js   # Öffentliche Schnittstelle für den Core
├── weather-loader.js      # Registrierung und Aktivierung im ModuleManager
└── README.md              # Diese Datei
```

## Normalisierte Datenstruktur

```javascript
{
  location:   { lat, lon, name },
  source:     'Open-Meteo',
  fetchedAt:  'ISO-String',
  timezone:   'Europe/Berlin',
  current: {
    temperature, apparentTemperature,  // °C
    humidity,                          // %
    pressure,                          // hPa
    windSpeed, windDirection,          // km/h, Grad
    windGusts,                         // km/h
    precipitation,                     // mm
    precipitationProbability,          // %
    cloudCover,                        // %
    weatherCode,                       // WMO-Code
    weatherDescription,                // deutsch
    weatherIcon,                       // Emoji
    isDay                              // boolean
  },
  hourly: [ { time, temperature, precipitation, precipitationProbability,
              windSpeed, windDirection, windGusts, weatherCode, weatherIcon,
              weatherDescription } ],  // 24 Einträge
  daily: [ { date, tempMax, tempMin, precipitationSum, precipitationProbabilityMax,
             windSpeedMax, windDirectionDominant, weatherCode, weatherIcon,
             weatherDescription, sunrise, sunset } ],  // 7 Tage
  todaySunrise,  todaySunset            // ISO-Strings
}
```

## API

```javascript
// Wetterdaten abrufen (nutzt Cache wenn nicht älter als 30 min)
await CatchTrackWeatherModule.getWeather(forceRefresh);

// Letzten Datensatz aus dem RAM zurückgeben
CatchTrackWeatherModule.getLastData();

// Aktuellen Zustand abfragen
CatchTrackWeatherModule.getState(); // 'idle'|'loading'|'ok'|'stale'|'offline'|'error'

// Standort setzen
CatchTrackWeatherModule.setLocation(lat, lon, 'Standortname');

// Aktuellen Standort abfragen
CatchTrackWeatherModule.getLocation();

// Windrichtung als Himmelsrichtung
CatchTrackWeatherModule.windDirectionLabel(270); // 'W'

// Cache leeren
CatchTrackWeatherModule.clearCache();
```

## Offline-Verhalten

| Zustand | Verhalten |
|---|---|
| Cache vorhanden, nicht veraltet | Cache direkt zurückgeben |
| Cache vorhanden, aber veraltet + Fetch erfolgreich | Neue Daten |
| Cache vorhanden, veraltet + Fetch fehlgeschlagen | Cache mit `_stale: true` + `_staleReason` |
| Kein Cache + Fetch fehlgeschlagen | Exception, State `offline` oder `error` |

**Veraltungsgrenze:** 30 Minuten  
**Cache-Speicher:** `localStorage` (Key: `ct_weather_v1`)

Veraltete Daten werden niemals als aktuelle Daten ausgegeben. Der UI-Layer zeigt immer einen
deutlichen Hinweis wenn Daten veraltet sind.

## Standort

Standardstandort für die Entwicklungsphase: **Köln** (50.938°N, 6.960°O)

Der Standort kann jederzeit gesetzt werden:
```javascript
CatchTrackWeatherModule.setLocation(48.137, 11.576, 'München');
```

Das Modul benötigt kein Location-Modul und ist von keinem anderen Modul abhängig.

In der App-UI wird beim Öffnen der Wetteransicht automatisch versucht, eine aktuelle GPS-Position zu ermitteln. Bei Erfolg wird der Standort für das Wetter gesetzt; bei Fehlschlag bleibt der vorhandene Standort/Fallback aktiv.

## Events

| Event | Auslöser |
|---|---|
| `weather-module:initialized` | Modul geladen |
| `weather-module:activated` | Modul aktiviert |
| `weather-module:deactivated` | Modul deaktiviert |
| `weather-module:location-changed` | Standort geändert |
| `weather-module:data-updated` | Neue Daten verfügbar |
| `weather-module:data-stale` | Fetch fehlgeschlagen, Cache zurückgegeben |
| `weather-module:error` | Fehler, kein Cache verfügbar |

## Bekannte Einschränkungen

- Kostenlos nur für nicht-kommerzielle Nutzung (Open-Meteo)
- Standardstandort ist Köln (Entwicklungsphase)
- Keine Wetterradar-Daten oder Satellitenbilder
