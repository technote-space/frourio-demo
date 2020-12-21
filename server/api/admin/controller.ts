import { defineController } from './$relay';
import { get } from '$/domains/admin';

export default defineController(({ get }), ({ get }, fastify) => ({
  get: async({ headers }) => get(headers, fastify),
}));
