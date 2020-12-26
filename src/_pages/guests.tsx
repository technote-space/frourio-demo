import type { FC } from 'react';
import type { Column, Query, QueryResult } from 'material-table';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Guest } from '$/repositories/guest';
import { useMemo, useCallback } from 'react';
import MaterialTable from 'material-table';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import { useDispatchContext } from '~/store';
import useTableIcons from '~/hooks/useTableIcons';
import { client, handleAuthError } from '~/utils/api';
import pages from '.';

const Guests: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Guests');

  const { dispatch } = useDispatchContext();
  const tableIcons   = useTableIcons();

  const title                         = useMemo(() => {
    const Icon = pages['guests'].icon;
    return <>
      <Icon/>
      {pages['guests'].label}
    </>;
  }, []);
  const columns: Array<Column<Guest>> = useMemo(() => [
    { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
    { title: 'Name', field: 'name' },
    { title: 'Name(Kana)', field: 'nameKana' },
    { title: 'Zip Code', field: 'zipCode' },
    { title: 'Address', field: 'address' },
    { title: 'Phone number', field: 'phone' },
  ], []);

  const fetchData    = useCallback(async(query: Query<Guest>): Promise<QueryResult<Guest>> => handleAuthError(dispatch, {
    data: [] as Guest[],
    page: 0,
    totalCount: 0,
  }, client.guests.get, { headers: authHeader, query }), []);
  const handleAdd    = useCallback(async newData => handleAuthError(dispatch, {}, client.guests.post, {
    headers: authHeader,
    body: newData,
  }), []);
  const handleUpdate = useCallback(async(newData, oldData) => handleAuthError(dispatch, {}, client.guests._guestId(oldData.id).patch, {
    headers: authHeader,
    body: newData,
  }), []);
  const handleDelete = useCallback(async oldData => handleAuthError(dispatch, {}, client.guests._guestId(oldData.id).delete, {
    headers: authHeader,
  }), []);

  return useMemo(() => <div>
    <MaterialTable
      icons={tableIcons}
      title={title}
      columns={columns}
      data={fetchData}
      editable={{
        onRowAdd: handleAdd,
        onRowUpdate: handleUpdate,
        onRowDelete: handleDelete,
      }}
    />
  </div>, []);
};

export default AuthenticatedPage(Guests);
