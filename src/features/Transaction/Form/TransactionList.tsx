import { NumberFormatter, Table, ActionIcon } from '@mantine/core';
import { IconSquareRoundedX } from '@tabler/icons-react';
import { DetailTransactionType } from '../../../shared/TransactionType';
import { useAppDispatch } from '../../../store';
import { deleteNota } from '../transactionSlice';

type TransactionListProp = {
  transactionDetail: DetailTransactionType[];
  isViewer?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TransactionList({
  transactionDetail,
  isViewer = true,
}: TransactionListProp) {
  const dispatch = useAppDispatch();
  const tableHead = ['No.', 'Description', 'Quantity', 'Price', 'Total Price'];

  const totalAllPrice = transactionDetail?.reduce(
    (acc: number, cur: DetailTransactionType) => acc + cur.totalPrice,
    0
  );

  const headRow = tableHead.map((head) => {
    return <Table.Th key={head}>{head}</Table.Th>;
  });

  const tableBody =
    transactionDetail?.length > 0
      ? transactionDetail
      : [
          {
            id: '1',
            description: 'Silahkan Buat Transaksi',
            quantity: 0,
            price: 0,
            totalPrice: 0,
          },
        ];

  const bodyRow = tableBody.map(
    (body: DetailTransactionType, index: number) => {
      return (
        <Table.Tr key={index}>
          <Table.Td>{index + 1}</Table.Td>
          <Table.Td>{body.description}</Table.Td>
          <Table.Td>
            <NumberFormatter thousandSeparator value={body.quantity} />
          </Table.Td>
          <Table.Td>
            <NumberFormatter
              thousandSeparator
              prefix='Rp. '
              value={body.price}
            />
          </Table.Td>
          <Table.Td>
            <NumberFormatter
              thousandSeparator
              prefix='Rp. '
              value={body.totalPrice}
            />
          </Table.Td>

          {isViewer || (
            <Table.Td>
              <ActionIcon
                variant={'subtle'}
                color='red'
                onClick={() => deleteTransaction(index)}
              >
                <IconSquareRoundedX />
              </ActionIcon>
            </Table.Td>
          )}
        </Table.Tr>
      );
    }
  );

  function deleteTransaction(id: number) {
    const filteredNota = tableBody.filter((_, index: number) => index !== id);
    dispatch(deleteNota(filteredNota));
  }

  return (
    <Table
      highlightOnHover
      withTableBorder
      withColumnBorders
      horizontalSpacing={'lg'}
      striped
      // bg={'gray.3'}
    >
      <Table.Thead>
        <Table.Tr>{headRow}</Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {bodyRow}

        {totalAllPrice ? (
          <Table.Tr>
            <Table.Td>Total</Table.Td>
            <Table.Td></Table.Td>
            <Table.Td></Table.Td>
            <Table.Td></Table.Td>
            <Table.Td>
              <NumberFormatter
                thousandSeparator
                prefix='Rp. '
                value={totalAllPrice}
              />
            </Table.Td>
            {isViewer || <Table.Td></Table.Td>}
          </Table.Tr>
        ) : null}
      </Table.Tbody>
    </Table>
  );
}

export default TransactionList;
