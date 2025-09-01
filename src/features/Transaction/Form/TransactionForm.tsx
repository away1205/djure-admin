import {
  Button,
  Center,
  Image,
  Modal,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

import TransactionList from './TransactionList';
import TransactionInput from './TransactionInput';
import TransactionProof from './TransactionProof';
import {
  createDetailTransactionService,
  createTransactionService,
} from '../../../services/transactionService';
import {
  deleteAllNota,
  loadedTransaction,
  loadedTransactionDetail,
} from '../transactionSlice';
import { useAppDispatch, useAppSelector } from '../../../store';
import { useNavigate } from 'react-router-dom';

function TransactionForm() {
  const { transactionDetail, transactionData: newTransactionData } =
    useAppSelector((state) => state.transaction);
  const navigate = useNavigate();

  const [openedProof, { open: openProof, close: closeProof }] =
    useDisclosure(false);
  const [openedSuccess, { open: openSuccess, close: closeSuccess }] =
    useDisclosure(false);

  const [updatedState, setUpdatedState] = useState(0);

  const dispatch = useAppDispatch();

  const uuid = useMemo(() => {
    return Math.round(Math.random() * Date.now());
  }, [updatedState]);

  // in database there are 2 data: transaction and transactionDetail
  const transactionData = useMemo(() => {
    return {
      id: uuid,
      createdBy: 1,
      createdAt: new Date().toLocaleString(),
    };
  }, [uuid]);

  async function handleKirimNota() {
    if (transactionDetail.length === 0) return;

    await createTransactionService(newTransactionData).then(() => {
      createDetailTransactionService(transactionDetail);
    });

    openSuccess();
    setUpdatedState((cur) => cur + 1);
    dispatch(deleteAllNota());
  }

  useEffect(() => {
    const amount = transactionDetail.reduce(
      (acc, cur) => acc + cur.totalPrice,
      0
    );

    dispatch(loadedTransaction({ ...transactionData, amount }));
  }, [transactionData, dispatch, transactionDetail]);

  useEffect(() => {
    dispatch(loadedTransactionDetail(0));
  }, [dispatch]);

  return (
    <Center h={'100vh'}>
      <Stack>
        <Stack gap={0}>
          <Title order={2}>Transaction Form</Title>
          <Text>TX: {transactionData.id}</Text>
          <Button w={'fit-content'} onClick={openProof} my={'sm'}>
            Detail Transaksi
          </Button>

          <TransactionProof onClose={closeProof} opened={openedProof} />
        </Stack>

        <Stack w={'700px'}>
          <TransactionList
            transactionDetail={transactionDetail}
            isViewer={false}
          />
          <TransactionInput onKirimNota={handleKirimNota} />
        </Stack>

        <Modal
          opened={openedSuccess}
          onClose={() => {
            navigate('/dashboard/transaction');
            closeSuccess;
          }}
          closeOnClickOutside={false}
        >
          <Stack align='center'>
            <Image src={'/thankyou-logo.svg'} alt='Thankyou' />
            <Title order={2}>Transaction is success</Title>
            <Button
              fullWidth
              onClick={() => {
                navigate('/dashboard/transaction');
                closeSuccess;
              }}
            >
              Back
            </Button>
          </Stack>
        </Modal>
      </Stack>
    </Center>
  );
}

export default TransactionForm;
