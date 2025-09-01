import { useEffect, useState, useCallback } from 'react';
import {
  Paper,
  Title,
  Text,
  Group,
  Button,
  Badge,
  Table,
} from '@mantine/core';
import { IconEdit, IconArrowLeft } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuestionByIdService } from '../../../services/questionService';
import { getAnswersByQuestionService } from '../../../services/answerService';
import { QuestionType, AnswerType } from '../../../shared/CompetitionType';

type AnswerWithParticipant = AnswerType & {
  participant?: {
    name: string;
  };
};

export default function QuestionViewDetail() {
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [answers, setAnswers] = useState<AnswerWithParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { competitionID, questionID } = useParams();

  const fetchQuestionData = useCallback(async () => {
    if (!questionID) return;

    try {
      const [questionData, answersData] = await Promise.all([
        getQuestionByIdService(parseInt(questionID)),
        getAnswersByQuestionService(parseInt(questionID)),
      ]);

      setQuestion(questionData);
      setAnswers(Array.isArray(answersData) ? answersData : []);
    } catch (error) {
      console.error('Error fetching question data:', error);
    } finally {
      setLoading(false);
    }
  }, [questionID]);

  useEffect(() => {
    fetchQuestionData();
  }, [fetchQuestionData]);

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return <Text>Loading question details...</Text>;
  }

  if (!question) {
    return <Text>Question not found</Text>;
  }

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Group>
          <Button
            variant="light"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate(`/dashboard/competition/${competitionID}`)}
          >
            Back to Competition
          </Button>
          <Title order={2}>Question Details</Title>
        </Group>
        <Button
          variant="light"
          leftSection={<IconEdit size={16} />}
          onClick={() => navigate(`/dashboard/competition/${competitionID}/questions/${questionID}/edit`)}
        >
          Edit Question
        </Button>
      </Group>

      <Paper p="md" mb="md">
        <Title order={4} mb="sm">Question</Title>
        <Text mb="md" style={{ whiteSpace: 'pre-wrap' }}>
          {question.question_text}
        </Text>

        <Group mb="sm">
          <Text fw={500}>Correct Answer:</Text>
          <Badge color="green" size="lg">{question.correct_answer}</Badge>
        </Group>

        <Text size="sm" c="dimmed">
          Created: {formatDateTime(question.created_at || '')}
        </Text>
      </Paper>

      <Paper p="md">
        <Title order={4} mb="md">Answers ({answers.length})</Title>

        {answers.length === 0 ? (
          <Text c="dimmed">No answers submitted yet.</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Participant</Table.Th>
                <Table.Th>Answer</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Submitted At</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {answers.map((answer) => (
                <Table.Tr key={answer.id}>
                  <Table.Td>{answer.participant?.name || 'N/A'}</Table.Td>
                  <Table.Td>{answer.answer_text}</Table.Td>
                  <Table.Td>
                    <Badge color={answer.is_correct ? 'green' : 'red'}>
                      {answer.is_correct ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{formatDateTime(answer.submitted_at || '')}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    </div>
  );
}
