import { depend } from 'velona';
import {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
} from '$/repositories/reservation';
import { getSkip } from '$/utils';
import type { BodyResponse } from '$/types';
import type {
  Reservation,
  CreateReservationData,
  UpdateReservationData,
  ReservationOrderByInput,
} from '$/repositories/reservation';

export const list = depend(
  { getReservations },
  async({ getReservations }, pageSize?: number, pageIndex?: number, orderBy?: ReservationOrderByInput): Promise<BodyResponse<Reservation[]>> => ({
    status: 200,
    body: await getReservations({
      skip: getSkip(pageSize ?? 10, pageIndex),
      take: pageSize ?? 10,
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
