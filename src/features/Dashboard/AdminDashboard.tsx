import { AppShell, Burger, Group, Stack, Text } from '@mantine/core';
import { Navbar } from './Navbar';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Outlet, useLocation } from 'react-router-dom';
import StatsDashboard from './StatsDashboard';

function AdminDashboard() {
  const [opened, { toggle }] = useDisclosure();
  const { pathname } = useLocation();
  const isDashboard = pathname === '/dashboard';
  const isMobile = useMediaQuery('(max-width: 36em)');

  return (
    <AppShell
      navbar={{
        width: '80',
        breakpoint: 'xs',
        collapsed: { mobile: !opened },
      }}
      header={{ height: 50, collapsed: !isMobile }}
    >
      {/* {isMobile && (
        
      )} */}

      <AppShell.Header>
        <Group h={'100%'} align='center' gap={8}>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />

          {!opened && (
            <>
              <img src='/logo-rccd.png' width={'25px'} />
              <Text>RCCD 12</Text>
            </>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main>
        {isDashboard && (
          <Stack h={'100vh'} px={'4rem'} py={'2rem'} gap={'xl'}>
            <StatsDashboard />
          </Stack>
        )}

        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default AdminDashboard;
