import type { Prisma, RoomKey } from '$/prisma/client';
import type { Reservation } from '$/domain/database/reservation';

export type FindRoomKeyArgs = Prisma.RoomKeyFindFirstArgs;
export type CreateRoomKeyData = Omit<Prisma.RoomKeyCreateInput, 'key' | 'startAt' | 'endAt'> & {
  key?: string;
  startAt?: Date | string;
  endAt?: Date | string;
};
export type CreateRoomKeyArgs = Prisma.RoomKeyCreateArgs;
export type UpdateRoomKeyData = Prisma.RoomKeyUpdateInput;
export type UpdateRoomKeyArgs = Prisma.RoomKeyUpdateArgs;
export type { RoomKey };

export interface IRoomKeyRepository {
  find(reservationId: number, args?: FindRoomKeyArgs): Promise<RoomKey | null>;

  create(reservation: Reservation, data?: CreateRoomKeyData, args?: Partial<CreateRoomKeyArgs>): Promise<RoomKey>;

  update(id: number, data: UpdateRoomKeyData, args?: Partial<UpdateRoomKeyArgs>): Promise<RoomKey>;
}
