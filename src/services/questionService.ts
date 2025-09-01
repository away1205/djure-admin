/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import supabase from './supabase';
import { QuestionType } from '../shared/CompetitionType';

const questionTable = 'competitions_questions';

export async function getAllQuestionsService() {
  const { data, error } = await supabase
    .from(questionTable)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function getQuestionsByCompetitionService(competitionId: number) {
  const { data, error } = await supabase
    .from(questionTable)
    .select('*')
    .eq('competition_id', competitionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function getQuestionByIdService(questionId: number) {
  const { data, error } = await supabase
    .from(questionTable)
    .select('*')
    .eq('id', questionId)
    .single();

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function createQuestionService(newQuestion: QuestionType) {
  const { data, error } = await supabase
    .from(questionTable)
    .insert(newQuestion)
    .select();

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function updateQuestionService(
  questionID: number,
  newDetail: Partial<QuestionType>
) {
  const { data, error } = await supabase
    .from(questionTable)
    .update(newDetail)
    .eq('id', questionID)
    .select();

  if (error) {
    console.log(error);
    return error;
  }

  return data[0];
}

export async function deleteQuestionService(questionID: number) {
  const { data, error } = await supabase
    .from(questionTable)
    .delete()
    .eq('id', questionID);

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}
