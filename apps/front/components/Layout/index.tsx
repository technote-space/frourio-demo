import type { ReactNode } from 'react';
import { useMemo } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Flex } from '@chakra-ui/react';

type Props = {
  children?: ReactNode
}

const Layout = ({ children }: Props) => useMemo(() =>
  <Flex
    direction="column"
    align="center"
    maxW={{ xl: '1000px' }}
    m="0 auto"
    minHeight="100vh"
  >
    <Header/>
    <Flex grow={1} width="100%">
      <main>
        {children}
      </main>
    </Flex>
    <Footer/>
  </Flex>, []);

export default Layout;
