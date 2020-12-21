import { depend } from 'velona';
import { getSkip } from '$/utils';
import type { BodyResponse } from '$/types';
import type { Room, CreateRoomData, UpdateRoomData, RoomOrderByInput } from '$/repositories/room';
import type { getRooms, getRoom, createRoom, updateRoom, deleteRoom } from '$/repositories/room';

export const PER_PAGE = 10;

export const list = depend(
  { getRooms },
  async({ getRooms }, page?: number, orderBy?: RoomOrderByInput): Promise<BodyResponse<Room[]>> => ({
    status: 200,
    body: await getRooms({
      skip: getSkip(PER_PAGE, page),
      take: PER_PAGE,
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
