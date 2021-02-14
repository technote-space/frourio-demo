import { defineController } from './$relay';
import { attachPaymentMethod, detachPaymentMethod } from '$/domains/stripe';

export default defineController(({ attachPaymentMethod, detachPaymentMethod }), ({
  attachPaymentMethod,
  detachPaymentMethod,
}) => ({
  put: async({ params, user }) => attachPaymentMethod(params.methodId, user.id),
  delete: async({ params }) => detachPaymentMethod(params.methodId),
}));
