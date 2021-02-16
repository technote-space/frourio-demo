import { defineController } from './$relay';
import { getCheckout, checkout } from '$/domains/admin/dashboard';

export default defineController(({ getCheckout, checkout }), ({ getCheckout, checkout }) => ({
  get: async({ query }) => getCheckout(query.query, query.date),
  patch: async({ body }) => checkout(body.id),
}));
