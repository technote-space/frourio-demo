import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetCheckoutSelectableUseCase } from '$/packages/application/usecase/front/reservation/getCheckoutSelectable';

export default defineController(() => ({
  get: async(
    {
      query: { roomId, end, checkin },
      user,
    },
  ) => container.resolve(GetCheckoutSelectableUseCase).execute(roomId, end, checkin, user),
}));
