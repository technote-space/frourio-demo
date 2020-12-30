import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Query, QueryResult } from 'material-table';
import { useState, useMemo, useCallback, useRef } from 'react';
import MaterialTable from 'material-table';
import { Button } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { differenceInCalendarDays } from 'date-fns';
import HomeIcon from '@material-ui/icons/Home';
import CancelIcon from '@material-ui/icons/Cancel';
import { red } from '@material-ui/core/colors';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { client, handleAuthError } from '~/utils/api';
import useTableIcons from '~/hooks/useTableIcons';
import { CheckinReservation, CheckoutReservation } from '$/domains/dashboard';
import { getWord } from '~/utils';
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  dateWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  date: {
    width: 'auto',
  },
  button: {
    margin: theme.spacing(1),
  },
  cancel: {
    backgroundColor: red['600'],
  },
}));

const Dashboard: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Dashboard');

  const classes          = useStyles();
  const { dispatch }     = useDispatchContext();
  const tableIcons       = useTableIcons();
  const [date, setDate]  = useState<Date>(new Date());
  const dailySales       = useFetch(dispatch, [], client.dashboard.sales.daily, { headers: authHeader });
  const monthlySales     = useFetch(dispatch, [], client.dashboard.sales.monthly, { headers: authHeader });
  const checkinTableRef  = useRef<any>();
  const checkoutTableRef = useRef<any>();
  const handleDateChange = useCallback(value => {
    setDate(value);
    if (checkinTableRef.current?.onQueryChange) {
      checkinTableRef.current.onQueryChange();
    }
    if (checkoutTableRef.current?.onQueryChange) {
      checkoutTableRef.current.onQueryChange();
    }
  }, []);


  console.log(date);
  const selectDate    = useMemo(() => <div className={classes.dateWrap}>
    <KeyboardDatePicker
      className={classes.date}
      disableToolbar
      variant="inline"
      format="yyyy/MM/dd"
      margin="normal"
      label="Date"
      value={date}
      onChange={handleDateChange}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
    />
  </div>, [classes, date]);
  const checkinTable  = useMemo(() => <MaterialTable
    tableRef={checkinTableRef}
    icons={tableIcons}
    title={'Checkin'}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      { title: 'Guest name', field: 'guestName' },
      { title: 'Guest name(Kana)', field: 'guestNameKana' },
      { title: 'Guest phone number', field: 'guestPhone' },
      { title: 'Room name', field: 'roomName' },
      {
        // eslint-disable-next-line react/display-name
        title: 'Nights', render: data => {
          const nights = differenceInCalendarDays(new Date(data['checkout']), new Date(data['checkin']));
          return `${nights}${getWord('night', nights)}`;
        },
      },
      {
        // eslint-disable-next-line react/display-name
        title: 'Checkin', render: data => {
          return <Button className={classes.button} startIcon={<HomeIcon/>}>
            Checkin
          </Button>;
        },
      },
      {
        // eslint-disable-next-line react/display-name
        title: 'Cancel', render: data => {
          return <Button className={clsx(classes.button, classes.cancel)} startIcon={<CancelIcon/>}>
            Cancel
          </Button>;
        },
      },
    ]}
    data={async(query: Query<CheckinReservation>): Promise<QueryResult<CheckinReservation>> => handleAuthError(dispatch, {
      data: [] as CheckinReservation[],
      page: 0,
      totalCount: 0,
    }, client.dashboard.checkin.get, { headers: authHeader, query: { query, date } })}
    options={{
      emptyRowsWhenPaging: false,
    }}
  />, [date]);
  const checkoutTable = useMemo(() => <MaterialTable
    tableRef={checkoutTableRef}
    icons={tableIcons}
    title={'Checkout'}
    columns={[
      { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
      { title: 'Guest name', field: 'guestName' },
      { title: 'Guest name(Kana)', field: 'guestNameKana' },
      { title: 'Room name', field: 'roomName' },
      {
        // eslint-disable-next-line react/display-name
        title: 'Checkout time', render: data => {
          const checkout = new Date(data['checkout']);
          return `${('0' + checkout.getHours()).slice(-2)}:${('0' + checkout.getMinutes()).slice(-2)}`;
        },
      },
      {
        // eslint-disable-next-line react/display-name
        title: 'Checkout', render: data => {
          return <Button className={classes.button} startIcon={<HomeIcon/>}>Checkout</Button>;
        },
      },
    ]}
    data={async(query: Query<CheckoutReservation>): Promise<QueryResult<CheckoutReservation>> => handleAuthError(dispatch, {
      data: [] as CheckoutReservation[],
      page: 0,
      totalCount: 0,
    }, client.dashboard.checkout.get, { headers: authHeader, query: { query, date } })}
    options={{
      emptyRowsWhenPaging: false,
    }}
  />, [date]);

  return <div>
    {selectDate}
    {checkinTable}
    {checkoutTable}
    {JSON.stringify(dailySales.data)}
    {JSON.stringify(monthlySales.data)}
  </div>;
};

export default AuthenticatedPage(Dashboard);
