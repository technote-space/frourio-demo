import { useCallback, useState, useEffect } from 'react';
import useLocalStorage from '~/hooks/useLocalStorage';

type AuthValue = {
  authToken: string;
  authHeader: { authorization: string };
}

const useAuthToken = (): [AuthValue | undefined, (value: string) => void, () => void] => {
  const getAuth = token => token ? { authToken: token, authHeader: { authorization: `Bearer ${token}` } } : undefined;
  const [token, setToken] = useLocalStorage('auth-token', '');
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
