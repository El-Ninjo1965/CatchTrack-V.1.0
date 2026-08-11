/*
 * CatchTrack i18n Module
 * Version: 1.0.0
 *
 * Internationalisierung – unterstützt aktuell: de (Deutsch), en (English)
 * Sprache: navigator.language (Gerät), manuell wählbar, gespeichert in localStorage
 */

(() => {
    'use strict';

    const TRANSLATIONS = {

        de: {
            // App
            'app.loading':          'Wird geladen…',
            'app.user_loading':     'Benutzer wird geladen…',
            'app.error':            'Fehler beim Laden – bitte Seite neu laden.',
            'app.tagline':          'v1.0.0 – Core + Services + Modules + Tests',

            // Navigation
            'nav.dashboard':  'Dashboard',
            'nav.catches':    'Meine Fänge',
            'nav.fishdb':     'Fischdatenbank',
            'nav.weather':    'Wetter',
            'nav.gps':        'GPS & Standort',
            'nav.stats':      'Statistiken',
            'nav.profile':    'Mein Profil',
            'nav.settings':   'Einstellungen',
            'nav.soon':       'Bald',

            // Bottom nav short labels
            'bnav.home':     'Home',
            'bnav.catches':  'Fänge',
            'bnav.weather':  'Wetter',
            'bnav.profile':  'Profil',

            // Dashboard
            'dashboard.welcome_user':    'Willkommen, {name}!',
            'dashboard.welcome':         'Willkommen!',
            'dashboard.welcome_sub':     'Schön, dass du wieder dabei bist.',
            'dashboard.new_catch':       '➕ Neuen Fang erfassen',
            'dashboard.overview':        'Übersicht',
            'dashboard.modules':         'Module',
            'stat.catches':              'Gesamte Fänge',
            'stat.week':                 'Diese Woche',
            'stat.species':              'Fischarten',
            'stat.modules':              'Aktive Module',

            // Module Cards
            'mod.catches.title': 'Fangbuch',
            'mod.catches.desc':  'Erfasse deine Fänge, Gewässer und Angelausflüge.',
            'mod.fishdb.title':  'Fischdatenbank',
            'mod.fishdb.desc':   'Fischarten, Schonzeiten, Maße und Gewässerinformationen.',
            'mod.weather.title': 'Wetter',
            'mod.weather.desc':  'Aktuelle Wetterdaten und 7-Tage-Vorhersage für deinen Spot.',
            'mod.stats.title':   'Statistiken',
            'mod.stats.desc':    'Auswertungen, Trends und persönliche Bestleistungen.',
            'mod.leader.title':  'Leaderboard',
            'mod.leader.desc':   'Ranglisten und Community-Vergleiche nach Fischarten.',
            'mod.spots.title':   'Gewässer',
            'mod.spots.desc':    'Gewässerverwaltung mit GPS und Spotmarkierungen.',
            'mod.available':     '✓ Verfügbar',
            'mod.in_dev':        'In Entwicklung',
            'mod.planned':       'Geplant',

            // Sys bar
            'sys.label':    'System',

            // Weather
            'weather.page_title':   '🌤️ Wetter',
            'weather.page_sub':     'Aktuelle Wetterdaten für deinen Angelspot.',
            'weather.refresh':      '🔄 Aktualisieren',
            'weather.gps':          '📡 GPS',
            'weather.gps_retry_active': '🛰️ GPS-Autoaktualisierung aktiv',
            'weather.gps_retry_wait':   'GPS wird automatisch erneut geprüft.',
            'weather.loading':      'Wetterdaten werden geladen…',
            'weather.retry':        'Erneut versuchen',
            'weather.wind':         '💨 Wind',
            'weather.gusts':        '💨 Böen',
            'weather.pressure':     '🌡️ Luftdruck',
            'weather.humidity':     '💧 Luftfeuchte',
            'weather.rain':         '🌧️ Regenwahrsch.',
            'weather.clouds':       '☁️ Bewölkung',
            'weather.sunrise':      'Sonnenaufgang',
            'weather.sunset':       'Sonnenuntergang',
            'weather.hourly':       'Stündliche Vorhersage (24 h)',
            'weather.daily':        '7-Tage-Vorhersage',
            'weather.updated':      'Aktualisiert',
            'weather.now':          'Jetzt',
            'weather.attribution':  'Wetterdaten:',
            'weather.stale':        '⚠️ Zwischengespeicherte Daten ({age} Min. alt) – {reason}',
            'weather.err_nomodule': 'Weather-Modul nicht geladen.',
            'weather.err_offline':  'Keine Internetverbindung. Wetterdaten nicht verfügbar.',
            'weather.err_timeout':  'Zeitüberschreitung.',
            'weather.err_generic':  'Wetterdaten konnten nicht geladen werden: {msg}',
            'weather.err_nogps':    'GPS- oder Weather-Modul nicht verfügbar',

            // GPS
            'gps.page_title': '📡 GPS & Standort',
            'gps.page_sub':   'Aktuelle Geräteposition – Schnittstelle für andere Module.',
            'gps.get':        '📍 Position ermitteln',
            'gps.track_start':'▶ Tracking starten',
            'gps.track_stop': '⏹ Tracking stoppen',
            'gps.for_weather':'🌤️ Für Wetter nutzen',
            'gps.pos_data':   'Positionsdaten',
            'gps.no_pos':     'Noch keine Position verfügbar.',
            'gps.mod_status': 'Modul-Status',
            'gps.interface':  '🔗 GPS-Schnittstelle',
            'gps.r_loaded':   'Modul geladen',
            'gps.r_support':  'Browser-Support',
            'gps.r_perm':     'Berechtigung',
            'gps.r_status':   'Status',
            'gps.d_lat':      'Latitude',
            'gps.d_lon':      'Longitude',
            'gps.d_city':     'Stadt',
            'gps.d_province': 'Bundesland/Provinz',
            'gps.d_country':  'Staat',
            'gps.d_accuracy': 'Genauigkeit',
            'gps.d_altitude': 'Höhe',
            'gps.d_speed':    'Geschwindigkeit',
            'gps.d_heading':  'Richtung',
            'gps.d_time':     'Zeitstempel',
            'gps.d_source':   'Quelle',
            'gps.d_stale':    'Veraltet',
            'gps.loading':    'wird geladen…',
            'gps.stale_yes':  'Ja (> 5 Min.)',
            'gps.stale_no':   'Nein',
            'gps.speed_unit': 'km/h',
            'gps.alt_unit':   'm',
            'gps.unavail':    'N/A',

            // GPS Status Labels
            'gps.st.idle.title':          'Bereit',
            'gps.st.idle.sub':            'Position noch nicht ermittelt',
            'gps.st.requesting.title':    'Ermittlung läuft…',
            'gps.st.requesting.sub':      'Bitte Berechtigung erteilen',
            'gps.st.available.title':     'Position verfügbar',
            'gps.st.available.sub':       '',
            'gps.st.stale.title':         'Position veraltet',
            'gps.st.stale.sub':           'Daten älter als 5 Minuten',
            'gps.st.denied.title':        'Berechtigung verweigert',
            'gps.st.denied.sub':          'Standortzugriff in Browser-Einstellungen aktivieren',
            'gps.st.unavailable.title':   'GPS nicht verfügbar',
            'gps.st.unavailable.sub':     'Standortdienste deaktiviert oder nicht unterstützt',
            'gps.st.timeout.title':       'Zeitüberschreitung',
            'gps.st.timeout.sub':         'Position konnte nicht rechtzeitig ermittelt werden',
            'gps.st.error.title':         'Fehler',
            'gps.st.error.sub':           'Fehler bei der Positionsermittlung',

            // GPS module info values
            'gps.v.loaded':       '✓ Geladen',
            'gps.v.not_loaded':   '✗ Nicht geladen',
            'gps.v.supported':    '✓ Unterstützt',
            'gps.v.not_supported':'✗ Nicht unterstützt',
            'gps.perm.granted':   '✓ Erteilt',
            'gps.perm.denied':    '✗ Verweigert',
            'gps.perm.prompt':    '⏳ Noch nicht entschieden',
            'gps.perm.unknown':   'Unbekannt',

            // Profile
            'profile.page_title': '👤 Mein Profil',
            'profile.page_sub':   'Deine Benutzerinformationen und Kontodaten.',
            'profile.card':       '🪪 Benutzerinformationen',
            'profile.username':   'Username',
            'profile.displayname':'Anzeigename',
            'profile.email':      'E-Mail',
            'profile.role':       'Rolle',
            'profile.status':     'Status',
            'profile.since':      'Dabei seit',
            'profile.last_login': 'Letzter Login',
            'profile.user_id':    'Benutzer-ID',
            'profile.never':      'Noch nie',
            'user.active':        'Aktiv',
            'user.inactive':      'Inaktiv',
            'user.banned':        'Gesperrt',

            // Placeholders
            'ph.catches.title': 'Fangbuch',
            'ph.catches.text':  'Das Fangbuch-Modul befindet sich noch in Entwicklung.',
            'ph.fishdb.title':  'Fischdatenbank',
            'ph.fishdb.text':   'Die Fischdatenbank befindet sich noch in Entwicklung.',
            'ph.stats.title':   'Statistiken',
            'ph.stats.text':    'Das Statistik-Modul befindet sich noch in Entwicklung.',
            'ph.coming_soon':   'Kommt bald',

            // Catches / FishDB / Stats pages
            'catches.page_title': '🎣 Meine Fänge',
            'catches.page_sub':   'Erfasste Angelaktivitäten und Fangdaten.',
            'fishdb.page_title':  '🐟 Fischdatenbank',
            'fishdb.page_sub':    'Informationen zu Fischarten, Schonzeiten und Maßen.',
            'stats.page_title':   '📊 Statistiken',
            'stats.page_sub':     'Auswertungen deiner Angelaktivitäten.',

            // Settings
            'settings.page_title':   '⚙️ Einstellungen',
            'settings.page_sub':     'App-Einstellungen und Konfiguration.',
            'settings.lang_title':   'Sprache',
            'settings.lang_head':    '🌐 Sprachauswahl',
            'settings.lang_desc':    'Anzeigesprache der App. Änderungen werden sofort angewendet.',
            'settings.lang_device':  '🖥️ Gerätesprache ({locale})',
            'settings.lang_current': 'Aktuell: {locale}',
            'settings.other_title':  'Weitere Einstellungen',
            'settings.other_ph':     'Weitere Einstellungen sind noch in Entwicklung.',
        },

        en: {
            // App
            'app.loading':          'Loading…',
            'app.user_loading':     'Loading user…',
            'app.error':            'Error loading – please reload the page.',
            'app.tagline':          'v1.0.0 – Core + Services + Modules + Tests',

            // Navigation
            'nav.dashboard':  'Dashboard',
            'nav.catches':    'My Catches',
            'nav.fishdb':     'Fish Database',
            'nav.weather':    'Weather',
            'nav.gps':        'GPS & Location',
            'nav.stats':      'Statistics',
            'nav.profile':    'My Profile',
            'nav.settings':   'Settings',
            'nav.soon':       'Soon',

            'bnav.home':     'Home',
            'bnav.catches':  'Catches',
            'bnav.weather':  'Weather',
            'bnav.profile':  'Profile',

            // Dashboard
            'dashboard.welcome_user':    'Welcome, {name}!',
            'dashboard.welcome':         'Welcome!',
            'dashboard.welcome_sub':     'Glad to have you back.',
            'dashboard.new_catch':       '➕ Record New Catch',
            'dashboard.overview':        'Overview',
            'dashboard.modules':         'Modules',
            'stat.catches':              'Total Catches',
            'stat.week':                 'This Week',
            'stat.species':              'Fish Species',
            'stat.modules':              'Active Modules',

            'mod.catches.title': 'Catch Log',
            'mod.catches.desc':  'Record your catches, waters and fishing trips.',
            'mod.fishdb.title':  'Fish Database',
            'mod.fishdb.desc':   'Fish species, closed seasons, sizes and water information.',
            'mod.weather.title': 'Weather',
            'mod.weather.desc':  'Current weather data and 7-day forecast for your spot.',
            'mod.stats.title':   'Statistics',
            'mod.stats.desc':    'Analysis, trends and personal bests.',
            'mod.leader.title':  'Leaderboard',
            'mod.leader.desc':   'Rankings and community comparisons by fish species.',
            'mod.spots.title':   'Waters',
            'mod.spots.desc':    'Water management with GPS and spot markers.',
            'mod.available':     '✓ Available',
            'mod.in_dev':        'In development',
            'mod.planned':       'Planned',

            'sys.label':    'System',

            'weather.page_title':   '🌤️ Weather',
            'weather.page_sub':     'Current weather data for your fishing spot.',
            'weather.refresh':      '🔄 Refresh',
            'weather.gps':          '📡 GPS',
            'weather.gps_retry_active': '🛰️ GPS auto-refresh active',
            'weather.gps_retry_wait':   'GPS will be checked again automatically.',
            'weather.loading':      'Loading weather data…',
            'weather.retry':        'Try again',
            'weather.wind':         '💨 Wind',
            'weather.gusts':        '💨 Gusts',
            'weather.pressure':     '🌡️ Pressure',
            'weather.humidity':     '💧 Humidity',
            'weather.rain':         '🌧️ Rain Prob.',
            'weather.clouds':       '☁️ Cloud Cover',
            'weather.sunrise':      'Sunrise',
            'weather.sunset':       'Sunset',
            'weather.hourly':       'Hourly Forecast (24 h)',
            'weather.daily':        '7-Day Forecast',
            'weather.updated':      'Updated',
            'weather.now':          'Now',
            'weather.attribution':  'Weather data:',
            'weather.stale':        '⚠️ Cached data ({age} min. old) – {reason}',
            'weather.err_nomodule': 'Weather module not loaded.',
            'weather.err_offline':  'No internet connection. Weather data unavailable.',
            'weather.err_timeout':  'Request timed out.',
            'weather.err_generic':  'Could not load weather data: {msg}',
            'weather.err_nogps':    'GPS or Weather module not available',

            'gps.page_title': '📡 GPS & Location',
            'gps.page_sub':   'Current device position – interface for other modules.',
            'gps.get':        '📍 Get Position',
            'gps.track_start':'▶ Start Tracking',
            'gps.track_stop': '⏹ Stop Tracking',
            'gps.for_weather':'🌤️ Use for Weather',
            'gps.pos_data':   'Position Data',
            'gps.no_pos':     'No position available yet.',
            'gps.mod_status': 'Module Status',
            'gps.interface':  '🔗 GPS Interface',
            'gps.r_loaded':   'Module loaded',
            'gps.r_support':  'Browser Support',
            'gps.r_perm':     'Permission',
            'gps.r_status':   'Status',
            'gps.d_lat':      'Latitude',
            'gps.d_lon':      'Longitude',
            'gps.d_city':     'City',
            'gps.d_province': 'State/Province',
            'gps.d_country':  'Country',
            'gps.d_accuracy': 'Accuracy',
            'gps.d_altitude': 'Altitude',
            'gps.d_speed':    'Speed',
            'gps.d_heading':  'Heading',
            'gps.d_time':     'Timestamp',
            'gps.d_source':   'Source',
            'gps.d_stale':    'Stale',
            'gps.loading':    'loading…',
            'gps.stale_yes':  'Yes (> 5 min.)',
            'gps.stale_no':   'No',
            'gps.speed_unit': 'km/h',
            'gps.alt_unit':   'm',
            'gps.unavail':    'N/A',

            'gps.st.idle.title':          'Ready',
            'gps.st.idle.sub':            'Position not yet determined',
            'gps.st.requesting.title':    'Locating…',
            'gps.st.requesting.sub':      'Please grant permission',
            'gps.st.available.title':     'Position available',
            'gps.st.available.sub':       '',
            'gps.st.stale.title':         'Position outdated',
            'gps.st.stale.sub':           'Data older than 5 minutes',
            'gps.st.denied.title':        'Permission denied',
            'gps.st.denied.sub':          'Enable location access in browser settings',
            'gps.st.unavailable.title':   'GPS unavailable',
            'gps.st.unavailable.sub':     'Location services disabled or not supported',
            'gps.st.timeout.title':       'Timeout',
            'gps.st.timeout.sub':         'Could not determine position in time',
            'gps.st.error.title':         'Error',
            'gps.st.error.sub':           'Error determining position',

            'gps.v.loaded':       '✓ Loaded',
            'gps.v.not_loaded':   '✗ Not loaded',
            'gps.v.supported':    '✓ Supported',
            'gps.v.not_supported':'✗ Not supported',
            'gps.perm.granted':   '✓ Granted',
            'gps.perm.denied':    '✗ Denied',
            'gps.perm.prompt':    '⏳ Not decided yet',
            'gps.perm.unknown':   'Unknown',

            'profile.page_title': '👤 My Profile',
            'profile.page_sub':   'Your user information and account data.',
            'profile.card':       '🪪 User Information',
            'profile.username':   'Username',
            'profile.displayname':'Display Name',
            'profile.email':      'E-Mail',
            'profile.role':       'Role',
            'profile.status':     'Status',
            'profile.since':      'Member since',
            'profile.last_login': 'Last Login',
            'profile.user_id':    'User ID',
            'profile.never':      'Never',
            'user.active':        'Active',
            'user.inactive':      'Inactive',
            'user.banned':        'Banned',

            'ph.catches.title': 'Catch Log',
            'ph.catches.text':  'The catch log module is still in development.',
            'ph.fishdb.title':  'Fish Database',
            'ph.fishdb.text':   'The fish database is still in development.',
            'ph.stats.title':   'Statistics',
            'ph.stats.text':    'The statistics module is still in development.',
            'ph.coming_soon':   'Coming soon',

            'catches.page_title': '🎣 My Catches',
            'catches.page_sub':   'Recorded fishing activities and catch data.',
            'fishdb.page_title':  '🐟 Fish Database',
            'fishdb.page_sub':    'Information on fish species, closed seasons and sizes.',
            'stats.page_title':   '📊 Statistics',
            'stats.page_sub':     'Analysis of your fishing activities.',

            'settings.page_title':   '⚙️ Settings',
            'settings.page_sub':     'App settings and configuration.',
            'settings.lang_title':   'Language',
            'settings.lang_head':    '🌐 Language Selection',
            'settings.lang_desc':    'App display language. Changes are applied immediately.',
            'settings.lang_device':  '🖥️ Device Language ({locale})',
            'settings.lang_current': 'Current: {locale}',
            'settings.other_title':  'More Settings',
            'settings.other_ph':     'More settings are still in development.',
        }
    };

    const SUPPORTED = ['de', 'en'];
    const STORAGE_KEY = 'ct_locale';

    const I18nModule = {
        name:        'i18n-module',
        version:     '1.0.0',
        initialized: false,
        _locale:     'de',

        init() {
            if (this.initialized) return;
            this.initialized = true;

            const stored   = localStorage.getItem(STORAGE_KEY);
            const detected = (navigator.language || navigator.userLanguage || 'de').split('-')[0].toLowerCase();

            if (stored === 'auto' || !stored) {
                this._locale = SUPPORTED.includes(detected) ? detected : 'de';
            } else {
                this._locale = SUPPORTED.includes(stored) ? stored : 'de';
            }

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('i18n:initialized', { locale: this._locale });
            }
        },

        // Übersetzung abrufen – Fallback: andere Sprache, dann Key selbst
        t(key, params) {
            const str = (TRANSLATIONS[this._locale] && TRANSLATIONS[this._locale][key])
                     || (TRANSLATIONS['de'] && TRANSLATIONS['de'][key])
                     || key;
            if (!params) return str;
            return str.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? params[k] : ''));
        },

        setLocale(locale) {
            if (locale === 'auto') {
                localStorage.setItem(STORAGE_KEY, 'auto');
                const detected = (navigator.language || 'de').split('-')[0].toLowerCase();
                this._locale = SUPPORTED.includes(detected) ? detected : 'de';
            } else {
                if (!SUPPORTED.includes(locale)) return;
                this._locale = locale;
                localStorage.setItem(STORAGE_KEY, locale);
            }

            if (window.CatchTrackCore) {
                window.CatchTrackCore.emit('i18n:locale-changed', { locale: this._locale });
            }
        },

        getLocale()           { return this._locale; },
        getStoredPreference() { return localStorage.getItem(STORAGE_KEY) || 'auto'; },
        getSupportedLocales() { return [...SUPPORTED]; },
        getDeviceLocale()     {
            const l = (navigator.language || 'de').split('-')[0].toLowerCase();
            return SUPPORTED.includes(l) ? l : 'de';
        }
    };

    if (!window.CatchTrackI18n) {
        window.CatchTrackI18n = I18nModule;
    }
})();
