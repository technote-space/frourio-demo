import { defineController } from './$relay';
import { createPaymentIntents } from '$/domains/front/reservation/stripe';

export default defineController(({ createPaymentIntents }), ({ createPaymentIntents }) => ({
  post: async({ body }) => createPaymentIntents(body.reservationId, body.paymentMethodsId),
}));
