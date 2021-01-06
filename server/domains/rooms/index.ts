import { depend } from 'velona';
import { getRooms, getRoomCount, getRoom, createRoom, updateRoom, deleteRoom } from '$/repositories/room';
import { getCurrentPage, getSkip } from '$/service/pages';
import type { BodyResponse } from '$/types';
import type { Room, CreateRoomData, UpdateRoomData } from '$/repositories/room';
import type { Query, QueryResult } from 'material-table';
import { getWhere, getOrderBy } from '$/repositories/utils';

export const list = depend(
  { getRooms, getRoomCount },
  async({ getRooms }, query?: Query<Room>): Promise<BodyResponse<QueryResult<Room>>> => {
    const pageSize   = query?.pageSize ?? 10;
    const where      = getWhere<Room>(query?.search, ['name'], ['price', 'number']);
    const orderBy    = getOrderBy<Room>(query?.orderBy, query?.orderDirection);
    const totalCount = await getRoomCount({ where });
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
