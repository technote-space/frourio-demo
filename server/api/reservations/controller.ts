import { defineController } from './$relay';
import { list, create } from '$/domains/reservations';

export default defineController(({ list, create }), ({ list, create }) => ({
  get: async({ query }) => list(query),
  post: async({ body }) => create(body),
}));
