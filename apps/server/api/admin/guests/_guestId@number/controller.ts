import { defineController } from './$relay';
import { container } from 'tsyringe';
import { FindGuestUseCase } from '$/packages/application/usecase/admin/guests/find';
import { UpdateGuestUseCase } from '$/packages/application/usecase/admin/guests/update';
import { DeleteGuestUseCase } from '$/packages/application/usecase/admin/guests/delete';

export default defineController(() => ({
  get: async({ params }) => container.resolve(FindGuestUseCase).execute(params.guestId),
  patch: async({ params, body }) => container.resolve(UpdateGuestUseCase).execute(params.guestId, body),
  delete: async({ params }) => container.resolve(DeleteGuestUseCase).execute(params.guestId),
}));
