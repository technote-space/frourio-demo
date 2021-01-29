import type { Guest } from '$/repositories/guest';
import type { Room } from '$/repositories/room';
import type { BodyResponse } from '$/types';
import type { Reservation, CreateReservationData } from '$/repositories/reservation';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { ReservationBody } from './validators';
import { depend } from 'velona';
import { differenceInCalendarDays, eachDayOfInterval, format, startOfDay, subDays } from 'date-fns';
import {
  getReservations,
  getReservationCount,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
} from '$/repositories/reservation';
import { getGuest, getGuests, getGuestCount } from '$/repositories/guest';
import { getRoom, getRooms, getRoomCount } from '$/repositories/room';
import { getCurrentPage, getSkip } from '$/service/pages';
import { getWhere, getOrderBy, getFilterConstraints } from '$/repositories/utils';

export type ListReservation = Reservation & {
  room?: {
    number: number;
    price: number;
  }
}
export type SelectedRoom = Pick<Room, 'id' | 'name' | 'number' | 'price'>;
export type SelectedGuest = Pick<Guest, 'id' | 'name'>;
export type CheckinNotSelectableEvent = {
  start: string;
  end: string;
  allDay: true;
  color: string;
  textColor: string;
  display: string,
}
export type CheckoutSelectableEvent = {
  start: string;
  end: string;
  allDay: true;
  color: string;
  textColor: string;
  display: string,
}

