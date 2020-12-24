import type { FC } from 'react';
import AuthenticatedPage  from '~/components/AuthenticatedPage';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { getClient } from '~/utils/api';
import styles from '~/styles/pages/Reservations.module.scss';

const Reservations: FC = () => {
  console.log('page::Reservations');

  const { dispatch } = useDispatchContext();
  const { data: reservations, error } = useFetch(dispatch, [], getClient().reservations);
  return <div className={styles.wrap}>
    {error && <div>failed to load</div>}
    {!error && !reservations && <div>loading...</div>}
    {!error && reservations && reservations.map(reservation => <div key={reservation.id}>
      {reservation.guestId}/{reservation.roomId}/{reservation.status}
    </div>)}
  </div>;
};

export default AuthenticatedPage(Reservations);
