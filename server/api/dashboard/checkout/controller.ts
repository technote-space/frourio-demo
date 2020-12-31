import { defineController } from './$relay';
import { getCheckout, checkout } from '$/domains/dashboard';
import { parseQuery } from '$/repositories/utils';

export default defineController(({ getCheckout, checkout }), ({ getCheckout }) => ({
  get: async({ query }) => {
    if (!query) {
      return getCheckout();
    }

    return getCheckout(parseQuery(query.query), query.date);
  },
  patch: async({ body }) => checkout(body.id, body.payment),
}));
