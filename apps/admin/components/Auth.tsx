import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { sleep } from '@frourio-demo/utils/misc';
import useAuthToken from '~/hooks/useAuthToken';
import useUnmountRef from '@technote-space/use-unmount-ref';
import { useDispatchContext, useStoreContext } from '~/store';
import { changePage, logout, offRefreshToken, setAdmin, tokenRemoved } from '~/utils/actions';
import { client, handleAuthError } from '~/utils/api';
import pages from '~/_pages';

const Auth: FC = () => {
  const unmountRef = useUnmountRef();
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
        const admin = await handleAuthError(dispatch, {}, client.get, { headers: auth.authHeader });
        if (!unmountRef.current) {
          if ('name' in admin) {
            setAdmin(dispatch, admin);
          } else {
            await sleep(5000);
          }
          offRefreshToken(dispatch);
          setIsLoading(false);
        }
      })();
    }
  }, [dispatch, auth, name, onRemoveToken, onRefreshToken, isLoading, page]);
  useEffect(() => {
    if (roles && !roles.includes(page)) {
      const available = Object.keys(pages).find(page => roles.includes(page));
      if (available) {
        changePage(dispatch, available);
      } else {
        logout(dispatch);
      }
    }
  }, [roles]);

  return null;
};

export default Auth;
