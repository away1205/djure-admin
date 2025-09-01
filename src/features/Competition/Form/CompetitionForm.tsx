import { useEffect, useState, useCallback } from 'react';
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Paper,
  Title,
  Grid,
  NumberInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { createCompetitionService, getCompetitionByIdService, updateCompetitionService } from '../../../services/competitionService';
import { CompetitionType } from '../../../shared/CompetitionType';

export default function CompetitionForm() {
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { competitionID } = useParams();

  const form = useForm<CompetitionType>({
    initialValues: {
      name: '',
      description: '',
      duration_minutes: 60,
    },
    validate: {
      name: (value: string | Date) => (typeof value === 'string' && value.length < 2 ? 'Name must be at least 2 characters' : null),
      description: (value: string | Date) => (typeof value === 'string' && value.length < 10 ? 'Description must be at least 10 characters' : null),
      duration_minutes: (value: number) => (value <= 0 ? 'Duration must be greater than 0 minutes' : null),
    },
  });

  const fetchCompetition = useCallback(async (id: string) => {
    try {
      const data = await getCompetitionByIdService(parseInt(id));
      if (data) {
        form.setValues({
          ...data,
        });
      }
    } catch (error) {
      console.error('Error fetching competition:', error);
    }
  }, [form]);

  useEffect(() => {
    if (competitionID) {
      setIsEdit(true);
      fetchCompetition(competitionID);
    }
  }, [competitionID, fetchCompetition]);

  const handleSubmit = async (values: CompetitionType) => {
    setLoading(true);
    try {
      const competitionData = {
        name: values.name,
        description: values.description,
        duration_minutes: values.duration_minutes,
        ...(values.id && { id: values.id }),
        ...(values.created_at && { created_at: values.created_at }),
      };

      if (isEdit && competitionID) {
        await updateCompetitionService(parseInt(competitionID), competitionData);
      } else {
        await createCompetitionService(competitionData);
      }
      navigate('/dashboard/competition/view');
    } catch (error) {
      console.error('Error saving competition:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" radius="md">
      <Title order={3} mb="md">
        {isEdit ? 'Edit Competition' : 'Create New Competition'}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Competition Name"
              placeholder="Enter competition name"
              required
              {...form.getInputProps('name')}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              label="Description"
              placeholder="Enter competition description"
              required
              minRows={3}
              {...form.getInputProps('description')}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <NumberInput
              label="Duration (minutes)"
              placeholder="Enter competition duration in minutes"
              required
              min={1}
              {...form.getInputProps('duration_minutes')}
            />
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={() => navigate('/dashboard/competition/view')}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Update Competition' : 'Create Competition'}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
