import { depend } from 'velona';
import { PrismaClient } from '@prisma/client';
import { ensureNotNull } from '$/utils';
import type { Prisma } from '@prisma/client';
import { SearchGuestArgs } from '$/repositories/guest';

export type SearchReservationArgs = Prisma.FindManyReservationArgs;
export type FindReservationArgs = Prisma.FindFirstReservationArgs;
export type CreateReservationData = Prisma.ReservationCreateInput;
export type CreateReservationArgs = Prisma.ReservationCreateArgs;
export type UpdateReservationData = Prisma.ReservationUpdateInput;
export type UpdateReservationArgs = Prisma.ReservationUpdateArgs;
export type DeleteReservationArgs = Prisma.ReservationDeleteArgs;
export type ReservationOrderByInput = Prisma.ReservationOrderByInput;
export type ReservationWhereInput = Prisma.ReservationWhereInput;
export type { Reservation, ReservationDetail } from '@prisma/client';

const prisma = new PrismaClient();

export const getReservations = depend(
  { prisma: prisma as { reservation: { findMany: typeof prisma.reservation.findMany } } },
  async <T>({ prisma }, args?: Prisma.Subset<T, SearchReservationArgs>) => prisma.reservation.findMany(args),
);

export const getReservation = depend(
  { prisma: prisma as { reservation: { findFirst: typeof prisma.reservation.findFirst } } },
  async <T>({ prisma }, id: number | undefined, args?: Prisma.Subset<T, FindReservationArgs>) => ensureNotNull(await prisma.reservation.findFirst({
    where: { id },
    ...args,
  })),
);

export const createReservation = depend(
  { prisma: prisma as { reservation: { create: typeof prisma.reservation.create } } },
  async <T>({ prisma }, data: CreateReservationData, args?: Prisma.Subset<T, CreateReservationArgs>) => prisma.reservation.create({
    data,
    ...args,
  }),
);

export const updateReservation = depend(
  { prisma: prisma as { reservation: { update: typeof prisma.reservation.update } } },
  async <T>({ prisma }, id: number | undefined, data: UpdateReservationData, args?: Prisma.Subset<T, UpdateReservationArgs>) => prisma.reservation.update({
    data,
    where: { id },
    ...args,
  }),
);

export const deleteReservation = depend(
  { prisma: prisma as { reservation: { delete: typeof prisma.reservation.delete } } },
  async <T>({ prisma }, id: number | undefined, args?: Prisma.Subset<T, DeleteReservationArgs>) => prisma.reservation.delete({
    where: { id },
    ...args,
  }),
);
