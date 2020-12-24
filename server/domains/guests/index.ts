import { depend } from 'velona';
import { getGuests, getGuest, createGuest, updateGuest, deleteGuest } from '$/repositories/guest';
import { getSkip } from '$/utils';
import type { BodyResponse } from '$/types';
import type { GuestWithDetail, CreateGuestData, UpdateGuestData, GuestOrderByInput } from '$/repositories/guest';

export const PER_PAGE = 10;

export const list = depend(
  { getGuests },
  async({ getGuests }, page?: number, orderBy?: GuestOrderByInput): Promise<BodyResponse<GuestWithDetail[]>> => ({
    status: 200,
    body: await getGuests({
      include: {
        detail: true,
      },
      skip: getSkip(PER_PAGE, page),
      take: PER_PAGE,
      orderBy,
    }),
  }),
);

export const get = depend(
  { getGuest },
  async({ getGuest }, id: number): Promise<BodyResponse<GuestWithDetail>> => ({
    status: 200,
    body: await getGuest(id, {
      include: {
        detail: true,
      },
    }),
  }),
);

export const create = depend(
  { createGuest },
  async({ createGuest }, data: CreateGuestData): Promise<BodyResponse<GuestWithDetail>> => ({
    status: 201,
    body: await createGuest(data, {
      include: {
        detail: true,
      },
    }),
  }),
);

export const remove = depend(
  { deleteGuest },
  async({ deleteGuest }, id: number): Promise<BodyResponse<GuestWithDetail>> => ({
    status: 200,
    body: await deleteGuest(id, {
      include: {
        detail: true,
      },
    }),
  }),
);

export const update = depend(
  { updateGuest },
  async({ updateGuest }, id: number, data: UpdateGuestData): Promise<BodyResponse<GuestWithDetail>> => ({
    status: 200,
    body: await updateGuest(id, data, {
      include: {
        detail: true,
      },
    }),
  }),
);
