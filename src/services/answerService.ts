/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import supabase from './supabase';
import { AnswerType } from '../shared/CompetitionType';

const answerTable = 'competitions_answers';

export async function getAllAnswersService() {
  const { data, error } = await supabase
    .from(answerTable)
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function getAnswersByParticipantService(participantId: number) {
  const { data, error } = await supabase
    .from(answerTable)
    .select(`
      *,
      question:question_id (
        question_text,
        correct_answer
      )
    `)
    .eq('participant_id', participantId)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function getAnswersByQuestionService(questionId: number) {
  const { data, error } = await supabase
    .from(answerTable)
    .select(`
      *,
      participant:participant_id (
        name
      )
    `)
    .eq('question_id', questionId)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function submitAnswerService(newAnswer: AnswerType) {
  // First, check if correct
  const { data: question } = await supabase
    .from('competitions_questions')
    .select('correct_answer')
    .eq('id', newAnswer.question_id)
    .single();

  const isCorrect = question ? newAnswer.answer_text.toLowerCase().trim() === question.correct_answer.toLowerCase().trim() : false;

  const answerWithCorrect = { ...newAnswer, is_correct: isCorrect };

  const { data, error } = await supabase
    .from(answerTable)
    .insert(answerWithCorrect)
    .select();

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function updateAnswerService(
  answerID: number,
  newDetail: Partial<AnswerType>
) {
  const { data, error } = await supabase
    .from(answerTable)
    .update(newDetail)
    .eq('id', answerID)
    .select();

  if (error) {
    console.log(error);
    return error;
  }

  return data[0];
}

export async function deleteAnswerService(answerID: number) {
  const { data, error } = await supabase
    .from(answerTable)
    .delete()
    .eq('id', answerID);

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}
