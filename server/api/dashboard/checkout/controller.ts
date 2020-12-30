import { defineController } from './$relay';
import { getCheckout, checkout } from '$/domains/dashboard';

export default defineController(({ getCheckout, checkout }), ({ getCheckout }) => ({
  get: async({ query }) => {
    if (!query) {
      return getCheckout();
    }

    return getCheckout(
      typeof query.query === 'string' ? JSON.parse(query.query) : query.query,
      typeof query.date === 'string' ? new Date(query.date) : query.date,
    );
  },
  patch: async({ body }) => checkout(body.id, body.payment),
}));
