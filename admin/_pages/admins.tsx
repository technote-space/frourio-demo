import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import { useMemo } from 'react';
import useUnmountRef from '~/hooks/useUnmountRef';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import { Avatar } from '@material-ui/core';
import DataTable from '~/components/DataTable';
import SelectIcon from '~/components/admins/SelectIcon';
import RenderRoles from '~/components/admins/RenderRoles';
import EditRoles from '~/components/admins/EditRoles';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { client } from '~/utils/api';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  avatar: {
    background: 'white',
    marginRight: '1rem',
  },
});

const Admins: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  const classes = useStyles();
  const unmountRef = useUnmountRef();
  const { dispatch } = useDispatchContext();
  const roles = useFetch(dispatch, {}, client.admins.roles, { headers: authHeader });

  return useMemo(() => roles.data ? <DataTable
    model={'admins'}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      {
        title: '名前',
        field: 'name',
        filtering: false,
        cellStyle: { width: 'auto', whiteSpace: 'nowrap' },
        headerStyle: { width: 'auto', whiteSpace: 'nowrap' },
      },
      {
        title: 'メールアドレス',
        field: 'email',
        filtering: false,
        cellStyle: { width: 'auto', whiteSpace: 'nowrap' },
        headerStyle: { width: 'auto', whiteSpace: 'nowrap' },
      },
      {
        title: 'パスワード',
        field: 'password',
        filtering: false,
        cellStyle: { width: 'auto', whiteSpace: 'nowrap' },
        headerStyle: { width: 'auto', whiteSpace: 'nowrap' },
        render: () => '******',
      },
      {
        title: 'アイコン',
        field: 'icon',
        filtering: false,
        cellStyle: { width: 'auto' },
        headerStyle: { width: 'auto', whiteSpace: 'nowrap' },
        // eslint-disable-next-line react/display-name
        render: data => data['icon'] && <Avatar
          className={classes.avatar}
          src={data['icon']}
          alt={data['name'] || 'icon'}
        />,
        // eslint-disable-next-line react/display-name
        editComponentWithError: (props: EditComponentPropsWithError<Model>) => <SelectIcon props={props}/>,
      },
      {
        title: '権限',
        field: 'roles',
        lookup: roles.data,
        cellStyle: { width: '100%' },
        headerStyle: { width: '100%' },
        // eslint-disable-next-line react/display-name
        render: data => <RenderRoles rowData={data}/>,
        // eslint-disable-next-line react/display-name
        editComponentWithError: (props: EditComponentPropsWithError<Model>) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          <EditRoles props={props} roles={roles.data!}/>,
      },
    ]}
    authHeader={authHeader}
    options={{
      filtering: true,
    }}
    unmountRef={unmountRef}
  /> : null, [classes, roles.data]);
};

export default AuthenticatedPage(Admins);
