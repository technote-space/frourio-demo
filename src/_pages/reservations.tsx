import type { FC } from 'react';
import type { EditComponentProps } from 'material-table';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Model } from '~/components/DataTable';
import { useMemo } from 'react';
import { startOfToday, addDays, addHours } from 'date-fns';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import DataTable from '~/components/DataTable';
import InputNumber from '~/components/reservations/InputNumber';
import RenderAmount from '~/components/reservations/RenderAmount';
import { ReservationStatus } from '$/types';
import { client } from '~/utils/api';
import { getPriceCalc } from '~/utils/calc';

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
            { title: '最大人数', field: 'number', type: 'numeric' },
            { title: '料金(円/人泊)', field: 'price', type: 'numeric' },
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
        // eslint-disable-next-line react/display-name
        editComponent: (props: EditComponentProps<Model>) => <InputNumber
          authHeader={authHeader}
          roomId={props.rowData['roomId']}
          value={props.value}
          onChange={props.onChange}
        />,
        validate: data => data['number'] > 0,
      },
      {
        title: '請求額',
        field: 'amount',
        // eslint-disable-next-line react/display-name
        render: data => {
          if (!data['room']) {
            return data['amount'];
          }

          return <>
            <div>¥{data['amount']}</div>
            <div style={{
              whiteSpace: 'nowrap',
            }}>{`(${getPriceCalc(data['room']['price'], data['number'], data['checkin'], data['checkout'], data['amount'])})`}</div>
          </>;
        },
        filtering: false,
        // eslint-disable-next-line react/display-name
        editComponent: (props: EditComponentProps<Model>) => <RenderAmount
          authHeader={authHeader}
          rowData={props.rowData}
        />,
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
      {
        title: '支払額',
        field: 'payment',
        type: 'numeric',
        editable: 'onUpdate',
        filtering: false,
        // eslint-disable-next-line react/display-name
        render: data => data['payment'] ? `¥${data['payment']}` : '',
      },
    ]}
    authHeader={authHeader}
    options={{
      filtering: true,
    }}
  />, []);
};

export default AuthenticatedPage(Reservations);
