import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetAdminUseCase } from '$/application/usecase/admin/getAdmin';

export default defineController(() => ({
  get: async({ user }) => container.resolve(GetAdminUseCase).execute(user),
}));
