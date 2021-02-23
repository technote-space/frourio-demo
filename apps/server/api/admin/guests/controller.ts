import { defineController } from './$relay';
import { container } from 'tsyringe';
import { ListGuestsUseCase } from '$/application/usecase/admin/guests/list';
import { CreateGuestUseCase } from '$/application/usecase/admin/guests/create';

export default defineController(() => ({
  get: async({ query }) => container.resolve(ListGuestsUseCase).execute(query),
  post: async({ body }) => container.resolve(CreateGuestUseCase).execute(body),
}));
