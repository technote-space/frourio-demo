import { depend } from 'velona';
import { PrismaClient } from '@prisma/client';
import { createHash, validateHash } from '$/utils';
import { API_ORIGIN, BASE_PATH } from '$/service/envValues';
import { ensureNotNull } from '$/utils';
import 'fastify-jwt';
import type { Prisma } from '@prisma/client';

export type FindAdminArgs = Prisma.FindFirstAdminArgs;
export type CreateAdminData = Prisma.AdminCreateInput;
export type CreateAdminArgs = Prisma.AdminCreateArgs;
export type UpdateAdminData = Prisma.AdminUpdateInput;
export type UpdateAdminArgs = Prisma.AdminUpdateArgs;
export type DeleteAdminArgs = Prisma.AdminDeleteArgs;
export type { Admin } from '@prisma/client';

export const prisma = new PrismaClient();

const createIconUrl    = (name: string) => `${API_ORIGIN}${BASE_PATH}/icons/${name}`;
const convertToIconUrl = <T extends { icon: string | null }>(admin: T | null) => {
  if (admin?.icon && !/\/icons\//.test(admin.icon)) {
    admin.icon = createIconUrl(admin.icon);
  }

  return admin;
};
const filterAdmin      = <T extends { icon: string | null }>(admin: T | null): T | never => ensureNotNull(convertToIconUrl(admin));

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

export const createAdmin = depend(
  { prisma: prisma as { admin: { create: typeof prisma.admin.create } } },
  async({ prisma }, data: CreateAdminData, args?: CreateAdminArgs) => filterAdmin(await prisma.admin.create({
    ...args,
    data: {
      ...data,
      ...args?.data,
      password: createHash(args?.data.password ?? data.password),
    },
  })),
);

export const updateAdmin = depend(
  { prisma: prisma as { admin: { update: typeof prisma.admin.update } } },
  async({ prisma }, id: number | undefined, data: UpdateAdminData, args?: UpdateAdminArgs) => filterAdmin(await prisma.admin.update({
    ...args,
    where: {
      id,
      ...args?.where,
    },
    data: {
      ...data,
      ...args?.data,
      password: typeof data.password === 'string' ? createHash(data.password) : undefined,
    },
  })),
);

export const deleteAdmin = depend(
  { prisma: prisma as { admin: { delete: typeof prisma.admin.delete } } },
  async({ prisma }, id: number | undefined, args?: DeleteAdminArgs) => filterAdmin(await prisma.admin.delete({
    where: { id },
    ...args,
  })),
);
