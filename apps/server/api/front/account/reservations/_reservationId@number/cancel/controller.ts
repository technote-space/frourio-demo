import { defineController } from './$relay';
import { cancel } from '$/domains/front/account';

export default defineController(({ cancel }), ({ cancel }) => ({
  patch: async({ user, params }) => cancel(user, params.reservationId),
}));
