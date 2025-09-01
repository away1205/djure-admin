import {
  Divider,
  Group,
  NativeSelect,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../store';

// import StatsCard from '../../UI/StatsCard';
import { deleteMemberList, filterMember, loadedMember } from './memberSlice';
import MemberViewList from './MemberViewList';

function MemberView() {
  const { isLoading, error, memberList } = useAppSelector(
    (state) => state.member
  );

  const [filter, setFilter] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const dispatch = useAppDispatch();

  const filterType = [
    { label: 'All Members', value: '' },
    { label: 'Filter by Name', value: 'fullname' },
    { label: 'Filter by Angkatan', value: 'generation' },
    { label: 'Filter by Golongan darah', value: 'bloodType' },
  ];

  useEffect(() => {
    if (filter !== '') {
      dispatch(
        filterMember(
          filter,
          filter === 'generation' ? Number(filterValue) : filterValue
        )
      );
      return;
    }

    dispatch(loadedMember());
  }, [dispatch, filter, filterValue]);

  function deleteMember(id: number) {
    dispatch(deleteMemberList(id));
  }

  return (
    <Stack p={'2rem'}>
      <Title>Daftar Anggota</Title>

      <Divider />

      <Group>
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

      <Divider size={'xs'} />

      <MemberViewList
        isLoading={isLoading}
        error={error}
        dataList={memberList}
        name='Anggota'
        onDeleteItem={deleteMember}
      />
    </Stack>
  );
}

export default MemberView;
