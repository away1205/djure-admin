import { Button, Modal, NativeSelect, Stack, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store';
import { loadedTransaction } from '../transactionSlice';
import { TransactionType } from '../../../shared/TransactionType';

type TransactionProofProp = {
  opened: boolean;
  onClose: () => void;
};

function TransactionProof({ opened, onClose }: TransactionProofProp) {
  const { transactionData } = useAppSelector((state) => state.transaction);

  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionProof, setTransactionProof] = useState('');
  const [transactionType, setTransactionType] = useState('debit');
  const [transactionDate, setTransactionDate] = useState<Date | null>(
    new Date()
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    const newTransactionData: TransactionType = {
      ...transactionData,
      transactionProof,
      createdAt: transactionDate!.toLocaleString(),
      transactionType,
      description: transactionDescription,
    };

    dispatch(loadedTransaction(newTransactionData));
  }, [
    transactionProof,
    transactionDate,
    transactionType,
    transactionDescription,
    dispatch,
  ]);

  function handleSaveData() {
    onClose();
  }

  return (
    <Modal
      opened={opened}
      onClose={handleSaveData}
      title='Proof of Transaction'
      closeOnClickOutside={false}
    >
      <Stack gap={8}>
        <TextInput
          label='Deskripsi Transaksi'
          placeholder='Deskripsi Transaksi'
          value={transactionDescription}
          onChange={(ev) => setTransactionDescription(ev.currentTarget.value)}
        />

        <TextInput
          label='Link Bukti Nota'
          placeholder='Link Bukti Nota'
          value={transactionProof}
          onChange={(ev) => setTransactionProof(ev.currentTarget.value)}
        />

        <DateInput
          label='Tanggal Transaksi'
          placeholder='Tanggal Transaksi'
          required
          value={transactionDate}
          onChange={setTransactionDate}
        />

        <NativeSelect
          label='Tipe Transaksi'
          data={[
            { label: 'Debit', value: 'debit' },
            { label: 'Kredit', value: 'kredit' },
          ]}
          value={transactionType}
          onChange={(ev) => setTransactionType(ev.currentTarget.value)}
        />
      </Stack>

      <Button onClick={handleSaveData} mt={'1rem'}>
        Simpan
      </Button>
    </Modal>
  );
}

export default TransactionProof;
