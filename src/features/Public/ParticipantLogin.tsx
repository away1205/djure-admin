import { useState } from 'react';
import {
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Container,
  Alert,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { getParticipantByAuthKeyService, updateParticipantService } from '../../services/participantService';

export default function ParticipantLogin() {
  const [authKey, setAuthKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { competitionID } = useParams();

  const handleLogin = async () => {
    if (!authKey.trim()) {
      setError('Silakan masukkan kunci autentikasi Anda');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const participant = await getParticipantByAuthKeyService(authKey.trim(), parseInt(competitionID || '0'));

      if (participant) {
        // Store participant info in session storage for the competition session
        sessionStorage.setItem('participant', JSON.stringify(participant));
        sessionStorage.setItem('competitionId', competitionID || '');

        try {
          // Invalidate the auth key to prevent reuse
          if (participant?.id) {
            await updateParticipantService(participant.id, {
              auth_key: `invalidated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            });
          }
        } catch (error) {
          console.error('Error invalidating auth key:', error);
        }
        
        // Navigate to the competition interface
        navigate(`/public/competition/${competitionID}/quiz`);
      } else {
        setError('Kunci autentikasi tidak valid. Silakan periksa dan coba lagi.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper p="xl" radius="md" withBorder>
        <Title order={2} ta="center" mb="md">
          Bergabung Kompetisi
        </Title>

        <Text ta="center" c="dimmed" mb="xl">
          Masukkan kunci autentikasi Anda untuk berpartisipasi dalam kompetisi ini
        </Text>

        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}

        <TextInput
          label="Kunci Autentikasi"
          placeholder="Masukkan kunci autentikasi Anda"
          value={authKey}
          onChange={(event) => setAuthKey(event.currentTarget.value)}
          onKeyPress={handleKeyPress}
          required
          mb="md"
        />

        <Group justify="center">
          <Button
            size="lg"
            onClick={handleLogin}
            loading={loading}
            disabled={!authKey.trim()}
          >
            Bergabung Kompetisi
          </Button>
        </Group>

        <Text ta="center" size="sm" c="dimmed" mt="md">
          Kunci autentikasi Anda diberikan saat Anda terdaftar untuk kompetisi ini.
        </Text>
      </Paper>
    </Container>
  );
}
