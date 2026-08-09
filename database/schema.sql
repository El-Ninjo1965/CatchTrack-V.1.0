PRAGMA foreign_keys = ON;


CREATE TABLE IF NOT EXISTS system (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    key TEXT NOT NULL UNIQUE,

    value TEXT,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT NOT NULL UNIQUE,

    display_name TEXT,

    email TEXT UNIQUE,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS user_settings (

    user_id INTEGER PRIMARY KEY,

    language TEXT NOT NULL
        DEFAULT 'de',

    timezone TEXT,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);


CREATE TABLE IF NOT EXISTS privacy_settings (

    user_id INTEGER PRIMARY KEY,

    location_sharing INTEGER NOT NULL
        DEFAULT 0,

    home_location_sharing INTEGER NOT NULL
        DEFAULT 0,

    social_sharing INTEGER NOT NULL
        DEFAULT 0,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);


CREATE TABLE IF NOT EXISTS modules (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL UNIQUE,

    version TEXT,

    enabled INTEGER NOT NULL
        DEFAULT 0,

    status TEXT NOT NULL
        DEFAULT 'installed',

    config TEXT,

    database_ready INTEGER NOT NULL
        DEFAULT 0,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS fish (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    scientific_name TEXT NOT NULL UNIQUE,

    family TEXT,

    minimum_size REAL,

    record_weight REAL,

    description TEXT,

    image TEXT,

    verified INTEGER NOT NULL
        DEFAULT 1,

    created_by TEXT,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS fish_names (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    fish_id INTEGER NOT NULL,

    language TEXT NOT NULL,

    name TEXT NOT NULL,

    verified INTEGER NOT NULL
        DEFAULT 1,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (fish_id)
        REFERENCES fish(id)
        ON DELETE CASCADE,

    UNIQUE (
        fish_id,
        language,
        name
    )

);


CREATE TABLE IF NOT EXISTS waters (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    type TEXT,

    country TEXT,

    region TEXT,

    description TEXT,

    gps_lat REAL,

    gps_lon REAL,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS equipment (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    category TEXT,

    name TEXT,

    brand TEXT,

    model TEXT,

    description TEXT,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS catches (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER,

    fish_id INTEGER,

    fish_name TEXT,

    date TEXT,

    time TEXT,

    weight REAL,

    length REAL,

    bait TEXT,

    method TEXT,

    water_id INTEGER,

    depth REAL,

    gps_lat REAL,

    gps_lon REAL,

    gps_accuracy REAL,

    gps_altitude REAL,

    gps_captured_at TEXT,

    gps_source TEXT,

    weather_id INTEGER,

    weather_snapshot TEXT,

    moon_id INTEGER,

    moon_snapshot TEXT,

    tide_id INTEGER,

    tide_snapshot TEXT,

    photo TEXT,

    notes TEXT,

    cloud_id TEXT,

    sync_status TEXT NOT NULL
        DEFAULT 'local',

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (fish_id)
        REFERENCES fish(id),

    FOREIGN KEY (water_id)
        REFERENCES waters(id)

);


CREATE TABLE IF NOT EXISTS fish_reports (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER,

    photo TEXT,

    suggested_name TEXT,

    scientific_guess TEXT,

    status TEXT NOT NULL
        DEFAULT 'pending',

    ai_result TEXT,

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)

);


CREATE TABLE IF NOT EXISTS sync_queue (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    table_name TEXT NOT NULL,

    record_id INTEGER,

    action TEXT NOT NULL,

    status TEXT NOT NULL
        DEFAULT 'pending',

    created_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS migrations (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    version TEXT NOT NULL UNIQUE,

    description TEXT,

    applied_at DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP

);


CREATE INDEX IF NOT EXISTS idx_users_username
    ON users(username);


CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);


CREATE INDEX IF NOT EXISTS idx_fish_names_fish
    ON fish_names(fish_id);


CREATE INDEX IF NOT EXISTS idx_fish_names_language
    ON fish_names(language);


CREATE INDEX IF NOT EXISTS idx_waters_name
    ON waters(name);


CREATE INDEX IF NOT EXISTS idx_equipment_category
    ON equipment(category);


CREATE INDEX IF NOT EXISTS idx_catches_date
    ON catches(date);


CREATE INDEX IF NOT EXISTS idx_catches_fish
    ON catches(fish_id);


CREATE INDEX IF NOT EXISTS idx_catches_water
    ON catches(water_id);


CREATE INDEX IF NOT EXISTS idx_catches_gps
    ON catches(gps_lat, gps_lon);


CREATE INDEX IF NOT EXISTS idx_sync_queue_status
    ON sync_queue(status);


INSERT OR IGNORE INTO system
(
    key,
    value
)
VALUES
(
    'database_version',
    '2'
);


INSERT OR IGNORE INTO system
(
    key,
    value
)
VALUES
(
    'architecture_version',
    '3.0'
);