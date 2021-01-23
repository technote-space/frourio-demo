import type { BodyResponse } from '$/types';
import type { Admin, CreateAdminData, UpdateAdminData } from '$/repositories/admin';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { Role } from '$/repositories/role';
import { depend } from 'velona';
import { getAdmins, getAdminCount, getAdmin, createAdmin, updateAdmin, deleteAdmin } from '$/repositories/admin';
import { getRoles, getRoleCount } from '$/repositories/role';
import { getSkip, getCurrentPage } from '$/service/pages';
import { getWhere, getOrderBy } from '$/repositories/utils';
import { getAdminFilterConstraints } from '$/domains/admins/utils';

export type ListRole = Record<string, string>;

export const list = depend(
  { getAdmins, getAdminCount },
  async({ getAdmins, getAdminCount }, query: Query<Admin>): Promise<BodyResponse<QueryResult<Admin>>> => {
    const pageSize = query.pageSize;
    const where = getWhere<Admin>(query.search, ['name', 'email'], [], undefined, ...getAdminFilterConstraints(query.filters));
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

export const listRoles = depend(
  { getRoles },
  async({ getRoles }): Promise<BodyResponse<ListRole>> => ({
    status: 200,
    body: Object.assign({}, ...(await getRoles()).map(role => ({ [role.role]: role.name }))),
  }),
);

export const searchRole = depend(
  { getRoles, getRoleCount },
  async({ getRoles, getRoleCount }, query: Query<Role>): Promise<BodyResponse<QueryResult<Role>>> => {
    const pageSize = query.pageSize;
    const where = getWhere<Role>(query.search, ['name'], []);
    const orderBy = getOrderBy<Role>(query.orderBy, query.orderDirection);
    const totalCount = await getRoleCount({
      where,
    });
    const page = getCurrentPage(pageSize, totalCount, query.page);
    const data = await getRoles({
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
