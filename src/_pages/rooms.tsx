import type { FC } from 'react';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { client } from '~/utils/api';

const Rooms: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Rooms');

  const { dispatch }           = useDispatchContext();
  const { data: rooms, error } = useFetch(dispatch, [], client.rooms, { headers: authHeader });
  return <div>
    {error && <div>failed to load</div>}
    {!error && !rooms && <div>loading...</div>}
    {!error && rooms && rooms.map(room => <div key={room.id}>
      {JSON.stringify(room)}
    </div>)}
  </div>;
};

export default AuthenticatedPage(Rooms);
