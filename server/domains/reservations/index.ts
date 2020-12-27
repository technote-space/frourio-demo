import { depend } from 'velona';
import {
  getReservations,
  getReservationCount,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
} from '$/repositories/reservation';
import { getCurrentPage, getSkip } from '$/utils';
import type { BodyResponse } from '$/types';
import type {
  Reservation,
  CreateReservationData,
  UpdateReservationData,
} from '$/repositories/reservation';
import type { Query, QueryResult } from 'material-table';
import { getWhere, getOrderBy } from '../../utils/prisma';

export const list = depend(
  { getReservations, getReservationCount },
  async({ getReservations }, query?: Query<Reservation>): Promise<BodyResponse<QueryResult<Reservation>>> => {
    const pageSize   = query?.pageSize ?? 10;
    const where      = getWhere<Reservation>(query?.search, [
      'guestName',
      'guestNameKana',
      'guestPhone',
      'roomName',
    ], [
      'amount',
      'payment',
    ]);
    const orderBy    = getOrderBy<Reservation>(query?.orderBy, query?.orderDirection);
    const totalCount = await getReservationCount({
      where,
    });
    const page       = getCurrentPage(pageSize, totalCount, query?.page);
    const data       = await getReservations({
      skip: getSkip(pageSize, page),
      take: pageSize,
      where,
      orderBy,
    });

    return {
      status: 200,
      body: {
        data,
        page,
        totalCount,
      },
    };
  },
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
