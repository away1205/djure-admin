import { Anchor, Divider, Grid, Group, Stack, Title } from '@mantine/core';
import {
  TotalExpenseCard,
  TotalIncomeCard,
  TotalRevenueCard,
} from '../Transaction/TransactionCard';
import { useAppDispatch, useAppSelector } from '../../store';
import { TotalMemberCard } from '../Member/MemberStats';
import { IconArrowRight } from '@tabler/icons-react';
import { useEffect } from 'react';
import { loadedMember } from '../Member/memberSlice';
import { loadedTransactionAmount } from '../Transaction/transactionSlice';
import { useNavigate } from 'react-router-dom';

function StatsDashboard() {
  const { transactionAmount } = useAppSelector((state) => state.transaction);
  const { memberList } = useAppSelector((state) => state.member);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadedMember());
    dispatch(loadedTransactionAmount());
  }, [dispatch]);
  return (
    <>
      <Stack>
        <Title>Data Transaksi</Title>

        <Grid grow align='center'>
          <Grid.Col span={{ base: 'content', lg: 3 }}>
            <TotalRevenueCard transactionList={transactionAmount} />
          </Grid.Col>

          <Grid.Col span={{ base: 'content', lg: 3 }}>
            <TotalIncomeCard transactionList={transactionAmount} />
          </Grid.Col>

          <Grid.Col span={{ base: 'content', lg: 3 }}>
            <TotalExpenseCard transactionList={transactionAmount} />
          </Grid.Col>

          <Grid.Col span={'content'}>
            <Anchor
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => navigate('/dashboard/transaction/view')}
            >
              Lihat detail <IconArrowRight />
            </Anchor>
          </Grid.Col>
        </Grid>
      </Stack>

      <Stack>
        <Title>Data Anggota</Title>
        <Group>
          <TotalMemberCard memberList={memberList} />

          <Anchor
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => navigate('/dashboard/member/view')}
          >
            Lihat detail <IconArrowRight />
          </Anchor>
        </Group>
      </Stack>

      <Stack mt={'2rem'}>
        <Divider />
        <Title order={5} c={'dimmed'} ta={'center'}>
          More stats are coming in hot🔥
        </Title>
      </Stack>
    </>
  );
}

export default StatsDashboard;
