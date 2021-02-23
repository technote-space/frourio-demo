import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetCheckinNotSelectableUseCase } from '$/packages/application/usecase/front/reservation/getCheckinNotSelectable';

export default defineController(() => ({
  get: async(
    {
      query: { roomId, start, end },
      user,
    },
  ) => container.resolve(GetCheckinNotSelectableUseCase).execute(roomId, start, end, user),
}));
