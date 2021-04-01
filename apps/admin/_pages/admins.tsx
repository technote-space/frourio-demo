import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Model, EditComponentPropsWithError, DataTableColumn } from '~/components/DataTable';
import { useMemo, useCallback } from 'react';
import useUnmountRef from '@technote-space/use-unmount-ref';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import { Avatar } from '@material-ui/core';
import DataTable from '~/components/DataTable';
import SelectIcon from '~/components/admins/SelectIcon';
import RenderRoles from '~/components/admins/RenderRoles';
import EditRoles from '~/components/admins/EditRoles';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { client } from '~/utils/api';
import { onRefreshToken } from '~/utils/actions';

const Admins: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  const unmountRef = useUnmountRef();
  const { dispatch } = useDispatchContext();
  const roles = useFetch(dispatch, {}, client.admins.roles, { headers: authHeader });
  const onUpdated = useCallback(() => {
    onRefreshToken(dispatch);
  }, []);
  const columns = useMemo(() => [
    { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
    {
      title: '名前',
      field: 'name',
      filtering: false,
      cellStyle: { width: 'auto', whiteSpace: 'nowrap' },
      headerStyle: { width: 'auto', whiteSpace: 'nowrap' },
      validate: data => !!data['name'],
    },
    {
      title: 'メールアドレス',
      field: 'email',
      filtering: false,
      cellStyle: { width: 'auto', whiteSpace: 'nowrap' },
      headerStyle: { width: 'auto', whiteSpace: 'nowrap' },
      validate: data => !!data['email'],
    },
    {
      title: 'パスワード',
      field: 'password',
      filtering: false,
      sorting: false,
      cellStyle: { width: 'auto', whiteSpace: 'nowrap' },
      headerStyle: { width: 'auto', whiteSpace: 'nowrap' },
      render: () => '******',
      validate: data => !!data['id'] || !!data['password'],
    },
    {
      title: 'アイコン',
      field: 'icon',
      filtering: false,
      sorting: false,
      cellStyle: { width: 'auto' },
      headerStyle: { width: 'auto', whiteSpace: 'nowrap' },
      // eslint-disable-next-line react/display-name
      render: data => data['icon'] && <Avatar
        src={data['icon']}
        alt={data['name']}
        style={{
          background: 'white',
          marginRight: '1rem',
        }}
      />,
      // eslint-disable-next-line react/display-name
      editComponentWithError: (props: EditComponentPropsWithError<Model>) => <SelectIcon props={props}/>,
    },
    {
      title: '権限',
      field: 'roles',
      sorting: false,
      lookup: roles.data,
      cellStyle: { width: '100%' },
      headerStyle: { width: '100%' },
      // eslint-disable-next-line react/display-name
      render: data => <RenderRoles rowData={data}/>,
      // eslint-disable-next-line react/display-name
      editComponentWithError: (props: EditComponentPropsWithError<Model>) =>
        <EditRoles props={props} roles={roles.data!}/>,
      validate: data => !!data['roles'] && !!data['roles'].length,
    },
  ] as DataTableColumn<Model>[], [roles.data]);
  const options = useMemo(() => ({
    filtering: true,
  }), []);

  return roles.data ? <DataTable
    model={'admins'}
    columns={columns}
    authHeader={authHeader}
    options={options}
    unmountRef={unmountRef}
    onUpdated={onUpdated}
  /> : null;
};

export default AuthenticatedPage(Admins);
