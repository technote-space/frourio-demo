import { defineController } from './$relay';
import { container } from 'tsyringe';
import { ValidateQrUseCase } from '$/packages/application/usecase/lock/rooms/validateQr';

export default defineController(() => ({
  post: async({ body }) => container.resolve(ValidateQrUseCase).execute(body.roomId, body.data),
}));
