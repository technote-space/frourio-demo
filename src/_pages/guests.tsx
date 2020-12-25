import type { FC } from 'react';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { client } from '~/utils/api';

const Guests: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Guests');

  const { dispatch }            = useDispatchContext();
  const { data: guests, error } = useFetch(dispatch, [], client.guests, { headers: authHeader });
  return <div>
    {error && <div>failed to load</div>}
    {!error && !guests && <div>loading...</div>}
    {!error && guests && guests.map(guest => <div key={guest.id}>
      {JSON.stringify(guest)}
    </div>)}
  </div>;
};

export default AuthenticatedPage(Guests);
