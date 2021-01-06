import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Query, QueryResult } from 'material-table';
import { useState, useMemo, useCallback, useRef } from 'react';
import MaterialTable from 'material-table';
import {
  FormControl,
  InputLabel,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
} from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
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
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  card: {
    margin: theme.spacing(2, 0),
  },
  wrapCondition: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  condition: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
  },
  date: {
    width: 'auto',
  },
  table: {
    margin: theme.spacing(2, 0),
  },
  buttonGroup: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    whiteSpace: 'nowrap',
    letterSpacing: 0,
    backgroundColor: theme.palette.primary.main,
  },
  dialogButton: {
    margin: theme.spacing(0, 1),
    minWidth: '6rem',
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

  const classes                     = useStyles();
  const { dispatch }                = useDispatchContext();
  const tableIcons                  = useTableIcons();
  const [date, setDate]             = useState<Date>(new Date());
  const [salesDate, setSalesDate]   = useState<Date>(new Date());
  const [roomId, setRoomId]         = useState<number>(0);
  const [cancelId, setCancelId]     = useState<number | undefined>();
  const [checkoutId, setCheckoutId] = useState<number | undefined>();
  const [amount, setAmount]         = useState<number | undefined>();
  const dailySales                  = useFetch(dispatch, [], client.dashboard.sales.daily, {
    headers: authHeader,
    query: { date: salesDate, roomId: roomId ? roomId : undefined },
  });
  const monthlySales                = useFetch(dispatch, [], client.dashboard.sales.monthly, {
    headers: authHeader,
    query: { date: salesDate, roomId: roomId ? roomId : undefined },
  });
  const selectableRooms             = useFetch(dispatch, [], client.dashboard.rooms, { headers: authHeader });
  const checkinTableRef             = useRef<any>();
  const checkoutTableRef            = useRef<any>();
  const refreshTables               = () => {
    if (checkinTableRef.current?.onQueryChange) {
      checkinTableRef.current.onQueryChange();
    }
    if (checkoutTableRef.current?.onQueryChange) {
      checkoutTableRef.current.onQueryChange();
    }
  };
  const refreshSales                = () => {
    dailySales.revalidate().then();
    monthlySales.revalidate().then();
  };
  const handleDateChange            = useCallback(value => {
    setDate(value);
    refreshTables();
  }, []);
  const handleSalesDateChange       = useCallback(value => {
    setSalesDate(value);
    refreshSales();
  }, []);
  const handleSelectRoom            = useCallback(value => {
    setRoomId(Number(value.target.value));
    refreshSales();
  }, []);
  const handleCloseCancel           = useCallback(() => {
    setCancelId(undefined);
  }, []);
  const handleCancel                = useCallback(async() => {
    if (cancelId) {
      await client.dashboard.cancel.patch({
        headers: authHeader,
        body: { id: cancelId },
      });
      setCancelId(undefined);
      refreshTables();
      refreshSales();
    }
  }, [cancelId]);
  const handleCloseCheckout         = useCallback(() => {
    setCheckoutId(undefined);
    setAmount(undefined);
  }, []);
  const handleCheckout              = useCallback(async() => {
    if (checkoutId) {
      await client.dashboard.checkout.patch({
        headers: authHeader,
        body: { id: checkoutId, payment: amount },
      });
      refreshTables();
      refreshSales();
      setCheckoutId(undefined);
      setAmount(undefined);
    }
  }, [checkoutId, amount]);
  const handleChangeAmount          = useCallback(event => {
    setAmount(Number(event.target.value));
  }, []);

  const selectDate       = useMemo(() => <div className={classes.condition}>
    <KeyboardDatePicker
      className={classes.date}
      disableToolbar
      variant="inline"
      format="yyyy/MM/dd"
      margin="normal"
      label="日付"
      value={date}
      onChange={handleDateChange}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
    />
  </div>, [classes, date]);
  const selectSalesDate  = useMemo(() => <div className={classes.condition}>
    <KeyboardDatePicker
      className={classes.date}
      disableToolbar
      variant="inline"
      format="yyyy/MM"
      margin="normal"
      label="選択"
      value={salesDate}
      onChange={handleSalesDateChange}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
      views={['year', 'month']}
    />
  </div>, [classes, salesDate]);
  const selectTargetRoom = useMemo(() => <div className={classes.condition}>
    <FormControl variant="outlined" margin="normal">
      <InputLabel>部屋</InputLabel>
      <Select value={roomId} onChange={handleSelectRoom}>
        <MenuItem value="0">
          <em>None</em>
        </MenuItem>
        {selectableRooms.data?.map(room => <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>)}
      </Select>
    </FormControl>
  </div>, [classes, roomId, selectableRooms.data]);
  const checkinTable     = useMemo(() => <div className={classes.table}>
    <MaterialTable
      tableRef={checkinTableRef}
      icons={tableIcons}
      title='チェックイン'
      columns={[
        { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
        { title: '名前', field: 'guestName' },
        { title: 'かな名', field: 'guestNameKana' },
        { title: '電話番号', field: 'guestPhone' },
        { title: '部屋名', field: 'roomName' },
        {
          title: '泊数',
          sorting: false,
          // eslint-disable-next-line react/display-name
          render: data => {
            const nights = differenceInCalendarDays(new Date(data.checkout), new Date(data.checkin));
            return `${nights}泊`;
          },
        },
        {
          title: 'チェックイン',
          align: 'center',
          sorting: false,
          // eslint-disable-next-line react/display-name
          render: data => {
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
          title: 'キャンセル',
          align: 'center',
          sorting: false,
          // eslint-disable-next-line react/display-name
          render: data => {
            if (data.status === 'cancelled') {
              return <Button className={classes.button} disabled>
                キャンセル済み
              </Button>;
            }

            return <Button
              className={clsx(classes.button, classes.cancel)}
              startIcon={<CancelIcon/>}
              onClick={() => setCancelId(data.id)}
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
        draggable: false,
      }}
    />
  </div>, [classes, date]);
  const checkoutTable    = useMemo(() => <div className={classes.table}>
    <MaterialTable
      tableRef={checkoutTableRef}
      icons={tableIcons}
      title='チェックアウト'
      columns={[
        { title: 'ID', field: 'id', hidden: true, defaultSort: 'desc' },
        { title: '名前', field: 'guestName' },
        { title: 'かな名', field: 'guestNameKana' },
        { title: '部屋名', field: 'roomName' },
        {
          title: 'チェックアウト時間',
          sorting: false,
          // eslint-disable-next-line react/display-name
          render: data => {
            const checkout = new Date(data.checkout);
            return `${('0' + checkout.getHours()).slice(-2)}:${('0' + checkout.getMinutes()).slice(-2)}`;
          },
        },
        {
          title: '請求額',
          // eslint-disable-next-line react/display-name
          render: data => {
            if (!data.room) {
              return data.amount;
            }

            const diff   = differenceInCalendarDays(new Date(data.checkout), new Date(data.checkin));
            const amount = data.room.price * data.number * diff;
            return <>
              <div>¥{data.amount}</div>
              <div style={{
                whiteSpace: 'nowrap',
              }}>{`(${data.room.price} * ${data.number}人 * ${diff}泊 = ${amount})`}</div>
            </>;
          },
        },
        {
          title: 'チェックアウト',
          align: 'center',
          sorting: false,
          // eslint-disable-next-line react/display-name
          render: data => {
            if (data.status === 'reserved') {
              return <Button className={classes.button} disabled>
                未チェックイン
              </Button>;
            }
            if (data.status === 'checkin') {
              return <Button
                className={classes.button}
                startIcon={<HomeIcon/>}
                onClick={() => {
                  setCheckoutId(data.id);
                  setAmount(data.amount);
                }}
              >
                チェックアウト
              </Button>;
            }
            if (data.status === 'checkout') {
              if (data.payment !== data.amount) {
                return <Button className={classes.button} disabled>
                  チェックアウト済み (¥{data.payment})
                </Button>;
              }

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
        draggable: false,
      }}
    />
  </div>, [classes, date]);
  const dailySalesBar    = useMemo(() => <div className={classes.chart}>
    <Bar
      data={{
        labels: dailySales.data?.map(item => format(new Date(item.day), 'd')) ?? [],
        datasets: [
          {
            label: dailySales.data?.length ? `日別売上（${format(new Date(dailySales.data[0].day), 'yyyy年M月')}）` : '日別売上',
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
  </div>, [classes, dailySales.data]);
  const monthlySalesBar  = useMemo(() => <div className={classes.chart}>
    <Bar
      data={{
        labels: monthlySales.data?.map(item => format(new Date(item.month), 'M月')) ?? [],
        datasets: [
          {
            label: monthlySales.data?.length ? `月別売上（${format(new Date(monthlySales.data[0].month), 'yyyy年')}）` : '月別売上',
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
  </div>, [classes, monthlySales.data]);
  const cancelDialog     = useMemo(() => <Dialog
    onClose={handleCloseCancel}
    maxWidth="xs"
    open={cancelId !== undefined}
  >
    <DialogTitle>キャンセル</DialogTitle>
    <DialogContent dividers>
      <Typography>
        本当にキャンセルしてもよろしいですか？
      </Typography>
      <div className={classes.buttonGroup}>
        <Button className={clsx(classes.button, classes.dialogButton)} onClick={handleCancel}>
          はい
        </Button>
        <Button className={clsx(classes.button, classes.cancel, classes.dialogButton)} onClick={handleCloseCancel}>
          閉じる
        </Button>
      </div>
    </DialogContent>
  </Dialog>, [classes, cancelId]);
  const checkoutDialog   = useMemo(() => <Dialog
    onClose={handleCloseCheckout}
    maxWidth="xs"
    open={checkoutId !== undefined}
  >
    <DialogTitle>チェックアウト</DialogTitle>
    <DialogContent dividers>
      <div className={classes.buttonGroup}>
        <TextField type="number" value={amount} onChange={handleChangeAmount}/>
        <Button className={clsx(classes.button, classes.dialogButton)} onClick={handleCheckout}>
          確定
        </Button>
      </div>
      <div className={classes.buttonGroup}>
        <Button className={clsx(classes.button, classes.cancel, classes.dialogButton)} onClick={handleCloseCheckout}>
          閉じる
        </Button>
      </div>
    </DialogContent>
  </Dialog>, [classes, checkoutId, amount]);

  return <>
    {cancelDialog}
    {checkoutDialog}
    <Card className={classes.card}>
      <CardContent>
        <div className={classes.wrapCondition}>
          {selectDate}
        </div>
        {checkinTable}
        {checkoutTable}
      </CardContent>
    </Card>
    <Card className={classes.card}>
      <CardContent>
        <div className={classes.wrapCondition}>
          {selectTargetRoom}
          {selectSalesDate}
        </div>
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
  </>;
};

export default AuthenticatedPage(Dashboard);
