import { defineController } from './$relay';
import { searchRoom } from '$/domains/admin/reservations';

export default defineController(({ searchRoom }), ({ searchRoom }) => ({
  get: async({ query }) => searchRoom(query),
}));
