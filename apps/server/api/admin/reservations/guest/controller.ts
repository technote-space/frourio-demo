import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetSelectedGuestUseCase } from '$/application/usecase/admin/reservations/getSelectedGuest';

export default defineController(() => ({
  get: async({ query: { guestId } }) => container.resolve(GetSelectedGuestUseCase).execute(guestId),
}));
