import type { PrismaClient } from '../client';
import bcrypt from 'bcryptjs';
import { Seeder } from '@technote-space/prisma-seeder-tools/dist/seeder';
import { getRolesValue } from '$/packages/application/service/auth';

export class AdminSeeder extends Seeder<PrismaClient> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    await this.factory('admin').create({
      name: 'Admin',
      email: 'admin@example.com',
      password: bcrypt.hashSync('test1234', 10),
      icon: 'dummy.svg',
      roles: {
        connect: getRolesValue([
          { domain: 'dashboard', targets: ['all'] },
          { domain: 'admins', targets: ['all'] },
          { domain: 'rooms', targets: ['all'] },
          { domain: 'guests', targets: ['all'] },
          { domain: 'reservations', targets: ['all'] },
        ]).map(role => ({ role: role.role })),
      },
    });
    await this.factory('admin').create({
      name: 'Test User',
      email: 'test@example.com',
      password: bcrypt.hashSync('test1234', 10),
      icon: 'dummy.svg',
      roles: {
        connect: getRolesValue([
          { domain: 'dashboard', targets: ['all'] },
          { domain: 'rooms', targets: ['all'] },
          { domain: 'guests', targets: ['all'] },
          { domain: 'reservations', targets: ['all'] },
        ]).map(role => ({ role: role.role })),
      },
    });
    await this.factory('admin').create({
      name: 'Only rooms',
      email: 'rooms@example.com',
      password: bcrypt.hashSync('test1234', 10),
      icon: 'dummy.svg',
      roles: {
        connect: getRolesValue([
          { domain: 'rooms', targets: ['create', 'read', 'update'] },
        ]).map(role => ({ role: role.role })),
      },
    });
    await this.factory('admin').create({
      name: 'No edit',
      email: 'read@example.com',
      password: bcrypt.hashSync('test1234', 10),
      icon: 'dummy.svg',
      roles: {
        connect: getRolesValue([
          { domain: 'dashboard', targets: [] },
          { domain: 'rooms', targets: [] },
          { domain: 'guests', targets: [] },
          { domain: 'reservations', targets: [] },
        ]).map(role => ({ role: role.role })),
      },
    });
  }
}
