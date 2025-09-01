import { useEffect, useState, useCallback } from 'react';
import {
  Paper,
  Title,
  Text,
  Group,
  Badge,
  Table,
  ActionIcon,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getParticipantByIdService } from '../../../services/participantService';
import { getAnswersByParticipantService } from '../../../services/answerService';
import { CompetitionParticipantType } from '../../../shared/CompetitionType';

interface AnswerWithQuestion {
  id: number;
  participant_id: number;
  question_id: number;
  answer_text: string;
  submitted_at: string;
  is_correct: boolean;
  question: {
    question_text: string;
    correct_answer: string;
  };
}

export default function ParticipantViewDetail() {
  const [participant, setParticipant] = useState<CompetitionParticipantType | null>(null);
  const [answers, setAnswers] = useState<AnswerWithQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { competitionID, participantID } = useParams();

  const fetchParticipantData = useCallback(async () => {
    if (!participantID) return;

    try {
      const [participantData, answersData] = await Promise.all([
        getParticipantByIdService(parseInt(participantID)),
        getAnswersByParticipantService(parseInt(participantID)),
      ]);

      setParticipant(participantData);
      setAnswers(Array.isArray(answersData) ? answersData : []);
    } catch (error) {
      console.error('Error fetching participant data:', error);
    } finally {
      setLoading(false);
    }
  }, [participantID]);

  useEffect(() => {
    fetchParticipantData();
  }, [fetchParticipantData]);

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString();
  };

  const getCorrectBadge = (isCorrect: boolean) => {
    return isCorrect ? (
      <Badge color="green">Correct</Badge>
    ) : (
      <Badge color="red">Incorrect</Badge>
    );
  };

  const getScore = () => {
    // Use score from participant data if available, otherwise calculate from answers
    if (participant && typeof participant.score === 'number') {
      return {
        correct: participant.correct_answers || 0,
        total: participant.total_answers || 0,
        percentage: participant.score
      };
    }

    // Fallback to calculating from answers
    const correctAnswers = answers.filter(answer => answer.is_correct).length;
    const totalAnswers = answers.length;
    return { correct: correctAnswers, total: totalAnswers, percentage: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0 };
  };

  if (loading) {
    return <Text>Loading participant details...</Text>;
  }

  if (!participant) {
    return <Text>Participant not found</Text>;
  }

  const score = getScore();

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Group>
          <ActionIcon
            variant="light"
            onClick={() => navigate(`/dashboard/competition/${competitionID}`)}
          >
            <IconArrowLeft size={16} />
          </ActionIcon>
          <Title order={2}>{participant.name}</Title>
        </Group>
      </Group>

      <Paper p="md" mb="md">
        <Group mb="sm">
          <Text fw={500}>Participant Information</Text>
        </Group>
        <Text mb="sm"><strong>Name:</strong> {participant.name}</Text>
        <Text mb="sm"><strong>Auth Key:</strong> <code>{participant.auth_key}</code></Text>
        <Text mb="sm"><strong>Joined At:</strong> {formatDateTime(participant.joined_at || '')}</Text>
        <Text mb="sm"><strong>Score:</strong> {score.correct}/{score.total} ({score.percentage}%)</Text>
      </Paper>

      <Paper p="md">
        <Title order={4} mb="md">Answers ({answers.length})</Title>

        {answers.length === 0 ? (
          <Text c="dimmed">No answers submitted yet.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Question</Table.Th>
                <Table.Th>Participant's Answer</Table.Th>
                <Table.Th>Correct Answer</Table.Th>
                <Table.Th>Result</Table.Th>
                <Table.Th>Submitted At</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {answers.map((answer) => (
                <Table.Tr key={answer.id}>
                  <Table.Td>
                    {answer.question.question_text.length > 100
                      ? `${answer.question.question_text.substring(0, 100)}...`
                      : answer.question.question_text}
                  </Table.Td>
                  <Table.Td>{answer.answer_text}</Table.Td>
                  <Table.Td>{answer.question.correct_answer}</Table.Td>
                  <Table.Td>{getCorrectBadge(answer.is_correct)}</Table.Td>
                  <Table.Td>{formatDateTime(answer.submitted_at)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    </div>
  );
}
