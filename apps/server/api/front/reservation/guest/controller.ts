import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetGuestInfoUseCase } from '$/packages/application/usecase/front/reservation/getGuestInfo';

export default defineController(() => ({
  get: async({ user }) => container.resolve(GetGuestInfoUseCase).execute(user),
}));
