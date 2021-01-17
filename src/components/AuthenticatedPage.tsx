import type { FC } from 'react';
import { useEffect } from 'react';
import { client, handleAuthError } from '~/utils/api';
import Login from '~/components/Login';
import { useStoreContext, useDispatchContext } from '~/store';
import useAuthToken from '~/hooks/useAuthToken';
import { setAdmin } from '~/utils/actions';
import { addDisplayName } from '~/utils/component';
import { makeStyles } from '@material-ui/core/styles';
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
  const [auth] = useAuthToken();
  const { name, page } = useStoreContext();
  const { dispatch } = useDispatchContext();

  useEffect(() => {
    if (auth && !name) {
      (async() => {
        const admin = await handleAuthError(dispatch, {}, client.admin.get, { headers: auth.authHeader });
        if ('name' in admin && !unmountRef.current) {
          setAdmin(dispatch, admin);
        }
      })();
    }
  }, [auth, name, unmountRef.current]);

  return <div className={classes.wrap} data-testid={`page-${page}`}>
    {!auth && <Login {...props} />}
    {auth && <WrappedComponent {...auth} {...props} />}
  </div>;
}, WrappedComponent);

export default AuthenticatedPage;
