import type { Prisma, Role } from '$/packages/domain/database/service/prisma';

export type SearchRoleArgs = Prisma.RoleFindManyArgs;
export type { Role };

export interface IRoleRepository {
  list(args?: SearchRoleArgs): Promise<Role[]>;

  count(args?: Omit<SearchRoleArgs, 'select' | 'include'>): Promise<number>;
}
