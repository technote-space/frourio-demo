import { FC } from 'react';
import AuthenticatedPage, { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import useAspidaSWR from '@aspida/swr';
import { apiClient } from '~/utils/apiClient';
import styles from '~/styles/pages/Rooms.module.scss';

const Rooms: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  const { data: rooms, error } = useAspidaSWR(apiClient.rooms, { headers: authHeader });
  return <div className={styles.wrap}>
    {error && <div>failed to load</div>}
    {!error && !rooms && <div>loading...</div>}
    {!error && rooms && rooms.map(room => <div key={room.id}>
      {room.name}/{room.number}/{room.price}
    </div>)}
  </div>;
};

export default AuthenticatedPage(Rooms);
