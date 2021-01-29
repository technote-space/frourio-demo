import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import { useMemo } from 'react';
import useUnmountRef from '~/hooks/useUnmountRef';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import DataTable from '~/components/DataTable';
import RoomStatusCalendar from '~/components/rooms/RoomStatusCalendar';

const Rooms: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  const unmountRef = useUnmountRef();
  return useMemo(() => <DataTable
    model={'rooms'}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      { title: '部屋名', field: 'name', validate: data => !!data['name'] },
      { title: '最大人数', field: 'number', type: 'numeric', validate: data => data['number'] > 0 },
      {
        title: '料金(円/人泊)',
        field: 'price',
        type: 'numeric',
        render: data => `¥${data.price}`,
        validate: data => data['price'] >= 0,
      },
      {
        title: '利用状況',
        editable: 'never',
        // eslint-disable-next-line react/display-name
        render: (data) => <RoomStatusCalendar roomId={data.id} authHeader={authHeader}/>,
      },
    ]}
    authHeader={authHeader}
    unmountRef={unmountRef}
  />, []);
};

export default AuthenticatedPage(Rooms);