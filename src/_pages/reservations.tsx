import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import { useMemo } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import { ReservationStatus } from '$/types';
import DataTable from '~/components/DataTable';
import { client } from '~/utils/api';
import { getWord } from '~/utils';

const Reservations: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Reservations');

  return useMemo(() => <DataTable
    model={'reservations'}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      {
        title: 'Guest', field: 'guestId', type: 'search', filtering: false,
        search: {
          model: 'guests',
          api: client.reservations.search.guests.get,
          columns: [
            { title: 'Name', field: 'name' },
            { title: 'Name(Kana)', field: 'nameKana' },
            { title: 'Zip Code', field: 'zipCode' },
            { title: 'Address', field: 'address' },
            { title: 'Phone number', field: 'phone' },
          ],
          render: data => data['guestName'],
          process: data => ({
            ...data,
            guestId: data['id'],
            guestName: data['name'],
          }),
        },
      },
      {
        title: 'Room', field: 'roomId', type: 'search', filtering: false,
        search: {
          model: 'rooms',
          api: client.reservations.search.rooms.get,
          columns: [
            { title: 'Name', field: 'name' },
            { title: 'Number', field: 'number', type: 'numeric' },
            { title: 'Price', field: 'price', type: 'numeric' },
          ],
          render: data => data['roomName'],
          process: data => ({
            ...data,
            roomId: data['id'],
            roomName: data['name'],
          }),
        },
      },
      {
        title: 'Number',
        field: 'number',
        type: 'numeric',
        render: data => `${data['number']}/${data['room']['number']}`,
        filtering: false,
      },
      {
        title: 'Amount',
        field: 'amount',
        editable: 'never',
        // eslint-disable-next-line react/display-name
        render: data => {
          if (!data['room']) {
            return data['amount'];
          }

          const diff   = differenceInCalendarDays(new Date(data['checkout']), new Date(data['checkin']));
          const amount = data['room']['price'] * data['number'] * diff;
          return <>
            <div>{data['amount']}</div>
            <div style={{
              whiteSpace: 'nowrap',
            }}>{`(${amount} = ${data['room']['price']} * ${data['number']}${getWord('person', data['number'])} * ${diff}${getWord('night', diff)})`}</div>
          </>;
        },
        filtering: false,
      },
      { title: 'Checkin', field: 'checkin', type: 'datetime', filtering: false },
      { title: 'Checkout', field: 'checkout', type: 'datetime', filtering: false },
      { title: 'Status', field: 'status', lookup: ReservationStatus, editable: 'onUpdate' },
      { title: 'Payment', field: 'payment', type: 'numeric', filtering: false },
    ]}
    authHeader={authHeader}
    options={{
      filtering: true,
    }}
  />, []);
};

export default AuthenticatedPage(Reservations);
