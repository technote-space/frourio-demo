import { defineController } from './$relay';
import { container } from 'tsyringe';
import { FindRoomUseCase } from '$/packages/application/usecase/front/rooms/find';

export default defineController(() => ({
  get: async({ params }) => container.resolve(FindRoomUseCase).execute(params.roomId),
}));
