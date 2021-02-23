import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetRoomInfoUseCase } from '$/packages/application/usecase/front/reservation/getRoomInfo';

export default defineController(() => ({
  get: async({ params }) => container.resolve(GetRoomInfoUseCase).execute(params.roomId),
}));
