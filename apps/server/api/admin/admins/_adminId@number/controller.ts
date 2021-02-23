import { defineController } from './$relay';
import { container } from 'tsyringe';
import { FindAdminUseCase } from '$/application/usecase/admin/admins/find';
import { UpdateAdminUseCase } from '$/application/usecase/admin/admins/update';
import { DeleteAdminUseCase } from '$/application/usecase/admin/admins/delete';

export default defineController(() => ({
  get: async({ params }) => container.resolve(FindAdminUseCase).execute(params.adminId),
  patch: async({ params, body }) => container.resolve(UpdateAdminUseCase).execute(params.adminId, body),
  delete: async({ params }) => container.resolve(DeleteAdminUseCase).execute(params.adminId),
}));
