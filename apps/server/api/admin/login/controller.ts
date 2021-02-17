import { defineController } from './$relay';
import { login } from '$/domains/admin/login';

export default defineController(({ login }), ({ login }, fastify) => ({
  post: ({ body }) => login(body, fastify),
}));
