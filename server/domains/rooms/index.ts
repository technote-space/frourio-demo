import { depend } from 'velona';
import { getRooms, getRoom, createRoom, updateRoom, deleteRoom } from '$/repositories/room';
import { getSkip } from '$/utils';
import type { BodyResponse } from '$/types';
import type { Room, CreateRoomData, UpdateRoomData, RoomOrderByInput } from '$/repositories/room';

export const list = depend(
  { getRooms },
  async({ getRooms }, pageSize?: number, pageIndex?: number, orderBy?: RoomOrderByInput): Promise<BodyResponse<Room[]>> => ({
    status: 200,
    body: await getRooms({
      skip: getSkip(pageSize ?? 10, pageIndex),
      take: pageSize ?? 10,
      orderBy,
    }),
  }),
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
