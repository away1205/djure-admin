import StatsCard from '../../UI/StatsCard';
import {
  countAllTransactions,
  filterTransactionsByMonth,
} from '../../utils/transactionFilter';

import { TransactionType } from '../../shared/TransactionType';

type CardProp = {
  transactionList: TransactionType[];
};

export function TotalRevenueCard({ transactionList }: CardProp) {
  const totalAllDebit = countAllTransactions(transactionList, 'debit');
  const totalAllKredit = countAllTransactions(transactionList, 'kredit');

  const totalDebitThisMonth = filterTransactionsByMonth(
    transactionList,
    'debit',
    new Date().getMonth() + 1
  );
  const totalDebitLastMonth = filterTransactionsByMonth(
    transactionList,
    'debit',
    new Date().getMonth() === 0 ? 12 : new Date().getMonth()
  );
  const totalKreditThisMonth = filterTransactionsByMonth(
    transactionList,
    'kredit',
    new Date().getMonth() + 1
  );
  const totalKreditLastMonth = filterTransactionsByMonth(
    transactionList,
    'kredit',
    new Date().getMonth() === 0 ? 12 : new Date().getMonth()
  );

  const totalRevenueThisMonth =
    countAllTransactions(totalDebitThisMonth, 'debit') -
    countAllTransactions(totalKreditThisMonth, 'kredit');

  const totalRevenueLastMonth =
    countAllTransactions(totalDebitLastMonth, 'debit') -
    countAllTransactions(totalKreditLastMonth, 'kredit');

  const diffDebit =
    ((totalRevenueThisMonth - totalRevenueLastMonth) / totalRevenueLastMonth) *
    100;

  const data = {
    title: 'Total Kas',
    icon: 'receipt',
    value: totalAllDebit - totalAllKredit,
    diff: diffDebit === Infinity ? 0 : Math.round(diffDebit),
  };

  return <StatsCard stat={data} />;
}

export function TotalIncomeCard({ transactionList }: CardProp) {
  const totalDebitThisMonth = filterTransactionsByMonth(
    transactionList,
    'debit',
    new Date().getMonth() + 1
  );
  const totalDebitLastMonth = filterTransactionsByMonth(
    transactionList,
    'debit',
    new Date().getMonth() === 0 ? 12 : new Date().getMonth()
  );

  const diffDebit =
    ((countAllTransactions(totalDebitThisMonth, 'debit') -
      countAllTransactions(totalDebitLastMonth, 'debit')) /
      countAllTransactions(totalDebitLastMonth, 'debit')) *
    100;

  const data = {
    title: 'Total Pemasukan - Bulan ini',
    icon: 'receipt',
    value: countAllTransactions(totalDebitThisMonth, 'debit'),
    diff: diffDebit === Infinity ? 0 : Math.round(diffDebit),
  };

  return <StatsCard stat={data} />;
}

export function TotalExpenseCard({ transactionList }: CardProp) {
  const totalKreditThisMonth = countAllTransactions(
    filterTransactionsByMonth(
      transactionList,
      'kredit',
      new Date().getMonth() + 1
    ),
    'kredit'
  );
  const totalKreditLastMonth = countAllTransactions(
    filterTransactionsByMonth(
      transactionList,
      'kredit',
      new Date().getMonth() === 0 ? 12 : new Date().getMonth()
    ),
    'kredit'
  );

  const diffDebit =
    ((totalKreditThisMonth - totalKreditLastMonth) / totalKreditLastMonth) *
    100;

  const data = {
    title: 'Total Pengeluaran - Bulan ini',
    icon: 'receipt',
    value: totalKreditThisMonth,
    diff: diffDebit === Infinity ? 0 : Math.round(diffDebit),
  };

  return <StatsCard stat={data} />;
}
