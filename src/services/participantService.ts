/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import supabase from './supabase';
import { CompetitionParticipantType } from '../shared/CompetitionType';

const participantTable = 'competitions_participants';

export async function getAllParticipantsService() {
  const { data, error } = await supabase
    .from(participantTable)
    .select('*')
    .order('joined_at', { ascending: false });

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function getParticipantsByCompetitionService(competitionId: number) {
  const { data, error } = await supabase
    .from(participantTable)
    .select(`
      *,
      answers:competitions_answers(
        id,
        is_correct
      )
    `)
    .eq('competition_id', competitionId)
    .order('joined_at', { ascending: false });

  if (error) {
    console.log(error);
    return error;
  }

  // Calculate score for each participant
  const participantsWithScore = data?.map((participant: any) => {
    const answers = participant.answers || [];
    const totalAnswers = answers.length;
    const correctAnswers = answers.filter((answer: any) => answer.is_correct).length;
    const score = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

    return {
      ...participant,
      total_answers: totalAnswers,
      correct_answers: correctAnswers,
      score: score
    };
  });

  return participantsWithScore;
}

export async function getParticipantByIdService(participantId: number) {
  const { data, error } = await supabase
    .from(participantTable)
    .select('*')
    .eq('id', participantId)
    .single();

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function addParticipantService(newParticipant: CompetitionParticipantType) {
  const { data, error } = await supabase
    .from(participantTable)
    .insert(newParticipant)
    .select();

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}

export async function removeParticipantService(participantID: number) {
  const { data, error } = await supabase
    .from(participantTable)
    .delete()
    .eq('id', participantID);

  if (error) {
    console.log(error);
    return error;
  }

  return data;
}
