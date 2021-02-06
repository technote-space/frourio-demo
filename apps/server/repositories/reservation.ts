import type { Prisma, Reservation } from '$/prisma/client';
import { depend } from 'velona';
import { PrismaClient } from '$/prisma/client';
import { dropId, whereId } from '$/repositories/utils';
import { generateCode } from '$/service/reservation';

export type SearchReservationArgs = Prisma.ReservationFindManyArgs;
export type FindReservationArgs = Prisma.ReservationFindFirstArgs;
export type CreateReservationData = Omit<Prisma.ReservationCreateInput, 'code'>;
export type CreateReservationArgs = Prisma.ReservationCreateArgs;
export type UpdateReservationData = Prisma.ReservationUpdateInput;
export type UpdateReservationArgs = Prisma.ReservationUpdateArgs;
export type DeleteReservationArgs = Prisma.ReservationDeleteArgs;
export type ReservationOrderByInput = Prisma.ReservationOrderByInput;
export type ReservationWhereInput = Prisma.ReservationWhereInput;
export type { Reservation };

const prisma = new PrismaClient();

export const getReservations = depend(
  { prisma: prisma as { reservation: { findMany: typeof prisma.reservation.findMany } } },
  async({ prisma }, args?: SearchReservationArgs) => prisma.reservation.findMany(args),
);

export const getReservationCount = depend(
  { prisma: prisma as { reservation: { count: typeof prisma.reservation.count } } },
  async({ prisma }, args?: Omit<SearchReservationArgs, 'select' | 'include'>) => prisma.reservation.count(args),
);

export const getReservation = depend(
  { prisma: prisma as { reservation: { findFirst: typeof prisma.reservation.findFirst } } },
  async({ prisma }, id: number | undefined, args?: FindReservationArgs): Promise<Reservation> | never => await prisma.reservation.findFirst({
    rejectOnNotFound: true,
    ...args,
    where: {
      ...whereId(id),
      ...args?.where,
    },
  }) as Reservation,
);

export const createReservation = depend(
  { prisma: prisma as { reservation: { create: typeof prisma.reservation.create } } },
  async({ prisma }, data: CreateReservationData, args?: Partial<CreateReservationArgs>) => prisma.reservation.create({
    ...args,
    data: {
      ...data,
      code: generateCode(),
    },
  }),
);

export const updateReservation = depend(
  { prisma: prisma as { reservation: { update: typeof prisma.reservation.update } } },
  async({ prisma }, id: number, data: UpdateReservationData, args?: Partial<UpdateReservationArgs>) => prisma.reservation.update({
    where: { id },
    ...args,
    data: dropId(data),
  }),
);

export const deleteReservation = depend(
  { prisma: prisma as { reservation: { delete: typeof prisma.reservation.delete } } },
  async({ prisma }, id: number, args?: Partial<DeleteReservationArgs>) => prisma.reservation.delete({
    where: { id },
    ...args,
  }),
);
