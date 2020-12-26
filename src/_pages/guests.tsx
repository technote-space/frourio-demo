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
    { title: 'ID', field: 'id', editable: 'never' },
    { title: 'Name', field: 'name', editable: 'never' },
    { title: 'Name(Kana)', field: 'nameKana', editable: 'never' },
    { title: 'Zip Code', field: 'zipCode', editable: 'never' },
    { title: 'Address', field: 'address', editable: 'never' },
    { title: 'Phone number', field: 'phone', editable: 'never' },
  ], []);

  const fetchData    = useCallback(async(query: Query<Guest>): Promise<QueryResult<Guest>> => handleAuthError(dispatch, {
    data: [] as Guest[],
    page: 0,
    totalCount: 0,
  }, client.guests.get, { headers: authHeader, query }), []);
  const handleAdd    = useCallback(async newData => {
    console.log('Add!');
    console.log(newData);
  }, []);
  const handleUpdate = useCallback(async(newData, oldData) => {
    console.log('Update!');
    console.log(newData);
    console.log(oldData);
  }, []);
  const handleDelete = useCallback(async oldData => {
    console.log('Delete!');
    console.log(oldData);
  }, []);

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
