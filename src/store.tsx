import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from './features/Authentication/authSlice';
import transactionSlice from './features/Transaction/transactionSlice';
import memberSlice from './features/Member/memberSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    transaction: transactionSlice,
    member: memberSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
