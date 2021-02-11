import type { PropsWithChildren } from 'react';
import type { AppProps } from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from '~/components/Head';
import { StoreContextProvider } from '~/store';

const MyApp = ({ Component, pageProps }: PropsWithChildren<AppProps>) => typeof window === 'undefined' ? null :
  <StoreContextProvider>
    <Head />
    <CssBaseline />
    <Component {...pageProps} />
  </StoreContextProvider>;

export default MyApp;
