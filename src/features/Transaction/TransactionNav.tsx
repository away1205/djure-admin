import { Button, Center, Stack, Text } from '@mantine/core';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

function TransactionNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isOnPage = pathname === '/dashboard/transaction';

  return (
    <>
      {isOnPage && (
        <Center h={'100vh'}>
          <Stack>
            <Button onClick={() => navigate('create')}>Tambah Transaksi</Button>
            <Text ta={'center'}>Atau</Text>
            <Button onClick={() => navigate('view')}>
              Lihat Daftar Transaksi
            </Button>
          </Stack>
        </Center>
      )}

      <Outlet />
    </>
  );
}

export default TransactionNav;
