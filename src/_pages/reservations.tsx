import type { FC } from 'react';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { client } from '~/utils/api';

const Reservations: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Reservations');

  const { dispatch }                  = useDispatchContext();
  const { data: reservations, error } = useFetch(dispatch, [], client.reservations, { headers: authHeader });
  return <div>
    {error && <div>failed to load</div>}
    {!error && !reservations && <div>loading...</div>}
    {!error && reservations && reservations.map(reservation => <div key={reservation.id}>
      {JSON.stringify(reservation)}
    </div>)}
  </div>;
};

export default AuthenticatedPage(Reservations);
