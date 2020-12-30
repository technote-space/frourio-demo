import type { ReservationCreateInput, Guest, Room } from '@prisma/client';
import { define } from '../tools/define';

define<ReservationCreateInput>('reservation', ((faker, params) => {
  const number  = faker.random.number({ min: 1, max: (params[0] as Room).number });
  const checkin = faker.date.between(faker.date.past(2), faker.date.future(2));
  checkin.setHours(15, 0, 0, 0);
  const days     = faker.random.number({ min: 1, max: 10 });
  const checkout = new Date(checkin.valueOf());
  checkout.setDate(checkin.getDate() + days);
  checkout.setHours(10, 0, 0, 0);
  return {
    checkin,
    checkout,
    status: 'reserved',
    number,
    amount: (params[0] as Room).price * number * days,
  };
}));
