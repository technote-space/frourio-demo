import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import { useMemo } from 'react';
import useUnmountRef from '~/hooks/useUnmountRef';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import DataTable from '~/components/DataTable';

const Guests: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Guests');

  const unmountRef = useUnmountRef();
  return useMemo(() => <DataTable
    model={'guests'}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      { title: '名前', field: 'name' },
      { title: 'かな名', field: 'nameKana' },
      { title: '郵便番号', field: 'zipCode' },
      { title: '住所', field: 'address' },
      { title: '電話番号', field: 'phone' },
    ]}
    authHeader={authHeader}
    unmountRef={unmountRef}
  />, []);
};

export default AuthenticatedPage(Guests);
