import type { FC } from 'react';
import type { AuthenticatedPageProps } from '~/components/AuthenticatedPage';
import type { Query, QueryResult } from 'material-table';
import { useState, useMemo } from 'react';
import MaterialTable from 'material-table';
import { IconButton } from '@material-ui/core';
import { differenceInCalendarDays } from 'date-fns';
import HomeIcon from '@material-ui/icons/Home';
import CancelIcon from '@material-ui/icons/Cancel';
import AuthenticatedPage from '~/components/AuthenticatedPage';
import useFetch from '~/hooks/useFetch';
import { useDispatchContext } from '~/store';
import { client, handleAuthError } from '~/utils/api';
import useTableIcons from '~/hooks/useTableIcons';
import { CheckinReservation, CheckoutReservation } from '$/domains/dashboard';
import * as React from 'react';

const Dashboard: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  console.log('page::Dashboard');

  const { dispatch }    = useDispatchContext();
  const tableIcons      = useTableIcons();
  const [date, setDate] = useState<Date>(new Date());
  const dailySales      = useFetch(dispatch, [], client.dashboard.sales.daily, { headers: authHeader });
  const monthlySales    = useFetch(dispatch, [], client.dashboard.sales.monthly, { headers: authHeader });

  const checkinTable  = useMemo(() => <MaterialTable
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
        title: 'Days', render: data => {
          const nights = differenceInCalendarDays(new Date(data['checkout']), new Date(data['checkin']));
          return `${nights}${getWord('night', nights)}`;
        },
      },
      {
        // eslint-disable-next-line react/display-name
        title: 'Checkin', render: data => {
          return <IconButton>
            <HomeIcon/>
          </IconButton>;
        },
      },
      {
        // eslint-disable-next-line react/display-name
        title: 'Cancel', render: data => {
          return <IconButton>
            <CancelIcon/>
          </IconButton>;
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
  />, []);
  const checkoutTable = useMemo(() => <MaterialTable
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
          return <IconButton>
            <HomeIcon/>
          </IconButton>;
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
  />, []);

  return <div>
    {checkinTable}
    {checkoutTable}
    {JSON.stringify(dailySales.data)}
    {JSON.stringify(monthlySales.data)}
  </div>;
};

export default AuthenticatedPage(Dashboard);
