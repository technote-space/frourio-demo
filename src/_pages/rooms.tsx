import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import { useMemo } from 'react';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import DataTable from '~/components/DataTable';

const Rooms: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Rooms');

  return useMemo(() => <DataTable
    page={'rooms'}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      { title: 'Name', field: 'name' },
      { title: 'Number', field: 'number', type: 'numeric' },
      { title: 'Price', field: 'price', type: 'numeric' },
    ]}
    authHeader={authHeader}
  />, []);
};

export default AuthenticatedPage(Rooms);
