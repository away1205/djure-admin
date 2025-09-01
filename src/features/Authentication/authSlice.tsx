import { createSlice } from '@reduxjs/toolkit';

import { AppDispatch } from '../../store';
import { adminAuthService } from '../../services/authService';

const initialState = {
  isLoading: false,
  error: '',
  isAuthenticatedAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLoading(state) {
      state.isLoading = true;
      state.error = '';
    },

    authLoginAdmin(state) {
      state.isLoading = false;
      state.error = '';
      state.isAuthenticatedAdmin = true;
    },
    authLogoutAdmin(state) {
      state.isLoading = false;
      state.error = '';
      state.isAuthenticatedAdmin = false;
    },

    authRejected(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export function loginAdmin(email: string, password: string) {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'auth/authLoading' });

    adminAuthService(email, password).then((data) => {
      if (data?.code) {
        dispatch({
          type: 'auth/authRejected',
          payload: data.message,
        });
        return;
      }

      if (data === true) {
        dispatch({ type: 'auth/authLoginAdmin' });
      } else {
        dispatch({
          type: 'auth/authRejected',
          payload: 'Email atau password anda salah',
        });
      }
    });
  };
}

export function logoutAdmin() {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'auth/authLogoutAdmin' });
  };
}

export default authSlice.reducer;
