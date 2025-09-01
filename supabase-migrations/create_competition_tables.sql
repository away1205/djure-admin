-- Create competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create competitions_questions table
CREATE TABLE IF NOT EXISTS competitions_questions (
  id SERIAL PRIMARY KEY,
  competition_id INTEGER NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create competitions_participants table
CREATE TABLE IF NOT EXISTS competitions_participants (
  id SERIAL PRIMARY KEY,
  competition_id INTEGER NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  auth_key VARCHAR(255) NOT NULL UNIQUE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create competitions_answers table
CREATE TABLE IF NOT EXISTS competitions_answers (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER NOT NULL REFERENCES competitions_participants(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES competitions_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_correct BOOLEAN DEFAULT FALSE,
  UNIQUE(participant_id, question_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_competitions_questions_competition_id ON competitions_questions(competition_id);
CREATE INDEX IF NOT EXISTS idx_competitions_participants_competition_id ON competitions_participants(competition_id);
CREATE INDEX IF NOT EXISTS idx_competitions_participants_auth_key ON competitions_participants(auth_key);
CREATE INDEX IF NOT EXISTS idx_competitions_answers_participant_id ON competitions_answers(participant_id);
CREATE INDEX IF NOT EXISTS idx_competitions_answers_question_id ON competitions_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_competitions_answers_submitted_at ON competitions_answers(submitted_at);

-- Enable Row Level Security (RLS) if needed
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions_answers ENABLE ROW LEVEL SECURITY;
