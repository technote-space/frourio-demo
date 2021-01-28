import type { FC } from 'react';
import type { AuthenticatedPageProps } from '^/components/AuthenticatedPage';
import AuthenticatedPage from '^/components/AuthenticatedPage';

const Account: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  return <div>Account</div>;
};

export default AuthenticatedPage(Account);
