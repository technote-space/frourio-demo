import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import { useMemo } from 'react';
import { differenceInCalendarDays, startOfToday, addDays, addHours } from 'date-fns';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import { ReservationStatus } from '$/types';
import DataTable from '~/components/DataTable';
import { client } from '~/utils/api';

const Reservations: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Reservations');

  return useMemo(() => <DataTable
    model={'reservations'}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      {
        title: '名前', field: 'guestId', type: 'search',
        search: {
          model: 'guests',
          api: client.reservations.search.guests.get,
          columns: [
            { title: '名前', field: 'name' },
            { title: 'かな名', field: 'nameKana' },
            { title: '郵便番号', field: 'zipCode' },
            { title: '住所', field: 'address' },
            { title: '電話番号', field: 'phone' },
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
        title: '部屋名', field: 'roomId', type: 'search',
        search: {
          model: 'rooms',
          api: client.reservations.search.rooms.get,
          columns: [
            { title: '部屋名', field: 'name' },
            { title: '人数', field: 'number', type: 'numeric' },
            { title: '１泊料金', field: 'price', type: 'numeric' },
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
        title: '人数',
        field: 'number',
        type: 'numeric',
        render: data => `${data['number']}/${data['room']['number']}`,
        filtering: false,
      },
      {
        title: '請求額',
        field: 'amount',
        editable: 'never',
        // eslint-disable-next-line react/display-name
        render: data => {
          if (!data['room']) {
            return data['amount'];
          }

          const diff = differenceInCalendarDays(new Date(data['checkout']), new Date(data['checkin']));
          const amount = data['room']['price'] * data['number'] * diff;
          return <>
            <div>¥{data['amount']}</div>
            <div style={{
              whiteSpace: 'nowrap',
            }}>{`(${amount} = ${data['room']['price']} * ${data['number']}人 * ${diff}泊)`}</div>
          </>;
        },
        filtering: false,
      },
      {
        title: 'チェックイン',
        field: 'checkin',
        type: 'datetime',
        filtering: false,
        initialEditValue: addHours(startOfToday(), 15),
      },
      {
        title: 'チェックアウト',
        field: 'checkout',
        type: 'datetime',
        filtering: false,
        initialEditValue: addHours(addDays(startOfToday(), 3), 10),
      },
      { title: 'ステータス', field: 'status', lookup: ReservationStatus, editable: 'onUpdate' },
      { title: '支払額', field: 'payment', type: 'numeric', filtering: false },
    ]}
    authHeader={authHeader}
    options={{
      filtering: true,
    }}
  />, []);
};

export default AuthenticatedPage(Reservations);
