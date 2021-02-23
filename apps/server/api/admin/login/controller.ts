import { defineController } from './$relay';
import { container } from 'tsyringe';
import { LoginUseCase } from '$/packages/application/usecase/admin/login/login';

export default defineController((fastify) => ({
  post: ({ body }) => container.resolve(LoginUseCase).execute(body, fastify),
}));
