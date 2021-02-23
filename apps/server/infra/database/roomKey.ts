import type {
  IRoomKeyRepository,
  FindRoomKeyArgs,
  CreateRoomKeyData,
  CreateRoomKeyArgs,
  UpdateRoomKeyData,
  UpdateRoomKeyArgs,
} from '$/domain/database/roomKey';
import type { Reservation } from '$/domain/database/reservation';
import { depend } from 'velona';
import { generateRoomKey } from '$/infra/database/service';
import { prisma } from '$/infra/database';
import { set } from 'date-fns';
import { dropId } from './service';

export class RoomKeyRepository implements IRoomKeyRepository {
  find = depend(
    { prisma: prisma as { roomKey: { findFirst: typeof prisma.roomKey.findFirst } } },
    async({ prisma }, reservationId: number, args?: FindRoomKeyArgs) => prisma.roomKey.findFirst({
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

  create = depend(
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

  update = depend(
    { prisma: prisma as { roomKey: { update: typeof prisma.roomKey.update } } },
    async({ prisma }, id: number, data: UpdateRoomKeyData, args?: Partial<UpdateRoomKeyArgs>) => prisma.roomKey.update({
      where: { id },
      ...args,
      data: dropId(data),
    }),
  );
}
