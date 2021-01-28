import type { FC } from 'react';
import type { AuthHeader } from '@frourio-demo/types';
import { useAuth0 } from '@auth0/auth0-react';
import { useStoreContext } from '^/store';
import useAuthToken from '^/hooks/useAuthToken';
import { addDisplayName } from '@frourio-demo/utils/component';

export type AuthenticatedPageProps = {
  authToken: string;
  authHeader: AuthHeader;
}

type Props = {
  page: string;
}

const AuthenticatedPage: (WrappedComponent: FC<AuthenticatedPageProps>) => FC<Props> = WrappedComponent => addDisplayName<FC<Props>>('AuthenticatedPage', props => {
  const [auth] = useAuthToken();
  const { page, onRemoveToken } = useStoreContext();
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect,
  } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (!isAuthenticated) {
    loginWithRedirect().then();
  }

  return <div data-testid={`page-${page}`}>
    {!(!auth || onRemoveToken) && <WrappedComponent {...auth} {...props} />}
  </div>;
}, WrappedComponent);

export default AuthenticatedPage;
