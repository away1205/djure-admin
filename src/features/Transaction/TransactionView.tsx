import {
  Divider,
  Grid,
  Group,
  NativeSelect,
  Pagination,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useMediaQuery, usePagination } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '../../store';
import { useEffect, useState } from 'react';

import TransactionViewList from './TransactionViewList';
import {
  deleteTransactionList,
  loadedTransactionAmount,
  paginationTransactionList,
} from './transactionSlice';
import { getTransactionLengthService } from '../../services/transactionService';
import {
  TotalExpenseCard,
  TotalIncomeCard,
  TotalRevenueCard,
} from './TransactionCard';

function TransactionView() {
  const { isLoading, error, transactionList, transactionAmount } =
    useAppSelector((state) => state.transaction);

  const [transactionLength, setTransactionLength] = useState(0);
  const [filter, setFilter] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const isMobile = useMediaQuery('(max-width: 30em)');

  const [page, onPageChange] = useState(1);
  const pagination = usePagination({
    total: Math.ceil(transactionLength / 10),
    page,
    onChange: onPageChange,
  });

  const dispatch = useAppDispatch();

  const filterType = [
    { label: 'All Transactions', value: '' },
    { label: 'Filter by Description', value: 'description' },
    // { label: 'Filter by Date', value: 'createdAt' },
    // { label: 'Filter by ID', value: 'id' },
  ];

  // if page 1
  // then items from 0 to 9
  // if page 2
  // then items from 10 to 19
  const from = page > 1 ? page * 10 - 10 : 0;
  const to = page > 1 ? page * 10 + 9 - 10 : 9;

  useEffect(() => {
    dispatch(paginationTransactionList(from, to, filter, filterValue));
    dispatch(loadedTransactionAmount());

    getTransactionLengthService(filter, filterValue).then((data) => {
      setTransactionLength(data);
    });
  }, [dispatch, from, to, filter, filterValue]);

  function deleteTransaction(id: number) {
    dispatch(deleteTransactionList(id));
  }

  return (
    <Stack p={'2rem'}>
      <Title>Daftar Transaksi</Title>

      <Grid grow align='center'>
        <Grid.Col span={{ base: 'content', lg: 3 }}>
          <TotalRevenueCard transactionList={transactionAmount} />
        </Grid.Col>

        {!isMobile && (
          <>
            {' '}
            <Grid.Col span={{ base: 'content', lg: 3 }}>
              <TotalIncomeCard transactionList={transactionAmount} />
            </Grid.Col>
            <Grid.Col span={{ base: 'content', lg: 3 }}>
              <TotalExpenseCard transactionList={transactionAmount} />
            </Grid.Col>
          </>
        )}
      </Grid>
      <Divider />

      <Group grow={isMobile}>
        <NativeSelect
          data={filterType}
          value={filter}
          onChange={(ev) => setFilter(ev.currentTarget.value)}
        />

        <TextInput
          value={filterValue}
          onChange={(ev) => setFilterValue(ev.currentTarget.value)}
          disabled={filter === ''}
        />
      </Group>

      <TransactionViewList
        isLoading={isLoading}
        error={error}
        dataList={transactionList}
        name='Transaction'
        onDeleteItem={deleteTransaction}
      />
      <Pagination total={pagination.range.length} onChange={onPageChange} />
    </Stack>
  );
}

export default TransactionView;
