import { defineController } from './$relay';
import { getCheckinGuests } from '$/domains/dashboard';

export default defineController(({ getCheckinGuests }), ({ getCheckinGuests }) => ({
  get: async({ query }) => getCheckinGuests(query?.day),
}));
