import type { FC } from 'react';
import CommonPage from '~/components/CommonPage';
import Login from '~/components/Login';
import { getDisplayName } from '~/utils/component';
import { useStoreContext } from '~/store';

export type AuthenticatedPageProps = {
  authToken: string;
  authHeader: { authorization: string };
}

const AuthenticatedPage: (WrappedComponent: FC<AuthenticatedPageProps>) => FC = WrappedComponent => {
  const Component: FC   = props => {
    const { authToken } = useStoreContext();

    return <>
      {!authToken && <Login {...props} />}
      {authToken && <WrappedComponent authToken={authToken} authHeader={{ authorization: authToken }} {...props} />}
    </>;
  };
  Component.displayName = getDisplayName('AuthenticatedPage', WrappedComponent);

  return CommonPage(Component);
};

export default AuthenticatedPage;
