import { defineController } from './$relay';
import { container } from 'tsyringe';
import { ReserveUseCase } from '$/packages/application/usecase/front/reservation/reserve';

export default defineController(() => ({
  post: async({ body, user }) => container.resolve(ReserveUseCase).execute(body, user),
}));
