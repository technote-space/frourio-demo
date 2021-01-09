import type { ReactChild, ReactElement } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { CookiesProvider } from 'react-cookie';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ja } from 'date-fns/locale';
import { StoreContextProvider } from '~/store';
import nock from 'nock';
import Cookies from 'universal-cookie';
import '@testing-library/jest-dom';

type ProviderProps = {
  children: ReactChild;
}

const Providers = ({ children }: ProviderProps) => <CookiesProvider>
  <StoreContextProvider>
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ja}>
      <SWRConfig value={{ dedupingInterval: 0 }}>
        {children}
      </SWRConfig>
    </MuiPickersUtilsProvider>
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

export * from '@testing-library/react';

export { customRender as render };
