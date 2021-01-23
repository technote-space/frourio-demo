import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { client, handleAuthError } from '~/utils/api';
import Login from '~/components/Login';
import { useStoreContext, useDispatchContext } from '~/store';
import useAuthToken from '~/hooks/useAuthToken';
import { setAdmin, tokenRemoved, offRefreshToken } from '~/utils/actions';
import { addDisplayName } from '~/utils/component';
import { makeStyles } from '@material-ui/core/styles';

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
  const [auth, , removeToken] = useAuthToken();
  const { name, page, onRemoveToken, onRefreshToken } = useStoreContext();
  const { dispatch } = useDispatchContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (onRemoveToken) {
      removeToken();
    }
  }, [onRemoveToken]);
  useEffect(() => {
    if (!auth) {
      tokenRemoved(dispatch);
    }
  }, [auth]);
  useEffect(() => {
    if (!isLoading && auth && (onRefreshToken || (!name && !onRemoveToken))) {
      setIsLoading(true);
      (async() => {
        const admin = await handleAuthError(dispatch, {}, client.admin.get, { headers: auth.authHeader });
        if ('name' in admin) {
          setAdmin(dispatch, admin);
        }
        offRefreshToken(dispatch);
        setIsLoading(false);
      })();
    }
  }, [dispatch, auth, name, onRemoveToken, onRefreshToken, isLoading, page]);

  return <div className={classes.wrap} data-testid={`page-${page}`}>
    {(!auth || onRemoveToken) && <Login {...props} />}
    {!(!auth || onRemoveToken) && <WrappedComponent {...auth} {...props} />}
  </div>;
}, WrappedComponent);

export default AuthenticatedPage;
