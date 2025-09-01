/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Tooltip,
} from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useState } from 'react';

type AuthProp = {
  onLogin: (email: string, password: string) => any;
  isLoading: boolean;
  error: string;
};

function AuthenticationTitle({ onLogin, isLoading, error }: AuthProp) {
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const loginForm = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: isNotEmpty('Email cannot be empty') && isEmail('Invalid email'),
      password: isNotEmpty('Password cannot be empty'),
    },
  });

  return (
    <Container size={420} my={40} w={'30rem'}>
      <Title ta='center'>Welcome back!</Title>
      {isForgotPassword ? (
        <Text ta={'center'} mt={5} c={'red'} fz={'sm'}>
          Contact Ketua korps or other PIC if you forgot your password
        </Text>
      ) : (
        <Text c='dimmed' size='sm' ta='center' mt={5}>
          Do not have an account yet?{' '}
          <Tooltip label='Coming soon' position='right-start'>
            <Anchor
              size='sm'
              component='button'
              style={{ cursor: 'not-allowed' }}
            >
              Create account
            </Anchor>
          </Tooltip>
        </Text>
      )}

      <form
        onSubmit={loginForm.onSubmit((val) => onLogin(val.email, val.password))}
      >
        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          <TextInput
            label='Email'
            placeholder='you@mail.com'
            required
            {...loginForm.getInputProps('email')}
          />

          <PasswordInput
            label='Password'
            placeholder='Your password'
            required
            mt='md'
            {...loginForm.getInputProps('password')}
          />

          <Group justify='space-between' mt='lg'>
            <Checkbox label='Remember me' />

            <Anchor
              component='button'
              size='sm'
              onClick={() => setIsForgotPassword((cur) => !cur)}
              type={'button'}
            >
              Forgot password?
            </Anchor>
          </Group>

          <Text mt={'sm'} c={'red'} fz={'sm'}>
            {error ? error : null}
          </Text>

          <Button fullWidth mt='xl' type='submit' loading={isLoading}>
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  );
}

export default AuthenticationTitle;
