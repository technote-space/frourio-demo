import type { FC } from 'react';
import { AuthenticatedPage } from '~/components/Page';
import type { AuthenticatedPageProps } from '~/components/Page';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { client } from '~/utils/api';
import styles from '~/styles/pages/Guests.module.scss';

const Guests: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Guests');

  const { dispatch }            = useDispatchContext();
  const { data: guests, error } = useFetch(dispatch, [], client.guests, { headers: authHeader });
  return <div className={styles.wrap}>
    {error && <div>failed to load</div>}
    {!error && !guests && <div>loading...</div>}
    {!error && guests && guests.map(guest => <div key={guest.id}>
      {JSON.stringify(guest)}
    </div>)}
  </div>;
};

export default AuthenticatedPage(Guests);
