import type { FC } from 'react';
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useAuthToken from '^/hooks/useAuthToken';
import { useDispatchContext, useStoreContext } from '^/store';
import { offRefreshToken, setGuest, setWarning, tokenRemoved } from '^/utils/actions';
import { client } from '^/utils/api';
import useFetch from '^/hooks/useFetch';

const Auth: FC = () => {
  const [auth, setToken, removeToken] = useAuthToken();
  const { onRemoveToken, onRefreshToken } = useStoreContext();
  const { dispatch } = useDispatchContext();
  const guest = useFetch(dispatch, {}, client.guest, { headers: auth?.authHeader!, enabled: !!auth });

  const {
    isLoading: isAuth0Loading,
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
    if (onRemoveToken || (!isAuth0Loading && !isAuthenticated)) {
      removeToken();
    }
  }, [onRemoveToken, isAuth0Loading, isAuthenticated]);
  useEffect(() => {
    if (!auth) {
      tokenRemoved(dispatch);
    }
  }, [auth]);
  useEffect(() => {
    if (onRefreshToken) {
      offRefreshToken(dispatch);
      guest.revalidate().then();
    }
  }, [onRefreshToken]);
  useEffect(() => {
    if (guest.data) {
      setGuest(dispatch, guest.data);
    }
  }, [guest.data]);

  return null;
};

export default Auth;
