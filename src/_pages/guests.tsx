import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import { useMemo } from 'react';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import DataTable from '~/components/DataTable';

const Guests: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Guests');

  return useMemo(() => <DataTable
    model={'guests'}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      { title: 'Name', field: 'name' },
      { title: 'Name(Kana)', field: 'nameKana' },
      { title: 'Zip Code', field: 'zipCode' },
      { title: 'Address', field: 'address' },
      { title: 'Phone number', field: 'phone' },
    ]}
    authHeader={authHeader}
  />, []);
};

export default AuthenticatedPage(Guests);
