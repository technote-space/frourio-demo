import type { FC, PropsWithChildren } from 'react';
import type { AppProps } from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import { CookiesProvider } from 'react-cookie';
import Head from '~/components/Head';
import { StoreContextProvider } from '~/store';

const SafeHydrate: FC = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  );
};

const MyApp = ({ Component, pageProps }: PropsWithChildren<AppProps>) => <SafeHydrate>
  <CookiesProvider>
    <StoreContextProvider>
      <Head/>
      <CssBaseline/>
      <Component {...pageProps} />
    </StoreContextProvider>
  </CookiesProvider>
</SafeHydrate>;

export default MyApp;
