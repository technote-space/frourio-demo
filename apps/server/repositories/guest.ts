import type { Prisma, Guest } from '$/prisma/client';
import { depend } from 'velona';
import { dropId, whereId } from '$/repositories/utils';
import { prisma } from '$/repositories';
import { normalizeHalfFull } from '@frourio-demo/utils/value';

export type SearchGuestArgs = Prisma.GuestFindManyArgs;
export type FindGuestArgs = Prisma.GuestFindFirstArgs;
export type CreateGuestData = Prisma.GuestCreateInput;
export type CreateGuestArgs = Prisma.GuestCreateArgs;
export type UpdateGuestData = Prisma.GuestUpdateInput;
export type UpdateGuestArgs = Prisma.GuestUpdateArgs;
export type DeleteGuestArgs = Prisma.GuestDeleteArgs;
export type DeleteManyGuestArgs = Prisma.GuestDeleteManyArgs;
export type { Guest };

export const getGuests = depend(
  { prisma: prisma as { guest: { findMany: typeof prisma.guest.findMany } } },
  async({ prisma }, args?: SearchGuestArgs) => prisma.guest.findMany(args),
);

export const getGuestCount = depend(
  { prisma: prisma as { guest: { count: typeof prisma.guest.count } } },
  async({ prisma }, args?: Omit<SearchGuestArgs, 'select' | 'include'>) => prisma.guest.count(args),
);

export const getGuest = depend(
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

const normalizeOptions = {
  toFull: ['nameKana', 'address'],
  toHalf: ['zipCode', 'phone'],
};

export const createGuest = depend(
  { prisma: prisma as { guest: { create: typeof prisma.guest.create } } },
  async({ prisma }, data: CreateGuestData, args?: Partial<CreateGuestArgs>) => prisma.guest.create({
    ...args,
    data: normalizeHalfFull(data, normalizeOptions),
  }),
);

export const updateGuest = depend(
  { prisma: prisma as { guest: { update: typeof prisma.guest.update } } },
  async({ prisma }, id: number, data: UpdateGuestData, args?: Partial<UpdateGuestArgs>) => prisma.guest.update({
    where: { id },
    ...args,
    data: normalizeHalfFull(dropId(data), normalizeOptions),
  }),
);

export const deleteGuest = depend(
  { prisma: prisma as { guest: { delete: typeof prisma.guest.delete } } },
  async({ prisma }, id: number, args?: Partial<DeleteGuestArgs>) => prisma.guest.delete({
    where: { id },
    ...args,
  }),
);

export const deleteGuests = depend(
  { prisma: prisma as { guest: { deleteMany: typeof prisma.guest.deleteMany } } },
  async({ prisma }, ids: number[] | undefined, args?: Partial<DeleteManyGuestArgs>) => prisma.guest.deleteMany({
    where: {
      OR: ids?.map(id => ({ id })),
    },
    ...args,
  }),
);
