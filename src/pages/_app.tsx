import { FC, PropsWithChildren } from 'react';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import '~/styles/globals.css';
import { StoreContextProvider } from '~/store';

const MyApp: FC<AppProps> = ({ Component, pageProps }: PropsWithChildren<AppProps>) =>
  <ChakraProvider>
    <StoreContextProvider>
      <Component {...pageProps} />
    </StoreContextProvider>
  </ChakraProvider>;

export default MyApp;
