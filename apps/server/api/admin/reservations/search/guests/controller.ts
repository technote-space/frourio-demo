import { defineController } from './$relay';
import { searchGuest } from '$/domains/admin/reservations';

export default defineController(({ searchGuest }), ({ searchGuest }) => ({
  get: async({ query }) => searchGuest(query),
}));
