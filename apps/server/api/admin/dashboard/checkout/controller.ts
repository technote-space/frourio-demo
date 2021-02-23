import { defineController } from './$relay';
import { container } from 'tsyringe';
import { CheckoutUseCase } from '$/packages/application/usecase/admin/dashboard/checkout';
import { GetCheckoutUseCase } from '$/packages/application/usecase/admin/dashboard/getCheckout';

export default defineController(() => ({
  get: async({ query }) => container.resolve(GetCheckoutUseCase).execute(query.query, query.date),
  patch: async({ body }) => container.resolve(CheckoutUseCase).execute(body.id),
}));
