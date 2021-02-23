import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetDefaultPaymentMethodUseCase } from '$/packages/application/usecase/stripe/getDefaultPaymentMethod';

export default defineController(() => ({
  get: async({ user }) => container.resolve(GetDefaultPaymentMethodUseCase).execute(user.id),
}));
