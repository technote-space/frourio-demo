import { defineController } from './$relay';
import { getCheckoutGuests } from '$/domains/dashboard';

export default defineController(({ getCheckoutGuests }), ({ getCheckoutGuests }) => ({
  get: async({ query }) => getCheckoutGuests(query?.day),
}));
