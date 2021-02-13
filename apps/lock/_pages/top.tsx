import type { FC } from 'react';
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Link, IconButton } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

const Top: FC = memo(() => {
  const { toggleColorMode: toggleMode } = useColorMode();
  const colorModeText = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return <Flex grow={1}>
    <Flex grow={1}>
      <Box maxW="1000px" margin="auto" fontSize="2rem">
        <IconButton
          size="md"
          fontSize="lg"
          aria-label={`Switch to ${colorModeText} mode`}
          variant="ghost"
          color="current"
          mr={{ base: '0', md: '3' }}
          onClick={toggleMode}
          icon={<SwitchIcon />}
          minW={'auto'}
        />
        <Box>
          <Link as={RouterLink} to={`${process.env.BASE_PATH}/rooms`} marginRight="auto">Rooms</Link>
        </Box>
      </Box>
    </Flex>
  </Flex>;
});

Top.displayName = 'Top';
export default Top;
