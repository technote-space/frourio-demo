import { defineController } from './$relay';
import { container } from 'tsyringe';
import { ListReservationsUseCase } from '$/application/usecase/admin/reservations/list';
import { CreateReservationUseCase } from '$/application/usecase/admin/reservations/create';

export default defineController(() => ({
  get: async({ query }) => container.resolve(ListReservationsUseCase).execute(query),
  post: async({ body }) => container.resolve(CreateReservationUseCase).execute(body),
}));
