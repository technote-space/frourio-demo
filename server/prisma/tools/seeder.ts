import type {
  Admin,
  Guest,
  GuestDetail,
  Reservation,
  ReservationDetail,
  Room,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { factory, Factory } from './factory';

export abstract class Seeder {
  protected adminFactory: Factory<Admin, Prisma.AdminCreateInput>;
  protected guestFactory: Factory<Guest, Prisma.GuestDetailCreateInput>;
  protected guestDetailFactory: Factory<GuestDetail, Prisma.GuestDetailCreateInput>;
  protected reservationFactory: Factory<Reservation, Prisma.ReservationCreateInput>;
  protected reservationDetailFactory: Factory<ReservationDetail, Prisma.ReservationDetailCreateInput>;
  protected roomFactory: Factory<Room, Prisma.RoomCreateInput>;

  constructor(prisma: PrismaClient) {
    this.adminFactory = factory<Admin, Prisma.AdminCreateInput>(prisma, 'admin');
    this.guestFactory = factory<Guest, Prisma.GuestCreateInput>(prisma, 'guest');
    this.guestDetailFactory = factory<GuestDetail, Prisma.GuestDetailCreateInput>(prisma, 'guestDetail');
    this.reservationFactory = factory<Reservation, Prisma.ReservationCreateInput>(prisma, 'reservation');
    this.reservationDetailFactory = factory<ReservationDetail, Prisma.ReservationDetailCreateInput>(prisma, 'reservationDetail');
    this.roomFactory = factory<Room, Prisma.RoomCreateInput>(prisma, 'room');
  }

  abstract run(): Promise<void>;
}
