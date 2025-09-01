-- Migration: Remove email field from competitions_participants table
-- This migration removes the email column and associated constraints from the competitions_participants table
-- WARNING: This is a destructive operation that will permanently remove email data

-- Step 1: Create backup of current data (optional but recommended)
-- Uncomment the following lines if you want to backup the data before migration
/*
CREATE TABLE IF NOT EXISTS competitions_participants_backup AS
SELECT * FROM competitions_participants;
*/

-- Step 2: Drop the unique constraint that includes email
-- Note: This constraint name might vary depending on your database setup
-- You can check the constraint name with: \d competitions_participants
ALTER TABLE competitions_participants DROP CONSTRAINT IF EXISTS competitions_participants_competition_id_email_key;

-- Step 3: Drop the email index
DROP INDEX IF EXISTS idx_competitions_participants_email;

-- Step 4: Remove the email column
-- WARNING: This will permanently delete all email data
ALTER TABLE competitions_participants DROP COLUMN IF EXISTS email;

-- Step 5: Verify the table structure
-- You can run this query to check the final structure:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns
-- WHERE table_name = 'competitions_participants' ORDER BY ordinal_position;

-- Optional: Add any additional constraints or indexes if needed
-- For example, you might want to add a unique constraint on (competition_id, name) if that makes sense for your use case
-- ALTER TABLE competitions_participants ADD CONSTRAINT unique_competition_participant_name UNIQUE (competition_id, name);

-- Migration completed
-- The competitions_participants table now only contains: id, competition_id, name, auth_key, joined_at
