import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetCancelledReservationsUseCase } from '$/application/usecase/front/account/getCancelledReservations';

export default defineController(() => ({
  get: async({ user }) => container.resolve(GetCancelledReservationsUseCase).execute(user),
}));
