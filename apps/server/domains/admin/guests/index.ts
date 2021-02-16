import type { BodyResponse } from '$/types';
import type { Guest, CreateGuestData, UpdateGuestData } from '$/repositories/guest';
import type { Query, QueryResult } from '@technote-space/material-table';
import { depend } from 'velona';
import { ACCOUNT_FIELDS } from '@frourio-demo/constants';
import { getGuests, getGuestCount, getGuest, createGuest, updateGuest, deleteGuest } from '$/repositories/guest';
import { getSkip, getCurrentPage } from '$/service/pages';
import { getWhere, getOrderBy } from '$/repositories/utils';

export const list = depend(
  { getGuests, getGuestCount },
  async({ getGuests, getGuestCount }, query: Query<Guest>): Promise<BodyResponse<QueryResult<Guest>>> => {
    const pageSize = query.pageSize;
    const where = getWhere<Guest>(query.search, [...ACCOUNT_FIELDS.map(field => field.name), 'auth0Sub', 'stripe'], []);
    const orderBy = getOrderBy<Guest>(query.orderBy, query.orderDirection);
    const totalCount = await getGuestCount({ where });
    const page = getCurrentPage(pageSize, totalCount, query.page);
    const data = await getGuests({
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
