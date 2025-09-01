# Database Migrations for Cerdas Cermat Competition

This folder contains SQL migration files for setting up the database tables for the cerdas cermat (quiz) competition feature.

## Tables Created

1. **competitions**
   - Stores competition details including name, description, and manually set duration in minutes

2. **competitions_questions**
   - Stores questions for each competition with the correct answer

3. **competitions_participants**
   - Stores participant details (name, auth_key) for each competition
   - Auth key is used for participant authentication
   - No unique constraints on participant data (multiple participants can have same name)

4. **competitions_answers**
   - Stores participant answers to questions, with automatic correctness checking

## How to Apply Migrations

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `create_competition_tables.sql`
4. Run the query

## Notes

- The `duration_minutes` in competitions is manually set by the user
- The `is_correct` in answers is automatically determined when submitting an answer
- Foreign key constraints ensure data integrity
- Unique constraints prevent duplicate entries (e.g., same participant answering same question twice)
- Indexes are created for common query patterns

## Usage in Code

The TypeScript types and services have been created in:
- `src/shared/CompetitionType.ts` - Type definitions
- `src/services/competitionService.ts` - Competition CRUD operations
- `src/services/questionService.ts` - Question management
- `src/services/participantService.ts` - Participant management
- `src/services/answerService.ts` - Answer submission and retrieval
