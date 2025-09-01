import { useEffect, useState, useCallback } from 'react';
import {
  Paper,
  Title,
  Text,
  Group,
  Button,
  Badge,
  Table,
  ActionIcon,
  Tabs,
  Modal,
} from '@mantine/core';
import { IconEdit, IconPlus, IconTrash, IconEye } from '@tabler/icons-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCompetitionByIdService } from '../../services/competitionService';
import { getQuestionsByCompetitionService, deleteQuestionService } from '../../services/questionService';
import { getParticipantsByCompetitionService, removeParticipantService } from '../../services/participantService';
import { CompetitionType, QuestionType, CompetitionParticipantType } from '../../shared/CompetitionType';

type ParticipantWithMember = CompetitionParticipantType;

export default function CompetitionViewDetail() {
  const [competition, setCompetition] = useState<CompetitionType | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [participants, setParticipants] = useState<ParticipantWithMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantWithMember | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionType | null>(null);
  const [deleteType, setDeleteType] = useState<'participant' | 'question' | null>(null);
  const navigate = useNavigate();
  const { competitionID } = useParams();

  const fetchCompetitionData = useCallback(async () => {
    if (!competitionID) return;

    try {
      const [competitionData, questionsData, participantsData] = await Promise.all([
        getCompetitionByIdService(parseInt(competitionID)),
        getQuestionsByCompetitionService(parseInt(competitionID)),
        getParticipantsByCompetitionService(parseInt(competitionID)),
      ]);

      setCompetition(competitionData);
      setQuestions(Array.isArray(questionsData) ? questionsData : []);
      setParticipants(Array.isArray(participantsData) ? participantsData : []);
    } catch (error) {
      console.error('Error fetching competition data:', error);
    } finally {
      setLoading(false);
    }
  }, [competitionID]);

  useEffect(() => {
    fetchCompetitionData();
  }, [fetchCompetitionData]);

  const handleRemoveParticipant = async () => {
    if (!selectedParticipant?.id) return;

    try {
      setIsDeleting(true);
      await removeParticipantService(selectedParticipant.id);
      setParticipants(participants.filter(p => p.id !== selectedParticipant.id));
      setDeleteModalOpen(false);
      setSelectedParticipant(null);
    } catch (error) {
      console.error('Error removing participant:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion?.id) return;

    try {
      setIsDeleting(true);
      await deleteQuestionService(selectedQuestion.id);
      setQuestions(questions.filter(q => q.id !== selectedQuestion.id));
      setDeleteModalOpen(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Error deleting question:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteType === 'participant') {
      await handleRemoveParticipant();
    } else if (deleteType === 'question') {
      await handleDeleteQuestion();
    }
    setDeleteType(null);
  };

  const getStatusBadge = () => {
    // Since we removed time-based logic, show active status
    return <Badge color="green">Active</Badge>;
  };

  if (loading) {
    return <Text>Loading competition details...</Text>;
  }

  if (!competition) {
    return <Text>Competition not found</Text>;
  }

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Title order={2}>{competition.name}</Title>
        <Group>
          <Button
            variant="light"
            leftSection={<IconEdit size={16} />}
            onClick={() => navigate(`/dashboard/competition/${competitionID}/edit`)}
          >
            Edit Competition
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate(`/dashboard/competition/${competitionID}/questions/create`)}
          >
            Add Question
          </Button>
        </Group>
      </Group>

      <Paper p="md" mb="md">
        <Group mb="sm">
          <Text fw={500}>Status:</Text>
          {getStatusBadge()}
        </Group>
        <Text mb="sm"><strong>Description:</strong> {competition.description}</Text>
        <Text mb="sm"><strong>Duration:</strong> {competition.duration_minutes} minutes</Text>
        <Text mb="sm"><strong>Total Questions:</strong> {questions.length}</Text>
        <Text mb="sm"><strong>Total Participants:</strong> {participants.length}</Text>
        <Text mb="sm"><strong>Competition link: </strong> 
            <Link to={`/public/competition/${competitionID}`} target='_blank'>{`${window.location.origin}/public/competition/${competitionID}`}</Link>
        </Text>
      </Paper>

      <Tabs defaultValue="questions">
        <Tabs.List>
          <Tabs.Tab value="questions">Questions ({questions.length})</Tabs.Tab>
          <Tabs.Tab value="participants">Participants ({participants.length})</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="questions" pt="md">
          <Paper p="md">
            <Group justify="space-between" mb="md">
              <Title order={4}>Questions</Title>
              <Button
                size="sm"
                leftSection={<IconPlus size={14} />}
                onClick={() => navigate(`/dashboard/competition/${competitionID}/questions/create`)}
              >
                Add Question
              </Button>
            </Group>

            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Question</Table.Th>
                  <Table.Th>Correct Answer</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {questions.map((question) => (
                  <Table.Tr key={question.id}>
                    <Table.Td>
                      {question.question_text.length > 100
                        ? `${question.question_text.substring(0, 100)}...`
                        : question.question_text}
                    </Table.Td>
                    <Table.Td>{question.correct_answer}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => navigate(`/dashboard/competition/${competitionID}/questions/${question.id}`)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="green"
                          onClick={() => navigate(`/dashboard/competition/${competitionID}/questions/${question.id}/edit`)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => {
                            setSelectedQuestion(question);
                            setDeleteType('question');
                            setDeleteModalOpen(true);
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="participants" pt="md">
          <Paper p="md">
            <Group justify="space-between" mb="md">
              <Title order={4}>Participants</Title>
              <Button
                size="sm"
                leftSection={<IconPlus size={14} />}
                onClick={() => navigate(`/dashboard/competition/${competitionID}/participants/add`)}
              >
                Add Participant
              </Button>
            </Group>

            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Auth Key</Table.Th>
                  <Table.Th>Score</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {participants.map((participant) => (
                  <Table.Tr key={participant.id}>
                    <Table.Td>{participant.name}</Table.Td>
                    <Table.Td>
                      <Text size="xs" style={{ fontFamily: 'monospace' }}>
                        {participant.auth_key}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Text fw={500}>{participant.score || 0}%</Text>
                        <Text size="xs" c="dimmed">
                          ({participant.correct_answers || 0}/{participant.total_answers || 0})
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => navigate(`/dashboard/competition/${competitionID}/participants/${participant.id}`)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => {
                            setSelectedParticipant(participant);
                            setDeleteType('participant');
                            setDeleteModalOpen(true);
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedParticipant(null);
          setSelectedQuestion(null);
          setDeleteType(null);
        }}
        title={deleteType === 'question' ? 'Delete Question' : 'Remove Participant'}
        centered
      >
        <Text>
          {deleteType === 'question'
            ? `Are you sure you want to delete this question?`
            : `Are you sure you want to remove "${selectedParticipant?.name}" from this competition?`
          }
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          {deleteType === 'question'
            ? 'This will also delete all answers related to this question.'
            : 'This will also delete all their answers for this competition.'
          }
        </Text>
        <Group justify="flex-end" mt="md">
          <Button
            variant="light"
            onClick={() => {
              setDeleteModalOpen(false);
              setSelectedParticipant(null);
              setSelectedQuestion(null);
              setDeleteType(null);
            }}
          >
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete} loading={isDeleting}>
            {deleteType === 'question' ? 'Delete' : 'Remove'}
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
