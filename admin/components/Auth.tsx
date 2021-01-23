import { FC, useEffect, useState } from 'react';
import useAuthToken from '~/hooks/useAuthToken';
import { useDispatchContext, useStoreContext } from '~/store';
import { changePage, logout, offRefreshToken, setAdmin, tokenRemoved } from '~/utils/actions';
import { client, handleAuthError } from '~/utils/api';
import pages from '~/_pages';

const Auth: FC = () => {
  const [auth, , removeToken] = useAuthToken();
  const { name, page, roles, onRemoveToken, onRefreshToken } = useStoreContext();
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
  useEffect(() => {
    if (roles) {
      if (!(page in roles)) {
        const available = Object.keys(pages).find(page => roles.includes(page));
        if (available) {
          changePage(dispatch, available);
        } else {
          logout(dispatch);
        }
      }
    }
  }, [roles]);

  return null;
};

export default Auth;
