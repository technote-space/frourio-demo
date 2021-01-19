import type { FC } from 'react';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import { useMemo, useCallback } from 'react';
import useFetch from '~/hooks/useFetch';
import useUnmountRef from '~/hooks/useUnmountRef';
import SearchTable from '~/components/SearchTable';
import { client } from '~/utils/api';
import { useDispatchContext } from '~/store';

type Props = {
  authHeader: { authorization: string };
  props: EditComponentPropsWithError<Model>;
}

const SelectGuest: FC<Props> = ({ authHeader, props }: Props) => {
  const unmountRef = useUnmountRef();
  const { dispatch } = useDispatchContext();
  const guest = useFetch(dispatch, undefined, client.reservations.guest, {
    headers: authHeader,
    query: { guestId: Number(props.value) },
    enabled: !!props.value,
  });
  const handleChange = useCallback(value => {
    props.onChange(value.id);
  }, []);

  return useMemo(() => <SearchTable
    model='guests'
    api={client.reservations.search.guests.get}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      { title: '名前', field: 'name' },
      { title: 'かな名', field: 'nameKana' },
      { title: '郵便番号', field: 'zipCode' },
      { title: '住所', field: 'address' },
      { title: '電話番号', field: 'phone' },
    ]}
    searchText={guest?.data?.name}
    authHeader={authHeader}
    props={{
      ...props,
      onChange: handleChange,
    }}
    unmountRef={unmountRef}
  />, [guest?.data, props.helperText, unmountRef]);
};

export default SelectGuest;
