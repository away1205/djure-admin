import { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Card,
  Badge,
  Alert,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompetitionByIdService } from '../../services/competitionService';
import { CompetitionType } from '../../shared/CompetitionType';

export default function CompetitionAccess() {
  const [competition, setCompetition] = useState<CompetitionType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { competitionID } = useParams();

  useEffect(() => {
    const fetchCompetition = async () => {
      if (!competitionID) return;

      try {
        const data = await getCompetitionByIdService(parseInt(competitionID));
        setCompetition(data);
      } catch (error) {
        console.error('Error fetching competition:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [competitionID]);

  const handleJoinCompetition = () => {
    navigate(`/public/competition/${competitionID}/login`);
  };

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Text ta="center">Memuat kompetisi...</Text>
      </Container>
    );
  }

  if (!competition) {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" radius="md" withBorder ta="center">
          <Title order={2} c="red" mb="md">
            Kompetisi Tidak Ditemukan
          </Title>
          <Text mb="xl">
            Kompetisi yang Anda cari tidak ada atau telah dihapus.
          </Text>
          <Button onClick={() => navigate('/')}>
            Kembali ke Beranda
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Paper p="xl" radius="md" withBorder>
        <Title order={2} ta="center" mb="md">
          {competition.name}
        </Title>

        <Card withBorder p="lg" mb="xl">
          <Text mb="md">{competition.description}</Text>

          <Group justify="space-between" mb="md">
            <div>
              <Text fw={500}>Durasi:</Text>
              <Text>{competition.duration_minutes} menit</Text>
            </div>
            <Badge color="blue" size="lg">
              Kompetisi Aktif
            </Badge>
          </Group>
        </Card>

        <Alert title="Cara Berpartisipasi" mb="xl">
          <Text>
            Untuk bergabung dalam kompetisi ini, Anda memerlukan kunci autentikasi yang disediakan oleh administrator kompetisi. Jika Anda tidak memilikinya, silakan hubungi penyelenggara.
          </Text>
        </Alert>

        <Group justify="center">
          <Button size="lg" onClick={handleJoinCompetition}>
            Bergabung Kompetisi
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
