import { PrismaClient } from '$/prisma/client';
import '../factories';
import { AdminSeeder } from './admin';
import { GuestSeeder } from './guest';
import { ReservationSeeder } from './reservation';
import { RoomSeeder } from './room';

const prisma  = new PrismaClient();
const seeders = [
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
