import { defineController } from './$relay';
import { container } from 'tsyringe';
import { ListRoomsUseCase } from '$/packages/application/usecase/lock/rooms/list';

export default defineController(() => ({
  get: async() => container.resolve(ListRoomsUseCase).execute(),
}));
