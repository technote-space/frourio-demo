/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  IAdminRepository,
  Admin,
  FindAdminArgs,
  SearchAdminArgs,
  CreateAdminData,
  CreateAdminArgs,
  UpdateAdminData,
  UpdateAdminArgs,
  DeleteAdminArgs,
} from '$/packages/domain/database/admin';
import type { Role } from '$/packages/domain/database/role';
import type { Models, Delegate } from '$/packages/domain/database/service/types';
import { depend } from 'velona';
import { API_URL } from '$/config/env';
import { createAdminPasswordHash, validateHash } from '$/packages/infra/database/service';
import { dropId } from './service';
import { prisma } from '$/packages/infra/database';

const createIconUrl = (name: string) => `${API_URL}/icons/${name}`;
const convertToIconUrl = <T extends { icon: string | null }>(admin: T) => {
  if (admin?.icon && !/\/icons\//.test(admin.icon)) {
    admin.icon = createIconUrl(admin.icon);
  }

  return admin;
};
const removePassword = <T extends Record<string, any> & { password?: string }>(admin: T): Omit<T, 'password'> => {
  delete admin.password;
  return admin as Omit<T, 'password'>;
};
const processRoles = <T extends Record<string, any> & Omit<Admin, 'roles' | 'password'>>(admin: T): Admin => {
  if ('roles' in admin && admin.roles) {
    return {
      ...admin,
      roles: admin.roles,
    };
  }

  return {
    ...admin,
    roles: [] as Role[],
  };
};
const filterAdmin = <T extends Omit<Admin, 'roles'> & { password: string }>(admin: T): Admin | never => processRoles(removePassword(convertToIconUrl(admin)));
const includeRoles = <T extends Record<string, any> & { include?: any; select?: any; }>(args: T | undefined): any => {
  if (!args) {
    return {
      include: {
        roles: true,
      },
    };
  }

  if ('include' in args) {
    args.include.roles = true;
  } else if ('select' in args) {
    args.select.roles = true;
  } else {
    args.include = { roles: true };
  }

  return args;
};

export class AdminRepository implements IAdminRepository {
  getDelegate(): Delegate {
    return prisma.admin;
  }

  getModelName(): Models {
    return 'admin';
  }

  validate = depend(
    { validateHash, prisma: prisma as { admin: { findFirst: typeof prisma.admin.findFirst } } },
    async({ validateHash, prisma }, email: string, password: string) => {
      const admin = await prisma.admin.findFirst({ where: { email } });
      return !!admin && validateHash(password, admin.password) ? admin.id : undefined;
    },
  );

  list = depend(
    { prisma: prisma as { admin: { findMany: typeof prisma.admin.findMany } } },
    async({ prisma }, args?: SearchAdminArgs) => (await prisma.admin.findMany(includeRoles(args))).map(admin => filterAdmin(admin)),
  );

  count = depend(
    { prisma: prisma as { admin: { count: typeof prisma.admin.count } } },
    async({ prisma }, args?: Omit<SearchAdminArgs, 'select' | 'include'>) => prisma.admin.count(args),
  );

  find = depend(
    { prisma: prisma as { admin: { findFirst: typeof prisma.admin.findFirst } } },
    async({ prisma }, id: number, args?: FindAdminArgs) => filterAdmin((await prisma.admin.findFirst(includeRoles({
      where: { id },
      rejectOnNotFound: true,
      ...args,
    })))!),
  );

  create = depend(
    { prisma: prisma as { admin: { create: typeof prisma.admin.create } } },
    async({ prisma }, data: CreateAdminData, args?: Partial<CreateAdminArgs>) => filterAdmin(await prisma.admin.create({
      ...args,
      data: {
        ...data,
        password: createAdminPasswordHash(args?.data?.password ?? data.password),
      },
    })),
  );

  update = depend(
    { prisma: prisma as { admin: { update: typeof prisma.admin.update } } },
    async({ prisma }, id: number, data: UpdateAdminData, args?: Partial<UpdateAdminArgs>) => filterAdmin(await prisma.admin.update({
      where: { id },
      ...args,
      data: dropId({
        ...data,
        password: createAdminPasswordHash(data.password),
      }),
    })),
  );

  delete = depend(
    { prisma: prisma as { admin: { delete: typeof prisma.admin.delete } } },
    async({ prisma }, id: number, args?: Partial<DeleteAdminArgs>) => filterAdmin(await prisma.admin.delete({
      where: { id },
      ...args,
    })),
  );
}
