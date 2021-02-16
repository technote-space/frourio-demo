import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { Model } from '~/components/DataTable';
import type { CheckinReservation, CheckoutReservation } from '@frourio-demo/server/domains/admin/dashboard';
import type { Column } from '@technote-space/material-table';
import { useState, useCallback, useRef, useMemo } from 'react';
import MaterialTable from '@technote-space/material-table';
import { FormControl, InputLabel, Button, Card, CardContent, Grid } from '@material-ui/core';
import { Typography, TextField, Select, MenuItem } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { differenceInCalendarDays, format } from 'date-fns';
import HomeIcon from '@material-ui/icons/Home';
import CancelIcon from '@material-ui/icons/Cancel';
import { red } from '@material-ui/core/colors';
import { Bar } from 'react-chartjs-2';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import useFetch from '~/hooks/useFetch';
import useUnmountRef from '~/hooks/useUnmountRef';
import { useDispatchContext } from '~/store';
import { client, handleAuthError } from '~/utils/api';
import { getPriceCalc } from '@frourio-demo/utils/calc';
import { setNotice } from '~/utils/actions';
import useTableIcons from '~/hooks/useTableIcons';
import useTableLocalization from '~/hooks/useTableLocalization';
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
  resend: {
    marginTop: theme.spacing(1),
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
  const classes = useStyles();
  const unmountRef = useUnmountRef();
  const { dispatch } = useDispatchContext();
  const tableIcons = useTableIcons();
  const tableLocalization = useTableLocalization();
  const [date, setDate] = useState<Date>(new Date());
  const [salesDate, setSalesDate] = useState<Date>(new Date());
  const [roomId, setRoomId] = useState<number>(0);
  const [cancelId, setCancelId] = useState<number | undefined>();
  const [checkoutId, setCheckoutId] = useState<number | undefined>();
  const [amount, setAmount] = useState<number | undefined>();
  const dailySales = useFetch(dispatch, [], client.dashboard.sales.daily, {
    headers: authHeader,
    query: { date: salesDate, roomId: roomId ? roomId : undefined },
  });
  const monthlySales = useFetch(dispatch, [], client.dashboard.sales.monthly, {
    headers: authHeader,
    query: { date: salesDate, roomId: roomId ? roomId : undefined },
  });
  const selectableRooms = useFetch(dispatch, [], client.dashboard.rooms, { headers: authHeader });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkinTableRef = useRef<any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkoutTableRef = useRef<any>();
  const refreshTables = () => {
    checkinTableRef.current.onQueryChange();
    checkoutTableRef.current.onQueryChange();
  };
  const refreshSales = () => {
    dailySales.revalidate().then();
    monthlySales.revalidate().then();
  };
  const handleDateChange = useCallback(value => {
    setDate(value);
    refreshTables();
  }, []);
  const handleSalesDateChange = useCallback(value => {
    setSalesDate(value);
  }, []);
  const handleSelectRoom = useCallback(value => {
    setRoomId(Number(value.target.value));
  }, []);
  const handleCloseCancel = useCallback(() => {
    setCancelId(undefined);
  }, []);
  const handleRequest = async(request: Promise<{ id?: number }>, onSuccess: () => void) => {
    const result = await request;
    if ('id' in result) {
      onSuccess();
    } else {
      refreshTables();
    }
  };
  const handleCancel = useCallback(async() => handleRequest(handleAuthError(dispatch, {}, client.dashboard.cancel.patch, {
    headers: authHeader,
    body: { id: cancelId! },
  }), () => {
    refreshTables();
    refreshSales();
    setCancelId(undefined);
    setNotice(dispatch, 'キャンセルしました。');
  }), [cancelId]);
  const handleCloseCheckout = useCallback(() => {
    setCheckoutId(undefined);
    setAmount(undefined);
  }, []);
  const handleCheckout = useCallback(async() => handleRequest(handleAuthError(dispatch, {}, client.dashboard.checkout.patch, {
    headers: authHeader,
    body: { id: checkoutId!, payment: amount },
  }), () => {
    refreshTables();
    refreshSales();
    setCheckoutId(undefined);
    setAmount(undefined);
    setNotice(dispatch, '更新しました。');
  }), [checkoutId, amount]);
  const handleChangeAmount = useCallback(event => {
    setAmount(Number(event.target.value));
  }, []);

  const selectDate = <div className={classes.condition} data-testid="select-date">
    <DatePicker
      className={classes.date}
      disableToolbar
      variant="inline"
      format="yyyy/MM/dd"
      margin="normal"
      label="日付"
      value={date}
      onChange={handleDateChange}
      autoOk
    />
  </div>;
  const selectSalesDate = <div className={classes.condition} data-testid="select-sales-date">
    <DatePicker
      className={classes.date}
      disableToolbar
      variant="inline"
      format="yyyy/MM"
      margin="normal"
      label="選択"
      value={salesDate}
      onChange={handleSalesDateChange}
      views={['year', 'month']}
      autoOk
    />
  </div>;
  const selectTargetRoom = <div className={classes.condition} data-testid="select-target-room">
    <FormControl variant="outlined" margin="normal">
      <InputLabel>部屋</InputLabel>
      <Select value={roomId} onChange={handleSelectRoom}>
        <MenuItem value="0">
          <em>全部屋</em>
        </MenuItem>
        {selectableRooms.data?.map(room => <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>)}
      </Select>
    </FormControl>
  </div>;
  const checkinTableColumns = useMemo(() => [
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
        const resendButton = data.isValid ? <Button
          className={clsx(classes.button, classes.resend)}
          onClick={async() => handleRequest(handleAuthError(dispatch, {}, client.dashboard.checkin.post, {
            headers: authHeader,
            body: { id: data.id },
          }), () => {
            refreshTables();
            setNotice(dispatch, '送信しました。');
          })}
        >
          入室番号再送信
        </Button> : null;
        if (data.status === 'reserved') {
          return <>
            <Button
              className={classes.button}
              startIcon={<HomeIcon />}
              onClick={async() => handleRequest(handleAuthError(dispatch, {}, client.dashboard.checkin.patch, {
                headers: authHeader,
                body: { id: data.id },
              }), () => {
                refreshTables();
                setNotice(dispatch, '更新しました。');
              })}
            >
              チェックイン
            </Button>
            {resendButton}
          </>;
        }
        if (data.status === 'checkin') {
          return <>
            <Button className={classes.button} disabled>
              チェックイン済み
            </Button>
            {resendButton}
          </>;
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

        if (data.status === 'reserved') {
          return <Button
            className={clsx(classes.button, classes.cancel)}
            startIcon={<CancelIcon />}
            onClick={() => setCancelId(data.id)}
          >
            キャンセル
          </Button>;
        }

        return '';
      },
    },
  ] as Column<Model>[], [classes]);
  const checkinTableOptions = useMemo(() => ({
    emptyRowsWhenPaging: false,
    draggable: false,
  }), []);
  const checkinTableData = useCallback(async(query: Query<CheckinReservation>): Promise<QueryResult<CheckinReservation>> => handleAuthError(dispatch, {
    data: [],
    page: 0,
    totalCount: 0,
  }, client.dashboard.checkin.get, { headers: authHeader, query: { query, date } }), [authHeader, date]);
  const checkinTable = <div className={classes.table} data-testid="checkin-table">
    <MaterialTable
      tableRef={checkinTableRef}
      icons={tableIcons}
      localization={tableLocalization}
      title='チェックイン'
      columns={checkinTableColumns}
      data={checkinTableData}
      options={checkinTableOptions}
      unmountRef={unmountRef}
    />
  </div>;
  const checkoutTableColumns = useMemo(() => [
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
      sorting: false,
      // eslint-disable-next-line react/display-name
      render: data => {
        if (!data.room) {
          return data.amount;
        }

        return <>
          <div>¥{data.amount}</div>
          <div style={{
            whiteSpace: 'nowrap',
          }}>{`(${getPriceCalc(data.room.price, data.number, data.checkin, data.checkout, data.amount)})`}</div>
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
            startIcon={<HomeIcon />}
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
  ] as Column<Model>[], [classes]);
  const checkoutTableOptions = useMemo(() => ({
    emptyRowsWhenPaging: false,
    draggable: false,
  }), []);
  const checkoutTableData = useCallback(async(query: Query<CheckoutReservation>): Promise<QueryResult<CheckoutReservation>> => handleAuthError(dispatch, {
    data: [] as CheckoutReservation[],
    page: 0,
    totalCount: 0,
  }, client.dashboard.checkout.get, { headers: authHeader, query: { query, date } }), [authHeader, date]);
  const checkoutTable = <div className={classes.table} data-testid="checkout-table">
    <MaterialTable
      tableRef={checkoutTableRef}
      icons={tableIcons}
      localization={tableLocalization}
      title='チェックアウト'
      columns={checkoutTableColumns}
      data={checkoutTableData}
      options={checkoutTableOptions}
      unmountRef={unmountRef}
    />
  </div>;
  const dailySalesData = useMemo(() => ({
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
  }), [dailySales]);
  const dailySalesOptions = useMemo(() => ({
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }), []);
  const dailySalesBar = <div className={classes.chart} data-testid="daily-sales">
    <Bar
      data={dailySalesData}
      options={dailySalesOptions}
    />
  </div>;
  const monthlySalesData = useMemo(() => ({
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
  }), [monthlySales]);
  const monthlySalesOptions = useMemo(() => ({
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }), []);
  const monthlySalesBar = <div className={classes.chart} data-testid="monthly-sales">
    <Bar
      data={monthlySalesData}
      options={monthlySalesOptions}
    />
  </div>;
  const cancelDialog = <Dialog
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
  </Dialog>;
  const checkoutDialog = <Dialog
    onClose={handleCloseCheckout}
    maxWidth="xs"
    open={checkoutId !== undefined}
  >
    <DialogTitle>チェックアウト</DialogTitle>
    <DialogContent dividers>
      <div className={classes.buttonGroup}>
        <TextField type="number" value={amount ?? ''} onChange={handleChangeAmount} data-testid="checkout-payment" />
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
  </Dialog>;

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
