import type { FC } from 'react';
import type { AuthHeader } from '@frourio-demo/types';
import { useAuth0 } from '@auth0/auth0-react';
import { HStack, Box, Spinner } from '@chakra-ui/react';
import { useStoreContext } from '^/store';
import useAuthToken from '^/hooks/useAuthToken';
import { addDisplayName } from '@frourio-demo/utils/component';

export type AuthenticatedPageProps = {
  authToken: string;
  authHeader: AuthHeader;
}

const AuthenticatedPage: (WrappedComponent: FC<AuthenticatedPageProps>) => FC = WrappedComponent => addDisplayName<FC>('AuthenticatedPage', props => {
  const [auth] = useAuthToken();
  const { onRemoveToken } = useStoreContext();
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect,
  } = useAuth0();

  if (isLoading) {
    return <HStack>
      <Box>Loading...</Box>
      <Box><Spinner/></Box>
    </HStack>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { page: window.location.pathname },
    }).then();
  }

  return <>
    {!(!auth || onRemoveToken || !isAuthenticated) && <WrappedComponent {...auth} {...props} />}
  </>;
}, WrappedComponent);

export default AuthenticatedPage;
