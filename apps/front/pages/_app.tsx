import type { FC, PropsWithChildren } from 'react';
import type { AppProps } from 'next/app';
import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import Head from '^/components/Head';
import { StoreContextProvider } from '^/store';
import config from '^/auth0.json';

const SafeHydrate: FC = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  );
};
const getRedirectUri = () => typeof window === 'undefined' ? '' : window.location.origin;
const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('orange.50', 'gray.800')(props),
      },
    }),
  },
});

const MyApp = ({ Component, pageProps }: PropsWithChildren<AppProps>) => <SafeHydrate>
  <ChakraProvider theme={theme}>
    <Auth0Provider
      {...config}
      redirectUri={getRedirectUri()}
    >
      <StoreContextProvider>
        <Head/>
        <Component {...pageProps} />
      </StoreContextProvider>
    </Auth0Provider>
  </ChakraProvider>
</SafeHydrate>;

export default MyApp;
