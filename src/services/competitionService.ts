/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import supabase from './supabase';
import { CompetitionType } from '../shared/CompetitionType';

const competitionTable = 'competitions';

export async function getAllCompetitionsService() {
  const { data, error } = await supabase
    .from(competitionTable)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function getCompetitionByIdService(id: number) {
  const { data, error } = await supabase
    .from(competitionTable)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function createCompetitionService(newCompetition: CompetitionType) {
  const { data, error } = await supabase
    .from(competitionTable)
    .insert(newCompetition)
    .select();

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function updateCompetitionService(
  competitionID: number,
  newDetail: Partial<CompetitionType>
) {
  const { data, error } = await supabase
    .from(competitionTable)
    .update(newDetail)
    .eq('id', competitionID)
    .select();

  if (error) {
    console.log(error);
    return error;
  }

  return data[0];
}

export async function deleteCompetitionService(competitionID: number) {
  const { data, error } = await supabase
    .from(competitionTable)
    .delete()
    .eq('id', competitionID);

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}
