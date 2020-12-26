import type { FC } from 'react';
import type { Column, Query, QueryResult } from 'material-table';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Reservation } from '$/repositories/reservation';
import { useMemo, useCallback } from 'react';
import MaterialTable from 'material-table';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import { useDispatchContext } from '~/store';
import useTableIcons from '~/hooks/useTableIcons';
import { client, handleAuthError } from '~/utils/api';
import pages from '.';

const Reservations: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Reservations');

  const { dispatch } = useDispatchContext();
  const tableIcons   = useTableIcons();

  const title                               = useMemo(() => {
    const Icon = pages['reservations'].icon;
    return <>
      <Icon/>
      {pages['reservations'].label}
    </>;
  }, []);
  const columns: Array<Column<Reservation>> = useMemo(() => [
    { title: 'Guest Name', field: 'guestName', editable: 'never' },
    { title: 'Guest Name(Kana)', field: 'guestNameKana', editable: 'never' },
    { title: 'Guest Phone number', field: 'guestPhone', editable: 'never' },
    { title: 'Room name', field: 'roomName', editable: 'never' },
    { title: 'Number', field: 'number', editable: 'never' },
    { title: 'Amount', field: 'amount', editable: 'never' },
    { title: 'Checkin', field: 'checkin', editable: 'never' },
    { title: 'Checkout', field: 'checkout', editable: 'never' },
    { title: 'Status', field: 'status', editable: 'never' },
    { title: 'Payment', field: 'payment', editable: 'never' },
  ], []);

  const fetchData    = useCallback(async(query: Query<Reservation>): Promise<QueryResult<Reservation>> => handleAuthError(dispatch, {
    data: [] as Reservation[],
    page: 0,
    totalCount: 0,
  }, client.reservations.get, { headers: authHeader, query }), []);
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

export default AuthenticatedPage(Reservations);
