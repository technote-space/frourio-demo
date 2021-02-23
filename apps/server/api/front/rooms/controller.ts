import { defineController } from './$relay';
import { container } from 'tsyringe';
import { ListRoomsUseCase } from '$/application/usecase/front/rooms/list';

export default defineController(() => ({
  get: async() => container.resolve(ListRoomsUseCase).execute(),
}));
