import type { FC } from 'react';
import AuthenticatedPage, { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import useAspidaSWR from '@aspida/swr';
import { apiClient } from '~/utils/apiClient';
import styles from '~/styles/pages/Reservations.module.scss';

const Reservations: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Reservations');
  const { data: reservations, error } = useAspidaSWR(apiClient.reservations, { headers: authHeader });
  return <div className={styles.wrap}>
    {error && <div>failed to load</div>}
    {!error && !reservations && <div>loading...</div>}
    {!error && reservations && reservations.map(reservation => <div key={reservation.id}>
      {reservation.guestId}/{reservation.roomId}/{reservation.status}
    </div>)}
  </div>;
};

export default AuthenticatedPage(Reservations);
