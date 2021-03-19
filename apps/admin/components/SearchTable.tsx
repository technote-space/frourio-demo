/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
import type { ReactElement, MutableRefObject } from 'react';
import type { Column, Query, QueryResult, Action } from '@technote-space/material-table';
import type { DataTableApiModels } from '~/utils/api';
import type { AspidaResponse } from 'aspida';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import type { AuthHeader } from '@frourio-demo/types';
import { memo, useMemo, useCallback, useState } from 'react';
import MaterialTable from '@technote-space/material-table';
import { Dialog, DialogTitle, Link, IconButton, Typography, FormControl, FormHelperText } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatchContext } from '~/store';
import useTableIcons from '@technote-space/use-material-table-icons';
import useTableLocalization from '@technote-space/material-table-localization-jp';
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

type Props<T extends Model> = {
  model: DataTableApiModels;
  api: (option?: any) => Promise<AspidaResponse<any, any, any>>;
  columns: Column<T>[];
  authHeader: AuthHeader;
  searchText?: string;
  props: EditComponentPropsWithError<Model>;
  unmountRef: MutableRefObject<boolean>;
}

const SearchTable = memo(<T extends Model>({
  model, api, columns, authHeader, searchText, props, unmountRef,
}: Props<T>): ReactElement => {
  const classes = useStyles();
  const { dispatch } = useDispatchContext();

  // dialog
  const [open, setOpen] = useState(false);
  const handleClickField = useCallback(() => {
    setOpen(true);
    props.hideError();
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // material table
  const tableIcons = useTableIcons();
  const tableLocalization = useTableLocalization();
  const icon = useMemo(() => {
    const Icon = pages[model].icon;
    return <Icon/>;
  }, []);
  const actions = useMemo<Action<T>[]>(() => [{
    icon: tableIcons.Check as SvgIconComponent,
    tooltip: 'Select',
    onClick: (event, data) => {
      props.onChange(data);
      setOpen(false);
    },
  }], []);
  const fetchData = useCallback(async(query: Query<T>): Promise<QueryResult<T>> => handleAuthError(dispatch, {
    data: [] as T[],
    page: 0,
    totalCount: 0,
  }, api, { headers: authHeader, query }), []);

  return <>
    <FormControl error={Boolean(props.error)}>
      <Link
        component="button"
        variant="body2"
        onClick={handleClickField}
      >
        {searchText || '選択'}
      </Link>
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
    <Dialog open={open} onClose={handleClose}>
      <div data-testid={`${model}-search-table`}>
        <DialogTitle disableTypography className={classes.root}>
          <Typography variant="h6" className={classes.title}>
            {pages[model].label}
          </Typography>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon/>
          </IconButton>
        </DialogTitle>
        <MaterialTable
          icons={tableIcons}
          localization={tableLocalization}
          title={icon}
          columns={columns.map(col => {
            const colClone = { ...col };
            delete colClone['tableData'];
            return colClone;
          })}
          data={fetchData}
          actions={actions}
          options={{
            emptyRowsWhenPaging: false,
            searchText,
          }}
          unmountRef={unmountRef}
        />
      </div>
    </Dialog>
  </>;
});

SearchTable.displayName = 'SearchTable';
export default SearchTable;
