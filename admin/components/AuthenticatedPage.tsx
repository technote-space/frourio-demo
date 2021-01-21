import type { FC } from 'react';
import { useEffect } from 'react';
import { client, handleAuthError } from '~/utils/api';
import Login from '~/components/Login';
import { useStoreContext, useDispatchContext } from '~/store';
import useAuthToken from '~/hooks/useAuthToken';
import { setAdmin, tokenRemoved } from '~/utils/actions';
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
  const [auth, , removeToken] = useAuthToken();
  const { name, page, onRemoveToken } = useStoreContext();
  const { dispatch } = useDispatchContext();

  useEffect(() => {
    if (onRemoveToken) {
      if (auth) {
        removeToken();
      } else {
        tokenRemoved(dispatch);
      }
    }
  }, [onRemoveToken]);
  useEffect(() => {
    if (!auth) {
      tokenRemoved(dispatch);
    }
  }, [auth]);
  useEffect(() => {
    if (auth && !name && !onRemoveToken) {
      (async() => {
        const admin = await handleAuthError(dispatch, {}, client.admin.get, { headers: auth.authHeader });
        if ('name' in admin && !unmountRef.current) {
          setAdmin(dispatch, admin);
        }
      })();
    }
  }, [auth, name, onRemoveToken, unmountRef.current]);

  return <div className={classes.wrap} data-testid={`page-${page}`}>
    {(!auth || onRemoveToken) && <Login {...props} />}
    {!(!auth || onRemoveToken) && <WrappedComponent {...auth} {...props} />}
  </div>;
}, WrappedComponent);

export default AuthenticatedPage;
