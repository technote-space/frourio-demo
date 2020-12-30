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
        title: 'Guest', field: 'guestId', type: 'search',
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
        title: 'Room', field: 'roomId', type: 'search',
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
      },
      {
        title: 'Amount',
        field: 'amount',
        editable: 'never',
        // eslint-disable-next-line react/display-name
        render: data => {
          const diff   = differenceInCalendarDays(new Date(data['checkout']), new Date(data['checkin']));
          const amount = data['room']['price'] * data['number'] * diff;

          return <>
            <div>{data['amount']}</div>
            <div style={{
              whiteSpace: 'nowrap',
            }}>{`(${amount} = ${data['room']['price']} * ${data['number']}${getWord('person', data['number'])} * ${diff}${getWord('day', diff)})`}</div>
          </>;
        },
      },
      { title: 'Checkin', field: 'checkin', type: 'datetime' },
      { title: 'Checkout', field: 'checkout', type: 'datetime' },
      { title: 'Status', field: 'status', lookup: ReservationStatus, editable: 'onUpdate' },
      { title: 'Payment', field: 'payment', type: 'numeric' },
    ]}
    authHeader={authHeader}
  />, []);
};

export default AuthenticatedPage(Reservations);
