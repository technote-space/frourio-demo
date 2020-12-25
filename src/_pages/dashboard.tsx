import type { FC } from 'react';
import { AuthenticatedPage } from '~/components/Page';
import type { AuthenticatedPageProps } from '~/components/Page';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { client } from '~/utils/api';
import styles from '~/styles/pages/Dashboard.module.scss';

const Dashboard: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Dashboard');

  const { dispatch } = useDispatchContext();
  const checkins     = useFetch(dispatch, [], client.dashboard.checkin, { headers: authHeader });
  const checkouts    = useFetch(dispatch, [], client.dashboard.checkout, { headers: authHeader });
  const dailySales   = useFetch(dispatch, [], client.dashboard.sales.daily, { headers: authHeader });
  const monthlySales = useFetch(dispatch, [], client.dashboard.sales.monthly, { headers: authHeader });

  return <div className={styles.wrap}>
    {JSON.stringify(checkins.data)}
    {JSON.stringify(checkouts.data)}
    {JSON.stringify(dailySales.data)}
    {JSON.stringify(monthlySales.data)}
  </div>;
};

export default AuthenticatedPage(Dashboard);
