import type { FC } from 'react';
import { useCookies } from 'react-cookie';
import CommonPage from '~/components/CommonPage';
import Login from '~/components/Login';
import { addDisplayName } from '~/utils/component';

const AuthenticatedPage: (WrappedComponent: FC) => FC = WrappedComponent => CommonPage(addDisplayName<FC>('AuthenticatedPage', props => {
  const [{ authToken }] = useCookies(['authToken']);
  return typeof window === 'undefined' ? null : <div suppressHydrationWarning>
    {!authToken && <Login {...props} />}
    {authToken && <WrappedComponent {...props} />}
  </div>;
}, WrappedComponent));

export default AuthenticatedPage;
