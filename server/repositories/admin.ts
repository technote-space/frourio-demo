import { depend } from 'velona';
import { PrismaClient } from '$/prisma/client';
// import { createHash, validateHash } from '$/service/auth';
import { validateHash } from '$/service/auth';
import { API_ORIGIN, SERVER_PORT, BASE_PATH } from '$/service/env';
import { ensureNotNull } from '$/repositories/utils';
import type { Prisma } from '$/prisma/client';

export type FindAdminArgs = Prisma.FindFirstAdminArgs;
// export type CreateAdminData = Prisma.AdminCreateInput;
// export type CreateAdminArgs = Prisma.AdminCreateArgs;
// export type UpdateAdminData = Prisma.AdminUpdateInput;
export type UpdateAdminArgs = Prisma.AdminUpdateArgs;
export type DeleteAdminArgs = Prisma.AdminDeleteArgs;
export type { Admin } from '$/prisma/client';

export const prisma = new PrismaClient();

const createIconUrl = (name: string) => `${API_ORIGIN}${SERVER_PORT === 80 ? '' : `:${SERVER_PORT}`}${BASE_PATH}/icons/${name}`;
const convertToIconUrl = <T extends { icon: string | null }>(admin: T) => {
  if (admin?.icon && !/\/icons\//.test(admin.icon)) {
    admin.icon = createIconUrl(admin.icon);
  }

  return admin;
};
const removePassword = <T extends { password?: string }>(admin: T): Exclude<T, 'password'> => {
  delete admin.password;
  return admin as Exclude<T, 'password'>;
};
const filterAdmin = <T extends { icon: string | null; password: string }>(admin: T | null): Exclude<T, 'password'> | never => removePassword(convertToIconUrl(ensureNotNull(admin)));

export const validateUser = depend(
  { prisma: prisma as { admin: { findFirst: typeof prisma.admin.findFirst } } },
  async({ prisma }, email: string, password: string): Promise<number | undefined> => {
    const admin = await prisma.admin.findFirst({ where: { email } });
    return !!admin && validateHash(password, admin.password) ? admin.id : undefined;
  },
);

export const getAdmin = depend(
  { prisma: prisma as { admin: { findFirst: typeof prisma.admin.findFirst } } },
  async({ prisma }, id: number, args?: FindAdminArgs) => filterAdmin(await prisma.admin.findFirst({
    ...args,
    where: { id },
  })),
);

// export const createAdmin = depend(
//   { prisma: prisma as { admin: { create: typeof prisma.admin.create } } },
//   async({ prisma }, data: CreateAdminData, args?: Partial<CreateAdminArgs>) => filterAdmin(await prisma.admin.create({
//     ...args,
//     data: {
//       ...data,
//       ...args?.data,
//       password: createHash(args?.data?.password ?? data.password),
//     },
//   })),
// );
//
// export const updateAdmin = depend(
//   { prisma: prisma as { admin: { update: typeof prisma.admin.update } } },
//   async({ prisma }, id: number | undefined, data: UpdateAdminData, args?: Partial<UpdateAdminArgs>) => filterAdmin(await prisma.admin.update({
//     ...args,
//     where: {
//       id,
//       ...args?.where,
//     },
//     data: {
//       ...data,
//       ...args?.data,
//       password: typeof data.password === 'string' ? createHash(data.password) : undefined,
//     },
//   })),
// );
//
// export const deleteAdmin = depend(
//   { prisma: prisma as { admin: { delete: typeof prisma.admin.delete } } },
//   async({ prisma }, id: number | undefined, args?: Partial<DeleteAdminArgs>) => filterAdmin(await prisma.admin.delete({
//     where: { id },
//     ...args,
//   })),
// );
