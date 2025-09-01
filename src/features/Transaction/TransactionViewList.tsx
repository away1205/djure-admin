import {
  Accordion,
  Button,
  Center,
  Group,
  Loader,
  Menu,
  NumberFormatter,
  Stack,
  Text,
} from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { TransactionType } from '../../shared/TransactionType';

type ListItemProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataList: TransactionType[];
  isLoading: boolean;
  error: string;
  onDeleteItem?: (id: number) => void;
  name: string;
  children?: React.ReactNode;
  isPublic?: boolean;
};

function TransactionViewList({
  dataList,
  isLoading,
  error,
  onDeleteItem,
  name,
  isPublic = false,
}: ListItemProps) {
  function hapusItem(id: number) {
    if (onDeleteItem) {
      onDeleteItem(id);
    }
  }

  function formatDate(date: Date) {
    const createdAt = new Date(date);
    const formattedDate = createdAt.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return formattedDate;
  }

  const sortedObj = [...dataList.map((item) => ({ ...item }))];

  const items = sortedObj.map((item, index) => (
    <Accordion.Item key={item.id} value={`${item.id}`}>
      <Accordion.Control>
        <Group key={index} gap={0} pr={'sm'}>
          <Group gap={'0.6rem'}>
            <Text c={item.transactionType === 'debit' ? 'green' : 'red'}>
              <NumberFormatter
                prefix='Rp. '
                value={item.amount}
                thousandSeparator
              />
            </Text>
            -
            <Text>
              {item.description ? item.description : 'Tidak ada deskripsi'}
            </Text>
          </Group>

          <Text c='dimmed' fz={'sm'} ml={'auto'}>
            {formatDate(new Date(item.createdAt))}
          </Text>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack>
          <Text c={'dimmed'} fz={'sm'}>
            TX: {item.id}
          </Text>

          <Group>
            <NavLink to={`/dashboard/transaction/${item.id}`}>
              <Button w={'fit-content'}>Detail {name}</Button>
            </NavLink>

            {!isPublic && (
              <Menu
                withArrow
                offset={10}
                trigger={'click'}
                openDelay={200}
                closeDelay={400}
              >
                <Menu.Target>
                  <Button w={'fit-content'} color='red'>
                    Hapus {name}
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Button
                    color='red'
                    onClick={() => hapusItem(item.id)}
                    loading={isLoading}
                  >
                    Hapus ID:{item.id}
                  </Button>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return isLoading ? (
    <Center m={20}>
      {error ? <Text>{error}</Text> : <Loader color='blue' size='xl' />}
    </Center>
  ) : dataList.length === 0 ? (
    <Text>There is no transaction</Text>
  ) : (
    <Accordion variant='contained'>{items}</Accordion>
  );
}

export default TransactionViewList;
