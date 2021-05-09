import { defineController } from './$relay';
import { container } from 'tsyringe';
import { HandleWebhookUseCase } from '$/packages/application/usecase/stripe/handleWebhook';

export default defineController(() => ({
  post: async({ body, headers }) => container.resolve(HandleWebhookUseCase).execute(body, headers['stripe-signature']),
}));
