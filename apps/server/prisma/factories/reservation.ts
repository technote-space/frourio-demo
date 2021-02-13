import type { Room } from '$/prisma/client';
import type { ReservationStatus } from '@frourio-demo/types';
import { isBefore } from 'date-fns';
import { generateCode } from '$/utils/reservation';
import { define } from '../tools/define';

define('reservation', ((faker, params) => {
  const number = faker.random.number({ min: 1, max: (params[0] as Room).number });
  const checkin = faker.date.between(faker.date.past(2), faker.date.future(2));
  checkin.setHours(15, 0, 0, 0);
  const nights = faker.random.number({ min: 1, max: 7 });
  const checkout = new Date(checkin.valueOf());
  checkout.setDate(checkin.getDate() + nights);
  checkout.setHours(10, 0, 0, 0);

  const amount = (params[0] as Room).price * number * nights;
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
  };
}));
