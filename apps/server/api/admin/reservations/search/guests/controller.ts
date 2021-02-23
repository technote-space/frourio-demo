import { defineController } from './$relay';
import { container } from 'tsyringe';
import { SearchGuestUseCase } from '$/packages/application/usecase/admin/reservations/searchGuest';

export default defineController(() => ({
  get: async({ query }) => container.resolve(SearchGuestUseCase).execute(query),
}));
