import { defineController } from './$relay';
import { container } from 'tsyringe';
import { ValidateKeyUseCase } from '$/packages/application/usecase/lock/rooms/validateKey';

export default defineController(() => ({
  post: async({ body }) => container.resolve(ValidateKeyUseCase).execute(body.roomId, body.key),
}));
