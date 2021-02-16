import { defineController } from './$relay';
import { getDefaultPaymentMethod } from '$/domains/stripe';

export default defineController(({ getDefaultPaymentMethod }), ({ getDefaultPaymentMethod }) => ({
  get: async({ user }) => getDefaultPaymentMethod(user.id),
}));
