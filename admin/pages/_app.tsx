import type { FC, PropsWithChildren } from 'react';
import type { AppProps } from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
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
  <StoreContextProvider>
    <Head/>
    <CssBaseline/>
    <Component {...pageProps} />
  </StoreContextProvider>
</SafeHydrate>;

export default MyApp;
