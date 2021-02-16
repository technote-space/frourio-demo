import { defineController } from './$relay';
import { getPaymentMethods, attachPaymentMethod, detachPaymentMethod } from '$/domains/stripe';

export default defineController(({ getPaymentMethods, attachPaymentMethod, detachPaymentMethod }), ({
  getPaymentMethods,
  attachPaymentMethod,
  detachPaymentMethod,
}) => ({
  get: async({ user }) => getPaymentMethods(user.id),
  put: async({ user, body }) => attachPaymentMethod(body.methodId, user.id),
  delete: async({ body }) => detachPaymentMethod(body.methodId),
}));
