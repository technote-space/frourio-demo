import { defineController } from './$relay';
import { capturePaymentIntents } from '$/domains/stripe';

export default defineController(({ capturePaymentIntents }), ({ capturePaymentIntents }) => ({
  post: async({ body }) => capturePaymentIntents(body.reservationId, body.isCancel),
}));
