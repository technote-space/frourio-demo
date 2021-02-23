import type { IRoleRepository, SearchRoleArgs } from '$/domain/database/role';
import { depend } from 'velona';
import { prisma } from '$/infra/database';

export class RoleRepository implements IRoleRepository {
  list = depend(
    { prisma: prisma as { role: { findMany: typeof prisma.role.findMany } } },
    async({ prisma }, args?: SearchRoleArgs) => prisma.role.findMany(args),
  );

  count = depend(
    { prisma: prisma as { role: { count: typeof prisma.role.count } } },
    async({ prisma }, args?: Omit<SearchRoleArgs, 'select' | 'include'>) => prisma.role.count(args),
  );
}
