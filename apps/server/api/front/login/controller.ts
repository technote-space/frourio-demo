import { defineController } from './$relay';
import { login } from '$/domains/front/login';

export default defineController(({ login }), ({ login }, fastify) => ({
  post: ({ body }) => login(body, fastify),
}));
