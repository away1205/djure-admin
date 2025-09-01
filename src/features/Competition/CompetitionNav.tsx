import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@mantine/core';

export default function CompetitionNav() {
    
  return (
    <Flex h="100vh">
      <Box style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Flex>
  );
}
