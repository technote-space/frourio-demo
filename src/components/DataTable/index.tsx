/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
import type { FC, ReactElement } from 'react';
import type { Column, Query, QueryResult, Options } from 'material-table';
import type { DataTableApiModels } from '~/utils/api';
import type { ValidationError } from 'class-validator';
import { useMemo, useCallback, useState } from 'react';
import MaterialTable, { MTableEditField } from 'material-table';
import { useDispatchContext } from '~/store';
import useTableIcons from '~/hooks/useTableIcons';
import { getDataTableApi, handleAuthError, processUpdateData, isAxiosError } from '~/utils/api';
import { setNotice } from '~/utils/actions';
import { addDisplayName } from '~/utils/component';
import pages from '~/_pages';

type Props<T extends object> = {
  page: DataTableApiModels;
  columns: Column<T>[];
  authHeader: { authorization: string };
  options?: Options<T>;
}

type EditFieldProps<T extends object> = {
  columnDef: Column<T>;
  onChange: ((value: any) => void);
}

const DataTable = <T extends object, >({ page, columns, authHeader, options }: Props<T>): ReactElement => {
  const { dispatch } = useDispatchContext();
  const tableIcons   = useTableIcons();

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const title                                   = useMemo(() => {
    const Icon = pages[page].icon;
    return <Icon/>;
  }, []);
  const api                                     = useMemo(() => getDataTableApi(page), []);
  const editField                               = useMemo(() => addDisplayName<FC<EditFieldProps<T>>>('EditField', (props) => {
    if (props.columnDef && props.columnDef.field) {
      const key = props.columnDef.field as string;
      if (key in validationErrors) {
        return <MTableEditField {...{
          ...props,
          onChange: value => {
            delete validationErrors[key];
            setValidationErrors(validationErrors);
            props.onChange(value);
          },
          error: true,
          helperText: validationErrors[key],
        }}/>;
      }
    }

    return <MTableEditField {...props}/>;
  }), [validationErrors]);
  const fetchData                               = useCallback(async(query: Query<T>): Promise<QueryResult<T>> => handleAuthError(dispatch, {
    data: [] as T[],
    page: 0,
    totalCount: 0,
  }, api.get, { headers: authHeader, query }), []);
  const handleValidationError                   = error => {
    if (isAxiosError(error) && error.response?.data) {
      const validationError = error.response.data as ValidationError[];
      setValidationErrors(Object.assign({}, ...validationError.map(error => ({
        [error.property]: Object.values(error.constraints ?? {})[0],
      }))));
    }
    throw error;
  };
  const handleAdd                               = useCallback(async newData => {
    try {
      await handleAuthError(dispatch, {}, api.post, {
        headers: authHeader,
        body: newData,
      });
      setNotice(dispatch, '追加しました。');
      setValidationErrors({});
    } catch (error) {
      handleValidationError(error);
    }
  }, []);
  const handleUpdate                            = useCallback(async(newData, oldData) => {
    try {
      await handleAuthError(dispatch, {}, api.detail(oldData.id).patch, {
        headers: authHeader,
        body: processUpdateData(newData),
      });
      setNotice(dispatch, '更新しました。');
      setValidationErrors({});
    } catch (error) {
      handleValidationError(error);
    }
  }, []);
  const handleDelete                            = useCallback(async oldData => {
    try {
      await handleAuthError(dispatch, {}, api.detail(oldData.id).delete, {
        headers: authHeader,
      });
      setNotice(dispatch, '削除しました。');
      setValidationErrors({});
    } catch (error) {
      handleValidationError(error);
    }
  }, []);
  const handleCanceled                          = useCallback(() => {
    setValidationErrors({});
  }, []);

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
        onRowAddCancelled: handleCanceled,
        onRowUpdateCancelled: handleCanceled,
      }}
      options={{
        emptyRowsWhenPaging: false,
        ...options,
      }}
      components={{
        EditField: editField,
      }}
    />
  </div>, [validationErrors]);
};

export default DataTable;
