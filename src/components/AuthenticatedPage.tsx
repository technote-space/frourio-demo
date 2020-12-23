import type { FC } from 'react';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { getClient } from '~/utils/api';
import CommonPage from '~/components/CommonPage';
import Login from '~/components/Login';
import { useStoreContext, useDispatchContext } from '~/store';
import { addDisplayName } from '~/utils/component';

const AuthenticatedPage: (WrappedComponent: FC) => FC = WrappedComponent => CommonPage(addDisplayName<FC>('AuthenticatedPage', props => {
  const [{ authToken }] = useCookies(['authToken']);
  const { name }        = useStoreContext();
  const { dispatch }    = useDispatchContext();

  useEffect(() => {
    if (authToken && !name) {
      (async() => {
        const admin = await getClient().admin.get();
        dispatch({ type: 'SET_ADMIN', admin: admin.body });
      })();
    }
  }, [authToken, name]);

  return <div suppressHydrationWarning>
    {!authToken && <Login {...props} />}
    {authToken && <WrappedComponent {...props} />}
  </div>;
}, WrappedComponent));

export default AuthenticatedPage;
