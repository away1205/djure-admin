-- Verification Script: Check Participant Migration Status
-- Run this after executing the migration to verify everything worked correctly

-- ===========================================
-- TABLE STRUCTURE VERIFICATION
-- ===========================================

-- Check final table structure
SELECT
    'Table Structure Check' as check_type,
    column_name,
    data_type,
    is_nullable,
    CASE
        WHEN column_name = 'id' THEN 'Primary Key'
        WHEN column_name = 'competition_id' THEN 'Foreign Key to competitions'
        WHEN column_name = 'name' THEN 'Participant Name'
        WHEN column_name = 'auth_key' THEN 'Authentication Key'
        WHEN column_name = 'joined_at' THEN 'Timestamp'
        ELSE 'Unknown'
    END as description
FROM information_schema.columns
WHERE table_name = 'competitions_participants'
ORDER BY ordinal_position;

-- ===========================================
-- DATA INTEGRITY CHECKS
-- ===========================================

-- Count total participants
SELECT
    'Data Integrity' as check_type,
    COUNT(*) as total_participants,
    COUNT(DISTINCT competition_id) as competitions_with_participants,
    COUNT(DISTINCT auth_key) as unique_auth_keys
FROM competitions_participants;

-- Check for any NULL values in required fields
SELECT
    'NULL Check' as check_type,
    SUM(CASE WHEN name IS NULL THEN 1 ELSE 0 END) as null_names,
    SUM(CASE WHEN auth_key IS NULL THEN 1 ELSE 0 END) as null_auth_keys,
    SUM(CASE WHEN competition_id IS NULL THEN 1 ELSE 0 END) as null_competition_ids
FROM competitions_participants;

-- ===========================================
-- CONSTRAINT VERIFICATION
-- ===========================================

-- Check existing constraints
SELECT
    'Constraints' as check_type,
    conname as constraint_name,
    CASE contype
        WHEN 'p' THEN 'Primary Key'
        WHEN 'f' THEN 'Foreign Key'
        WHEN 'u' THEN 'Unique'
        WHEN 'c' THEN 'Check'
        ELSE 'Other'
    END as constraint_type,
    conkey as constrained_columns
FROM pg_constraint
WHERE conrelid = 'competitions_participants'::regclass;

-- ===========================================
-- INDEX VERIFICATION
-- ===========================================

-- Check existing indexes
SELECT
    'Indexes' as check_type,
    indexname as index_name,
    CASE
        WHEN indexname LIKE '%auth_key%' THEN 'Auth Key Index'
        WHEN indexname LIKE '%competition_id%' THEN 'Competition ID Index'
        WHEN indexname LIKE '%email%' THEN 'Email Index (should not exist)'
        ELSE 'Other Index'
    END as index_purpose
FROM pg_indexes
WHERE tablename = 'competitions_participants';

-- ===========================================
-- SAMPLE DATA PREVIEW
-- ===========================================

-- Show sample of migrated data
SELECT
    'Sample Data' as check_type,
    id,
    competition_id,
    LEFT(name, 20) || CASE WHEN LENGTH(name) > 20 THEN '...' ELSE '' END as name_preview,
    LEFT(auth_key, 10) || '...' as auth_key_preview,
    joined_at
FROM competitions_participants
ORDER BY joined_at DESC
LIMIT 5;

-- ===========================================
-- COMPETITION CROSS-REFERENCE
-- ===========================================

-- Verify participants are properly linked to competitions
SELECT
    'Competition Links' as check_type,
    c.name as competition_name,
    COUNT(cp.id) as participant_count,
    STRING_AGG(LEFT(cp.name, 15), ', ') as sample_participants
FROM competitions c
LEFT JOIN competitions_participants cp ON c.id = cp.competition_id
GROUP BY c.id, c.name
ORDER BY c.start_time DESC
LIMIT 10;

-- ===========================================
-- MIGRATION SUCCESS SUMMARY
-- ===========================================

DO $$
DECLARE
    total_participants INTEGER;
    competitions_count INTEGER;
    has_email_column BOOLEAN;
BEGIN
    SELECT COUNT(*) INTO total_participants FROM competitions_participants;
    SELECT COUNT(DISTINCT competition_id) INTO competitions_count FROM competitions_participants;

    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'competitions_participants'
        AND column_name = 'email'
    ) INTO has_email_column;

    RAISE NOTICE '===========================================';
    RAISE NOTICE 'MIGRATION VERIFICATION SUMMARY';
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'Total Participants: %', total_participants;
    RAISE NOTICE 'Competitions with Participants: %', competitions_count;
    RAISE NOTICE 'Email Column Removed: %', CASE WHEN has_email_column THEN 'NO - Migration may have failed' ELSE 'YES - Success!' END;
    RAISE NOTICE '===========================================';

    IF has_email_column THEN
        RAISE EXCEPTION 'Email column still exists! Migration may have failed.';
    ELSE
        RAISE NOTICE 'Migration appears successful!';
    END IF;
END $$;
