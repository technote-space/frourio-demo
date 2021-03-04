import type { AuthHeader } from '@frourio-demo/types';
import { useCallback, useState, useEffect } from 'react';
import { useStoreContext, useDispatchContext } from '^/store';
import useLocalStorage from '@technote-space/use-local-storage';

type AuthValue = {
  authToken: string;
  authHeader: AuthHeader;
}

const useAuthToken = (): [AuthValue | undefined, (value: string) => void, () => void] => {
  const getAuth = token => token ? { authToken: token, authHeader: { authorization: `Bearer ${token}` } } : undefined;
  const { dispatch } = useDispatchContext();
  const { localStorage } = useStoreContext();
  const [token, setToken] = useLocalStorage('auth-token-front', '', {
    storage: localStorage,
    onChanged: (key, value) => {
      dispatch({ type: 'LOCAL_STORAGE_CHANGED', key, value });
    },
  });
  const [auth, setAuth] = useState<AuthValue | undefined>(getAuth(token));
  const removeToken = useCallback(() => {
    setToken('');
  }, []);

  useEffect(() => {
    setAuth(getAuth(token));
  }, [token]);

  return [auth, setToken, removeToken];
};

export default useAuthToken;
