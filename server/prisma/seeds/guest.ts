import type { PrismaClient } from '@prisma/client';
import { Seeder } from '../tools/seeder';

export class GuestSeeder extends Seeder {
  constructor(private prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    await (await this.guestFactory.createMany(10)).each(async guest => {
      await this.guestDetailFactory.create({
        guest: {
          connect: {
            id: guest.id,
          },
        },
      });
    });
  }
}
