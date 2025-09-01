export type CompetitionType = {
  id?: number;
  name: string;
  description: string;
  duration_minutes: number; // manually set by user
  created_at?: string | Date;
};

export type QuestionType = {
  id?: number;
  competition_id: number;
  question_text: string;
  correct_answer: string;
  created_at?: string | Date;
};

export type CompetitionParticipantType = {
  id?: number;
  competition_id: number;
  name: string;
  auth_key: string;
  joined_at?: string | Date;
  score?: number;
  correct_answers?: number;
  total_answers?: number;
};

export type AnswerType = {
  id?: number;
  participant_id: number; // fk to competition_participants
  question_id: number;
  answer_text: string;
  submitted_at?: string | Date;
  is_correct?: boolean;
};
