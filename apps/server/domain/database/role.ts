import type { Prisma, Role } from '$/prisma/client';

export type SearchRoleArgs = Prisma.RoleFindManyArgs;
export type { Role };

export interface IRoleRepository {
  list(args?: SearchRoleArgs): Promise<Role[]>;

  count(args?: Omit<SearchRoleArgs, 'select' | 'include'>): Promise<number>;
}
