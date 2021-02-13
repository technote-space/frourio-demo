import type { FC, PropsWithChildren } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { Router } from 'react-router-dom';
import Head from '#/components/Head';
import { StoreContextProvider } from '#/store';
import history from '#/utils/history';

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('orange.50', 'gray.800')(props),
      },
      main: {
        width: '100%',
        display: 'flex',
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'teal',
      },
      sizes: {
        xs: { minW: 120 },
        sm: { minW: 120 },
        md: { minW: 120 },
        lg: { minW: 120 },
      },
    },
  },
});

const SafeHydrate: FC = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  );
};

const MyApp = ({ Component, pageProps }: PropsWithChildren<AppProps>) => <SafeHydrate>
  <ChakraProvider theme={theme}>
    <StoreContextProvider>
      <Router history={history}>
        <Head />
        <Component {...pageProps} />
      </Router>
    </StoreContextProvider>
  </ChakraProvider>
</SafeHydrate>;

export default MyApp;
