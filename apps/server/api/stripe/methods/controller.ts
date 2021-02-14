import { defineController } from './$relay';
import { getPaymentMethods } from '$/domains/stripe';

export default defineController(({ getPaymentMethods }), ({ getPaymentMethods }) => ({
  get: async({ user }) => getPaymentMethods(user.id),
}));
