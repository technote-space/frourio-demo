import { defineController } from './$relay';
import { searchRoom } from '$/domains/reservations';

export default defineController(({ searchRoom }), ({ searchRoom }) => ({
  get: async({ query }) => searchRoom(query),
}));
