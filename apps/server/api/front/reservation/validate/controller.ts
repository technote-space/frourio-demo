import { defineController } from './$relay';
import { container } from 'tsyringe';
import { ValidateUseCase } from '$/application/usecase/front/reservation/validate';

export default defineController(() => ({
  post: () => container.resolve(ValidateUseCase).execute(),
}));
