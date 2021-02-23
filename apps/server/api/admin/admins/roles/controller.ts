import { defineController } from './$relay';
import { container } from 'tsyringe';
import { ListRolesUseCase } from '$/packages/application/usecase/admin/admins/listRoles';

export default defineController(() => ({
  get: async() => container.resolve(ListRolesUseCase).execute(),
}));
