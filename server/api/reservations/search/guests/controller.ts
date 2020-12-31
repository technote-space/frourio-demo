import { defineController } from './$relay';
import { searchGuest } from '$/domains/reservations';
import { parseQuery } from '$/repositories/utils';

export default defineController(() => ({
  get: async({ query }) => searchGuest(parseQuery(query)),
}));
