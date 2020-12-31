/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
import type { ReactElement } from 'react';
import type { Column, Query, QueryResult, Action } from 'material-table';
import type { DataTableApiModels } from '~/utils/api';
import type { AspidaResponse } from 'aspida';
import { useMemo, useCallback, useState } from 'react';
import MaterialTable from 'material-table';
import { Dialog, DialogTitle, Link, IconButton, Typography, FormControl, FormHelperText } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatchContext } from '~/store';
import useTableIcons from '~/hooks/useTableIcons';
import { handleAuthError } from '~/utils/api';
import pages from '~/_pages';
import { SvgIconComponent } from '@material-ui/icons';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 0,
    padding: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    letterSpacing: '.1rem',
  },
}));

type EditFieldProps<T extends Record<string, any>> = {
  columnDef: Column<T>;
  onChange: ((value: any) => void);
  error?: boolean;
  helperText?: string;
} & {
  [key: string]: any;
}

type Props<T extends object> = {
  model: DataTableApiModels;
  api: (option?: any) => Promise<AspidaResponse<any, any, any>>;
  columns: Column<T>[];
  authHeader: { authorization: string };
  searchText?: string;
  props: EditFieldProps<T>;
}

const SearchTable = <T extends {
  id: number;
}, >({ model, api, columns, authHeader, searchText, props: editFieldProps }: Props<T>): ReactElement => {
  const classes      = useStyles();
  const { dispatch } = useDispatchContext();

  // dialog
  const [open, setOpen]  = useState(false);
  const handleClickField = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose      = useCallback(() => {
    setOpen(false);
  }, []);

  // material table
  const tableIcons = useTableIcons();
  const title      = useMemo(() => pages[model].label, []);
  const icon       = useMemo(() => {
    const Icon = pages[model].icon;
    return <Icon/>;
  }, []);
  const actions    = useMemo<Action<T>[]>(() => [{
    icon: tableIcons.Check as SvgIconComponent,
    tooltip: 'Select',
    onClick: (event, data) => {
      if ('id' in data) {
        editFieldProps.onChange(data);
      }
      setOpen(false);
    },
  }], []);
  const fetchData  = useCallback(async(query: Query<T>): Promise<QueryResult<T>> => handleAuthError(dispatch, {
    data: [] as T[],
    page: 0,
    totalCount: 0,
  }, api, { headers: authHeader, query }), []);

  const cell     = useMemo(() => <FormControl error={Boolean(editFieldProps.error)}>
    <Link
      component="button"
      variant="body2"
      onClick={handleClickField}
    >
      {searchText || '選択'}
    </Link>
    {editFieldProps.helperText && <FormHelperText>{editFieldProps.helperText}</FormHelperText>}
  </FormControl>, [searchText, editFieldProps.helperText]);
  const editCell = useMemo(() => <Dialog open={open} onClose={handleClose}>
    <DialogTitle disableTypography className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      <IconButton aria-label="close" onClick={handleClose}>
        <CloseIcon/>
      </IconButton>
    </DialogTitle>
    <MaterialTable
      icons={tableIcons}
      title={icon}
      columns={columns}
      data={fetchData}
      actions={actions}
      options={{
        emptyRowsWhenPaging: false,
        searchText,
      }}
    />
  </Dialog>, [classes, open, searchText]);
  return <>
    {cell}
    {editCell}
  </>;
};

export default SearchTable;
