import { depend } from 'velona';
import { PrismaClient } from '@prisma/client';
import { ensureNotNull } from '$/utils';
import type { Prisma } from '@prisma/client';

export type SearchGuestArgs = Prisma.FindManyGuestArgs;
export type FindGuestArgs = Prisma.FindFirstGuestArgs;
export type CreateGuestData = Prisma.GuestCreateInput;
export type CreateGuestArgs = Prisma.GuestCreateArgs;
export type UpdateGuestData = Prisma.GuestUpdateInput;
export type UpdateGuestArgs = Prisma.GuestUpdateArgs;
export type DeleteGuestArgs = Prisma.GuestDeleteArgs;
export type GuestOrderByInput = Prisma.GuestOrderByInput;
export type GuestWhereInput = Prisma.GuestWhereInput;
export type { Guest } from '@prisma/client';

const prisma = new PrismaClient();

export const getGuests = depend(
  { prisma: prisma as { guest: { findMany: typeof prisma.guest.findMany } } },
  async({ prisma }, args?: SearchGuestArgs) => prisma.guest.findMany(args),
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
  async({ prisma }, data: CreateGuestData, args?: CreateGuestArgs) => prisma.guest.create({
    data,
    ...args,
  }),
);

export const updateGuest = depend(
  { prisma: prisma as { guest: { update: typeof prisma.guest.update } } },
  async({ prisma }, id: number | undefined, data: UpdateGuestData, args?: UpdateGuestArgs) => prisma.guest.update({
    data,
    where: { id },
    ...args,
  }),
);

export const deleteGuest = depend(
  { prisma: prisma as { guest: { delete: typeof prisma.guest.delete } } },
  async({ prisma }, id: number | undefined, args?: DeleteGuestArgs) => prisma.guest.delete({
    where: { id },
    ...args,
  }),
);
