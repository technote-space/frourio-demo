import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetReservedReservationsUseCase } from '$/packages/application/usecase/front/account/getReservedReservations';

export default defineController(() => ({
  get: async({ user }) => container.resolve(GetReservedReservationsUseCase).execute(user),
}));
