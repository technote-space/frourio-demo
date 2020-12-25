import { depend } from 'velona';
import { getGuests, getGuest, createGuest, updateGuest, deleteGuest } from '$/repositories/guest';
import { getSkip } from '$/utils';
import type { BodyResponse } from '$/types';
import type { GuestWithDetail, CreateGuestData, UpdateGuestData, GuestOrderByInput } from '$/repositories/guest';

export const list = depend(
  { getGuests },
  async({ getGuests }, pageSize?: number, pageIndex?: number, orderBy?: GuestOrderByInput): Promise<BodyResponse<GuestWithDetail[]>> => ({
    status: 200,
    body: await getGuests({
      skip: getSkip(pageSize ?? 10, pageIndex),
      take: pageSize ?? 10,
      orderBy,
      include: {
        detail: true,
      },
    }) as GuestWithDetail[],
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
    }) as GuestWithDetail,
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
    }) as GuestWithDetail,
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
    }) as GuestWithDetail,
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
    }) as GuestWithDetail,
  }),
);
