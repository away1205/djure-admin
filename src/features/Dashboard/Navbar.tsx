import { useEffect, useState } from 'react';
import {
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  Text,
  Group,
} from '@mantine/core';
import {
  IconHome2,
  // IconGauge,
  // IconDeviceDesktopAnalytics,
  // IconFingerprint,
  // IconCalendarStats,
  IconUserPlus,
  // IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconCash,
} from '@tabler/icons-react';
import classes from './Navbar.module.css';
import { useMediaQuery } from '@mantine/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { logoutAdmin } from '../Authentication/authSlice';
import linkContainsString from '../../utils/linkContainString';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const isMobile = useMediaQuery('(max-width: 36em)');

  return (
    <Group wrap='nowrap' w={'max-content'}>
      <Tooltip label={label} position='right' transitionProps={{ duration: 0 }}>
        <UnstyledButton
          onClick={onClick}
          className={classes.link}
          data-active={active || undefined}
        >
          <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        </UnstyledButton>
      </Tooltip>

      {isMobile && <Text>{label}</Text>}
    </Group>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home', link: '/dashboard' },
  // { icon: IconGauge, label: 'Dashboard', link: 'dashboard' },
  { icon: IconCash, label: 'Transaction', link: 'transaction' },
  { icon: IconUserPlus, label: 'Member', link: 'member' },
  // { icon: IconSettings, label: 'Settings', link: 'settings' },
  // { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  // { icon: IconCalendarStats, label: 'Releases' },
  // { icon: IconFingerprint, label: 'Security' },
];

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const { pathname } = useLocation();

  useEffect(() => {
    mockdata.map((link, index) => {
      const isActive = linkContainsString(pathname, link.link);
      if (isActive) setActive(index);
    });
  }, [pathname]);

  const links = mockdata.map((link, index) => {
    return (
      <NavbarLink
        {...link}
        key={link.label}
        active={index === active}
        onClick={() => {
          navigate(link.link!);
        }}
      />
    );
  });

  function handleLogout() {
    dispatch(logoutAdmin());
  }

  return (
    <nav className={classes.navbar}>
      <Center>
        <img src='/logo-rccd.png' width={'30px'} />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify='center' gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify='center' gap={0}>
        <NavbarLink
          icon={IconSwitchHorizontal}
          label='Change account (coming soon)'
        />
        <NavbarLink icon={IconLogout} label='Logout' onClick={handleLogout} />
      </Stack>
    </nav>
  );
}
