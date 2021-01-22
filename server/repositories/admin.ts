import { depend } from 'velona';
import { PrismaClient } from '$/prisma/client';
import { API_URL } from '$/service/env';
import { ensureNotNull, createAdminPasswordHash, validateHash } from '$/repositories/utils';
import type { Prisma, Admin as _Admin } from '$/prisma/client';
import type { Role } from '$/repositories/role';
import { dropId } from '$/repositories/utils';

export type SearchAdminArgs = Prisma.FindManyAdminArgs;
export type FindAdminArgs = Prisma.FindFirstAdminArgs;
export type CreateAdminData = Prisma.AdminCreateInput;
export type CreateAdminArgs = Prisma.AdminCreateArgs;
export type UpdateAdminData = Prisma.AdminUpdateInput;
export type UpdateAdminArgs = Prisma.AdminUpdateArgs;
export type DeleteAdminArgs = Prisma.AdminDeleteArgs;
export type Admin = {
  [key in keyof _Admin]: key extends 'password' ? never : _Admin[key]
} & {
  roles: Role[]
};

export const prisma = new PrismaClient();

const createIconUrl = (name: string) => `${API_URL}/icons/${name}`;
const convertToIconUrl = <T extends { icon: string | null }>(admin: T) => {
  if (admin?.icon && !/\/icons\//.test(admin.icon)) {
    admin.icon = createIconUrl(admin.icon);
  }

  return admin;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DropPassword<T extends Record<string, any>> = {
  [key in keyof T]: key extends 'password' ? never : T[key]
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removePassword = <T extends Record<string, any> & { password?: string }>(admin: T): DropPassword<T> => {
  delete admin.password;
  return admin as Exclude<T, 'password'>;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processRoles = <T extends Record<string, any> & DropPassword<_Admin>>(admin: T): Admin => {
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filterAdmin = <T extends _Admin>(admin: T | null): Admin | never => processRoles(removePassword(convertToIconUrl(ensureNotNull(admin))));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const includeRoles = <T extends Record<string, any> & { include?: any; select?: any; }>(args: T | undefined): any => {
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

export const validateUser = depend(
  { prisma: prisma as { admin: { findFirst: typeof prisma.admin.findFirst } } },
  async({ prisma }, email: string, password: string): Promise<number | undefined> => {
    const admin = await prisma.admin.findFirst({ where: { email } });
    return !!admin && validateHash(password, admin.password) ? admin.id : undefined;
  },
);

export const getAdmins = depend(
  { prisma: prisma as { admin: { findMany: typeof prisma.admin.findMany } } },
  async({ prisma }, args?: SearchAdminArgs) => (await prisma.admin.findMany(includeRoles(args))).map(admin => filterAdmin(admin)),
);

export const getAdminCount = depend(
  { prisma: prisma as { admin: { count: typeof prisma.admin.count } } },
  async({ prisma }, args?: Omit<SearchAdminArgs, 'select' | 'include'>) => prisma.admin.count(args),
);

export const getAdmin = depend(
  { prisma: prisma as { admin: { findFirst: typeof prisma.admin.findFirst } } },
  async({ prisma }, id: number, args?: FindAdminArgs) => filterAdmin(await prisma.admin.findFirst(includeRoles({
    where: { id },
    ...args,
  }))),
);

export const createAdmin = depend(
  { prisma: prisma as { admin: { create: typeof prisma.admin.create } } },
  async({ prisma }, data: CreateAdminData, args?: Partial<CreateAdminArgs>) => filterAdmin(await prisma.admin.create({
    ...args,
    data: {
      ...data,
      ...args?.data,
      password: createAdminPasswordHash(args?.data?.password ?? data.password),
    },
  })),
);

export const updateAdmin = depend(
  { prisma: prisma as { admin: { update: typeof prisma.admin.update } } },
  async({ prisma }, id: number | undefined, data: UpdateAdminData, args?: Partial<UpdateAdminArgs>) => filterAdmin(await prisma.admin.update({
    ...args,
    where: {
      id,
      ...args?.where,
    },
    data: dropId({
      ...data,
      ...args?.data,
      password: createAdminPasswordHash(data.password),
    }),
  })),
);

export const deleteAdmin = depend(
  { prisma: prisma as { admin: { delete: typeof prisma.admin.delete } } },
  async({ prisma }, id: number | undefined, args?: Partial<DeleteAdminArgs>) => filterAdmin(await prisma.admin.delete({
    where: { id },
    ...args,
  })),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProcessRoleType<T extends Record<string, any> & { roles?: Role[] }> = {
  [key in keyof T]: key extends 'roles' ? { connect: { role: string }[] } : T[key]
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processRoleConnections = <T extends Record<string, any> & { roles?: Role[] }>(data: T): ProcessRoleType<T> => {
  console.log(data.roles);
  return {
    ...data,
    roles: {
      connect: (data.roles ?? []).map(role => ({ role: role.role })),
    },
  };
};
