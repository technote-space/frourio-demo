import type { FC } from 'react';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import useAspidaSWR from '@aspida/swr';
import { apiClient } from '~/utils/apiClient';
import styles from '~/styles/pages/Rooms.module.scss';

const Rooms: FC = () => {
  console.log('page::Rooms');
  const { data: rooms, error } = useAspidaSWR(apiClient.rooms);
  return <div className={styles.wrap}>
    {error && <div>failed to load</div>}
    {!error && !rooms && <div>loading...</div>}
    {!error && rooms && rooms.map(room => <div key={room.id}>
      {room.name}/{room.number}/{room.price}
    </div>)}
  </div>;
};

export default AuthenticatedPage(Rooms);
