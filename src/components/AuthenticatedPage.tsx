import type { FC } from 'react';
import { parseCookies } from 'nookies';
import CommonPage from '~/components/CommonPage';
import Login from '~/components/Login';
import { addDisplayName } from '~/utils/component';

const AuthenticatedPage: (WrappedComponent: FC) => FC = WrappedComponent => CommonPage(addDisplayName<FC>('AuthenticatedPage', props => {
  const cookies = parseCookies();
  return <>
    {!cookies.authToken && <Login {...props} />}
    {cookies.authToken && <WrappedComponent {...props} />}
  </>;
}, WrappedComponent));

export default AuthenticatedPage;
