import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetReservationDetailUseCase } from '$/application/usecase/front/reservations/getReservationDetail';

export default defineController(() => ({
  get: async({ params }) => container.resolve(GetReservationDetailUseCase).execute(params.code),
}));
