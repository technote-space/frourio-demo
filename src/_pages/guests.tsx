import type { FC } from 'react';
import AuthenticatedPage, { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { client } from '~/utils/api';
import styles from '~/styles/pages/Guests.module.scss';

const Guests: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Guests');

  const { dispatch }            = useDispatchContext();
  const { data: guests, error } = useFetch(dispatch, [], client.rooms, { headers: authHeader });
  return <div className={styles.wrap}>
    {error && <div>failed to load</div>}
    {!error && !guests && <div>loading...</div>}
    {!error && guests && guests.map(guest => <div key={guest.id}>
      {guest.id}
    </div>)}
  </div>;
};

export default AuthenticatedPage(Guests);
