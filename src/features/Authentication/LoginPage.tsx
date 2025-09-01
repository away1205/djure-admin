import { Center } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import AuthenticationTitle from './AuthenticationTitle';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginAdmin } from './authSlice';
import { useEffect } from 'react';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticatedAdmin, isLoading, error } = useAppSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  function handleLogin(email: string, pass: string) {
    dispatch(loginAdmin(email, pass));
  }

  useEffect(() => {
    if (isAuthenticatedAdmin) {
      navigate('/dashboard');
    }
  }, [isAuthenticatedAdmin, navigate]);

  return (
    <Center h={'100vh'} maw={'100%'}>
      <AuthenticationTitle
        onLogin={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    </Center>
  );
}
