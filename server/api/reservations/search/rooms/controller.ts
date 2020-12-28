import { defineController } from './$relay';
import { searchRoom } from '$/domains/reservations';

export default defineController(() => ({
  get: async({ query }) => searchRoom(query),
}));
