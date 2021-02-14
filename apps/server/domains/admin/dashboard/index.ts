import type { BodyResponse } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import type { Room } from '$/repositories/room';
import type { DailySales, MonthlySales } from '$/domains/admin/dashboard/types';
import type { Query, QueryResult } from '@technote-space/material-table';
import { depend } from 'velona';
import {
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfYear,
  eachMonthOfInterval,
  eachDayOfInterval,
  format,
  parse,
} from 'date-fns';
import { toDataURL } from 'qrcode';
import { getReservations, getReservation, getReservationCount, updateReservation } from '$/repositories/reservation';
import { getRooms } from '$/repositories/room';
import { createRoomKey } from '$/repositories/roomKey';
import { getWhere, getOrderBy } from '$/repositories/utils';
import { getCurrentPage, getSkip } from '$/service/pages';
import { sendRoomKeyMail } from '$/service/mail';
import { encryptQrInfo } from '$/utils/reservation';
import { isValidCheckinDateRange } from '$/service/reservation';

export type CheckinReservation =
  Pick<Reservation, 'id' | 'guestName' | 'guestNameKana' | 'guestPhone' | 'roomName' | 'checkin' | 'checkout' | 'status'>
  & {
  isValid: boolean;
};

export type CheckoutReservation =
  Pick<Reservation, 'id' | 'guestName' | 'guestNameKana' | 'roomName' | 'checkin' | 'checkout' | 'number' | 'status' | 'amount' | 'payment'>
  & {
  room?: {
    number: number;
    price: number;
  }
};
export type SelectableRoom = Pick<Room, 'id' | 'name'>;

export const getCheckin = depend(
  { getReservations, getReservationCount, isValidCheckinDateRange },
  async(
    { getReservations, getReservationCount, isValidCheckinDateRange },
    query: Query<CheckinReservation>,
    date?: Date,
  ): Promise<BodyResponse<QueryResult<CheckinReservation>>> => {
    const pageSize = query.pageSize;
    const where = getWhere<CheckinReservation>(query.search, [
      'guestName',
      'guestNameKana',
      'guestPhone',
      'roomName',
    ], [], {
      date,
      key: 'checkin',
    });
    const orderBy = getOrderBy<CheckinReservation>(query.orderBy, query.orderDirection);
    const totalCount = await getReservationCount({ where });
    const page = getCurrentPage(pageSize, totalCount, query.page);
    const reservations = await getReservations({
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
        data: reservations.map(reservation => ({
          ...reservation,
          isValid: isValidCheckinDateRange(reservation.checkin, reservation.checkout, new Date()),
        })),
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
    query: Query<CheckoutReservation>,
    date?: Date,
  ): Promise<BodyResponse<QueryResult<CheckoutReservation>>> => {
    const pageSize = query.pageSize;
    const where = getWhere<CheckoutReservation>(query.search, [
      'guestName',
      'guestNameKana',
      'roomName',
    ], [], {
      date,
      key: 'checkout',
    }, {
      status: {
        not: 'cancelled',
      },
    });
    const orderBy = getOrderBy<Reservation>(query.orderBy, query.orderDirection);
    const totalCount = await getReservationCount({ where });
    const page = getCurrentPage(pageSize, totalCount, query.page);
    const data = await getReservations({
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
        number: true,
        status: true,
        amount: true,
        payment: true,
        room: {
          select: {
            number: true,
            price: true,
          },
        },
      },
    }) as CheckoutReservation[];

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

export const checkin = depend(
  { getReservation, updateReservation },
  async({ getReservation, updateReservation }, id: number): Promise<BodyResponse<Reservation>> => {
    const reservation = await getReservation(id);
    if (reservation && reservation.status === 'reserved') {
      return {
        status: 200,
        body: await updateReservation(id, {
          status: 'checkin',
        }),
      };
    }

    return {
      status: 400,
      body: {
        message: 'Not found or invalid status.',
      },
    };
  },
);

export const checkout = depend(
  { getReservation, updateReservation },
  async({ getReservation, updateReservation }, id: number, payment?: number): Promise<BodyResponse<Reservation>> => {
    const reservation = await getReservation(id);
    if (reservation && reservation.status === 'checkin') {
      return {
        status: 200,
        body: await updateReservation(id, {
          status: 'checkout',
          payment: payment ?? reservation.amount,
        }),
      };
    }

    return {
      status: 400,
      body: {
        message: 'Not found or invalid status.',
      },
    };
  },
);
export const cancel = depend(
  { updateReservation },
  async({ updateReservation }, id: number): Promise<BodyResponse<Reservation>> => ({
    status: 200,
    body: await updateReservation(id, {
      status: 'cancelled',
    }),
  }),
);

export const getSelectableRooms = depend(
  { getRooms },
  async({ getRooms }): Promise<BodyResponse<SelectableRoom[]>> => {
    return {
      status: 200,
      body: (await getRooms()).map(room => ({
        id: room.id,
        name: room.name,
      })),
    };
  },
);

export const getMonthlySales = depend(
  { getReservations },
  async({ getReservations }, date: Date, roomId?: number): Promise<BodyResponse<MonthlySales[]>> => {
    const reservations = await getReservations({
      select: {
        payment: true,
        checkout: true,
      },
      where: {
        status: 'checkout',
        checkout: {
          gte: startOfYear(date),
          lt: endOfYear(date),
        },
        roomId,
      },
    });

    const months = eachMonthOfInterval({
      start: startOfYear(date),
      end: endOfYear(date),
    }).map(month => format(month, 'yyyy-MM'));

    const sales: Record<string, number> = Object.assign({}, ...months.map(month => ({ [month]: 0 })));
    reservations.forEach(reservation => {
      const key = format(reservation.checkout, 'yyyy-MM');
      sales[key] += reservation.payment ?? 0;
    });

    return {
      status: 200,
      body: Object.entries(sales).map(([month, sales]) => ({
        month: parse(month, 'yyyy-MM', new Date()),
        sales,
      })),
    };
  },
);

export const getDailySales = depend(
  { getReservations },
  async({ getReservations }, date: Date, roomId?: number): Promise<BodyResponse<DailySales[]>> => {
    const reservations = await getReservations({
      select: {
        payment: true,
        checkout: true,
      },
      where: {
        status: 'checkout',
        checkout: {
          gte: startOfMonth(date),
          lt: endOfMonth(date),
        },
        roomId,
      },
    });

    const days = eachDayOfInterval({
      start: startOfMonth(date),
      end: endOfMonth(date),
    }).map(day => format(day, 'yyyy-MM-dd'));

    const sales: Record<string, number> = Object.assign({}, ...days.map(day => ({ [day]: 0 })));
    reservations.forEach(reservation => {
      const key = format(reservation.checkout, 'yyyy-MM-dd');
      sales[key] += reservation.payment ?? 0;
    });

    return {
      status: 200,
      body: Object.entries(sales).map(([day, sales]) => ({
        day: parse(day, 'yyyy-MM-dd', new Date()),
        sales,
      })),
    };
  },
);

export const sendRoomKey = depend(
  { getReservation, createRoomKey, encryptQrInfo, toDataURL },
  async({
    getReservation,
    createRoomKey,
    encryptQrInfo,
    toDataURL,
  }, id: number): Promise<BodyResponse<Reservation>> => {
    const reservation = await getReservation(id);
    const roomKey = await createRoomKey(reservation);

    await sendRoomKeyMail(reservation, roomKey.key, await toDataURL(encryptQrInfo({
      reservationId: reservation.id,
      roomId: reservation.roomId,
      key: roomKey.key,
    })));
    return {
      status: 202,
      body: reservation,
    };
  },
);
