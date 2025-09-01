import { useEffect, useState, useCallback } from 'react';
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Paper,
  Title,
  Grid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { createQuestionService, getQuestionByIdService, updateQuestionService } from '../../../services/questionService';
import { QuestionType } from '../../../shared/CompetitionType';

export default function QuestionForm() {
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { competitionID, questionID } = useParams();

  const form = useForm<QuestionType>({
    initialValues: {
      competition_id: parseInt(competitionID || '0'),
      question_text: '',
      correct_answer: '',
    },
    validate: {
      question_text: (value) => (value.length < 5 ? 'Question must be at least 5 characters' : null),
      correct_answer: (value) => (value.length < 1 ? 'Correct answer is required' : null),
    },
  });

  const fetchQuestion = useCallback(async (id: string) => {
    try {
      const data = await getQuestionByIdService(parseInt(id));
      if (data) {
        form.setValues({
          ...data,
          competition_id: parseInt(competitionID || '0'),
        });
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  }, [form, competitionID]);

  useEffect(() => {
    if (questionID) {
      setIsEdit(true);
      fetchQuestion(questionID);
    }
  }, [questionID, fetchQuestion]);

  const handleSubmit = async (values: QuestionType) => {
    setLoading(true);
    try {
      if (isEdit && questionID) {
        await updateQuestionService(parseInt(questionID), values);
      } else {
        await createQuestionService(values);
      }
      navigate(`/dashboard/competition/${competitionID}`);
    } catch (error) {
      console.error('Error saving question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" radius="md">
      <Title order={3} mb="md">
        {isEdit ? 'Edit Question' : 'Create New Question'}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <Textarea
              label="Question Text"
              placeholder="Enter the question"
              required
              minRows={4}
              {...form.getInputProps('question_text')}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <TextInput
              label="Correct Answer"
              placeholder="Enter the correct answer"
              required
              {...form.getInputProps('correct_answer')}
            />
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
            {isEdit ? 'Update Question' : 'Create Question'}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
