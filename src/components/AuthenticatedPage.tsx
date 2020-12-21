import type { FC } from 'react';
import CommonPage from '~/components/CommonPage';
import useAuthToken from '~/hooks/useAuthToken';
import { getDisplayName } from '~/utils/component';

export type AuthenticatedPageProps = {
  authToken: string;
  authHeader: { authorization: string };
}

const AuthenticatedPage: (WrappedComponent: FC<AuthenticatedPageProps>) => FC = WrappedComponent => {
  const Component: FC   = props => {
    const authToken = useAuthToken();
    return <>
      {authToken && <WrappedComponent authToken={authToken} authHeader={{ authorization: authToken }} {...props} />}
    </>;
  };
  Component.displayName = getDisplayName('AuthenticatedPage', WrappedComponent);
  return CommonPage(Component);
};

export default AuthenticatedPage;
