import type { PrismaClient } from '../client';
import { Seeder } from '@technote-space/prisma-seeder-tools/dist/seeder';
import { getRolesValue } from '$/packages/application/service/auth';

export class RoleSeeder extends Seeder<PrismaClient> {
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
      await this.factory('role').create(role);
    }, Promise.resolve());
  }
}
