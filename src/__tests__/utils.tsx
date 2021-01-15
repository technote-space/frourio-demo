import type { ReactChild, ReactElement } from 'react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import type { PageKeys } from '~/_pages';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { StoreContextProvider } from '~/store';
import nock from 'nock';
import Index from '~/pages';
import user from '@testing-library/user-event';
import FullCalendar from '~/components/FullCalendar';
import MockFullCalendar from './MockFullCalendar';
import '@testing-library/jest-dom';

jest.mock('~/components/FullCalendar', () => ({
  __esModule: true,
  namedExport: jest.fn(),
  default: jest.fn(),
}));

type ProviderProps = {
  children: ReactChild;
}

const Providers = ({ children }: ProviderProps) => <StoreContextProvider>
  <SWRConfig value={{ dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
</StoreContextProvider>;

const customRender = (ui: ReactElement, options: RenderOptions = {}) => {
  window.scrollTo = jest.fn();
  return render(ui, {
    wrapper: Providers,
    ...options,
  });
};

export const setupNock = () => {
  afterEach(() => {
    nock.abortPendingRequests();
    nock.cleanAll();
  });
};

export const useNock = (): nock.Scope => {
  nock.disableNetConnect();
  return nock('http://localhost:8080/api').persist().defaultReplyHeaders({
    'access-control-allow-origin': '*',
    'access-control-allow-credentials': 'true',
    'access-control-expose-headers': 'Authorization',
  }).options(() => true).reply(204, '', {
    'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'access-control-allow-headers': 'Authorization',
  });
};

export const setupLocalStorage = () => {
  const localStorageMock = jest.fn(() => {
    const store = {};

    return {
      getItem: (key: string): string | null => store[key] || null,
      setItem: (key: string, value: string): void => {
        store[key] = value;
      },
      clear: (): void => {
        Object.keys(store).forEach(key => {
          delete store[key];
        });
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
  afterEach(() => {
    window.localStorage.clear();
  });
};

export const setToken = (token: string) => {
  window.localStorage.setItem('auth-token', JSON.stringify(token));
};
export const setInvalidToken = () => {
  window.localStorage.setItem('auth-token', 'invalid');
};
export const setDarkMode = (mode: boolean) => {
  window.localStorage.setItem('dark-mode-enabled', JSON.stringify(mode));
};

export const mockStdout = () => {
  console.log = jest.fn();
};

export const mockFullCalendar = (start: Date, end: Date, dates: Record<string, Date[]>, events: Record<string, { start: Date; end: Date; }[][]>) => {
  (FullCalendar as jest.Mock).mockImplementation(props => <MockFullCalendar
    start={start}
    end={end}
    dates={dates}
    calendarEvents={events}
    {...props}
  />);
};

export const setupTimers = () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
};

export const findElement = (node: ParentNode, selectors: string): HTMLElement | never => {
  const element = node.querySelector(selectors);
  if (element) {
    return element as HTMLElement;
  }

  /* istanbul ignore next */
  throw new Error(`selectors [${selectors}] not found`);
};

type SetupNock = (scope: nock.Scope) => void;
export const loadPage = async(page: PageKeys, setup: SetupNock): Promise<RenderResult> => {
  setup(useNock()
    .get('/admin').reply(200, { name: 'test name', icon: null })
    .get('/dashboard/rooms').reply(200, [])
    .get(/\/dashboard\/(checkin|checkout)/).reply(200, {
      'data': [],
      'page': 0,
      'totalCount': 0,
    })
    .get(/\/dashboard\/sales/).reply(200, []));
  setToken('token');

  const result = customRender(
    <Index/>,
    {},
  );

  const buttons = result.container.querySelectorAll('header .MuiSvgIcon-root');
  user.click(buttons[0]);
  await result.findByText('test name');
  user.click(result.getByTestId(`menu-item-${page}`));
  await result.findByTestId(`page-${page}`);

  return result;
};

export const setup = () => {
  setupNock();
  setupLocalStorage();
  setupTimers();
  mockStdout();
};

export * from '@testing-library/react';

export { customRender as render };
