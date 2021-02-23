import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetCheckoutSelectableUseCase } from '$/packages/application/usecase/admin/reservations/getCheckoutSelectable';

export default defineController(() => ({
  get: async({
    query: { roomId, end, checkin, id },
  }) => container.resolve(GetCheckoutSelectableUseCase).execute(roomId, end, checkin, id),
}));
