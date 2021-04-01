import type { Guest, Room } from './client';
import type { ReservationStatus } from '@frourio-demo/types';
import { PrismaClient } from './client';
import { Runner, createDefinition, DelegateTypes as _DelegateTypes } from '@technote-space/prisma-seeder-tools';
import { RoleSeeder } from './seeder/role';
import { AdminSeeder } from './seeder/admin';
import { GuestSeeder } from './seeder/guest';
import { ReservationSeeder } from './seeder/reservation';
import { RoomSeeder } from './seeder/room';
import { isBefore } from 'date-fns';
import { generateCode } from '$/packages/infra/database/service';

const prisma = new PrismaClient();
export const runner = new Runner(prisma, [
  createDefinition('admin', faker => ({
    name: `${faker.name.findName()} ${faker.name.lastName()}`,
    email: `${faker.random.number()}${faker.random.number()}@example.com`,
    password: faker.random.alpha(),
  })),
  createDefinition('guest', faker => ({
    email: `${faker.random.number()}${faker.random.number()}@example.com`,
    name: `${faker.name.lastName()} ${faker.name.firstName()}`,
    nameKana: 'テスト テスト',
    zipCode: faker.address.zipCode(),
    address: `${faker.address.country()} ${faker.address.city()} ${faker.address.streetName()}`,
    phone: faker.phone.phoneNumber(),
  })),
  createDefinition('role', () => ({})),
  createDefinition('room', faker => ({
    name: faker.name.firstName() + faker.random.number(),
    number: faker.random.number({ min: 1, max: 10 }),
    price: faker.random.number({ min: 1000, max: 100000 }),
  })),
  createDefinition('reservation', (faker, params) => {
    const room = params[0] as Room;
    const guest = params[1] as Guest;
    const number = faker.random.number({ min: 1, max: room.number });
    const checkin = faker.date.between(faker.date.past(2), faker.date.future(2));
    checkin.setHours(15, 0, 0, 0);
    const nights = faker.random.number({ min: 1, max: 7 });
    const checkout = new Date(checkin.valueOf());
    checkout.setDate(checkin.getDate() + nights);
    checkout.setHours(10, 0, 0, 0);

    const amount = room.price * number * nights;
    let status: ReservationStatus;
    let payment: number | undefined;
    const now = new Date();
    if (faker.random.number(1000) < 50) {
      status = 'cancelled';
    } else {
      if (isBefore(now, checkin)) {
        status = 'reserved';
      } else if (isBefore(now, checkout)) {
        status = 'checkin';
      } else {
        status = 'checkout';
        payment = amount;
      }
    }

    return {
      code: generateCode(),
      checkin,
      checkout,
      status,
      number,
      amount,
      payment,
      guestEmail: guest.email ?? '',
      guestName: guest.name ?? '',
      guestNameKana: guest.nameKana ?? '',
      guestZipCode: guest.zipCode ?? '',
      guestAddress: guest.address ?? '',
      guestPhone: guest.phone ?? '',
      roomName: room.name,
      room: {
        connect: {
          id: room.id,
        },
      },
      guest: guest ? {
        connect: {
          id: guest.id,
        },
      } : undefined,
    };
  }),
], [
  new RoleSeeder(prisma),
  new AdminSeeder(prisma),
  new GuestSeeder(prisma),
  new RoomSeeder(prisma),
  new ReservationSeeder(prisma),
], 'ja');
export type DelegateTypes = _DelegateTypes<PrismaClient>;
