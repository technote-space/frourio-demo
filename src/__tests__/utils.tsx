import type { ReactChild, ReactElement } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { CookiesProvider } from 'react-cookie';
import { StoreContextProvider } from '~/store';
import nock from 'nock';
import Cookies from 'universal-cookie';
import '@testing-library/jest-dom';

type ProviderProps = {
  children: ReactChild;
}

const Providers = ({ children }: ProviderProps) => <CookiesProvider>
  <StoreContextProvider>
    <SWRConfig value={{ dedupingInterval: 0 }}>
      {children}
    </SWRConfig>
  </StoreContextProvider>
</CookiesProvider>;

const customRender = (ui: ReactElement, options: RenderOptions = {}) => {
  window.scrollTo = jest.fn();
  return render(ui, {
    wrapper: Providers,
    ...options,
  });
};

export const useNock = (): nock.Scope => {
  nock.disableNetConnect();
  nock.cleanAll();
  return nock('http://localhost:8080/api').defaultReplyHeaders({
    'access-control-allow-origin': '*',
    'access-control-allow-credentials': 'true',
    'access-control-expose-headers': 'Authorization',
  }).persist().options(() => true).reply(204, '', {
    'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'access-control-allow-headers': 'Authorization',
  });
};

export const setupCookie = () => {
  beforeEach(() => {
    const cookieHandler = new Cookies();
    Object.keys(cookieHandler.getAll()).forEach(name => cookieHandler.remove(name));
  });
};

export const setCookie = (name: string, value: any) => {
  const cookieHandler = new Cookies();
  cookieHandler.set(name, value);
};

export const mockStdout = () => {
  console.log = jest.fn();
};

export const findElement = (node: ParentNode, selectors: string): Element | never => {
  const element = node.querySelector(selectors);
  if (element) {
    return element;
  }

  throw new Error(`selectors [${selectors}] not found`);
};

export * from '@testing-library/react';

export { customRender as render };
