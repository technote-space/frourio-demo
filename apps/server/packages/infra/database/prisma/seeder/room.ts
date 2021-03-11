import type { PrismaClient } from '../client';
import { Seeder } from '@technote-space/prisma-seeder-tools/dist/seeder';

export class RoomSeeder extends Seeder<PrismaClient> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    await this.factory('room').createMany(5);
  }
}
