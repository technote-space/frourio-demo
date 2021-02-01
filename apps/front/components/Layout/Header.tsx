import type { FC } from 'react';
import type { PageKeys } from '^/_pages';
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Image, Link, HStack, Box, IconButton } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import pages from '^/_pages';

const Header: FC = memo(() => {
  const { toggleColorMode: toggleMode } = useColorMode();
  const colorModeText = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const menuBgColor = useColorModeValue('green.300', 'green.700');
  const menuHoverBgColor = useColorModeValue('green.400', 'green.600');

  const NavigationItem: FC<{ page: PageKeys; }> = ({ page }) => {
    return <Link
      as={RouterLink}
      to={pages[page].path ?? `/${page}`}
      flexGrow={1}
      p={2}
      bg={menuBgColor}
      borderWidth={1}
      _hover={{ bg: menuHoverBgColor }}
    >
      {pages[page].label}
    </Link>;
  };

  return <>
    <Flex
      as="div"
      align="center"
      w="100%"
      p={8}
    >
      <Link as={RouterLink} to="/" marginRight="auto">
        <HStack>
          <Image src="/favicon.png" alt="logo"/>
          <Box>Frourioの宿</Box>
        </HStack>
      </Link>
      <IconButton
        size="md"
        fontSize="lg"
        aria-label={`Switch to ${colorModeText} mode`}
        variant="ghost"
        color="current"
        ml={{ base: '0', md: '3' }}
        onClick={toggleMode}
        icon={<SwitchIcon/>}
      />
      <Link as={RouterLink} to="/account">アカウント</Link>
    </Flex>
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="nowrap"
      textAlign="center"
      w="100%"
      mb={1}
    >
      <NavigationItem page='top'/>
      <NavigationItem page='rooms'/>
      <NavigationItem page='meal'/>
      <NavigationItem page='facility'/>
      <NavigationItem page='info'/>
    </Flex>
  </>;
});

Header.displayName = 'Header';
export default Header;
