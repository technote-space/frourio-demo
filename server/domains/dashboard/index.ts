import { depend } from 'velona';
import {
  getReservations,
  getReservationCount,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
} from '$/repositories/reservation';
import type { BodyResponse } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import type { DailySales, MonthlySales } from '$/domains/dashboard/types';
import type { Query, QueryResult } from 'material-table';
import { getWhere, getOrderBy } from '$/utils/prisma';
import { getCurrentPage, getSkip } from '$/utils';

export type CheckinReservation = Pick<Reservation, 'id' | 'guestName' | 'guestNameKana' | 'guestPhone' | 'roomName' | 'checkin' | 'checkout' | 'status'>;
export type CheckoutReservation = Pick<Reservation, 'id' | 'guestName' | 'guestNameKana' | 'roomName' | 'checkin' | 'checkout' | 'status' | 'amount'>;

export const getCheckin = depend(
  { getReservations, getReservationCount },
  async(
    { getReservations, getReservationCount },
    query?: Query<CheckinReservation>,
    date?: Date,
  ): Promise<BodyResponse<QueryResult<CheckinReservation>>> => {
    const pageSize   = query?.pageSize ?? 10;
    const where      = getWhere<CheckinReservation>(query?.search, [
      'guestName',
      'guestNameKana',
      'guestPhone',
      'roomName',
    ], [], {
      date,
      key: 'checkin',
    });
    const orderBy    = getOrderBy<CheckinReservation>(query?.orderBy, query?.orderDirection);
    const totalCount = await getReservationCount({ where });
    const page       = getCurrentPage(pageSize, totalCount, query?.page);
    const data       = await getReservations({
      skip: getSkip(pageSize, page),
      take: pageSize,
      where,
      orderBy,
      select: {
        id: true,
        guestName: true,
        guestNameKana: true,
        guestPhone: true,
        roomName: true,
        checkin: true,
        checkout: true,
        status: true,
      },
    });

    return {
      status: 200,
      body: {
        data,
        page,
        totalCount,
      },
    };
  },
);

export const getCheckout = depend(
  { getReservations, getReservationCount },
  async(
    { getReservations, getReservationCount },
    query?: Query<CheckoutReservation>,
    date?: Date,
  ): Promise<BodyResponse<QueryResult<CheckoutReservation>>> => {
    const pageSize   = query?.pageSize ?? 10;
    const where      = getWhere<CheckoutReservation>(query?.search, [
      'guestName',
      'guestNameKana',
      'roomName',
    ], [], {
      date,
      key: 'checkout',
    });
    const orderBy    = getOrderBy<CheckoutReservation>(query?.orderBy, query?.orderDirection);
    const totalCount = await getReservationCount({ where });
    const page       = getCurrentPage(pageSize, totalCount, query?.page);
    const data       = await getReservations({
      skip: getSkip(pageSize, page),
      take: pageSize,
      where,
      orderBy,
      select: {
        id: true,
        guestName: true,
        guestNameKana: true,
        roomName: true,
        checkin: true,
        checkout: true,
        status: true,
        amount: true,
      },
    });

    return {
      status: 200,
      body: {
        data,
        page,
        totalCount,
      },
    };
  },
);

export const getMonthlySales = async(year?: number): Promise<BodyResponse<MonthlySales[]>> => ({
  status: 200,
  body: [],
});

export const getDailySales = async(year?: number, month?: number): Promise<BodyResponse<DailySales[]>> => ({
  status: 200,
  body: [],
});
