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
  const {
          data: checkins,
          error: checkinsError,
        }            = useFetch(dispatch, [], client.dashboard.checkin, { headers: authHeader });
  const {
          data: checkouts,
          error: checkoutsError,
        }            = useFetch(dispatch, [], client.dashboard.checkout, { headers: authHeader });
  const {
          data: dailySales,
          error: dailySalesError,
        }            = useFetch(dispatch, [], client.dashboard.sales.daily, { headers: authHeader });
  const {
          data: monthlySales,
          error: monthlySalesError,
        }            = useFetch(dispatch, [], client.dashboard.sales.monthly, { headers: authHeader });

  return <div className={styles.wrap}>
    {JSON.stringify(checkins)}
    {JSON.stringify(checkouts)}
    {JSON.stringify(dailySales)}
    {JSON.stringify(monthlySales)}
  </div>;
};

export default AuthenticatedPage(Dashboard);
