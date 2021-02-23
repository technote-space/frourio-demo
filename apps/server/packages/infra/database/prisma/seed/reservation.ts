import type { PrismaClient } from '../client';
import { Seeder } from '../tools/seeder';

export class ReservationSeeder extends Seeder {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    const rooms  = await this.roomFactory.list();
    const guests = await this.guestFactory.list();
    await [...Array(300)].reduce(async prev => {
      await prev;
      const guest = guests.random();
      const room  = rooms.random();
      await this.reservationFactory.create({}, room, guest);
    }, Promise.resolve());
  }
}
