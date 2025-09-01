import { createSlice } from '@reduxjs/toolkit';
import {
  DetailTransactionType,
  TransactionType,
} from '../../shared/TransactionType';
import {
  deleteTransactionService,
  getAllTransactionService,
  getDetailTransactionService,
  getPaginationTransactionService,
  getSpecificTransactionService,
} from '../../services/transactionService';
import { AppDispatch } from '../../store';

type InitialStateType = {
  transactionList: TransactionType[];
  transactionData: TransactionType;
  transactionDetail: DetailTransactionType[];
  isLoading: boolean;
  transactionAmount: [];
  error: string;
};

const initialState: InitialStateType = {
  transactionList: [],
  transactionData: {
    id: 1,
    createdAt: '',
    createdBy: 1,
    transactionProof: '',
    transactionType: 'debit',
    amount: 0,
    description: '',
  },
  transactionDetail: [],
  transactionAmount: [],
  isLoading: false,
  error: '',
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    loadingTransaction(state) {
      state.isLoading = true;
      state.error = '';
    },
    loadedTransaction(state, action) {
      state.isLoading = false;
      state.transactionData = { ...state.transactionData, ...action.payload };
    },
    loadedTransactionDetail(state, action) {
      state.isLoading = false;
      state.transactionDetail = action.payload;
    },
    loadedTransactionList(state, action) {
      state.isLoading = false;
      state.transactionList = action.payload;
    },
    loadedTransactionAmount(state, action) {
      state.isLoading = false;
      state.transactionAmount = action.payload;
    },

    deleteTransactionList(state, action) {
      state.isLoading = false;
      state.transactionList = state.transactionList.filter(
        (transaction) => transaction.id !== action.payload
      );
    },

    createNota(state, action) {
      state.isLoading = false;
      state.transactionDetail.push(action.payload);
    },
    deleteNota(state, action) {
      state.isLoading = false;
      state.transactionDetail = action.payload;
    },
    deleteAllNota(state) {
      state.isLoading = false;
      state.transactionDetail = [];
    },

    rejected(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { createNota, deleteNota, deleteAllNota, loadedTransaction } =
  transactionSlice.actions;

export function loadedTransactionList() {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'transaction/loadingTransaction' });

    getAllTransactionService().then((data) => {
      if (data?.code) {
        dispatch({
          type: 'transaction/rejected',
          payload: data.message,
        });

        return;
      }

      dispatch({ type: 'transaction/loadedTransactionList', payload: data });
    });
  };
}

export function loadedTransactionDetail(id: number) {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'transaction/loadingTransaction' });

    getDetailTransactionService(id).then((data) => {
      if (data?.code) {
        dispatch({
          type: 'transaction/rejected',
          payload: data.message,
        });

        return;
      }

      dispatch({ type: 'transaction/loadedTransactionDetail', payload: data });
    });
  };
}

export function loadedTransactionAmount() {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'transaction/loadingTransaction' });

    getSpecificTransactionService('amount, transactionType, createdAt').then(
      (data) => {
        if (data?.code) {
          dispatch({
            type: 'transaction/rejected',
            payload: data.message,
          });

          return;
        }

        dispatch({
          type: 'transaction/loadedTransactionAmount',
          payload: data,
        });
      }
    );
  };
}

export function paginationTransactionList(
  from: number,
  to: number,
  filterColumn: string = '',
  pattern: string = ''
) {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'transaction/loadingTransaction' });

    getPaginationTransactionService(from, to, filterColumn, pattern).then(
      (data) => {
        if (data?.code) {
          dispatch({
            type: 'transaction/rejected',
            payload: data.message,
          });

          return;
        }

        dispatch({ type: 'transaction/loadedTransactionList', payload: data });
      }
    );
  };
}

export function deleteTransactionList(id: number) {
  return async function (dispatch: AppDispatch) {
    dispatch({ type: 'transaction/loadingTransaction' });

    deleteTransactionService(id).then((data) => {
      if (data?.code) {
        dispatch({
          type: 'transaction/rejected',
          payload: data.message,
        });

        return;
      }

      dispatch({ type: 'transaction/deleteTransactionList', payload: id });
    });
  };
}

export default transactionSlice.reducer;
