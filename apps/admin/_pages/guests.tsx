import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Model, DataTableColumn } from '~/components/DataTable';
import { useMemo } from 'react';
import useUnmountRef from '~/hooks/useUnmountRef';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import DataTable from '~/components/DataTable';

const Guests: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  const unmountRef = useUnmountRef();
  const columns = useMemo(() => [
    { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
    { title: 'メールアドレス', field: 'email', validate: data => !!data['email'] },
    { title: '名前', field: 'name', validate: data => !!data['name'] },
    { title: 'かな名', field: 'nameKana', validate: data => !!data['nameKana'] },
    { title: '郵便番号', field: 'zipCode', validate: data => !!data['zipCode'] },
    { title: '住所', field: 'address', validate: data => !!data['address'] },
    { title: '電話番号', field: 'phone', validate: data => !!data['phone'] },
    { title: 'auth0', field: 'auth0Sub' },
  ] as DataTableColumn<Model>[], []);

  return <DataTable
    model={'guests'}
    columns={columns}
    authHeader={authHeader}
    unmountRef={unmountRef}
  />;
};

export default AuthenticatedPage(Guests);
