import React, { ReactChild } from 'react';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';
import * as router from 'next/router';
import { NextRouter } from 'next/router';

const Providers = ({ children }: { children: ReactChild }) => (
  <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>
);

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';

export { customRender as render };

export const mockRouter = () => {
  const routerMock: NextRouter = {
    route: '',
    pathname: '',
    query: {},
    asPath: '',
    basePath: '',
    push: jest.fn(() => Promise.resolve(true)),
    replace: jest.fn(() => Promise.resolve(true)),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(() => Promise.resolve()),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
  };
  jest.mock('next/router');
  jest.spyOn(router, 'useRouter').mockImplementation(() => routerMock);
  return routerMock;
};
