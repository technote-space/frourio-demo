import { depend } from 'velona';
import { PrismaClient } from '@prisma/client';
import { ensureNotNull } from '$/utils';
import type { Prisma } from '@prisma/client';
import { SearchGuestArgs } from '$/repositories/guest';

export type SearchRoomArgs = Prisma.FindManyRoomArgs;
export type FindRoomArgs = Prisma.FindFirstRoomArgs;
export type CreateRoomData = Prisma.RoomCreateInput;
export type CreateRoomArgs = Prisma.RoomCreateArgs;
export type UpdateRoomData = Prisma.RoomUpdateInput;
export type UpdateRoomArgs = Prisma.RoomUpdateArgs;
export type DeleteRoomArgs = Prisma.RoomDeleteArgs;
export type RoomOrderByInput = Prisma.RoomOrderByInput;
export type RoomWhereInput = Prisma.RoomWhereInput;
export type { Room } from '@prisma/client';

const prisma = new PrismaClient();

export const getRooms = depend(
  { prisma: prisma as { room: { findMany: typeof prisma.room.findMany } } },
  async <T>({ prisma }, args?: Prisma.Subset<T, SearchRoomArgs>) => prisma.room.findMany(args),
);

export const getRoom = depend(
  { prisma: prisma as { room: { findFirst: typeof prisma.room.findFirst } } },
  async <T>({ prisma }, id: number | undefined, args?: Prisma.Subset<T, FindRoomArgs>) => ensureNotNull(await prisma.room.findFirst({
    where: { id },
    ...args,
  })),
);

export const createRoom = depend(
  { prisma: prisma as { room: { create: typeof prisma.room.create } } },
  async <T>({ prisma }, data: CreateRoomData, args?: Prisma.Subset<T, CreateRoomArgs>) => prisma.room.create({
    data,
    ...args,
  }),
);

export const updateRoom = depend(
  { prisma: prisma as { room: { update: typeof prisma.room.update } } },
  async <T>({ prisma }, id: number | undefined, data: UpdateRoomData, args?: Prisma.Subset<T, UpdateRoomArgs>) => prisma.room.update({
    data,
    where: { id },
    ...args,
  }),
);

export const deleteRoom = depend(
  { prisma: prisma as { room: { delete: typeof prisma.room.delete } } },
  async <T>({ prisma }, id: number | undefined, args?: Prisma.Subset<T, DeleteRoomArgs>) => prisma.room.delete({
    where: { id },
    ...args,
  }),
);
