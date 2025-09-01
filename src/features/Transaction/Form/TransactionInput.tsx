/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { isNotEmpty, useForm } from '@mantine/form';
import { DetailTransactionType } from '../../../shared/TransactionType';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createNota } from '../transactionSlice';

type TransactionInputProps = {
  onKirimNota: () => void;
};

function TransactionInput({ onKirimNota }: TransactionInputProps) {
  const { transactionData, isLoading, transactionDetail } = useAppSelector(
    (state) => state.transaction
  );
  const dispatch = useAppDispatch();

  const formNota = useForm({
    name: 'form-nota',
    initialValues: {
      description: '',
      quantity: 0,
      price: 0,
      totalPrice: 0,
    },

    validate: {
      description: isNotEmpty('Description cannot be empty'),
      quantity: isNotEmpty('Quantity cannot be empty'),
      price: (value) => (value <= 0 ? 'Must be more than 0' : null),
      totalPrice: (value) => (value <= 0 ? 'Must be more than 0' : null),
    },
  });

  const [isAddForm, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [isKirimNota, { open: onOpenNota, close: onCancelNota }] =
    useDisclosure(false);

  function handleTambahNota(newNota: DetailTransactionType) {
    const updatedNota = {
      ...newNota,
      transactionID: transactionData.id,
    };

    dispatch(createNota(updatedNota));

    formNota.reset();
  }

  return (
    <Stack w={'100%'}>
      {isAddForm ? (
        <Stack gap={0}>
          <Divider my={'sm'} />

          <form onSubmit={formNota.onSubmit((val) => handleTambahNota(val))}>
            <Group wrap={'nowrap'}>
              <TextInput
                label='Description'
                placeholder=''
                {...formNota.getInputProps('description')}
                style={{ flex: '1 1 20%' }}
              />
              <NumberInput
                label='Quantity'
                hideControls
                thousandSeparator
                {...formNota.getInputProps('quantity')}
                w={'10%'}
              />
              <NumberInput
                w={'18%'}
                label='Price'
                hideControls
                placeholder='Rupiah'
                prefix='Rp. '
                thousandSeparator
                {...formNota.getInputProps('price')}
              />
              <NumberInput
                label='Total Price'
                hideControls
                placeholder='Rupiah'
                prefix='Rp. '
                thousandSeparator
                {...formNota.getInputProps('totalPrice')}
              />
            </Group>

            <Group wrap='nowrap' my={'lg'}>
              <Button w={'80%'} type='submit' loading={isLoading}>
                Tambah Nota
              </Button>
              <Button w={'20%'} color='red' onClick={closeForm}>
                Kembali
              </Button>
            </Group>
          </form>
        </Stack>
      ) : (
        <>
          <Group wrap={'nowrap'}>
            <Button onClick={openForm} w={'80%'}>
              Buat Nota
            </Button>
            <Button color='red' onClick={onOpenNota} w={'30%'}>
              Kirim Nota
            </Button>
          </Group>

          <Modal
            opened={isKirimNota}
            onClose={onCancelNota}
            title='Kirim Nota'
            centered
          >
            <Text>
              Apakah anda yakin untuk mengirim nota yang telah anda buat?
            </Text>
            <Group mt={'4rem'}>
              <Button onClick={onCancelNota}>Batalkan</Button>
              <Button
                color='red'
                onClick={() => {
                  onCancelNota();
                  onKirimNota();
                }}
                loading={isLoading}
                disabled={transactionDetail.length === 0}
              >
                Ya, kirim nota
              </Button>
            </Group>
          </Modal>
        </>
      )}
    </Stack>
  );
}

export default TransactionInput;
