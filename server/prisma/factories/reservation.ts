import type { ReservationCreateInput } from '@prisma/client';
import { define } from '../tools/define';

define<ReservationCreateInput>('reservation', (faker => ({
  checkin: new Date(),
  checkout: new Date(),
  status: 'reserved',
  number: faker.random.number({ min: 1, max: 5 }),
  amount: faker.random.number({ min: 1000, max: 50000 }),
})));
