import { defineController } from './$relay';
import { container } from 'tsyringe';
import { FindRoomUseCase } from '$/packages/application/usecase/admin/rooms/find';
import { UpdateRoomUseCase } from '$/packages/application/usecase/admin/rooms/update';
import { DeleteRoomUseCase } from '$/packages/application/usecase/admin/rooms/delete';

export default defineController(() => ({
  get: async({ params }) => container.resolve(FindRoomUseCase).execute(params.roomId),
  patch: async({ params, body }) => container.resolve(UpdateRoomUseCase).execute(params.roomId, body),
  delete: async({ params }) => container.resolve(DeleteRoomUseCase).execute(params.roomId),
}));
