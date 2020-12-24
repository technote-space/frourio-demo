import type { FC } from 'react';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { client, handleAuthError } from '~/utils/api';
import CommonPage from '~/components/CommonPage';
import Login from '~/components/Login';
import { useStoreContext, useDispatchContext } from '~/store';
import { addDisplayName } from '~/utils/component';

export type AuthenticatedPageProps = {
  authToken: string;
  authHeader: { authorization: string };
}

const AuthenticatedPage: (WrappedComponent: FC<AuthenticatedPageProps>) => FC = WrappedComponent => CommonPage(addDisplayName<FC>('AuthenticatedPage', props => {
  const [{ authToken }] = useCookies(['authToken']);
  const { name }        = useStoreContext();
  const { dispatch }    = useDispatchContext();
  const authHeader      = { authorization: `Bearer ${authToken}` };

  useEffect(() => {
    if (authToken && !name) {
      (async() => {
        const admin = await handleAuthError(dispatch, {}, client.admin.get, { headers: authHeader });
        dispatch({ type: 'SET_ADMIN', admin });
      })();
    }
  }, [authToken, name]);

  return <div suppressHydrationWarning>
    {!authToken && <Login {...props} />}
    {authToken && <WrappedComponent authToken={authToken} authHeader={authHeader} {...props} />}
  </div>;
}, WrappedComponent));

export default AuthenticatedPage;
