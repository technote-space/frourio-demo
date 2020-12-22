import React, { ReactChild } from 'react';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { StoreContextProvider } from '~/store';

const Providers = ({ children }: { children: ReactChild }) => <StoreContextProvider>
  <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>
</StoreContextProvider>;

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';

export { customRender as render };
