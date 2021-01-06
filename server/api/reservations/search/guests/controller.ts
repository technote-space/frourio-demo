import { defineController } from './$relay';
import { searchGuest } from '$/domains/reservations';

export default defineController(() => ({
  get: async({ query }) => searchGuest(query),
}));
