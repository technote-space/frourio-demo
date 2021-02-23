import { defineController } from './$relay';
import { container } from 'tsyringe';
import { CancelUseCase } from '$/application/usecase/admin/dashboard/cancel';

export default defineController(() => ({
  patch: async({ body }) => container.resolve(CancelUseCase).execute(body.id),
}));
