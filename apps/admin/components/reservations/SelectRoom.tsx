import type { FC } from 'react';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import type { Column } from '@technote-space/material-table';
import type { AuthHeader } from '@frourio-demo/types';
import { memo, useMemo, useCallback } from 'react';
import useFetch from '~/hooks/useFetch';
import useUnmountRef from '~/hooks/useUnmountRef';
import SearchTable from '~/components/SearchTable';
import { client } from '~/utils/api';
import { useDispatchContext } from '~/store';

type Props = {
  authHeader: AuthHeader;
  props: EditComponentPropsWithError<Model>;
}

const SelectRoom: FC<Props> = memo(({ authHeader, props }: Props) => {
  const unmountRef = useUnmountRef();
  const { dispatch } = useDispatchContext();
  const room = useFetch(dispatch, undefined, client.reservations.room, {
    headers: authHeader,
    query: { roomId: Number(props.value) },
    enabled: !!props.value,
  });
  const handleChange = useCallback(value => {
    props.onChange(value.id);
  }, []);
  const columns = useMemo(() => [
    { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
    { title: '部屋名', field: 'name' },
    { title: '最大人数', field: 'number', type: 'numeric' },
    { title: '料金(円/人泊)', field: 'price', type: 'numeric' },
  ] as Column<Model>[], []);
  const tableProps = useMemo(() => ({
    ...props,
    onChange: handleChange,
  }), [props]);

  return <SearchTable
    model='rooms'
    api={client.reservations.search.rooms.get}
    columns={columns}
    searchText={room.data?.name}
    authHeader={authHeader}
    props={tableProps}
    unmountRef={unmountRef}
  />;
});

export default SelectRoom;
