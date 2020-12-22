import type { ReservationDetailCreateInput } from '@prisma/client';
import { define } from '../tools/define';

define<ReservationDetailCreateInput>('reservationDetail', (faker => ({
  number: faker.random.number({ min: 1, max: 5 }),
  amount: faker.random.number({ min: 1000, max: 50000 }),
})));
