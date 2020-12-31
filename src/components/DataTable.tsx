/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
import type { FC, ReactElement, Dispatch, SetStateAction } from 'react';
import type { Column, Query, QueryResult, Options } from 'material-table';
import type { DataTableApiModels } from '~/utils/api';
import type { ValidationError } from 'class-validator';
import type { AspidaResponse } from 'aspida';
import { useMemo, useCallback, useState } from 'react';
import { Grid } from '@material-ui/core';
import MaterialTable, { MTableEditField } from 'material-table';
import SearchTable from '~/components/Search';
import { useDispatchContext } from '~/store';
import useTableIcons from '~/hooks/useTableIcons';
import { getDataTableApi, handleAuthError, processUpdateData, isAxiosError } from '~/utils/api';
import { setNotice } from '~/utils/actions';
import { addDisplayName } from '~/utils/component';
import pages from '~/_pages';

type Model = Record<string, any> & {
  id: number;
}

type SearchColumn<T extends Model> = Omit<Column<T>, 'field' | 'type'> & {
  field: keyof T;
  type: 'search';
  search: {
    model: DataTableApiModels;
    api: (option?: any) => Promise<AspidaResponse<any, any, any>>,
    columns: {
      title: string;
      field: string,
      type?:
        | 'string'
        | 'boolean'
        | 'numeric'
        | 'date'
        | 'datetime'
        | 'time'
        | 'currency';
    }[];
    render?: (rowData: T) => string;
    process?: (rowData: T) => T;
  }
}
type DataTableColumn<T extends Model> = (Omit<Column<T>, 'field'> & {
  field: keyof T;
}) | SearchColumn<T>;
type EditData = {
  [model: string]: {
    [id: number]: any
  }
};
type Props<T extends Model> = {
  model: DataTableApiModels;
  columns: DataTableColumn<T>[];
  authHeader: { authorization: string };
  options?: Options<T>;
}
type EditFieldProps<T extends Model> = {
  columnDef: Column<T>;
  onChange: ((value: any) => void);
  value: any;
  error?: boolean;
  helperText?: string;
  rowData: T;
}

const controlValidationEditField = <T extends Model>(
  prefix: string,
  EditField: (props: any) => ReactElement,
  validationErrors: { [key: string]: string },
  setValidationErrors: Dispatch<SetStateAction<{ [key: string]: string }>>,
  getProps: (props: any) => any = (props) => props,
): FC<EditFieldProps<T>> => addDisplayName<FC<EditFieldProps<T>>>(prefix, (props) => {
  if (props.columnDef && props.columnDef.field) {
    const key = props.columnDef.field as string;
    if (key in validationErrors) {
      return <EditField {...getProps({
        ...props,
        onChange: value => {
          delete validationErrors[key];
          setValidationErrors(validationErrors);
          props.onChange(value);
        },
        error: true,
        helperText: validationErrors[key],
        value: props.value === null ? undefined : props.value,
      })}/>;
    }
  }

  return <EditField {...getProps({
    ...props,
    value: props.value === null ? undefined : props.value,
  })}/>;
});

const getRenderText = <T extends Model>(rowData: T, render: ((rowData: T) => string) | undefined, column: SearchColumn<T>, editData: EditData): string => {
  const id    = rowData[column.field];
  const model = column.search.model;
  const data  = model && model in editData && id in editData[model] ? editData[model][id] : rowData;
  if (!render) {
    return String(data[column.field]);
  }

  return render(data);
};

const DataTable = <T extends Model, >({ model, columns: columnsEx, authHeader, options }: Props<T>): ReactElement => {
  const { dispatch } = useDispatchContext();
  const tableIcons   = useTableIcons();

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const title                                   = useMemo(() => {
    const Icon = pages[model].icon;
    return <Grid container direction="row" alignItems="center" spacing={1}>
      <Grid item>
        <Icon/>
      </Grid>
      <Grid item>
        {pages[model].label}
      </Grid>
    </Grid>;
  }, []);
  const columns                                 = useMemo(() => columnsEx.map(column => {
    if (column.type === 'search') {
      const search                               = column.search;
      const editData: EditData                   = {};
      const editComponent: FC<EditFieldProps<T>> = (props) => {
        const onChange = (value: T) => {
          if (search.model) {
            editData[search.model] = {
              ...editData[search.model],
              [value.id]: search.process ? search.process(value) : value,
            };
          }
          props.onChange(value.id);
        };

        return <SearchTable
          model={search.model}
          api={search.api}
          columns={[
            { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
            ...search.columns,
          ]}
          searchText={getRenderText(props.rowData, search.render, column, editData)}
          authHeader={authHeader}
          props={{ ...props, onChange }}
        />;
      };
      const render                               = (data: T) => getRenderText(data, search.render, column, editData);
      const validate                             = (data: T) => {
        return {
          isValid: !!getRenderText(data, search.render, column, editData),
        };
      };

      return {
        filtering: false,
        sorting: false,
        ...column,
        type: 'string',
        editComponent,
        render,
        validate,
      } as Column<T>;
    }

    return column as Column<T>;
  }), []);
  const api                                     = useMemo(() => getDataTableApi(model), []);
  const editField                               = useMemo(() => controlValidationEditField('EditField', MTableEditField, validationErrors, setValidationErrors), [validationErrors]);
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

  return useMemo(() => <MaterialTable
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
      draggable: false,
      ...options,
    }}
    components={{
      EditField: editField,
    }}
  />, [validationErrors]);
};

export default DataTable;
