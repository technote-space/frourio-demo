import type {
  IReservationRepository,
  Reservation,
  FindReservationArgs,
  SearchReservationArgs,
  CreateReservationData,
  CreateReservationArgs,
  UpdateReservationData,
  UpdateReservationArgs,
  DeleteReservationArgs,
} from '$/packages/domain/database/reservation';
import type { Delegate, Models } from '$/packages/domain/database/service/types';
import { depend } from 'velona';
import { dropId } from './service';
import { whereId } from '$/packages/infra/database/service';
import { generateCode } from '$/packages/infra/database/service';
import { prisma } from '$/packages/infra/database';
import { normalizeHalfFull } from '@frourio-demo/utils/value';

const normalizeOptions = {
  toFull: ['guestNameKana', 'guestAddress'],
  toHalf: ['guestZipCode', 'guestPhone'],
};

export class ReservationRepository implements IReservationRepository {
  getDelegate(): Delegate {
    return prisma.reservation;
  }

  getModelName(): Models {
    return 'reservation';
  }

  list = depend(
    { prisma: prisma as { reservation: { findMany: typeof prisma.reservation.findMany } } },
    async({ prisma }, args?: SearchReservationArgs) => prisma.reservation.findMany(args),
  );

  count = depend(
    { prisma: prisma as { reservation: { count: typeof prisma.reservation.count } } },
    async({ prisma }, args?: Omit<SearchReservationArgs, 'select' | 'include'>) => prisma.reservation.count(args),
  );

  find = depend(
    { prisma: prisma as { reservation: { findFirst: typeof prisma.reservation.findFirst } } },
    async({ prisma }, id: number | undefined, args?: FindReservationArgs) => await prisma.reservation.findFirst({
      rejectOnNotFound: true,
      ...args,
      where: {
        ...whereId(id),
        ...args?.where,
      },
    }) as Reservation,
  );

  create = depend(
    { prisma: prisma as { reservation: { create: typeof prisma.reservation.create } } },
    async({ prisma }, data: CreateReservationData, args?: Partial<CreateReservationArgs>) => prisma.reservation.create({
      ...args,
      data: normalizeHalfFull({
        ...data,
        code: generateCode(),
      }, normalizeOptions),
    }),
  );

  update = depend(
    { prisma: prisma as { reservation: { update: typeof prisma.reservation.update } } },
    async({ prisma }, id: number, data: UpdateReservationData, args?: Partial<UpdateReservationArgs>) => prisma.reservation.update({
      where: { id },
      ...args,
      data: normalizeHalfFull(dropId(data), normalizeOptions),
    }),
  );

  delete = depend(
    { prisma: prisma as { reservation: { delete: typeof prisma.reservation.delete } } },
    async({ prisma }, id: number, args?: Partial<DeleteReservationArgs>) => prisma.reservation.delete({
      where: { id },
      ...args,
    }),
  );
}
