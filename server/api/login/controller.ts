import { defineController } from './$relay';
import type { login } from '$/domains/login';

export default defineController(({ login }), ({ login }, fastify) => ({
  post: ({ body }) => login(body, fastify),
}));
