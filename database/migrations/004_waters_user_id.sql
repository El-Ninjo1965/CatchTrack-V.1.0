-- CatchTrack
-- Migration 004: User ownership for waters
-- Version: 4.0
-- Date: 2026-08-10

PRAGMA foreign_keys = ON;


ALTER TABLE waters
ADD COLUMN user_id INTEGER
REFERENCES users(id)
ON DELETE CASCADE;


UPDATE waters

SET user_id = (
    SELECT MIN(id)
    FROM users
)

WHERE user_id IS NULL;


CREATE INDEX IF NOT EXISTS idx_waters_user_id
    ON waters(user_id);


CREATE INDEX IF NOT EXISTS idx_waters_user_name
    ON waters(user_id, name);