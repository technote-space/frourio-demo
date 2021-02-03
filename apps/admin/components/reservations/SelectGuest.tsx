import type { FC } from 'react';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import type { Column } from '@technote-space/material-table';
import type { AuthHeader } from '@frourio-demo/types';
import { memo, useMemo, useCallback } from 'react';
import { ACCOUNT_FIELDS } from '@frourio-demo/constants';
import useFetch from '~/hooks/useFetch';
import useUnmountRef from '~/hooks/useUnmountRef';
import SearchTable from '~/components/SearchTable';
import { client } from '~/utils/api';
import { useDispatchContext } from '~/store';

type Props = {
  authHeader: AuthHeader;
  props: EditComponentPropsWithError<Model>;
}

const SelectGuest: FC<Props> = memo(({ authHeader, props }: Props) => {
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
  const columns = useMemo(() => [
    { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
    ...ACCOUNT_FIELDS.map(field => ({
      title: field.label, field: field.name,
    })),
  ] as Column<Model>[], []);
  const tableProps = useMemo(() => ({
    ...props,
    onChange: handleChange,
  }), [props]);

  return <SearchTable
    model='guests'
    api={client.reservations.search.guests.get}
    columns={columns}
    searchText={guest.data?.name ?? guest.data?.email ?? ''}
    authHeader={authHeader}
    props={tableProps}
    unmountRef={unmountRef}
  />;
});

export default SelectGuest;
