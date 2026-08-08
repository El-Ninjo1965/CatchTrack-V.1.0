CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT,

    language TEXT,

    settings TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);



CREATE TABLE IF NOT EXISTS fish (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    scientific_name TEXT UNIQUE,

    family TEXT,

    minimum_size REAL,

    record_weight REAL,

    description TEXT,

    image TEXT,

    verified INTEGER DEFAULT 1

);



CREATE TABLE IF NOT EXISTS fish_names (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    fish_id INTEGER NOT NULL,

    language TEXT NOT NULL,

    common_name TEXT NOT NULL,

    FOREIGN KEY (fish_id)
    REFERENCES fish(id)
    ON DELETE CASCADE

);



CREATE INDEX IF NOT EXISTS idx_fish_names_search

ON fish_names
(
    language,
    common_name
);



CREATE TABLE IF NOT EXISTS catches (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id INTEGER,

    date TEXT,

    time TEXT,

    fish_id INTEGER,

    fish_name TEXT,

    weight REAL,

    length REAL,

    bait TEXT,

    method TEXT,

    water_id INTEGER,

    depth REAL,

    gps_lat REAL,

    gps_lon REAL,

    weather_id INTEGER,

    moon_id INTEGER,

    tide_id INTEGER,

    photo TEXT,

    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (fish_id)
    REFERENCES fish(id)

);



CREATE TABLE IF NOT EXISTS waters (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT,

    type TEXT,

    country TEXT,

    region TEXT,

    gps_lat REAL,

    gps_lon REAL,

    description TEXT

);



CREATE TABLE IF NOT EXISTS equipment (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    category TEXT,

    name TEXT,

    brand TEXT,

    model TEXT,

    description TEXT

);



CREATE TABLE IF NOT EXISTS modules (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT,

    version TEXT,

    enabled INTEGER,

    status TEXT

);



-- ==========================================
-- ENDE DATEI
-- CatchTrack V1.0
-- ==========================================