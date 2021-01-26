import { PrismaClient } from './prisma/client';
import bcrypt from 'bcryptjs';
import { startOfToday, addDays, setHours } from 'date-fns';

const prisma = new PrismaClient();

(async() => {
  await prisma.admin.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: bcrypt.hashSync('test1234', 10),
      icon: 'dummy.svg',
    },
  });
  await prisma.room.create({
    data: {
      name: '富士の間',
      number: 2,
      price: 10000,
    },
  });
  await prisma.guest.create({
    data: {
      name: '山田　太郎',
      nameKana: 'ヤマダ　タロウ',
      zipCode: '100-0001',
      address: '東京都千代田区千代田1-1-1',
      phone: '03-0000-0000',
    },
  });
  await prisma.guest.create({
    data: {
      name: '鈴木　一郎',
      nameKana: 'スズキ　イチロウ',
      zipCode: '100-0002',
      address: '東京都千代田区皇居外苑1-1-1',
      phone: '03-1111-1111',
    },
  });
  await prisma.reservation.create({
    data: {
      guestName: '山田　太郎',
      guestNameKana: 'ヤマダ　タロウ',
      guestZipCode: '100-0001',
      guestAddress: '東京都千代田区千代田1-1-1',
      guestPhone: '03-0000-0000',
      roomName: '富士の間',
      number: 2,
      amount: 40000,
      checkin: setHours(addDays(startOfToday(), -2), 15),
      checkout: setHours(startOfToday(), 10),
      room: {
        connect: {
          id: 1,
        },
      },
      guest: {
        connect: {
          id: 1,
        },
      },
      status: 'checkin',
    },
  });
  await prisma.reservation.create({
    data: {
      guestName: '鈴木　一郎',
      guestNameKana: 'スズキ　イチロウ',
      guestZipCode: '100-0002',
      guestAddress: '東京都千代田区皇居外苑1-1-1',
      guestPhone: '03-1111-1111',
      roomName: '富士の間',
      number: 1,
      amount: 20000,
      checkin: setHours(startOfToday(), 15),
      checkout: setHours(addDays(startOfToday(), 2), 10),
      room: {
        connect: {
          id: 1,
        },
      },
      guest: {
        connect: {
          id: 1,
        },
      },
      status: 'reserved',
    },
  });
  await prisma.$disconnect();
})();
