import type { ReactNode } from 'react';
import { memo } from 'react';
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
  <Flex grow={1} width="100%">
    <main>
      {children}
    </main>
  </Flex>
</Flex>);

Layout.displayName = 'Layout';
export default Layout;
