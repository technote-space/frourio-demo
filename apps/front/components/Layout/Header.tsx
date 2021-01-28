import type { FC } from 'react';
import type { PageKeys } from '^/_pages';
import { useCallback, useMemo } from 'react';
import { Flex, Image, Button, Link, HStack, Box, IconButton } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatchContext } from '^/store';
import { changePage } from '^/utils/actions';
import pages from '^/_pages';

const Header: FC = () => {
  const { dispatch } = useDispatchContext();
  const { toggleColorMode: toggleMode } = useColorMode();
  const colorModeText = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const menuBgColor = useColorModeValue('green.300', 'green.700');
  const menuHoverBgColor = useColorModeValue('green.400', 'green.600');

  const handleClickTop = useCallback(() => {
    changePage(dispatch, 'top');
  }, []);
  const handleClickAccount = useCallback(() => {
    changePage(dispatch, 'account');
  }, []);
  const NavigationItem: FC<{ page: PageKeys; }> = ({ page }) => {
    const handleClick = useCallback(() => {
      changePage(dispatch, page);
    }, []);
    return useMemo(() => <Link
      onClick={handleClick}
      flexGrow={1}
      p={2}
      bg={menuBgColor}
      _hover={{ bg: menuHoverBgColor }}
    >
      {pages[page].label}
    </Link>, [menuBgColor]);
  };

  return useMemo(() =>
    <>
      <Flex
        as="div"
        align="center"
        w="100%"
        p={8}
      >
        <Link onClick={handleClickTop} marginRight="auto">
          <HStack>
            <Image src="favicon.png" alt="logo"/>
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
        <Button onClick={handleClickAccount}>
          アカウント
        </Button>
      </Flex>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="nowrap"
        textAlign="center"
        w="100%"
        mb={8}
      >
        <NavigationItem page='top'/>
        <NavigationItem page='rooms'/>
        <NavigationItem page='meal'/>
        <NavigationItem page='facility'/>
        <NavigationItem page='price'/>
        <NavigationItem page='info'/>
      </Flex>
    </>, [colorModeText]);
};

export default Header;
