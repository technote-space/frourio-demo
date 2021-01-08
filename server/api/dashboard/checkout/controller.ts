import { defineController } from './$relay';
import { getCheckout, checkout } from '$/domains/dashboard';

export default defineController(({ getCheckout, checkout }), ({ getCheckout, checkout }) => ({
  get: async({ query }) => {
    if (!query) {
      return getCheckout();
    }

    return getCheckout(query.query, query.date);
  },
  patch: async({ body }) => checkout(body.id, body.payment),
}));
