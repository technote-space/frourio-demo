import type { Prisma, Reservation } from '$/prisma/client';
import type { IValidatable } from '$/packages/domain/database/service/validatable';

export type SearchReservationArgs = Prisma.ReservationFindManyArgs;
export type FindReservationArgs = Prisma.ReservationFindFirstArgs;
export type CreateReservationData = Omit<Prisma.ReservationCreateInput, 'code'>;
export type CreateReservationArgs = Prisma.ReservationCreateArgs;
export type UpdateReservationData = Prisma.ReservationUpdateInput;
export type UpdateReservationArgs = Prisma.ReservationUpdateArgs;
export type DeleteReservationArgs = Prisma.ReservationDeleteArgs;
export type { Reservation };

export interface IReservationRepository extends IValidatable {
  list(args?: SearchReservationArgs): Promise<Reservation[]>;

  count(args?: Omit<SearchReservationArgs, 'select' | 'include'>): Promise<number>;

  find(id: number | undefined, args?: FindReservationArgs): Promise<Reservation> | never;

  create(data: CreateReservationData, args?: Partial<CreateReservationArgs>): Promise<Reservation>;

  update(id: number, data: UpdateReservationData, args?: Partial<UpdateReservationArgs>): Promise<Reservation>;

  delete(id: number, args?: Partial<DeleteReservationArgs>): Promise<Reservation>;
}
