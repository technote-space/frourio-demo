import type { FC } from 'react';
import type { Column, Query, QueryResult } from 'material-table';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Room } from '$/repositories/room';
import { useMemo, useCallback } from 'react';
import MaterialTable from 'material-table';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import { useDispatchContext } from '~/store';
import useTableIcons from '~/hooks/useTableIcons';
import { client, handleAuthError } from '~/utils/api';
import pages from '.';

const Rooms: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Rooms');

  const { dispatch } = useDispatchContext();
  const tableIcons   = useTableIcons();

  const title                        = useMemo(() => {
    const Icon = pages['rooms'].icon;
    return <>
      <Icon/>
      {pages['rooms'].label}
    </>;
  }, []);
  const columns: Array<Column<Room>> = useMemo(() => [
    { title: 'Name', field: 'name', editable: 'never' },
    { title: 'Number', field: 'number', editable: 'never' },
    { title: 'Price', field: 'price', editable: 'never' },
  ], []);

  const fetchData    = useCallback(async(query: Query<Room>): Promise<QueryResult<Room>> => handleAuthError(dispatch, {
    data: [] as Room[],
    page: 0,
    totalCount: 0,
  }, client.rooms.get, { headers: authHeader, query }), []);
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

export default AuthenticatedPage(Rooms);
