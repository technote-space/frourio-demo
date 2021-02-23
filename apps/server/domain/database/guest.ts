import type { Prisma, Guest } from '$/prisma/client';
import type { IValidatable } from '$/domain/database/service/validatable';

export type SearchGuestArgs = Prisma.GuestFindManyArgs;
export type FindGuestArgs = Prisma.GuestFindFirstArgs;
export type CreateGuestData = Prisma.GuestCreateInput;
export type CreateGuestArgs = Prisma.GuestCreateArgs;
export type UpdateGuestData = Prisma.GuestUpdateInput;
export type UpdateGuestArgs = Prisma.GuestUpdateArgs;
export type DeleteGuestArgs = Prisma.GuestDeleteArgs;
export type DeleteManyGuestArgs = Prisma.GuestDeleteManyArgs;
export type { Guest };

export interface IGuestRepository extends IValidatable {
  list(args?: SearchGuestArgs): Promise<Guest[]>;

  count(args?: Omit<SearchGuestArgs, 'select' | 'include'>): Promise<number>;

  find(id: number | undefined, args?: FindGuestArgs): Promise<Guest> | never;

  create(data: CreateGuestData, args?: Partial<CreateGuestArgs>): Promise<Guest>;

  update(id: number, data: UpdateGuestData, args?: Partial<UpdateGuestArgs>): Promise<Guest>;

  delete(id: number, args?: Partial<DeleteGuestArgs>): Promise<Guest>;

  deleteMany(ids: number[] | undefined, args?: Partial<DeleteManyGuestArgs>): Promise<{ count: number }>;
}
