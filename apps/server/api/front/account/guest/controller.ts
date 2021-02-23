import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetGuestInfoUseCase } from '$/application/usecase/front/account/getGuestInfo';
import { UpdateGuestInfoUseCase } from '$/application/usecase/front/account/updateGuestInfo';

export default defineController(() => ({
  get: async({ user }) => container.resolve(GetGuestInfoUseCase).execute(user),
  patch: async({ user, body }) => container.resolve(UpdateGuestInfoUseCase).execute(user, body),
}));
