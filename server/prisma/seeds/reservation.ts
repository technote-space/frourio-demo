import type { PrismaClient } from '@prisma/client';
import { Seeder } from '../tools/seeder';

export class ReservationSeeder extends Seeder {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    const rooms  = await this.roomFactory.list();
    const guests = await this.guestFactory.list();
    await [...Array(100)].reduce(async prev => {
      await prev;
      const reservation = await this.reservationFactory.create({
        room: {
          connect: {
            id: rooms.random().id,
          },
        },
        guest: {
          connect: {
            id: guests.random().id,
          },
        },
      });
    }, Promise.resolve());
  }
}
