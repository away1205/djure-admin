import { Center, Stack, Text, Title } from '@mantine/core';
import TransactionList from './Form/TransactionList';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { useEffect } from 'react';
import { loadedTransactionDetail } from './transactionSlice';

function TransactionViewDetail() {
  const { transactionID } = useParams();
  const { transactionDetail, transactionList } = useAppSelector(
    (state) => state.transaction
  );
  const dispatch = useAppDispatch();

  const [thisTransaction] = transactionList.filter(
    (transaction) => transaction.id === Number(transactionID)
  );

  useEffect(() => {
    dispatch(loadedTransactionDetail(Number(transactionID)));
  }, [dispatch, transactionID]);

  return (
    <Center p={'2rem'} h={'100vh'}>
      <Stack>
        <Stack gap={0}>
          <Title order={3}>Transaction Details</Title>
          <Text fz={'sm'} c={'dimmed'}>
            TX: {transactionID}
          </Text>
        </Stack>

        <TransactionList transactionDetail={transactionDetail} />

        <Text c={'dimmed'} fz={'sm'}>
          Link Transaction: <br />{' '}
          {thisTransaction.transactionProof
            ? thisTransaction.transactionProof
            : 'No Link'}
        </Text>
      </Stack>
    </Center>
  );
}

export default TransactionViewDetail;
