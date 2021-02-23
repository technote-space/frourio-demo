import { defineController } from './$relay';
import { container } from 'tsyringe';
import { FindGuestUseCase } from '$/packages/application/usecase/front/guest/find';

export default defineController(() => ({
  get: async({ user }) => container.resolve(FindGuestUseCase).execute(user),
}));
