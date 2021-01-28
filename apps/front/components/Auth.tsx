import { FC, useEffect, useState } from 'react';
import useAuthToken from '^/hooks/useAuthToken';
import useUnmountRef from '^/hooks/useUnmountRef';
import { useDispatchContext, useStoreContext } from '^/store';
import { offRefreshToken, setGuest, setWarning, tokenRemoved } from '^/utils/actions';
import { client, handleAuthError } from '^/utils/api';
import { useAuth0 } from '@auth0/auth0-react';

const Auth: FC = () => {
  const unmountRef = useUnmountRef();
  const [auth, setToken, removeToken] = useAuthToken();
  const { name, page, onRemoveToken, onRefreshToken } = useStoreContext();
  const { dispatch } = useDispatchContext();
  const [isLoading, setIsLoading] = useState(false);

  const {
    isAuthenticated,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && !auth) {
      (async() => {
        const data = await client.login.post({ body: { accessToken: await getAccessTokenSilently() } });
        if (data?.headers?.authorization) {
          setToken(data.headers.authorization);
        } else {
          setWarning(dispatch, 'Login failed');
          logout();
        }
      })();
    }
  }, [auth, isAuthenticated]);

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
        const guest = await handleAuthError(dispatch, {}, client.guest.get, { headers: auth.authHeader });
        if (!unmountRef.current) {
          if ('name' in guest || 'email' in guest) {
            setGuest(dispatch, guest);
          }
          offRefreshToken(dispatch);
          setIsLoading(false);
        }
      })();
    }
  }, [dispatch, auth, name, onRemoveToken, onRefreshToken, isLoading, page]);

  return null;
};

export default Auth;
