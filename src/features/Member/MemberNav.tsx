import { Button, Center, Stack, Text } from '@mantine/core';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

function MemberNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isOnPage = pathname === '/dashboard/member';

  return (
    <>
      {isOnPage && (
        <Center h={'100vh'}>
          <Stack>
            <Button onClick={() => navigate('create')}>Tambah Anggota</Button>
            <Text ta={'center'}>Atau</Text>
            <Button onClick={() => navigate('view')}>
              Lihat Daftar Anggota
            </Button>
          </Stack>
        </Center>
      )}

      <Outlet />
    </>
  );
}

export default MemberNav;
