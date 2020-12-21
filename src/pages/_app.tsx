import { FC, PropsWithChildren } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';
import { extendTheme } from '@chakra-ui/react';
import '~/styles/globals.css';
import { StoreContextProvider } from '~/store';

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};

const breakpoints = createBreakpoints({
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
});

const theme = extendTheme({ colors, breakpoints });

const MyApp: FC<AppProps> = ({ Component, pageProps }: PropsWithChildren<AppProps>) =>
  <ChakraProvider theme={theme}>
    <StoreContextProvider>
      <Head>
        <title>frourio-todo-app</title>
        <link rel="icon" href="/favicon.png"/>
      </Head>
      <Component {...pageProps} />
    </StoreContextProvider>
  </ChakraProvider>;

export default MyApp;
