import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetSelectRoomsUseCase } from '$/packages/application/usecase/front/reservation/getSelectRooms';

export default defineController(() => ({
  get: async() => container.resolve(GetSelectRoomsUseCase).execute(),
}));
