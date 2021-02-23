import type { Prisma, Admin as _Admin } from '$/packages/domain/database/service/prisma';
import type { Role } from '$/packages/domain/database/role';
import type { IValidatable } from '$/packages/domain/database/service/validatable';

export type SearchAdminArgs = Prisma.AdminFindManyArgs;
export type FindAdminArgs = Prisma.AdminFindFirstArgs;
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

export interface IAdminRepository extends IValidatable {
  validate(email: string, password: string): Promise<number | undefined>;

  list(args?: SearchAdminArgs): Promise<Admin[]>;

  count(args?: Omit<SearchAdminArgs, 'select' | 'include'>): Promise<number>;

  find(id: number, args?: FindAdminArgs): Promise<Admin> | never;

  create(data: CreateAdminData, args?: Partial<CreateAdminArgs>): Promise<Admin>;

  update(id: number, data: UpdateAdminData, args?: Partial<UpdateAdminArgs>): Promise<Admin>;

  delete(id: number, args?: Partial<DeleteAdminArgs>): Promise<Admin>;
}
