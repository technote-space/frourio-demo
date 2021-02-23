import type { PrismaClient } from '$/prisma/client';
import bcrypt from 'bcryptjs';
import { Seeder } from '../tools/seeder';
import { getRolesValue } from '$/application/service/auth';

export class AdminSeeder extends Seeder {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  public async run(): Promise<void> {
    await this.adminFactory.create({
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
    await this.adminFactory.create({
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
    await this.adminFactory.create({
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
    await this.adminFactory.create({
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
