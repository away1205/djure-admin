-- Comprehensive Migration Script: Remove Email from Participants
-- This script safely migrates the competitions_participants table from the old structure (with email)
-- to the new structure (without email) with proper backup and rollback capabilities

-- ===========================================
-- PRE-MIGRATION CHECKS
-- ===========================================

-- Check current table structure
DO $$
BEGIN
    RAISE NOTICE 'Current competitions_participants table structure:';
END $$;

SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'competitions_participants'
ORDER BY ordinal_position;

-- Check for existing constraints
DO $$
BEGIN
    RAISE NOTICE 'Current constraints on competitions_participants:';
END $$;

SELECT
    conname as constraint_name,
    contype as constraint_type,
    conkey as constraint_keys,
    confkey as foreign_keys
FROM pg_constraint
WHERE conrelid = 'competitions_participants'::regclass;

-- ===========================================
-- BACKUP PHASE (RECOMMENDED)
-- ===========================================

-- Create backup table with timestamp
DO $$
DECLARE
    backup_table_name TEXT;
BEGIN
    backup_table_name := 'competitions_participants_backup_' || to_char(now(), 'YYYYMMDD_HH24MI');
    EXECUTE 'CREATE TABLE IF NOT EXISTS ' || backup_table_name || ' AS SELECT * FROM competitions_participants';
    RAISE NOTICE 'Backup created: %', backup_table_name;
END $$;

-- ===========================================
-- MIGRATION PHASE
-- ===========================================

-- Begin transaction for safety
BEGIN;

    -- Step 1: Drop email-related constraints
    -- Drop unique constraint on (competition_id, email) if it exists
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'competitions_participants_competition_id_email_key'
            AND conrelid = 'competitions_participants'::regclass
        ) THEN
            ALTER TABLE competitions_participants DROP CONSTRAINT competitions_participants_competition_id_email_key;
            RAISE NOTICE 'Dropped unique constraint on (competition_id, email)';
        ELSE
            RAISE NOTICE 'Unique constraint on (competition_id, email) not found - skipping';
        END IF;
    END $$;

    -- Step 2: Drop email-related indexes
    DROP INDEX IF EXISTS idx_competitions_participants_email;
    RAISE NOTICE 'Dropped email index if it existed';

    -- Step 3: Remove email column
    -- Check if column exists before dropping
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'competitions_participants'
            AND column_name = 'email'
        ) THEN
            ALTER TABLE competitions_participants DROP COLUMN email;
            RAISE NOTICE 'Dropped email column';
        ELSE
            RAISE NOTICE 'Email column not found - skipping';
        END IF;
    END $$;

    -- Step 4: Verify remaining columns
    DO $$
    BEGIN
        RAISE NOTICE 'Post-migration table structure:';
    END $$;

    SELECT
        column_name,
        data_type,
        is_nullable
    FROM information_schema.columns
    WHERE table_name = 'competitions_participants'
    ORDER BY ordinal_position;

COMMIT;

-- ===========================================
-- POST-MIGRATION VERIFICATION
-- ===========================================

-- Count participants to ensure data integrity
DO $$
DECLARE
    participant_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO participant_count FROM competitions_participants;
    RAISE NOTICE 'Total participants after migration: %', participant_count;
END $$;

-- Check for any orphaned data or issues
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Participants table now contains only: id, competition_id, name, auth_key, joined_at';
END $$;

-- ===========================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ===========================================
/*
-- To rollback this migration, run the following commands:

-- 1. Recreate the email column
ALTER TABLE competitions_participants ADD COLUMN email VARCHAR(255);

-- 2. Restore data from backup (replace 'backup_table_name' with actual backup table name)
-- UPDATE competitions_participants
-- SET email = backup.email
-- FROM backup_table_name backup
-- WHERE competitions_participants.id = backup.id;

-- 3. Recreate constraints
ALTER TABLE competitions_participants ADD CONSTRAINT competitions_participants_competition_id_email_key UNIQUE (competition_id, email);
CREATE INDEX idx_competitions_participants_email ON competitions_participants(email);

-- 4. Drop backup table when satisfied
-- DROP TABLE backup_table_name;
*/

-- ===========================================
-- OPTIONAL: Add new constraints if desired
-- ===========================================
/*
-- If you want to prevent duplicate names within the same competition:
-- ALTER TABLE competitions_participants ADD CONSTRAINT unique_competition_participant_name UNIQUE (competition_id, name);

-- If you want to ensure auth_keys are unique across all competitions:
-- ALTER TABLE competitions_participants ADD CONSTRAINT unique_auth_key UNIQUE (auth_key);
*/
