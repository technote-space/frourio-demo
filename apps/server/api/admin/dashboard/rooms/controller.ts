import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetSelectableRoomsUseCase } from '$/packages/application/usecase/admin/dashboard/getSelectableRooms';

export default defineController(() => ({
  get: async() => container.resolve(GetSelectableRoomsUseCase).execute(),
}));
