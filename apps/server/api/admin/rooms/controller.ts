import { defineController } from './$relay';
import { container } from 'tsyringe';
import { ListRoomsUseCase } from '$/packages/application/usecase/admin/rooms/list';
import { CreateRoomUseCase } from '$/packages/application/usecase/admin/rooms/create';

export default defineController(() => ({
  get: async({ query }) => container.resolve(ListRoomsUseCase).execute(query),
  post: async({ body }) => container.resolve(CreateRoomUseCase).execute(body),
}));
