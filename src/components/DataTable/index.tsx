import type { ReactElement } from 'react';
import type { Column, Query, QueryResult, Options } from 'material-table';
import type { ApiModels } from '~/utils/api';
import { useMemo, useCallback } from 'react';
import MaterialTable from 'material-table';
import { useDispatchContext } from '~/store';
import useTableIcons from '~/hooks/useTableIcons';
import { getDataTableApi, handleAuthError } from '~/utils/api';
import { AspidaResponse } from 'aspida';
import pages from '~/_pages';

export type ApiType = {
  get: (option?: any) => Promise<AspidaResponse<any, any, any>>;
  post: (option?: any) => Promise<AspidaResponse<any, any, any>>;
  detail: (id: number) => {
    patch: (option?: any) => Promise<AspidaResponse<any, any, any>>;
    delete: (option?: any) => Promise<AspidaResponse<any, any, any>>;
  }
};
type Props<T extends object> = {
  page: ApiModels;
  columns: Column<T>[];
  authHeader: { authorization: string };
  options?: Options<T>;
}

const DataTable = <T extends object, >({ page, columns, authHeader, options }: Props<T>): ReactElement => {
  console.log('page::DataTable');

  const { dispatch } = useDispatchContext();
  const tableIcons   = useTableIcons();

  const title        = useMemo(() => {
    const Icon = pages[page].icon;
    return <Icon/>;
  }, []);
  const api          = useMemo(() => getDataTableApi(page), []);
  const fetchData    = useCallback(async(query: Query<T>): Promise<QueryResult<T>> => handleAuthError(dispatch, {
    data: [] as T[],
    page: 0,
    totalCount: 0,
  }, api.get, { headers: authHeader, query }), []);
  const handleAdd    = useCallback(async newData => handleAuthError(dispatch, {}, api.post, {
    headers: authHeader,
    body: newData,
  }), []);
  const handleUpdate = useCallback(async(newData, oldData) => handleAuthError(dispatch, {}, api.detail(oldData.id).patch, {
    headers: authHeader,
    body: newData,
  }), []);
  const handleDelete = useCallback(async oldData => handleAuthError(dispatch, {}, api.detail(oldData.id).delete, {
    headers: authHeader,
  }), []);

  return useMemo(() => <div>
    <MaterialTable
      icons={tableIcons}
      title={title}
      columns={columns}
      data={fetchData}
      editable={{
        onRowAdd: handleAdd,
        onRowUpdate: handleUpdate,
        onRowDelete: handleDelete,
      }}
      options={{
        emptyRowsWhenPaging: false,
        ...options,
      }}
    />
  </div>, []);
};

export default DataTable;
