import { PrismaClient } from '$/prisma/client';
import '../factories';
import { RoleSeeder } from './seed/role';
import { AdminSeeder } from './seed/admin';
import { GuestSeeder } from './seed/guest';
import { ReservationSeeder } from './seed/reservation';
import { RoomSeeder } from './seed/room';

const prisma  = new PrismaClient();
const seeders = [
  new RoleSeeder(prisma),
  new AdminSeeder(prisma),
  new GuestSeeder(prisma),
  new RoomSeeder(prisma),
  new ReservationSeeder(prisma),
];

(async() => {
  await seeders.reduce(async(prev, seeder) => {
    await prev;
    await seeder.run();
  }, Promise.resolve());
  await prisma.$disconnect();
})();
