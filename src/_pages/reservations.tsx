import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import { useMemo } from 'react';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import { ReservationStatus } from '$/types';
import DataTable from '~/components/DataTable';

const Reservations: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Reservations');

  return useMemo(() => <DataTable
    page={'reservations'}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      { title: 'Guest Name', field: 'guestName', hidden: true },
      { title: 'Room Name', field: 'roomName', hidden: true },
      {
        // eslint-disable-next-line react/display-name
        title: 'Guest', field: 'guestId', editable: 'onAdd', render: (data) => {
          console.log(data);
          return <a onClick={() => {
            console.log('Click!!');
            console.log(data.guestId);
          }}>{data.guestName}</a>;
        },
      },
      {
        // eslint-disable-next-line react/display-name
        title: 'Room', field: 'roomId', editable: 'onAdd', render: (data) => {
          console.log(data);
          return <a onClick={() => {
            console.log('Click!!');
            console.log(data.roomId);
          }}>{data.roomName}</a>;
        },
      },
      { title: 'Number', field: 'number', type: 'numeric' },
      { title: 'Amount', field: 'amount', editable: 'never' },
      { title: 'Checkin', field: 'checkin', type: 'datetime' },
      { title: 'Checkout', field: 'checkout', type: 'datetime' },
      { title: 'Status', field: 'status', lookup: ReservationStatus, editable: 'onUpdate' },
      { title: 'Payment', field: 'payment', type: 'numeric' },
    ]}
    authHeader={authHeader}
  />, []);
};

export default AuthenticatedPage(Reservations);
