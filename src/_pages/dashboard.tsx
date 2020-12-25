import type { FC } from 'react';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { client } from '~/utils/api';

const Dashboard: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Dashboard');

  const { dispatch } = useDispatchContext();
  const checkins     = useFetch(dispatch, [], client.dashboard.checkin, { headers: authHeader });
  const checkouts    = useFetch(dispatch, [], client.dashboard.checkout, { headers: authHeader });
  const dailySales   = useFetch(dispatch, [], client.dashboard.sales.daily, { headers: authHeader });
  const monthlySales = useFetch(dispatch, [], client.dashboard.sales.monthly, { headers: authHeader });

  return <div>
    {JSON.stringify(checkins.data)}
    {JSON.stringify(checkouts.data)}
    {JSON.stringify(dailySales.data)}
    {JSON.stringify(monthlySales.data)}
  </div>;
};

export default AuthenticatedPage(Dashboard);
