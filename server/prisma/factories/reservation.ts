import type { ReservationCreateInput } from '@prisma/client';
import { define } from '../tools/define';

define<ReservationCreateInput>('reservation', (() => ({
  checkin: new Date(),
  checkout: new Date(),
  status: 'reserved',
})));
