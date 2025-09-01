import { useEffect, useState } from 'react';
import {
  TextInput,
  Button,
  Group,
  Paper,
  Title,
  Text,
  Grid,
  PasswordInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { addParticipantService } from '../../../services/participantService';
import { CompetitionParticipantType } from '../../../shared/CompetitionType';

export default function ParticipantForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { competitionID } = useParams();

  const form = useForm<CompetitionParticipantType>({
    initialValues: {
      competition_id: parseInt(competitionID || '0'),
      name: '',
      auth_key: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      auth_key: (value) => {
        if (!value) return 'Auth key is required';
        if (value.length < 6) return 'Auth key must be at least 6 characters';
        return null;
      },
    },
  });

  useEffect(() => {
    // No longer need to fetch existing participants for email validation
  }, [competitionID]);

  const generateAuthKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldValue('auth_key', result);
  };

  const handleSubmit = async (values: CompetitionParticipantType) => {
    setLoading(true);
    try {
      await addParticipantService(values);
      navigate(`/dashboard/competition/${competitionID}`);
    } catch (error) {
      console.error('Error adding participant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" radius="md">
      <Title order={3} mb="md">Add New Participant</Title>

      <Text mb="md">
        Enter participant details. They will need the auth key to access the competition.
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Full Name"
              placeholder="Enter participant's full name"
              required
              {...form.getInputProps('name')}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <PasswordInput
              label="Auth Key"
              placeholder="Enter or generate an auth key"
              required
              {...form.getInputProps('auth_key')}
              rightSection={
                <Button
                  size="xs"
                  variant="light"
                  onClick={generateAuthKey}
                  style={{ marginRight: '8px' }}
                >
                  Generate
                </Button>
              }
            />
            <Text size="xs" c="dimmed" mt="xs">
              This key will be used by the participant to access the competition.
            </Text>
          </Grid.Col>
        </Grid>

        <Group justify="flex-end" mt="md">
          <Button
            variant="light"
            onClick={() => navigate(`/dashboard/competition/${competitionID}`)}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Participant
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
