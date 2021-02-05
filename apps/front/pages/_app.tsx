import type { FC, PropsWithChildren } from 'react';
import type { AppProps } from 'next/app';
import type { AppState } from '@auth0/auth0-react';
import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { Router } from 'react-router-dom';
import Head from '^/components/Head';
import { StoreContextProvider } from '^/store';
import history from '^/utils/history';
import config from '^/auth0.json';

const SafeHydrate: FC = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  );
};
const getRedirectUri = () => typeof window === 'undefined' ? '' : `${window.location.origin}${process.env.BASE_PATH}`;
const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('orange.50', 'gray.800')(props),
      },
      main: {
        width: '100%',
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

const onRedirectCallback = (appState: AppState) => {
  if (appState?.page) {
    history.replace(appState.page);
  }
};

const MyApp = ({ Component, pageProps }: PropsWithChildren<AppProps>) => <SafeHydrate>
  <ChakraProvider theme={theme}>
    <StoreContextProvider>
      <Auth0Provider
        {...config}
        redirectUri={getRedirectUri()}
        onRedirectCallback={onRedirectCallback}
      >
        <Router history={history}>
          <Head/>
          <Component {...pageProps} />
        </Router>
      </Auth0Provider>
    </StoreContextProvider>
  </ChakraProvider>
</SafeHydrate>;

export default MyApp;
