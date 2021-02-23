import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetGuestInfoUseCase } from '$/packages/application/usecase/front/account/getGuestInfo';
import { UpdateGuestInfoUseCase } from '$/packages/application/usecase/front/account/updateGuestInfo';

export default defineController(() => ({
  get: async({ user }) => container.resolve(GetGuestInfoUseCase).execute(user),
  patch: async({ user, body }) => container.resolve(UpdateGuestInfoUseCase).execute(user, body),
}));
