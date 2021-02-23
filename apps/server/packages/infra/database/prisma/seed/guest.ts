import type { PrismaClient } from '../client';
import { Seeder } from '../tools/seeder';

export class GuestSeeder extends Seeder {
  constructor(private prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    await this.guestFactory.createMany(10);
  }
}
