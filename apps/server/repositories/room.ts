import type { Prisma, Admin as _Admin } from '$/prisma/client';
import { depend } from 'velona';
import { PrismaClient } from '$/prisma/client';
import { dropId, whereId } from '$/repositories/utils';

export type SearchRoomArgs = Prisma.RoomFindManyArgs;
export type FindRoomArgs = Prisma.RoomFindFirstArgs;
export type CreateRoomData = Prisma.RoomCreateInput;
export type CreateRoomArgs = Prisma.RoomCreateArgs;
export type UpdateRoomData = Prisma.RoomUpdateInput;
export type UpdateRoomArgs = Prisma.RoomUpdateArgs;
export type DeleteRoomArgs = Prisma.RoomDeleteArgs;
export type RoomOrderByInput = Prisma.RoomOrderByInput;
export type RoomWhereInput = Prisma.RoomWhereInput;
export type { Room };

const prisma = new PrismaClient();

export const getRooms = depend(
  { prisma: prisma as { room: { findMany: typeof prisma.room.findMany } } },
  async({ prisma }, args?: SearchRoomArgs) => prisma.room.findMany(args),
);

export const getRoomCount = depend(
  { prisma: prisma as { room: { count: typeof prisma.room.count } } },
  async({ prisma }, args?: Omit<SearchRoomArgs, 'select' | 'include'>) => prisma.room.count(args),
);

export const getRoom = depend(
  { prisma: prisma as { room: { findFirst: typeof prisma.room.findFirst } } },
  async({ prisma }, id: number | undefined, args?: FindRoomArgs): Promise<Room> | never => await prisma.room.findFirst({
    rejectOnNotFound: true,
    ...args,
    where: {
      ...whereId(id),
      ...args?.where,
    },
  }) as Room,
);

export const createRoom = depend(
  { prisma: prisma as { room: { create: typeof prisma.room.create } } },
  async({ prisma }, data: CreateRoomData, args?: Partial<CreateRoomArgs>) => prisma.room.create({
    ...args,
    data,
  }),
);

export const updateRoom = depend(
  { prisma: prisma as { room: { update: typeof prisma.room.update } } },
  async({ prisma }, id: number, data: UpdateRoomData, args?: Partial<UpdateRoomArgs>) => prisma.room.update({
    where: { id },
    ...args,
    data: dropId(data),
  }),
);

export const deleteRoom = depend(
  { prisma: prisma as { room: { delete: typeof prisma.room.delete } } },
  async({ prisma }, id: number, args?: Partial<DeleteRoomArgs>) => prisma.room.delete({
    where: { id },
    ...args,
  }),
);
