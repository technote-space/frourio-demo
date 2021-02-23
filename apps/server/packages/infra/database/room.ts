import type {
  IRoomRepository,
  Room,
  FindRoomArgs,
  SearchRoomArgs,
  CreateRoomData,
  CreateRoomArgs,
  UpdateRoomData,
  UpdateRoomArgs,
  DeleteRoomArgs,
} from '$/packages/domain/database/room';
import type { Delegate, Models } from '$/packages/domain/database/service/types';
import { depend } from 'velona';
import { dropId } from './service';
import { whereId } from '$/packages/infra/database/service';
import { prisma } from '$/packages/infra/database';

export class RoomRepository implements IRoomRepository {
  getDelegate(): Delegate {
    return prisma.room;
  }

  getModelName(): Models {
    return 'room';
  }

  list = depend(
    { prisma: prisma as { room: { findMany: typeof prisma.room.findMany } } },
    async({ prisma }, args?: SearchRoomArgs) => prisma.room.findMany(args),
  );

  count = depend(
    { prisma: prisma as { room: { count: typeof prisma.room.count } } },
    async({ prisma }, args?: Omit<SearchRoomArgs, 'select' | 'include'>) => prisma.room.count(args),
  );

  find = depend(
    { prisma: prisma as { room: { findFirst: typeof prisma.room.findFirst } } },
    async({ prisma }, id: number | undefined, args?: FindRoomArgs) => await prisma.room.findFirst({
      rejectOnNotFound: true,
      ...args,
      where: {
        ...whereId(id),
        ...args?.where,
      },
    }) as Room,
  );

  create = depend(
    { prisma: prisma as { room: { create: typeof prisma.room.create } } },
    async({ prisma }, data: CreateRoomData, args?: Partial<CreateRoomArgs>) => prisma.room.create({
      ...args,
      data,
    }),
  );

  update = depend(
    { prisma: prisma as { room: { update: typeof prisma.room.update } } },
    async({ prisma }, id: number, data: UpdateRoomData, args?: Partial<UpdateRoomArgs>) => prisma.room.update({
      where: { id },
      ...args,
      data: dropId(data),
    }),
  );

  delete = depend(
    { prisma: prisma as { room: { delete: typeof prisma.room.delete } } },
    async({ prisma }, id: number, args?: Partial<DeleteRoomArgs>) => prisma.room.delete({
      where: { id },
      ...args,
    }),
  );
}
