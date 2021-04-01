import type { PrismaClient } from '../client';
import { Seeder } from '@technote-space/prisma-seeder-tools/dist/seeder';

export class GuestSeeder extends Seeder<PrismaClient> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    await this.factory('guest').createMany(10);
  }
}
