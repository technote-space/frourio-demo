import type { Prisma, Room } from '$/prisma/client';
import type { IValidatable } from '$/domain/database/service/validatable';

export type SearchRoomArgs = Prisma.RoomFindManyArgs;
export type FindRoomArgs = Prisma.RoomFindFirstArgs;
export type CreateRoomData = Prisma.RoomCreateInput;
export type CreateRoomArgs = Prisma.RoomCreateArgs;
export type UpdateRoomData = Prisma.RoomUpdateInput;
export type UpdateRoomArgs = Prisma.RoomUpdateArgs;
export type DeleteRoomArgs = Prisma.RoomDeleteArgs;
export type { Room };

export interface IRoomRepository extends IValidatable {
  list(args?: SearchRoomArgs): Promise<Room[]>;

  count(args?: Omit<SearchRoomArgs, 'select' | 'include'>): Promise<number>;

  find(id: number | undefined, args?: FindRoomArgs): Promise<Room> | never;

  create(data: CreateRoomData, args?: Partial<CreateRoomArgs>): Promise<Room>;

  update(id: number, data: UpdateRoomData, args?: Partial<UpdateRoomArgs>): Promise<Room>;

  delete(id: number, args?: Partial<DeleteRoomArgs>): Promise<Room>;
}
