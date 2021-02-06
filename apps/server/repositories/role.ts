import type { Prisma, Role } from '$/prisma/client';
import { depend } from 'velona';
import { PrismaClient } from '$/prisma/client';

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
