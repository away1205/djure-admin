import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Group,
  Text,
  ActionIcon,
  Badge,
  Modal,
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { getAllCompetitionsService, deleteCompetitionService } from '../../services/competitionService';
import { CompetitionType } from '../../shared/CompetitionType';

export default function CompetitionView() {
  const [competitions, setCompetitions] = useState<CompetitionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const data = await getAllCompetitionsService();
      if (Array.isArray(data)) {
        setCompetitions(data);
      }
    } catch (error) {
      console.error('Error fetching competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCompetition?.id) return;

    try {
      await deleteCompetitionService(selectedCompetition.id);
      setCompetitions(competitions.filter(c => c.id !== selectedCompetition.id));
      setDeleteModalOpen(false);
      setSelectedCompetition(null);
    } catch (error) {
      console.error('Error deleting competition:', error);
    }
  };

  const getStatusBadge = () => {
    // Since we removed time-based logic, show active status
    return <Badge color="green">Active</Badge>;
  };

  if (loading) {
    return <Text>Loading competitions...</Text>;
  }

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>Competitions</Text>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate('../create')}
        >
          Create Competition
        </Button>
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Duration (min)</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {competitions.map((competition) => (
            <Table.Tr key={competition.id}>
              <Table.Td>{competition.name}</Table.Td>
              <Table.Td>
                {competition.description?.length > 50
                  ? `${competition.description.substring(0, 50)}...`
                  : competition.description}
              </Table.Td>
              <Table.Td>{competition.duration_minutes}</Table.Td>
              <Table.Td>{getStatusBadge()}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => navigate(`../${competition.id}`)}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="green"
                    onClick={() => navigate(`../${competition.id}/edit`)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      setSelectedCompetition(competition);
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

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Competition"
        centered
      >
        <Text>Are you sure you want to delete "{selectedCompetition?.name}"?</Text>
        <Text size="sm" c="dimmed" mt="sm">
          This action cannot be undone and will also delete all associated questions and answers.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
