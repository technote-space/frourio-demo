import { defineController } from './$relay';
import type { get } from '$/domains/admin';

export default defineController(({ get }), ({ get }, fastify) => ({
  get: async({ headers }) => get(headers, fastify),
}));
