import { defineController } from './$relay';
import { getReservedReservations } from '$/domains/front/account';

export default defineController(({ getReservedReservations }), ({ getReservedReservations }) => ({
  get: async({ user }) => getReservedReservations(user),
}));
