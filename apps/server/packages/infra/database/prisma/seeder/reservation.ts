import type { PrismaClient } from '../client';
import { Seeder } from '@technote-space/prisma-seeder-tools/dist/seeder';

export class ReservationSeeder extends Seeder<PrismaClient> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    const rooms  = await this.factory('room').list();
    const guests = await this.factory('guest').list();
    await [...Array(300)].reduce(async prev => {
      await prev;
      await this.factory('reservation').create({}, rooms.random(), guests.random());
    }, Promise.resolve());
  }
}
