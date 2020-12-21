import { defineController } from './$relay';
import type { getCheckinGuests } from '$/domains/dashboard';

export default defineController(({ getCheckinGuests }), ({ getCheckinGuests }) => ({
  get: async({ query }) => getCheckinGuests(query?.day),
}));
