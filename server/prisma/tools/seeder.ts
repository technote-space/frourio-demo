import type {
  Admin,
  Guest,
  Reservation,
  Room,
  Prisma,
  PrismaClient,
} from '$/prisma/client';
import { factory, Factory } from './factory';

export abstract class Seeder {
  protected adminFactory: Factory<Admin, Prisma.AdminCreateInput>;
  protected guestFactory: Factory<Guest, Prisma.GuestCreateInput>;
  protected reservationFactory: Factory<Reservation, Prisma.ReservationCreateInput>;
  protected roomFactory: Factory<Room, Prisma.RoomCreateInput>;

  protected constructor(prisma: PrismaClient) {
    this.adminFactory = factory<Admin, Prisma.AdminCreateInput>(prisma, 'admin');
    this.guestFactory = factory<Guest, Prisma.GuestCreateInput>(prisma, 'guest');
    this.reservationFactory = factory<Reservation, Prisma.ReservationCreateInput>(prisma, 'reservation');
    this.roomFactory = factory<Room, Prisma.RoomCreateInput>(prisma, 'room');
  }

  abstract run(): Promise<void>;
}
