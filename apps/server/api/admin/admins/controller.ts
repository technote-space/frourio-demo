import { defineController } from './$relay';
import { container } from 'tsyringe';
import { ListAdminsUseCase } from '$/packages/application/usecase/admin/admins/list';
import { CreateAdminUseCase } from '$/packages/application/usecase/admin/admins/create';

export default defineController(() => ({
  get: async({ query }) => container.resolve(ListAdminsUseCase).execute(query),
  post: async({ body }) => container.resolve(CreateAdminUseCase).execute(body),
}));
