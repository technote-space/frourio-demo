import { depend } from 'velona';
import { PrismaClient } from '$/prisma/client';
import type { Prisma, Role } from '$/prisma/client';
// import { ensureNotNull } from '$/repositories/utils';

export type SearchRoleArgs = Prisma.RoleFindManyArgs;
export type FindRoleArgs = Prisma.RoleFindFirstArgs;
export type { Role };

const prisma = new PrismaClient();

export const getRoles = depend(
  { prisma: prisma as { role: { findMany: typeof prisma.role.findMany } } },
  async({ prisma }, args?: SearchRoleArgs) => prisma.role.findMany(args),
);

export const getRoleCount = depend(
  { prisma: prisma as { role: { count: typeof prisma.role.count } } },
  async({ prisma }, args?: Omit<SearchRoleArgs, 'select' | 'include'>) => prisma.role.count(args),
);

// export const getRole = depend(
//   { prisma: prisma as { role: { findFirst: typeof prisma.role.findFirst } } },
//   async({ prisma }, role: string | undefined, args?: FindRoleArgs): Promise<Role> | never => await prisma.role.findFirst({
//     where: { role },
//     rejectOnNotFound: true,
//     ...args,
//   }) as Role,
// );
