import type { ReactChild, ReactElement } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { CookiesProvider } from 'react-cookie';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ja } from 'date-fns/locale';
import { StoreContextProvider } from '~/store';
import Layout from '~/components/Layout';

type ProviderOptions = {
  wrapLayout?: boolean;
};

const Providers = (options: ProviderOptions) => ({ children }: { children: ReactChild }) => <CookiesProvider>
  <StoreContextProvider>
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ja}>
      <SWRConfig value={{ dedupingInterval: 0 }}>
        {options.wrapLayout ? <Layout>
          {children}
        </Layout> : { children }}
      </SWRConfig>
    </MuiPickersUtilsProvider>
  </StoreContextProvider>
</CookiesProvider>;

const customRender = (ui: ReactElement, options: ProviderOptions & RenderOptions = {}) => {
  const { wrapLayout, ...renderOptions } = options;

  window.scrollTo = jest.fn();
  return render(ui, {
    wrapper: Providers({
      wrapLayout,
    }),
    ...renderOptions,
  });
};

export * from '@testing-library/react';

export { customRender as render };
