-- CatchTrack
-- Migration 005: Neutralize ambiguous legacy Waters ownership
-- Version: 5.0
-- Date: 2026-08-10

PRAGMA foreign_keys = ON;


UPDATE waters

SET user_id = NULL

WHERE
    user_id IS NOT NULL
    AND created_at <= (
        SELECT
            applied_at

        FROM migrations

        WHERE version = '4'

        LIMIT 1
    );


CREATE INDEX IF NOT EXISTS idx_waters_unassigned
    ON waters(user_id);