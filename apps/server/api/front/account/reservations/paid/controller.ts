import { defineController } from './$relay';
import { getPaidReservations } from '$/domains/front/account';

export default defineController(({ getPaidReservations }), ({ getPaidReservations }) => ({
  get: async({ user }) => getPaidReservations(user),
}));
