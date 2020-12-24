import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { Heading, Flex } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import { useDispatchContext } from '~/store';
import { openSidebar, changePage } from '~/utils/actions';
import styles from '~/styles/components/Header.module.scss';

const Header: FC = () => {
  const { dispatch }      = useDispatchContext();
  const [{ authToken }]   = useCookies(['authToken']);
  const handleClickToggle = useCallback(() => openSidebar(dispatch), []);
  const handleClickHome   = useCallback(() => changePage(dispatch, 'dashboard'), []);

  return useMemo(() =>
    <Flex
      as="nav"
      wrap="wrap"
      padding="1rem"
      bg="teal.500"
      color="white"
      alignItems="center"
      className={styles.wrap}
    >
      {authToken && <Flex
        mr={5}
        display={{ base: 'block' }}
        onClick={handleClickToggle}
        className={styles.menu}
      >
        <svg
          fill="white"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
        </svg>
      </Flex>}
      <Flex>
        <Heading as="h1" size="lg">
          <div onClick={handleClickHome} className={styles.home}>Home</div>
        </Heading>
      </Flex>
    </Flex>, [authToken]);
};

export default Header;
