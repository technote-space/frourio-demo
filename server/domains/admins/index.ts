import { depend } from 'velona';
import { getAdmins, getAdminCount, getAdmin, createAdmin, updateAdmin, deleteAdmin } from '$/repositories/admin';
import { getSkip, getCurrentPage } from '$/service/pages';
import { getWhere, getOrderBy } from '$/repositories/utils';
import type { BodyResponse } from '$/types';
import type { Admin, CreateAdminData, UpdateAdminData } from '$/repositories/admin';
import type { Query, QueryResult } from '@technote-space/material-table';

export const list = depend(
  { getAdmins, getAdminCount },
  async({ getAdmins, getAdminCount }, query: Query<Admin>): Promise<BodyResponse<QueryResult<Admin>>> => {
    const pageSize = query.pageSize;
    const where = getWhere<Admin>(query.search, ['name', 'email'], []);
    const orderBy = getOrderBy<Admin>(query.orderBy, query.orderDirection);
    const totalCount = await getAdminCount({ where });
    const page = getCurrentPage(pageSize, totalCount, query.page);
    const data = await getAdmins({
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
  { getAdmin },
  async({ getAdmin }, id: number): Promise<BodyResponse<Admin>> => ({
    status: 200,
    body: await getAdmin(id),
  }),
);

export const create = depend(
  { createAdmin },
  async({ createAdmin }, data: CreateAdminData): Promise<BodyResponse<Admin>> => ({
    status: 201,
    body: await createAdmin(data),
  }),
);

export const remove = depend(
  { deleteAdmin },
  async({ deleteAdmin }, id: number): Promise<BodyResponse<Admin>> => ({
    status: 200,
    body: await deleteAdmin(id),
  }),
);

export const update = depend(
  { updateAdmin },
  async({ updateAdmin }, id: number, data: UpdateAdminData): Promise<BodyResponse<Admin>> => ({
    status: 200,
    body: await updateAdmin(id, data),
  }),
);
