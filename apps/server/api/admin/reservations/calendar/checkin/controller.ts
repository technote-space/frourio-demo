import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetCheckinNotSelectableUseCase } from '$/packages/application/usecase/admin/reservations/getCheckinNotSelectable';

export default defineController(() => ({
  get: async({
    query: { roomId, start, end, id },
  }) => container.resolve(GetCheckinNotSelectableUseCase).execute(roomId, start, end, id),
}));
