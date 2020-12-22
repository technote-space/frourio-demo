import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Seeder } from '../tools/seeder';

export class AdminSeeder extends Seeder {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    await this.adminFactory.create({
      name: 'Test User',
      email: 'test@example.com',
      password: bcrypt.hashSync('test1234', 10),
    });
  }
}
