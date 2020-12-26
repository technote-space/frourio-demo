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
import { ReservationStatus } from '$/types';

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
    { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
    { title: 'Guest Name', field: 'guestName', editable: 'onAdd' },
    { title: 'Guest Name(Kana)', field: 'guestNameKana', editable: 'onAdd' },
    { title: 'Guest Phone number', field: 'guestPhone', editable: 'onAdd' },
    { title: 'Room name', field: 'roomName', editable: 'onAdd' },
    { title: 'Number', field: 'number', type: 'numeric' },
    { title: 'Amount', field: 'amount', editable: 'never' },
    { title: 'Checkin', field: 'checkin', type: 'datetime' },
    { title: 'Checkout', field: 'checkout', type: 'datetime' },
    { title: 'Status', field: 'status', lookup: ReservationStatus },
    { title: 'Payment', field: 'payment', type: 'numeric' },
  ], []);

  const fetchData    = useCallback(async(query: Query<Reservation>): Promise<QueryResult<Reservation>> => handleAuthError(dispatch, {
    data: [] as Reservation[],
    page: 0,
    totalCount: 0,
  }, client.reservations.get, { headers: authHeader, query }), []);
  const handleAdd    = useCallback(async newData => handleAuthError(dispatch, {}, client.reservations.post, {
    headers: authHeader,
    body: newData,
  }), []);
  const handleUpdate = useCallback(async(newData, oldData) => handleAuthError(dispatch, {}, client.reservations._reservationId(oldData.id).patch, {
    headers: authHeader,
    body: newData,
  }), []);
  const handleDelete = useCallback(async oldData => handleAuthError(dispatch, {}, client.reservations._reservationId(oldData.id).delete, {
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

export default AuthenticatedPage(Reservations);
