import { depend } from 'velona';
import { getSkip } from '$/utils';
import type { BodyResponse } from '$/types';
import type {
  Reservation,
  CreateReservationData,
  UpdateReservationData,
  ReservationOrderByInput,
} from '$/repositories/reservation';
import type {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
} from '$/repositories/reservation';

export const PER_PAGE = 10;

export const list = depend(
  { getReservations },
  async({ getReservations }, page?: number, orderBy?: ReservationOrderByInput): Promise<BodyResponse<Reservation[]>> => ({
    status: 200,
    body: await getReservations({
      skip: getSkip(PER_PAGE, page),
      take: PER_PAGE,
      orderBy,
    }),
  }),
);

export const get = depend(
  { getReservation },
  async({ getReservation }, id: number): Promise<BodyResponse<Reservation>> => ({
    status: 200,
    body: await getReservation(id),
  }),
);

export const create = depend(
  { createReservation },
  async({ createReservation }, data: CreateReservationData): Promise<BodyResponse<Reservation>> => ({
    status: 201,
    body: await createReservation(data),
  }),
);

export const remove = depend(
  { deleteReservation },
  async({ deleteReservation }, id: number): Promise<BodyResponse<Reservation>> => ({
    status: 200,
    body: await deleteReservation(id),
  }),
);

export const update = depend(
  { updateReservation },
  async({ updateReservation }, id: number, data: UpdateReservationData): Promise<BodyResponse<Reservation>> => ({
    status: 200,
    body: await updateReservation(id, data),
  }),
);
