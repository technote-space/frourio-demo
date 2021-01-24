import { depend } from 'velona';
import { PrismaClient } from '$/prisma/client';
import { ensureNotNull } from '$/repositories/utils';
import type { Prisma, Guest } from '$/prisma/client';
import { dropId } from '$/repositories/utils';

export type SearchGuestArgs = Prisma.GuestFindManyArgs;
export type FindGuestArgs = Prisma.GuestFindFirstArgs;
export type CreateGuestData = Prisma.GuestCreateInput;
export type CreateGuestArgs = Prisma.GuestCreateArgs;
export type UpdateGuestData = Prisma.GuestUpdateInput;
export type UpdateGuestArgs = Prisma.GuestUpdateArgs;
export type DeleteGuestArgs = Prisma.GuestDeleteArgs;
export type GuestOrderByInput = Prisma.GuestOrderByInput;
export type GuestWhereInput = Prisma.GuestWhereInput;
export type { Guest };

const prisma = new PrismaClient();

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
  async({ prisma }, id: number | undefined, args?: FindGuestArgs) => ensureNotNull(await prisma.guest.findFirst({
    where: { id },
    ...args,
  })),
);

export const createGuest = depend(
  { prisma: prisma as { guest: { create: typeof prisma.guest.create } } },
  async({ prisma }, data: CreateGuestData, args?: Partial<CreateGuestArgs>) => prisma.guest.create({
    ...args,
    data,
  }),
);

export const updateGuest = depend(
  { prisma: prisma as { guest: { update: typeof prisma.guest.update } } },
  async({ prisma }, id: number | undefined, data: UpdateGuestData, args?: Partial<UpdateGuestArgs>) => prisma.guest.update({
    where: { id },
    ...args,
    data: dropId(data),
  }),
);

export const deleteGuest = depend(
  { prisma: prisma as { guest: { delete: typeof prisma.guest.delete } } },
  async({ prisma }, id: number | undefined, args?: Partial<DeleteGuestArgs>) => prisma.guest.delete({
    where: { id },
    ...args,
  }),
);
