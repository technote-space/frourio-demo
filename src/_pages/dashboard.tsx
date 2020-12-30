import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Query, QueryResult } from 'material-table';
import { useState, useMemo, useCallback, useRef } from 'react';
import MaterialTable from 'material-table';
import { Button, Card, CardContent, Grid } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { differenceInCalendarDays, format } from 'date-fns';
import HomeIcon from '@material-ui/icons/Home';
import CancelIcon from '@material-ui/icons/Cancel';
import { red } from '@material-ui/core/colors';
import { Bar } from 'react-chartjs-2';
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
  card: {
    margin: theme.spacing(2, 0),
  },
  dateWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  date: {
    width: 'auto',
  },
  table: {
    margin: theme.spacing(2, 0),
  },
  button: {
    whiteSpace: 'nowrap',
    letterSpacing: 0,
  },
  cancel: {
    backgroundColor: red['600'],
  },
  chart: {
    backgroundColor: 'white',
    padding: theme.spacing(1),
  },
}));

const Dashboard: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Dashboard');

  const classes                   = useStyles();
  const { dispatch }              = useDispatchContext();
  const tableIcons                = useTableIcons();
  const [date, setDate]           = useState<Date>(new Date());
  const [salesDate, setSalesDate] = useState<Date>(new Date());
  const dailySales                = useFetch(dispatch, [], client.dashboard.sales.daily, {
    headers: authHeader,
    query: { date: salesDate },
  });
  const monthlySales              = useFetch(dispatch, [], client.dashboard.sales.monthly, {
    headers: authHeader,
    query: { date: salesDate },
  });
  const checkinTableRef           = useRef<any>();
  const checkoutTableRef          = useRef<any>();
  const refreshTables             = () => {
    if (checkinTableRef.current?.onQueryChange) {
      checkinTableRef.current.onQueryChange();
    }
    if (checkoutTableRef.current?.onQueryChange) {
      checkoutTableRef.current.onQueryChange();
    }
  };
  const refreshSales              = () => {
    dailySales.revalidate().then();
    monthlySales.revalidate().then();
  };
  const handleDateChange          = useCallback(value => {
    setDate(value);
    refreshTables();
  }, []);
  const handleSalesDateChange     = useCallback(value => {
    setSalesDate(value);
    refreshSales();
  }, []);

  const selectDate      = useMemo(() => <div className={classes.dateWrap}>
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
  const selectSalesDate = useMemo(() => <div className={classes.dateWrap}>
    <KeyboardDatePicker
      className={classes.date}
      disableToolbar
      variant="inline"
      format="yyyy/MM"
      margin="normal"
      label="Date"
      value={salesDate}
      onChange={handleSalesDateChange}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
      views={['year', 'month']}
    />
  </div>, [classes, salesDate]);
  const checkinTable    = useMemo(() => <div className={classes.table}>
    <MaterialTable
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
          title: 'Checkin', align: 'center', render: data => {
            if (data.status === 'reserved') {
              return <Button
                className={classes.button}
                startIcon={<HomeIcon/>}
                onClick={async() => {
                  await client.dashboard.checkin.patch({
                    headers: authHeader,
                    body: { id: data.id },
                  });
                  refreshTables();
                }}
              >
                チェックイン
              </Button>;
            }
            if (data.status === 'checkin') {
              return <Button className={classes.button} disabled>
                チェックイン済み
              </Button>;
            }
            if (data.status === 'checkout') {
              return <Button className={classes.button} disabled>
                チェックアウト済み
              </Button>;
            }

            return '';
          },
        },
        {
          // eslint-disable-next-line react/display-name
          title: 'Cancel', align: 'center', render: data => {
            return <Button
              className={clsx(classes.button, classes.cancel)}
              startIcon={<CancelIcon/>}
              onClick={async() => {
                await client.dashboard.cancel.patch({
                  headers: authHeader,
                  body: { id: data.id },
                });
                refreshTables();
                refreshSales();
              }}
            >
              キャンセル
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
    />
  </div>, [date]);
  const checkoutTable   = useMemo(() => <div className={classes.table}>
    <MaterialTable
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
          title: 'Checkout', align: 'center', render: data => {
            if (data.status === 'checkin') {
              return <Button
                className={classes.button}
                startIcon={<HomeIcon/>}
                onClick={async() => {
                  await client.dashboard.checkout.patch({
                    headers: authHeader,
                    body: { id: data.id },
                  });
                  refreshTables();
                  refreshSales();
                }}
              >
                チェックアウト
              </Button>;
            }
            if (data.status === 'checkout') {
              return <Button className={classes.button} disabled>
                チェックアウト済み
              </Button>;
            }

            return '';
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
    />
  </div>, [date]);
  const dailySalesBar   = useMemo(() => <div className={classes.chart}>
    <Bar
      data={{
        labels: dailySales.data?.map(item => format(new Date(item.day), 'yyyy-MM-dd')) ?? [],
        datasets: [
          {
            label: 'Daily sales',
            data: dailySales.data?.map(item => item.sales) ?? [],
            borderColor: 'rgba(0,128,0)',
            backgroundColor: 'rgba(64,128,64)',
            borderWidth: 1,
          },
        ],
      }}
      options={{
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      }}
    />
  </div>, [dailySales.data]);
  const monthlySalesBar = useMemo(() => <div className={classes.chart}>
    <Bar
      data={{
        labels: monthlySales.data?.map(item => format(new Date(item.month), 'yyyy-MM')) ?? [],
        datasets: [
          {
            label: 'Monthly sales',
            data: monthlySales.data?.map(item => item.sales) ?? [],
            borderColor: 'rgba(0,0,255)',
            backgroundColor: 'rgba(128,128,255)',
            borderWidth: 1,
          },
        ],
      }}
      options={{
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      }}
    />
  </div>, [monthlySales.data]);

  return <div>
    <Card className={classes.card}>
      <CardContent>
        {selectDate}
        {checkinTable}
        {checkoutTable}
      </CardContent>
    </Card>
    <Card className={classes.card}>
      <CardContent>
        {selectSalesDate}
        <Grid container spacing={2}>
          <Grid item sm={12} md={6}>
            {dailySalesBar}
          </Grid>
          <Grid item sm={12} md={6}>
            {monthlySalesBar}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </div>;
};

export default AuthenticatedPage(Dashboard);
