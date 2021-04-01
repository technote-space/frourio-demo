import type { FC } from 'react';
import type { EditComponentProps } from '@technote-space/material-table';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Model, EditComponentPropsWithError, DataTableColumn } from '~/components/DataTable';
import { useMemo } from 'react';
import { format } from 'date-fns';
import useUnmountRef from '@technote-space/use-unmount-ref';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import DataTable from '~/components/DataTable';
import SelectGuest from '~/components/reservations/SelectGuest';
import SelectRoom from '~/components/reservations/SelectRoom';
import InputNumber from '~/components/reservations/InputNumber';
import RenderAmount from '~/components/reservations/RenderAmount';
import SelectCheckinDate from '~/components/reservations/SelectCheckinDate';
import SelectCheckoutDate from '~/components/reservations/SelectCheckoutDate';
import { RESERVATION_STATUS } from '@frourio-demo/constants';
import { getPriceCalc } from '@frourio-demo/utils/calc';

const Reservations: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  const unmountRef = useUnmountRef();
  const columns = useMemo(() => [
    { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
    { title: '予約番号', field: 'code', editable: 'never', filtering: false },
    {
      title: '名前',
      field: 'guestId',
      filtering: false,
      // eslint-disable-next-line react/display-name
      editComponentWithError: (props: EditComponentPropsWithError<Model>) => <SelectGuest
        authHeader={authHeader}
        props={props}
      />,
      // eslint-disable-next-line react/display-name
      render: data => data['guestName'],
    },
    {
      title: '部屋名',
      field: 'roomId',
      filtering: false,
      // eslint-disable-next-line react/display-name
      editComponentWithError: (props: EditComponentPropsWithError<Model>) => <SelectRoom
        authHeader={authHeader}
        props={props}
      />,
      // eslint-disable-next-line react/display-name
      render: data => data['roomName'],
    },
    {
      title: '人数',
      field: 'number',
      type: 'numeric',
      render: data => {
        if (!data['room']) {
          return data['number'];
        }

        return `${data['number']}/${data['room']['number']}`;
      },
      filtering: false,
      // eslint-disable-next-line react/display-name
      editComponentWithError: (props: EditComponentPropsWithError<Model>) => <InputNumber
        authHeader={authHeader}
        props={props}
      />,
      validate: data => data['number'] > 0,
    },
    {
      title: '請求額',
      field: 'amount',
      // eslint-disable-next-line react/display-name
      render: data => {
        if (!data['room']) {
          return <div>¥{data['amount']}</div>;
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
      filtering: false,
      // eslint-disable-next-line react/display-name
      editComponentWithError: (props: EditComponentPropsWithError<Model>) => <SelectCheckinDate
        authHeader={authHeader}
        props={props}
      />,
      render: data => format(new Date(data['checkin']), 'yyyy-MM-dd HH:mm'),
      validate: data => !!data['checkin'],
    },
    {
      title: 'チェックアウト',
      field: 'checkout',
      filtering: false,
      // eslint-disable-next-line react/display-name
      editComponentWithError: (props: EditComponentPropsWithError<Model>) => <SelectCheckoutDate
        authHeader={authHeader}
        props={props}
      />,
      render: data => format(new Date(data['checkout']), 'yyyy-MM-dd HH:mm'),
      validate: data => !!data['checkout'],
    },
    { title: 'ステータス', field: 'status', lookup: RESERVATION_STATUS, editable: 'onUpdate' },
    {
      title: '支払額',
      field: 'payment',
      type: 'numeric',
      editable: 'onUpdate',
      filtering: false,
      // eslint-disable-next-line react/display-name
      render: data => data['payment'] ? `¥${data['payment']}` : '',
    },
    { title: 'Payment Intents', field: 'paymentIntents', editable: 'never', filtering: false },
  ] as DataTableColumn<Model>[], []);
  const options = useMemo(() => ({
    filtering: true,
  }), []);

  return <DataTable
    model={'reservations'}
    columns={columns}
    authHeader={authHeader}
    options={options}
    unmountRef={unmountRef}
  />;
};

export default AuthenticatedPage(Reservations);