export const list = depend(
  { getReservations, getReservationCount },
  async(
    { getReservations, getReservationCount },
    query: Query<ListReservation>,
  ): Promise<BodyResponse<QueryResult<ListReservation>>> => {
    const pageSize = query.pageSize;
    const where = getWhere<ListReservation>(query.search, [
      'guestName',
      'guestNameKana',
      'guestPhone',
      'roomName',
    ], [
      'amount',
      'payment',
    ], undefined, ...getFilterConstraints(query.filters));
    const orderBy = getOrderBy<ListReservation>(query.orderBy, query.orderDirection);
    const totalCount = await getReservationCount({ where });
    const page = getCurrentPage(pageSize, totalCount, query.page);
    const data = await getReservations({
      skip: getSkip(pageSize, page),
      take: pageSize,
      where,
      orderBy,
      include: {
        room: {
          select: {
            number: true,
            price: true,
          },
        },
      },
    }) as ListReservation[];

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

export const get = depend(
  { getReservation },
  async({ getReservation }, id: number): Promise<BodyResponse<Reservation>> => ({
    status: 200,
    body: await getReservation(id),
  }),
);

export const fillReservationData = async(data: ReservationBody, getGuest: (id: number) => Promise<Guest>, getRoom: (id: number) => Promise<Room>): Promise<CreateReservationData> | never => {
  const guest = await getGuest(data.guestId);
  if (!guest.name || !guest.nameKana || !guest.zipCode || !guest.address || !guest.phone) {
    throw new Error('必須項目が登録されていないゲストは指定できません。');
  }

  const room = await getRoom(data.roomId);
  const checkin = new Date(data.checkin);
  const checkout = new Date(data.checkout);
  const nights = differenceInCalendarDays(checkout, checkin);

  return {
    guest: {
      connect: {
        id: data.guestId,
      },
    },
    guestName: guest.name,
    guestNameKana: guest.nameKana,
    guestZipCode: guest.zipCode,
    guestAddress: guest.address,
    guestPhone: guest.phone,
    room: {
      connect: {
        id: data.roomId,
      },
    },
    roomName: room.name,
    number: data.number,
    amount: data.number * room.price * nights,
    checkin,
    checkout,
    status: data.status ?? 'reserved',
    payment: data.payment,
  };
};

export const create = depend(
  { createReservation, getGuest, getRoom },
  async({ createReservation, getGuest, getRoom }, data: ReservationBody): Promise<BodyResponse<Reservation>> => ({
    status: 201,
    body: await createReservation(await fillReservationData(data, getGuest, getRoom)),
  }),
);

export const remove = depend(
  { deleteReservation },
  async({ deleteReservation }, id: number): Promise<BodyResponse<Reservation>> => ({
    status: 200,
    body: await deleteReservation(id),
  }),
);

export const update = depend(
  { updateReservation, getGuest, getRoom },
  async(
    { updateReservation, getGuest, getRoom },
    id: number,
    data: ReservationBody,
  ): Promise<BodyResponse<Reservation>> => ({
    status: 200,
    body: await updateReservation(id, await fillReservationData(data, getGuest, getRoom)),
  }),
);

export const searchGuest = depend(
  { getGuests, getGuestCount },
  async({ getGuests, getGuestCount }, query: Query<Guest>): Promise<BodyResponse<QueryResult<Guest>>> => {
    const pageSize = query.pageSize;
    const where = getWhere<Guest>(query.search, ['email', 'name', 'nameKana', 'zipCode', 'address', 'phone'], []);
    const orderBy = getOrderBy<Guest>(query.orderBy, query.orderDirection);
    const totalCount = await getGuestCount({
      where,
    });
    const page = getCurrentPage(pageSize, totalCount, query.page);
    const data = await getGuests({
      select: {
        id: true,
        email: true,
        name: true,
        nameKana: true,
        zipCode: true,
        address: true,
        phone: true,
        reservations: {
          take: 3,
          orderBy: {
            checkin: 'desc',
          },
        },
      },
      skip: getSkip(pageSize, page),
      take: pageSize,
      where,
      orderBy,
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

export const searchRoom = depend(
  { getRooms, getRoomCount },
  async({ getRooms, getRoomCount }, query: Query<Room>): Promise<BodyResponse<QueryResult<Room>>> => {
    const pageSize = query.pageSize;
    const where = getWhere<Room>(query.search, ['name'], ['price', 'number']);
    const orderBy = getOrderBy<Room>(query.orderBy, query.orderDirection);
    const totalCount = await getRoomCount({
      where,
    });
    const page = getCurrentPage(pageSize, totalCount, query.page);
    const data = await getRooms({
      skip: getSkip(pageSize, page),
      take: pageSize,
      where,
      orderBy,
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

export const getSelectedRoom = depend(
  { getRoom },
  async({ getRoom }, roomId: number): Promise<BodyResponse<SelectedRoom>> => {
    const room = await getRoom(roomId);

    return {
      status: 200,
      body: {
        id: room.id,
        name: room.name,
        number: room.number,
        price: room.price,
      },
    };
  },
);

export const getSelectedGuest = depend(
  { getGuest },
  async({ getGuest }, guestId: number): Promise<BodyResponse<SelectedGuest>> => {
    const room = await getGuest(guestId);

    return {
      status: 200,
      body: {
        id: room.id,
        name: room.name,
      },
    };
  },
);

export const getCheckinNotSelectable = depend(
  { getReservations },
  async({ getReservations }, roomId: number, start: Date, end: Date, id?: number): Promise<BodyResponse<Array<CheckinNotSelectableEvent>>> => {
    const reservations = await getReservations({
      select: {
        checkin: true,
        checkout: true,
      },
      where: {
        id: {
          ...(id ? {
            not: id,
          } : {}),
        },
        roomId,
        checkin: {
          lt: end,
        },
        checkout: {
          gt: start,
        },
        status: {
          not: 'cancelled',
        },
      },
    });
    const dates: Array<number> = [...new Set(reservations.flatMap(reservation => eachDayOfInterval({
      start: startOfDay(reservation.checkin),
      end: startOfDay(subDays(reservation.checkout, 1)),
    })).map(date => date.valueOf()))].sort();
    const events: Array<CheckinNotSelectableEvent> = [];
    if (dates.length) {
      const createEvent = (start: number, end: number): CheckinNotSelectableEvent => ({
        start: format(start, 'yyyy-MM-dd'),
        end: format(end + 86400000, 'yyyy-MM-dd'), // end is exclusive
        allDay: true,
        color: '#a99',
        textColor: 'black',
        display: 'background',
      });
      let start = dates[0], prev = dates[0];
      for (let index = 1; index < dates.length; ++index) {
        if (dates[index] - prev !== 86400000) {
          events.push(createEvent(start, prev));
          start = dates[index];
        }
        prev = dates[index];
      }
      events.push(createEvent(start, prev));
    }

    return {
      status: 200,
      body: events,
    };
  },
);

export const getCheckoutSelectable = depend(
  { getReservations },
  async({ getReservations }, roomId: number, end: Date, checkin: Date, id?: number): Promise<BodyResponse<Array<CheckoutSelectableEvent>>> => {
    const reservations = await getReservations({
      select: {
        checkin: true,
        checkout: true,
      },
      where: {
        id: {
          ...(id ? {
            not: id,
          } : {}),
        },
        roomId,
        checkin: {
          lt: end,
        },
        checkout: {
          gt: checkin,
        },
        status: {
          not: 'cancelled',
        },
      },
    });
    const dates: Array<number> = [...new Set(reservations.flatMap(reservation => eachDayOfInterval({
      start: startOfDay(reservation.checkin),
      end: startOfDay(subDays(reservation.checkout, 1)),
    })).map(date => date.valueOf()))].sort();
    const events: Array<CheckoutSelectableEvent> = [];
    const startValue = startOfDay(checkin).valueOf();
    let prev = startValue;
    const endValue = startOfDay(end).valueOf();
    while (prev < endValue) {
      prev += 86400000;
      if (dates.includes(prev)) {
        events.push({
          start: format(startValue + 86400000, 'yyyy-MM-dd'), // exclude checkin date
          end: format(prev + 86400000, 'yyyy-MM-dd'), // end is exclusive
          allDay: true,
          color: '#a99',
          textColor: 'black',
          display: 'inverse-background',
        });
        break;
      }
    }
    if (!events.length) {
      events.push({
        start: format(startValue + 86400000, 'yyyy-MM-dd'), // exclude checkin date
        end: format(endValue, 'yyyy-MM-dd'),
        allDay: true,
        color: '#a99',
        textColor: 'black',
        display: 'inverse-background',
      });
    }

    return {
      status: 200,
      body: events,
    };
  },
);
