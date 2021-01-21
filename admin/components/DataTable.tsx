/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
import type { FC, ReactElement, Dispatch, SetStateAction, MutableRefObject } from 'react';
import type { Column, Query, QueryResult, Options, EditComponentProps } from '@technote-space/material-table';
import type { DataTableApiModels } from '~/utils/api';
import type { ValidationError } from 'class-validator';
import { useMemo, useCallback, useState } from 'react';
import { Grid } from '@material-ui/core';
import MaterialTable, { MTableEditField } from '@technote-space/material-table';
import { useDispatchContext } from '~/store';
import useTableIcons from '~/hooks/useTableIcons';
import { getDataTableApi, handleAuthError, processUpdateData, isAxiosError } from '~/utils/api';
import { setNotice } from '~/utils/actions';
import { addDisplayName } from '~/utils/component';
import pages from '~/_pages';

export type Model = Record<string, any> & {
  id: number;
}
export type EditComponentPropsWithError<T extends Model> = EditComponentProps<T> & {
  helperText?: string;
  hideError: () => void;
}

type CustomColumn<T extends Model> = Omit<Column<T>, 'field' | 'editable' | 'render'> & {
  editable: 'never';
  render: Required<Pick<Column<T>, 'render'>['render']>;
}
type DataTableColumn<T extends Model> = (Omit<Column<T>, 'field'> & {
  field: keyof T;
}) | CustomColumn<T>;
type Props<T extends Model> = {
  model: DataTableApiModels;
  columns: DataTableColumn<T>[];
  authHeader: { authorization: string };
  options?: Options<T>;
  unmountRef: MutableRefObject<boolean>;
}
type EditFieldProps<T extends Model> = {
  columnDef: Column<T>;
  onChange: ((value: any) => void);
  value: any;
  error?: boolean;
  helperText?: string;
  rowData: T;
}

declare module '@technote-space/material-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Column<RowData extends object> {
    editComponentWithError?: (
      props: EditComponentPropsWithError<Model>,
    ) => ReactElement;
  }
}

const controlValidationEditField = <T extends Model>(
  prefix: string,
  EditField: (props: any) => ReactElement,
  validationErrors: Record<string, string>,
  setValidationErrors: Dispatch<SetStateAction<Record<string, string>>>,
  getProps: (props: any) => any = (props) => props,
): FC<EditFieldProps<T>> => addDisplayName<FC<EditFieldProps<T>>>(prefix, (props) => {
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
      value: props.value,
    })}/>;
  }

  return <EditField {...getProps({
    ...props,
    value: props.value,
  })}/>;
});

const DataTable = <T extends Model, >({
  model,
  columns: columnsEx,
  authHeader,
  options,
  unmountRef,
}: Props<T>): ReactElement => {
  const { dispatch } = useDispatchContext();
  const tableIcons = useTableIcons();

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const title = useMemo(() => {
    const Icon = pages[model].icon;
    return <Grid container direction="row" alignItems="center" spacing={1} data-testid="table-title">
      <Grid item>
        <Icon/>
      </Grid>
      <Grid item>
        {pages[model].label}
      </Grid>
    </Grid>;
  }, []);
  const wrapEditComponent = (column: Column<T>): Column<T> => {
    if ('editComponentWithError' in column && column.editComponentWithError) {
      // eslint-disable-next-line react/display-name
      column.editComponent = (props: EditComponentProps<T>) => {
        const key = props.columnDef.field as string;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return column.editComponentWithError!({
          ...props,
          error: key in validationErrors,
          helperText: validationErrors[key] ?? undefined,
          hideError: () => {
            if (key in validationErrors) {
              delete validationErrors[key];
              setValidationErrors(validationErrors);
              props.onChange(props.value);
            }
          },
        });
      };
    }
    return column;
  };
  const columns = useMemo(() => columnsEx.map(column => {
    if (!('field' in column) && column.editable === 'never') {
      return wrapEditComponent({
        filtering: false,
        searchable: false,
        sorting: false,
        ...column,
      } as Column<T>);
    }

    return wrapEditComponent(column as Column<T>);
  }), [validationErrors]);
  const api = useMemo(() => getDataTableApi(model), []);
  const editField = useMemo(() => controlValidationEditField('EditField', MTableEditField, validationErrors, setValidationErrors), [validationErrors]);
  const fetchData = useCallback(async(query: Query<T>): Promise<QueryResult<T>> => handleAuthError(dispatch, {
    data: [] as T[],
    page: 0,
    totalCount: 0,
  }, api.get, { headers: authHeader, query }), []);
  const handleValidationError = error => {
    if (!unmountRef.current && isAxiosError(error) && error.response?.data) {
      const validationError = error.response.data as ValidationError[];
      setValidationErrors(Object.assign({}, ...validationError.map(error => error.constraints ? {
        [error.property]: Object.values(error.constraints)[0],
      } : undefined)));
    }
    throw error;
  };
  const handleAdd = useCallback(async newData => {
    try {
      await handleAuthError(dispatch, undefined, api.post, {
        headers: authHeader,
        body: newData,
      });
      setNotice(dispatch, '追加しました。');
      setValidationErrors({});
    } catch (error) {
      handleValidationError(error);
    }
  }, [unmountRef]);
  const handleUpdate = useCallback(async(newData, oldData) => {
    try {
      await handleAuthError(dispatch, undefined, api.detail(oldData.id).patch, {
        headers: authHeader,
        body: processUpdateData(newData),
      });
      setNotice(dispatch, '更新しました。');
      setValidationErrors({});
    } catch (error) {
      handleValidationError(error);
    }
  }, [unmountRef]);
  const handleDelete = useCallback(async oldData => {
    try {
      await handleAuthError(dispatch, undefined, api.detail(oldData.id).delete, {
        headers: authHeader,
      });
      setNotice(dispatch, '削除しました。');
      setValidationErrors({});
    } catch (error) {
      handleValidationError(error);
    }
  }, [unmountRef]);
  const handleCanceled = useCallback(() => {
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
    unmountRef={unmountRef}
  />, [validationErrors, unmountRef]);
};

export default DataTable;
