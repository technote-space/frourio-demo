import { PrismaClient } from '$/prisma/client';
import '../factories';
import { RoleSeeder } from './role';
import { AdminSeeder } from './admin';
import { GuestSeeder } from './guest';
import { ReservationSeeder } from './reservation';
import { RoomSeeder } from './room';

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
