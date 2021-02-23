import { defineController } from './$relay';
import { container } from 'tsyringe';
import { SearchRoleUseCase } from '$/packages/application/usecase/admin/admins/searchRole';

export default defineController(() => ({
  get: async({ query }) => container.resolve(SearchRoleUseCase).execute(query),
}));
