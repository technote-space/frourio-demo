import { defineController } from './$relay';
import type { getCheckoutGuests } from '$/domains/dashboard';

export default defineController(({ getCheckoutGuests }), ({ getCheckoutGuests }) => ({
  get: async({ query }) => getCheckoutGuests(query?.day),
}));
