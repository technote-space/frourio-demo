import type { PrismaClient } from '../client';
import { Seeder } from '../tools/seeder';

export class RoomSeeder extends Seeder {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    await this.roomFactory.createMany(5);
  }
}
