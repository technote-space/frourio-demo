import { defineController } from './$relay';
import { container } from 'tsyringe';
import { CancelUseCase } from '$/packages/application/usecase/admin/dashboard/cancel';

export default defineController(() => ({
  patch: async({ body }) => container.resolve(CancelUseCase).execute(body.id),
}));
