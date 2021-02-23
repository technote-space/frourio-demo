import { defineController } from './$relay';
import { container } from 'tsyringe';
import { SearchRoomUseCase } from '$/application/usecase/admin/reservations/searchRoom';

export default defineController(() => ({
  get: async({ query }) => container.resolve(SearchRoomUseCase).execute(query),
}));
