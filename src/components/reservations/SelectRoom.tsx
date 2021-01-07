import type { FC } from 'react';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import { useMemo, useCallback } from 'react';
import useFetch from '~/hooks/useFetch';
import SearchTable from '~/components/SearchTable';
import { client } from '~/utils/api';
import { useDispatchContext } from '~/store';

type Props = {
  authHeader: { authorization: string };
  props: EditComponentPropsWithError<Model>;
}

const SelectRoom: FC<Props> = ({ authHeader, props }: Props) => {
  const { dispatch } = useDispatchContext();
  const room         = useFetch(dispatch, undefined, client.reservations.room, {
    headers: authHeader,
    query: { roomId: Number(props.value) },
    enabled: !!props.value,
  });
  const handleChange = useCallback(value => {
    props.onChange(value.id);
  }, []);

  return useMemo(() => <SearchTable
    model='rooms'
    api={client.reservations.search.rooms.get}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      { title: '部屋名', field: 'name' },
      { title: '最大人数', field: 'number', type: 'numeric' },
      { title: '料金(円/人泊)', field: 'price', type: 'numeric' },
    ]}
    searchText={room?.data?.name}
    authHeader={authHeader}
    props={{
      ...props,
      onChange: handleChange,
    }}
  />, [room?.data, props.helperText]);
};

export default SelectRoom;
