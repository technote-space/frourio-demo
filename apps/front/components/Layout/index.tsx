import type { ReactNode } from 'react';
import { memo } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Flex } from '@chakra-ui/react';

type Props = {
  children?: ReactNode
}

const Layout = memo(({ children }: Props) => <Flex
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
</Flex>);

Layout.displayName = 'Layout';
export default Layout;
