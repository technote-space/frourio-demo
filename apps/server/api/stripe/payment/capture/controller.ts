import { defineController } from './$relay';
import { capturePaymentIntents } from '$/domains/front/reservation/stripe';

export default defineController(({ capturePaymentIntents }), ({ capturePaymentIntents }) => ({
  post: async({ body }) => capturePaymentIntents(body.reservationId, body.isCancel),
}));
