import { useEffect, useState, useCallback } from 'react';
import {
  Paper,
  Title,
  Text,
  Button,
  Group,
  Container,
  Card,
  Progress,
  Alert,
  Badge,
  TextInput,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompetitionByIdService } from '../../services/competitionService';
import { getQuestionsByCompetitionService } from '../../services/questionService';
import { submitAnswerService } from '../../services/answerService';
import { updateParticipantService } from '../../services/participantService';
import { CompetitionType, QuestionType, CompetitionParticipantType } from '../../shared/CompetitionType';

interface AnswerState {
  questionId: number;
  answer: string;
  submitted: boolean;
}

export default function ParticipantCompetition() {
  const [competition, setCompetition] = useState<CompetitionType | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [participant, setParticipant] = useState<CompetitionParticipantType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const navigate = useNavigate();
  const { competitionID } = useParams();

  const fetchData = useCallback(async () => {
    if (!competitionID) return;

    // Check if participant is logged in
    const participantData = sessionStorage.getItem('participant');
    if (!participantData) {
      navigate(`/public/competition/${competitionID}/login`);
      return;
    }

    const participantInfo = JSON.parse(participantData);
    setParticipant(participantInfo);

    try {
      setLoading(true);
      const [competitionData, questionsData] = await Promise.all([
        getCompetitionByIdService(parseInt(competitionID)),
        getQuestionsByCompetitionService(parseInt(competitionID)),
      ]);

      setCompetition(competitionData);
      setQuestions(Array.isArray(questionsData) ? questionsData : []);

      // Initialize timer
      const startTime = sessionStorage.getItem(`competition_start_${competitionID}`);
      const currentTime = Date.now();
      const durationMs = competitionData.duration_minutes * 60 * 1000;

      if (!startTime) {
        // First time starting the competition
        sessionStorage.setItem(`competition_start_${competitionID}`, currentTime.toString());
        setTimeRemaining(durationMs);
      } else {
        // Resume from previous start time
        const elapsed = currentTime - parseInt(startTime);
        const remaining = Math.max(0, durationMs - elapsed);
        setTimeRemaining(remaining);
        if (remaining === 0) {
          setTimeExpired(true);
        }
      }

      // Initialize answers state
      const initialAnswers = (questionsData || []).map((q: QuestionType) => ({
        questionId: q.id!,
        answer: '',
        submitted: false,
      }));
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching competition data:', error);
    } finally {
      setLoading(false);
    }
  }, [competitionID, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining > 0 && !completed && !timeExpired) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1000;
          if (newTime <= 0) {
            setTimeExpired(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, completed, timeExpired]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || !currentQuestion || !participant) return;

    setSubmitting(true);
    try {
      await submitAnswerService({
        participant_id: participant.id!,
        question_id: currentQuestion.id!,
        answer_text: selectedAnswer,
      });

      // Update answers state
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = {
        ...newAnswers[currentQuestionIndex],
        answer: selectedAnswer,
        submitted: true,
      };
      setAnswers(newAnswers);

      // Move to next question or complete
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer('');
      } else {
        setCompleted(true);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]?.answer || '');
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]?.answer || '');
    }
  };

  const handleLogout = useCallback(async () => {
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

    // Clear session storage
    sessionStorage.removeItem('participant');
    sessionStorage.removeItem('competitionId');
    if (competitionID) {
      sessionStorage.removeItem(`competition_start_${competitionID}`);
    }

    // Redirect to external site
    window.location.href = 'https://djure.rccd.space/';
  }, [competitionID, participant?.id]);

  // Auto logout when time expires
  useEffect(() => {
    if (timeExpired) {
      handleLogout();
    }
  }, [timeExpired, handleLogout]);

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Text ta="center">Memuat kompetisi...</Text>
      </Container>
    );
  }

  if (!competition || !participant) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title="Akses Ditolak">
          Anda perlu login terlebih dahulu untuk mengakses kompetisi ini.
        </Alert>
      </Container>
    );
  }

  if (completed) {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" radius="md" withBorder ta="center">
          <Title order={2} mb="md" c="green">
            Kompetisi Selesai! 🎉
          </Title>
          <Text mb="xl">
            Terima kasih telah berpartisipasi dalam "{competition.name}". Jawaban Anda telah berhasil dikirim.
          </Text>
          <Group justify="center">
            <Button onClick={handleLogout} variant="light">
              Keluar
            </Button>
          </Group>
        </Paper>
      </Container>
    );
  }

  if (timeExpired) {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" radius="md" withBorder ta="center">
          <Title order={2} mb="md" c="red">
            Waktu Habis! ⏰
          </Title>
          <Text mb="xl">
            Waktu kompetisi telah habis. Jawaban Anda telah otomatis dikirim.
          </Text>
          <Group justify="center">
            <Button onClick={handleLogout} variant="light">
              Keluar
            </Button>
          </Group>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Paper p="xl" radius="md" withBorder mb="md">
        <Group justify="space-between" mb="md">
          <div>
            <Title order={3}>{competition.name}</Title>
            <Text c="dimmed">Selamat datang, {participant.name}!</Text>
          </div>
          <Button variant="light" onClick={handleLogout}>
            Logout
          </Button>
        </Group>

        <Progress value={progress} mb="md" />
        <Group justify="space-between" mb="lg">
          <Text size="sm" c="dimmed">
            Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
          </Text>
          <Text size="sm" c={timeRemaining < 60000 ? "red" : "dimmed"} fw={500}>
            Waktu Tersisa: {formatTime(timeRemaining)}
          </Text>
        </Group>
      </Paper>

      {currentQuestion && (
        <Card withBorder p="xl">
          <Title order={4} mb="md">
            {currentQuestion.question_text}
          </Title>

          <TextInput
            placeholder="Ketik jawaban Anda di sini..."
            value={selectedAnswer}
            onChange={(event) => setSelectedAnswer(event.currentTarget.value)}
            mb="xl"
            required
          />

          <Group justify="space-between">
            <Button
              variant="light"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Sebelumnya
            </Button>

            <Group>
              {!currentAnswer?.submitted ? (
                <Button
                  onClick={handleAnswerSubmit}
                  loading={submitting}
                  disabled={!selectedAnswer}
                >
                  Kirim Jawaban
                </Button>
              ) : (
                <Badge color="green">Jawaban Dikirim</Badge>
              )}

              <Button
                variant="light"
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Selanjutnya
              </Button>
            </Group>
          </Group>
        </Card>
      )}
    </Container>
  );
}
