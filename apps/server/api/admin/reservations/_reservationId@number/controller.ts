import { defineController } from './$relay';
import { container } from 'tsyringe';
import { FindReservationUseCase } from '$/application/usecase/admin/reservations/find';
import { UpdateReservationUseCase } from '$/application/usecase/admin/reservations/update';
import { DeleteReservationUseCase } from '$/application/usecase/admin/reservations/delete';

export default defineController(() => ({
  get: async({ params }) => container.resolve(FindReservationUseCase).execute(params.reservationId),
  patch: async({ params, body }) => container.resolve(UpdateReservationUseCase).execute(params.reservationId, body),
  delete: async({ params }) => container.resolve(DeleteReservationUseCase).execute(params.reservationId),
}));
