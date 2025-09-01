import { TransactionType } from '../shared/TransactionType';

export function filterTransactionsByMonth(
  transactions: TransactionType[],
  type: 'debit' | 'kredit',
  month: number
) {
  return transactions.filter((transaction) => {
    // Convert the createdAt string to a Date object
    const transactionDate = new Date(transaction.createdAt);

    // Check if the transaction is in the specified year and month
    return (
      transaction.transactionType === type &&
      transactionDate.getMonth() === month - 1 // JavaScript months are 0-based
    );
  });
}

export function countAllTransactions(
  transactions: TransactionType[],
  type: 'debit' | 'kredit'
) {
  if (type === 'debit')
    return transactions
      .filter((transaction) => transaction.transactionType === 'debit')
      .reduce((acc, cur) => acc + cur.amount, 0);

  return transactions
    .filter((transaction) => transaction.transactionType === 'kredit')
    .reduce((acc, cur) => acc + cur.amount, 0);
}
