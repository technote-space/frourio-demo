import { defineController } from './$relay';
import { login } from '$/domains/login/admin';

export default defineController(({ login }), ({ login }, fastify) => ({
  post: ({ body }) => login(body, fastify),
}));
