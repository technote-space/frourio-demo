import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import { useMemo } from 'react';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import DataTable from '~/components/DataTable';

const Rooms: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Rooms');

  return useMemo(() => <DataTable
    model={'rooms'}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      { title: '部屋名', field: 'name' },
      { title: '人数', field: 'number', type: 'numeric' },
      { title: '１泊料金', field: 'price', type: 'numeric' },
    ]}
    authHeader={authHeader}
  />, []);
};

export default AuthenticatedPage(Rooms);
