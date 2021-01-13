import type { FC } from 'react';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { client, handleAuthError } from '~/utils/api';
import Login from '~/components/Login';
import { useStoreContext, useDispatchContext } from '~/store';
import { setAdmin } from '~/utils/actions';
import { addDisplayName } from '~/utils/component';
import { makeStyles } from '@material-ui/core/styles';
import { addDays } from 'date-fns';
import useUnmountRef from '~/hooks/useUnmountRef';

const useStyles = makeStyles({
  wrap: {
    width: '100%',
  },
});

export type AuthenticatedPageProps = {
  authToken: string;
  authHeader: { authorization: string };
}

const AuthenticatedPage: (WrappedComponent: FC<AuthenticatedPageProps>) => FC = WrappedComponent => addDisplayName<FC>('AuthenticatedPage', props => {
  const classes = useStyles();
  const unmountRef = useUnmountRef();
  const [{ authToken }, setCookie] = useCookies(['authToken']);
  const { name, page } = useStoreContext();
  const { dispatch } = useDispatchContext();
  const authHeader = { authorization: `Bearer ${authToken}` };

  useEffect(() => {
    if (authToken) {
      setCookie('authToken', authToken, {
        expires: addDays(new Date(), 30),
      });
    }
  }, []);

  useEffect(() => {
    if (authToken && !name) {
      (async() => {
        const admin = await handleAuthError(dispatch, {}, client.admin.get, { headers: authHeader });
        if (!unmountRef.current) {
          setAdmin(dispatch, admin);
        }
      })();
    }
  }, [authToken, name, unmountRef]);

  return <div className={classes.wrap} data-testid={`page-${page}`}>
    {!authToken && <Login {...props} />}
    {authToken && <WrappedComponent authToken={authToken} authHeader={authHeader} {...props} />}
  </div>;
}, WrappedComponent);

export default AuthenticatedPage;
