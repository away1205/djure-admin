import { createQuestionService } from './questionService';
import soalWira from '../../data/soal-madya.json';

const COMPETITION_ID = 6;

async function importQuestions() {
  for (const item of soalWira.soal) {
    const newQuestion = {
      competition_id: COMPETITION_ID,
      question_text: item.pertanyaan,
      correct_answer: item.jawaban,
      // Add other fields as needed by your QuestionType
    };
    try {
      const result = await createQuestionService(newQuestion);
      console.log('Inserted:', result);
    } catch (err) {
      console.error('Error inserting:', item, err);
    }
  }
}

importQuestions();
