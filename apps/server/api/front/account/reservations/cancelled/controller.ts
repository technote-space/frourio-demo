import { defineController } from './$relay';
import { getCancelledReservations } from '$/domains/front/account';

export default defineController(({ getCancelledReservations }), ({ getCancelledReservations }) => ({
  get: async({ user }) => getCancelledReservations(user),
}));
