import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetPaymentMethodsUseCase } from '$/packages/application/usecase/stripe/getPaymentMethods';
import { AttachPaymentMethodUseCase } from '$/packages/application/usecase/stripe/attachPaymentMethod';
import { DetachPaymentMethodUseCase } from '$/packages/application/usecase/stripe/detachPaymentMethod';

export default defineController(() => ({
  get: async({ user }) => container.resolve(GetPaymentMethodsUseCase).execute(user.id),
  put: async({ user, body }) => container.resolve(AttachPaymentMethodUseCase).execute(body.methodId, user.id),
  delete: async({ body }) => container.resolve(DetachPaymentMethodUseCase).execute(body.methodId),
}));
