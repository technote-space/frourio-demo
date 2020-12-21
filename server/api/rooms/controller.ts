import { defineController } from './$relay';
import { list, create } from '$/domains/rooms';

export default defineController(({ list, create }), ({ list, create }) => ({
  get: async({ query }) => list(query?.page, query?.orderBy),
  post: async({ body }) => create(body),
}));
