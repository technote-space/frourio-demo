import type { PrismaClient } from '$/prisma/client';
import { Seeder } from '../tools/seeder';
import { getRolesValue } from '$/service/auth';

export class RoleSeeder extends Seeder {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    await getRolesValue([
      { domain: 'dashboard', targets: ['create', 'read', 'update', 'delete'] },
      { domain: 'admins', targets: ['create', 'read', 'update', 'delete'] },
      { domain: 'rooms', targets: ['create', 'read', 'update', 'delete'] },
      { domain: 'guests', targets: ['create', 'read', 'update', 'delete'] },
      { domain: 'reservations', targets: ['create', 'read', 'update', 'delete'] },
    ]).reduce(async(prev, role) => {
      await prev;
      await this.roleFactory.create(role);
    }, Promise.resolve());
  }
}
