import { depend } from 'velona';
import { getGuests, getGuestCount, getGuest, createGuest, updateGuest, deleteGuest } from '$/repositories/guest';
import { getSkip, getCurrentPage } from '$/utils';
import { getWhere, getOrderBy } from '$/utils/prisma';
import type { BodyResponse } from '$/types';
import type { Guest, CreateGuestData, UpdateGuestData, GuestOrderByInput } from '$/repositories/guest';
import type { Query, QueryResult } from 'material-table';

export const list = depend(
  { getGuests, getGuestCount },
  async({ getGuests }, query?: Query<Guest>): Promise<BodyResponse<QueryResult<Guest>>> => {
    const pageSize   = query?.pageSize ?? 10;
    const where      = getWhere<Guest>(query?.search, ['name', 'nameKana', 'zipCode', 'address', 'phone'], []);
    const orderBy    = getOrderBy<Guest>(query?.orderBy, query?.orderDirection);
    const totalCount = await getGuestCount({
      where,
    });
    const page       = getCurrentPage(pageSize, totalCount, query?.page);
    const data       = await getGuests({
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
