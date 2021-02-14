import type { Prisma, RoomKey } from '$/prisma/client';
import type { Reservation } from '$/repositories/reservation';
import { depend } from 'velona';
import { generateRoomKey } from '$/utils/reservation';
import { prisma } from '$/repositories';
import { set } from 'date-fns';
import { dropId } from '$/repositories/utils';

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

export const getRoomKey = depend(
  { prisma: prisma as { roomKey: { findFirst: typeof prisma.roomKey.findFirst } } },
  async({ prisma }, reservationId: number, args?: FindRoomKeyArgs): Promise<RoomKey | null> => await prisma.roomKey.findFirst({
    ...args,
    where: {
      reservationId,
      startAt: {
        lte: new Date(),
      },
      endAt: {
        gte: new Date(),
      },
      ...args?.where,
    },
  }),
);

export const createRoomKey = depend(
  { prisma: prisma as { roomKey: { create: typeof prisma.roomKey.create } } },
  async({ prisma }, reservation: Reservation, data?: CreateRoomKeyData, args?: Partial<CreateRoomKeyArgs>) => {
    const values = { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 };
    return prisma.roomKey.create({
      ...args,
      data: {
        reservation: {
          connect: {
            id: reservation.id,
          },
        },
        key: generateRoomKey(),
        trials: 0,
        startAt: set(reservation.checkin, values),
        endAt: set(reservation.checkout, values),
        ...data,
      },
    });
  },
);

export const updateRoomKey = depend(
  { prisma: prisma as { roomKey: { update: typeof prisma.roomKey.update } } },
  async({ prisma }, id: number, data: UpdateRoomKeyData, args?: Partial<UpdateRoomKeyArgs>) => prisma.roomKey.update({
    where: { id },
    ...args,
    data: dropId(data),
  }),
);
