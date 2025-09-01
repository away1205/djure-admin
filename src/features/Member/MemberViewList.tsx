import {
  ActionIcon,
  Center,
  Group,
  Loader,
  Table,
  Text,
  Tooltip,
  rem,
} from '@mantine/core';
import { IconTrash, IconUserSearch } from '@tabler/icons-react';
import { MemberType } from '../../shared/MemberType';
import { useNavigate } from 'react-router-dom';

type ListItemProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataList: MemberType[];
  isLoading: boolean;
  error: string;
  onDeleteItem?: (id: number) => void;
  name: string;
  children?: React.ReactNode;
  isPublic?: boolean;
};

const headerData = [
  'No.',
  'Nama',
  'Angkatan',
  'Telephone',
  'Email',
  'Pekerjaan',
  'Golongan Darah',
  'In Group',
];

function MemberViewList({
  dataList,
  isLoading,
  error,
  onDeleteItem,
  isPublic = false,
}: ListItemProps) {
  const navigate = useNavigate();

  function hapusItem(id: number) {
    if (onDeleteItem) {
      onDeleteItem(id);
    }
  }

  const sortedObj = [...dataList.map((item) => ({ ...item }))];

  const headerList = headerData.map((header, index) => {
    return <Table.Td key={index}>{header}</Table.Td>;
  });

  const bodyList = sortedObj.map((obj, index) => {
    return (
      <Table.Tr key={obj.id}>
        <Table.Td>{index + 1}.</Table.Td>
        <Table.Td>{obj.fullname}</Table.Td>
        <Table.Td>{obj.generation}</Table.Td>
        <Table.Td>{obj.phoneNumber}</Table.Td>
        <Table.Td>{obj.email}</Table.Td>

        <Table.Td>{obj.occupation}</Table.Td>

        <Table.Td>{obj.bloodType ? obj.bloodType : 'Tidak Tahu'}</Table.Td>
        <Table.Td>{obj.inGroup ? 'Ya' : 'Tidak'}</Table.Td>

        <Table.Td w={isPublic ? '20px' : '90px'}>
          <Group gap={4} justify='flex-start' w={'fit-content'}>
            <Tooltip label={`Lihat lebih detail`}>
              <ActionIcon
                variant='subtle'
                color='gray'
                onClick={() => navigate(`/dashboard/member/${obj.id}`)}
              >
                <IconUserSearch
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={3}
                />
              </ActionIcon>
            </Tooltip>

            {isPublic || (
              <Tooltip label={`Hapus ${obj.fullname}`}>
                <ActionIcon
                  variant='subtle'
                  color='red'
                  onClick={() => hapusItem(obj.id!)}
                >
                  <IconTrash
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return isLoading ? (
    <Center m={20}>
      {error ? <Text>{error}</Text> : <Loader color='blue' size='xl' />}
    </Center>
  ) : dataList.length === 0 ? (
    <Text>There is no member</Text>
  ) : (
    <Table
      stickyHeader
      stickyHeaderOffset={60}
      striped
      highlightOnHover
      withColumnBorders
      // w={'fit-content'}
    >
      <Table.Thead>
        <Table.Tr>
          {headerList}
          <Table.Td></Table.Td>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>{bodyList}</Table.Tbody>
    </Table>
  );
}

export default MemberViewList;
