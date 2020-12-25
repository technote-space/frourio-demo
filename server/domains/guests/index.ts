import { depend } from 'velona';
import { getGuests, getGuest, createGuest, updateGuest, deleteGuest } from '$/repositories/guest';
import { getSkip } from '$/utils';
import type { BodyResponse } from '$/types';
import type { Guest, CreateGuestData, UpdateGuestData, GuestOrderByInput } from '$/repositories/guest';

export const list = depend(
  { getGuests },
  async({ getGuests }, pageSize?: number, pageIndex?: number, orderBy?: GuestOrderByInput): Promise<BodyResponse<Guest[]>> => ({
    status: 200,
    body: await getGuests({
      skip: getSkip(pageSize ?? 10, pageIndex),
      take: pageSize ?? 10,
      orderBy,
    }),
  }),
);

export const get = depend(
  { getGuest },
  async({ getGuest }, id: number): Promise<BodyResponse<Guest>> => ({
    status: 200,
    body: await getGuest(id),
  }),
);

export const create = depend(
  { createGuest },
  async({ createGuest }, data: CreateGuestData): Promise<BodyResponse<Guest>> => ({
    status: 201,
    body: await createGuest(data),
  }),
);

export const remove = depend(
  { deleteGuest },
  async({ deleteGuest }, id: number): Promise<BodyResponse<Guest>> => ({
    status: 200,
    body: await deleteGuest(id),
  }),
);

export const update = depend(
  { updateGuest },
  async({ updateGuest }, id: number, data: UpdateGuestData): Promise<BodyResponse<Guest>> => ({
    status: 200,
    body: await updateGuest(id, data),
  }),
);
