import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetSelectedRoomUseCase } from '$/application/usecase/admin/reservations/getSelectedRoom';

export default defineController(() => ({
  get: async({ query: { roomId } }) => container.resolve(GetSelectedRoomUseCase).execute(roomId),
}));
