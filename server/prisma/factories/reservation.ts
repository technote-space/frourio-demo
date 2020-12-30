import type { ReservationCreateInput, Room } from '@prisma/client';
import { isBefore, isAfter } from 'date-fns';
import { define } from '../tools/define';
import { ReservationStatus } from '$/types';

define<ReservationCreateInput>('reservation', ((faker, params) => {
  const number  = faker.random.number({ min: 1, max: (params[0] as Room).number });
  const checkin = faker.date.between(faker.date.past(2), faker.date.future(2));
  checkin.setHours(15, 0, 0, 0);
  const nights   = faker.random.number({ min: 1, max: 10 });
  const checkout = new Date(checkin.valueOf());
  checkout.setDate(checkin.getDate() + nights);
  checkout.setHours(10, 0, 0, 0);

  const amount = (params[0] as Room).price * number * nights;
  let status: ReservationStatus;
  let payment: number | undefined;
  const now    = new Date();
  if (faker.random.number(1000) < 50) {
    status = 'cancelled';
  } else {
    if (isBefore(now, checkin)) {
      status = 'reserved';
    } else if (isBefore(now, checkout)) {
      status = 'checkin';
    } else {
      status  = 'checkout';
      payment = amount;
    }
  }

  return {
    checkin,
    checkout,
    status,
    number,
    amount,
    payment,
  };
}));
