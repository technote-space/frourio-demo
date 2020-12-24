import type { FC } from 'react';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { getClient } from '~/utils/api';
import styles from '~/styles/pages/Rooms.module.scss';

const Rooms: FC = () => {
  console.log('page::Rooms');

  const { dispatch }           = useDispatchContext();
  const { data: rooms, error } = useFetch(dispatch, [], getClient().rooms);
  return <div className={styles.wrap}>
    {error && <div>failed to load</div>}
    {!error && !rooms && <div>loading...</div>}
    {!error && rooms && rooms.map(room => <div key={room.id}>
      {room.name}/{room.number}/{room.price}
    </div>)}
  </div>;
};

export default AuthenticatedPage(Rooms);
