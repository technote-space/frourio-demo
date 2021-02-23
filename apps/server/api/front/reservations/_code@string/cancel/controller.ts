import { defineController } from './$relay';
import { container } from 'tsyringe';
import { CancelUseCase } from '$/packages/application/usecase/front/reservations/cancel';

export default defineController(() => ({
  patch: async({ params }) => container.resolve(CancelUseCase).execute(params.code),
}));
