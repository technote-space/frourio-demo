import type {
  IGuestRepository,
  Guest,
  FindGuestArgs,
  SearchGuestArgs,
  CreateGuestData,
  CreateGuestArgs,
  UpdateGuestData,
  UpdateGuestArgs,
  DeleteGuestArgs,
  DeleteManyGuestArgs,
} from '$/packages/domain/database/guest';
import type { Delegate, Models } from '$/packages/domain/database/service/types';
import { depend } from 'velona';
import { dropId } from './service';
import { whereId } from '$/packages/infra/database/service';
import { prisma } from '$/packages/infra/database';
import { normalizeHalfFull } from '@frourio-demo/utils/value';

const normalizeOptions = {
  toFull: ['nameKana', 'address'],
  toHalf: ['zipCode', 'phone'],
};

export class GuestRepository implements IGuestRepository {
  getDelegate(): Delegate {
    return prisma.guest;
  }

  getModelName(): Models {
    return 'guest';
  }

  list = depend(
    { prisma: prisma as { guest: { findMany: typeof prisma.guest.findMany } } },
    async({ prisma }, args?: SearchGuestArgs) => prisma.guest.findMany(args),
  );

  count = depend(
    { prisma: prisma as { guest: { count: typeof prisma.guest.count } } },
    async({ prisma }, args?: Omit<SearchGuestArgs, 'select' | 'include'>) => prisma.guest.count(args),
  );

  find = depend(
    { prisma: prisma as { guest: { findFirst: typeof prisma.guest.findFirst } } },
    async({ prisma }, id: number | undefined, args?: FindGuestArgs): Promise<Guest> | never => await prisma.guest.findFirst({
      rejectOnNotFound: true,
      ...args,
      where: {
        ...whereId(id),
        ...args?.where,
      },
    }) as Guest,
  );

  create = depend(
    { prisma: prisma as { guest: { create: typeof prisma.guest.create } } },
    async({ prisma }, data: CreateGuestData, args?: Partial<CreateGuestArgs>) => prisma.guest.create({
      ...args,
      data: normalizeHalfFull(data, normalizeOptions),
    }),
  );

  update = depend(
    { prisma: prisma as { guest: { update: typeof prisma.guest.update } } },
    async({ prisma }, id: number, data: UpdateGuestData, args?: Partial<UpdateGuestArgs>) => prisma.guest.update({
      where: { id },
      ...args,
      data: normalizeHalfFull(dropId(data), normalizeOptions),
    }),
  );

  delete = depend(
    { prisma: prisma as { guest: { delete: typeof prisma.guest.delete } } },
    async({ prisma }, id: number, args?: Partial<DeleteGuestArgs>) => prisma.guest.delete({
      where: { id },
      ...args,
    }),
  );

  deleteMany = depend(
    { prisma: prisma as { guest: { deleteMany: typeof prisma.guest.deleteMany } } },
    async({ prisma }, ids: number[] | undefined, args?: Partial<DeleteManyGuestArgs>) => prisma.guest.deleteMany({
      where: {
        OR: ids?.map(id => ({ id })),
      },
      ...args,
    }),
  );
}
