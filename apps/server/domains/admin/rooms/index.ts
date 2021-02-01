import type { BodyResponse } from '$/types';
import type { Room, CreateRoomData, UpdateRoomData } from '$/repositories/room';
import type { Query, QueryResult } from '@technote-space/material-table';
import { depend } from 'velona';
import { getRooms, getRoomCount, getRoom, createRoom, updateRoom, deleteRoom } from '$/repositories/room';
import { getCurrentPage, getSkip } from '$/service/pages';
import { format } from 'date-fns';
import { getWhere, getOrderBy } from '$/repositories/utils';
import { getReservations } from '$/repositories/reservation';

export type RoomStatusEvent = {
  title: string;
  start: string;
  end: string;
  allDay: true;
  displayEventTime: false;
  startEditable: false;
  durationEditable: false;
  resourceEditable: false;
}

export const list = depend(
  { getRooms, getRoomCount },
  async({ getRooms, getRoomCount }, query: Query<Room>): Promise<BodyResponse<QueryResult<Room>>> => {
    const pageSize = query.pageSize;
    const where = getWhere<Room>(query.search, ['name'], ['price', 'number']);
    const orderBy = getOrderBy<Room>(query.orderBy, query.orderDirection);
    const totalCount = await getRoomCount({ where });
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

export const get = depend(
  { getRoom },
  async({ getRoom }, id: number): Promise<BodyResponse<Room>> => ({
    status: 200,
    body: await getRoom(id),
  }),
);

export const create = depend(
  { createRoom },
  async({ createRoom }, data: CreateRoomData): Promise<BodyResponse<Room>> => ({
    status: 201,
    body: await createRoom(data),
  }),
);

export const remove = depend(
  { deleteRoom },
  async({ deleteRoom }, id: number): Promise<BodyResponse<Room>> => ({
    status: 200,
    body: await deleteRoom(id),
  }),
);

export const update = depend(
  { updateRoom },
  async({ updateRoom }, id: number, data: UpdateRoomData): Promise<BodyResponse<Room>> => ({
    status: 200,
    body: await updateRoom(id, data),
  }),
);

export const getStatusCalendarEvents = depend(
  { getReservations },
  async(
    { getReservations },
    roomId: number,
    start: Date,
    end: Date,
  ): Promise<BodyResponse<Array<RoomStatusEvent>>> => {
    const reservations = await getReservations({
      select: {
        guestName: true,
        number: true,
        checkin: true,
        checkout: true,
      },
      where: {
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

    return {
      status: 200,
      body: reservations.map(reservation => ({
        title: `${reservation.guestName} (${reservation.number}人)`,
        start: format(reservation.checkin, 'yyyy-MM-dd'),
        end: format(reservation.checkout, 'yyyy-MM-dd'),
        allDay: true,
        displayEventTime: false,
        startEditable: false,
        durationEditable: false,
        resourceEditable: false,
      })),
    };
  },
);

