import { defineController } from './$relay';
import { cancel } from '$/domains/front/account';

export default defineController(() => ({
  patch: async({ params }) => cancel(params.reservationId),
}));
