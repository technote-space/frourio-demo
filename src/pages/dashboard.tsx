import type { FC } from 'react';
import AuthenticatedPage, { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import styles from '~/styles/pages/Dashboard.module.scss';

const Dashboard: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Dashboard');
  return <div className={styles.wrap}>
    Dashboard
  </div>;
};

export default AuthenticatedPage(Dashboard);
