import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetPaidReservationsUseCase } from '$/application/usecase/front/account/getPaidReservations';

export default defineController(() => ({
  get: async({ user }) => container.resolve(GetPaidReservationsUseCase).execute(user),
}));
