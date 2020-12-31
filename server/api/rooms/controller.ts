import { defineController } from './$relay';
import { list, create } from '$/domains/rooms';
import { parseQuery } from '$/repositories/utils';

export default defineController(({ list, create }), ({ list, create }) => ({
  get: async({ query }) => list(parseQuery(query)),
  post: async({ body }) => create(body),
}));
