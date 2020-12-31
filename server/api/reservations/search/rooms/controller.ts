import { defineController } from './$relay';
import { searchRoom } from '$/domains/reservations';
import { parseQuery } from '$/repositories/utils';

export default defineController(() => ({
  get: async({ query }) => searchRoom(parseQuery(query)),
}));
