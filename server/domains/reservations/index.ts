import { depend } from 'velona';
import { differenceInCalendarDays } from 'date-fns';
import {
  getReservations,
  getReservationCount,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
} from '$/repositories/reservation';
import { getGuest, getGuests, getGuestCount } from '$/repositories/guest';
import type { Guest } from '$/repositories/guest';
import { getRoom, getRooms, getRoomCount } from '$/repositories/room';
import type { Room } from '$/repositories/room';
import { getCurrentPage, getSkip } from '$/utils';
import type { BodyResponse } from '$/types';
import type { Reservation } from '$/repositories/reservation';
import type { Query, QueryResult } from 'material-table';
import type { ReservationBody } from '$/domains/reservations/validators';
import { getWhere, getOrderBy } from '$/utils/prisma';

export type ListReservation = Reservation & {
  room?: {
    number: number;
    price: number;
  }
}

export const list = depend(
  { getReservations, getReservationCount },
  async({ getReservations }, query?: Query<ListReservation>): Promise<BodyResponse<QueryResult<ListReservation>>> => {
    const pageSize   = query?.pageSize ?? 10;
    const where      = getWhere<ListReservation>(query?.search, [
      'guestName',
      'guestNameKana',
      'guestPhone',
      'roomName',
    ], [
      'amount',
      'payment',
    ]);
    const orderBy    = getOrderBy<ListReservation>(query?.orderBy, query?.orderDirection);
    const totalCount = await getReservationCount({ where });
    const page       = getCurrentPage(pageSize, totalCount, query?.page);
    const data       = await getReservations({
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

const getData = async(data: ReservationBody) => {
  const guest    = await getGuest(data.guestId);
  const room     = await getRoom(data.roomId);
  const checkin  = new Date(data.checkin);
  const checkout = new Date(data.checkout);
  const nights   = differenceInCalendarDays(checkout, checkin);
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
  { createReservation },
  async({ createReservation }, data: ReservationBody): Promise<BodyResponse<Reservation>> => ({
    status: 201,
    body: await createReservation(await getData(data)),
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
  { updateReservation },
  async({ updateReservation }, id: number, data: ReservationBody): Promise<BodyResponse<Reservation>> => ({
    status: 200,
    body: await updateReservation(id, await getData(data)),
  }),
);

export const searchGuest = depend(
  { getGuests, getGuestCount },
  async({ getGuests }, query?: Query<Guest>): Promise<BodyResponse<QueryResult<Guest>>> => {
    const pageSize   = query?.pageSize ?? 10;
    const where      = getWhere<Guest>(query?.search, ['name', 'nameKana', 'zipCode', 'address', 'phone'], []);
    const orderBy    = getOrderBy<Guest>(query?.orderBy, query?.orderDirection);
    const totalCount = await getGuestCount({
      where,
    });
    const page       = getCurrentPage(pageSize, totalCount, query?.page);
    const data       = await getGuests({
      select: {
        id: true,
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
  async({ getRooms }, query?: Query<Room>): Promise<BodyResponse<QueryResult<Room>>> => {
    const pageSize   = query?.pageSize ?? 10;
    const where      = getWhere<Room>(query?.search, ['name'], ['price', 'number']);
    const orderBy    = getOrderBy<Room>(query?.orderBy, query?.orderDirection);
    const totalCount = await getRoomCount({
      where,
    });
    const page       = getCurrentPage(pageSize, totalCount, query?.page);
    const data       = await getRooms({
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
