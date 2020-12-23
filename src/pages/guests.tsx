import type { FC } from 'react';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import useAspidaSWR from '@aspida/swr';
import { apiClient } from '~/utils/apiClient';
import styles from '~/styles/pages/Guests.module.scss';

const Guests: FC = () => {
  console.log('page::Guests');
  const { data: guests, error } = useAspidaSWR(apiClient.rooms);
  return <div className={styles.wrap}>
    {error && <div>failed to load</div>}
    {!error && !guests && <div>loading...</div>}
    {!error && guests && guests.map(guest => <div key={guest.id}>
      {guest.id}
    </div>)}
  </div>;
};

export default AuthenticatedPage(Guests);
