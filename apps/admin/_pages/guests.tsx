import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Model, DataTableColumn } from '~/components/DataTable';
import { useMemo } from 'react';
import { ACCOUNT_FIELDS } from '@frourio-demo/constants';
import useUnmountRef from '~/hooks/useUnmountRef';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import DataTable from '~/components/DataTable';

const Guests: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  const unmountRef = useUnmountRef();
  const columns = useMemo(() => [
    { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
    ...ACCOUNT_FIELDS.map(field => ({
      title: field.label, field: field.name, validate: data => !!data[field.name],
    })),
    { title: 'auth0', field: 'auth0Sub', editable: 'never' },
    { title: 'Stripe', field: 'stripe', editable: 'never' },
  ] as DataTableColumn<Model>[], []);

  return <DataTable
    model={'guests'}
    columns={columns}
    authHeader={authHeader}
    unmountRef={unmountRef}
  />;
};

export default AuthenticatedPage(Guests);
